import "server-only";
import { z } from "zod";
import { Difficulty, SKIN_CONDITION_LABEL, SkinCondition, SkinType } from "@/enums";
import { getAvailableConditions, pickImage } from "@/data/image-library";
import { findCommonsImage, isCommonsEnabled } from "@/server/commons";
import type { CaseCore, CitedText, LibraryImage } from "@/types/advanced";
import { completeJson } from "./client";
import { VALID_SOURCE_IDS, buildKnowledgeBase } from "./knowledge";

const MAX_ATTEMPTS = 2;

export class NoImageError extends Error {}

const citedSchema = z.object({ text: z.string().min(1), sourceIds: z.array(z.string()).default([]) });

// AI đôi khi viết hoa, dùng "_" thay "-" hoặc gọi tắt; chuẩn hóa trước khi kiểm tra enum
const CONDITION_ALIASES: Record<string, SkinCondition> = {
  dry: SkinCondition.DrySkin,
  dry_skin: SkinCondition.DrySkin,
  "dry skin": SkinCondition.DrySkin,
  blackheads: SkinCondition.Comedones,
  comedone: SkinCondition.Comedones,
  photoaging: SkinCondition.Aging,
  wrinkles: SkinCondition.Aging,
};

function normalizeEnum(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const key = value.trim().toLowerCase();
  return CONDITION_ALIASES[key] ?? key.replace(/_/g, "-");
}

const generatedSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  skinType: z.preprocess(normalizeEnum, z.nativeEnum(SkinType)),
  difficulty: z.preprocess(normalizeEnum, z.nativeEnum(Difficulty)),
  condition: z.preprocess(normalizeEnum, z.nativeEnum(SkinCondition)),
  reference: z.object({
    diagnosis: citedSchema,
    steps: z.array(citedSchema).min(1),
    products: z.array(citedSchema).min(1),
    notes: z.array(citedSchema).default([]),
  }),
});

const SYSTEM_PROMPT = `Bạn là huấn luyện viên kỹ thuật viên chăm sóc da mặt tại spa. Hãy tạo MỘT ca khách hàng mô phỏng bằng tiếng Việt để học viên luyện phác đồ, kèm phác đồ tham chiếu.
Quy tắc:
- Khách hàng hoàn toàn hư cấu; mô tả 3-5 câu gồm tuổi, giới, vấn đề da, thói quen chăm sóc, yếu tố làm nặng. Mô tả phải đúng với "condition" vì ảnh minh họa sẽ được chọn theo condition.
- Phác đồ tham chiếu CHỈ dựa trên các nguyên tắc có trong KIẾN THỨC ĐÃ KIỂM CHỨNG. Không thêm liều lượng, thuốc kê đơn hay khẳng định y khoa ngoài kiến thức đó. Dùng tên hoạt chất, không dùng tên thương hiệu.
- Mỗi ý trong phác đồ là {"text","sourceIds"}. sourceIds là các id trong danh sách NGUỒN mà ý đó thực sự dựa vào; nếu không dựa vào nguồn nào thì để mảng rỗng. Không gắn nguồn cho có.
- Luôn có ý chuyển bác sĩ da liễu khi cần. Không tạo ca bệnh nặng cần can thiệp y khoa khẩn.
Chỉ trả JSON đúng dạng: {"title":string,"description":string,"skinType":"oily|dry|combination|sensitive","difficulty":"easy|medium|hard","condition":string,"reference":{"diagnosis":{"text":string,"sourceIds":string[]},"steps":[{"text":string,"sourceIds":string[]}],"products":[...],"notes":[...]}}`;

function cleanCited(entry: CitedText): CitedText {
  return { text: entry.text, sourceIds: entry.sourceIds.filter((id) => VALID_SOURCE_IDS.includes(id)) };
}

export interface GenerateOptions {
  skinType?: SkinType;
  difficulty?: Difficulty;
  condition?: SkinCondition;
  // Các tình trạng mà người dùng đã tự thêm ảnh trong trình duyệt
  userConditions: SkinCondition[];
}

export interface GenerateResult {
  generated: CaseCore;
  image: LibraryImage | null;
}

// Tình trạng đã có ảnh sẵn (ảnh người dùng hoặc thư viện tĩnh), không phụ thuộc mạng
function ownConditions(options: GenerateOptions): SkinCondition[] {
  const library = getAvailableConditions();
  return Object.values(SkinCondition).filter(
    (condition) => options.userConditions.includes(condition) || library.includes(condition),
  );
}

interface ResolvedImage {
  image: LibraryImage | null | undefined;
  note: string;
}

// Ưu tiên: ảnh người dùng (client tự chọn) > thư viện tĩnh > Wikimedia Commons
async function resolveImage(condition: SkinCondition, userConditions: SkinCondition[]): Promise<ResolvedImage> {
  if (userConditions.includes(condition)) return { image: null, note: "dùng ảnh của người dùng" };
  const fromLibrary = pickImage(condition);
  if (fromLibrary) return { image: fromLibrary, note: "thư viện tĩnh" };
  if (!isCommonsEnabled()) return { image: undefined, note: "Commons đang tắt" };
  const result = await findCommonsImage(condition);
  return { image: result.image, note: result.note };
}

export async function generateCase(options: GenerateOptions): Promise<GenerateResult> {
  const own = ownConditions(options);
  if (options.condition) {
    if (!own.includes(options.condition) && !isCommonsEnabled()) {
      throw new NoImageError(`Chưa có ảnh cho tình trạng "${SKIN_CONDITION_LABEL[options.condition]}". Hãy thêm ảnh của bạn vào Thư viện ảnh.`);
    }
  }
  // Có ảnh sẵn thì ưu tiên các tình trạng đó; chỉ dùng Commons khi chưa có ảnh nào hoặc người dùng chọn tình trạng cụ thể
  const fallback = isCommonsEnabled() ? Object.values(SkinCondition) : [];
  const allowed = options.condition ? [options.condition] : own.length > 0 ? own : fallback;
  if (allowed.length === 0) {
    throw new NoImageError("Chưa có ảnh nào. Hãy thêm ảnh của bạn (mục Thư viện ảnh) hoặc bật ảnh tự động từ Wikimedia Commons.");
  }
  const allowedText = allowed.map((condition) => `${condition} (${SKIN_CONDITION_LABEL[condition]})`).join("; ");

  const failures: string[] = [];
  let imageFailed = false;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const request = {
      skinType: options.skinType ?? "tự chọn",
      difficulty: options.difficulty ?? "tự chọn",
      seed: Math.random().toString(36).slice(2, 8),
    };
    const user = `${buildKnowledgeBase()}\n\nYÊU CẦU: ${JSON.stringify(request)}\nCHỈ ĐƯỢC chọn condition trong: ${allowedText}.`;
    const parsed = generatedSchema.safeParse(await completeJson(SYSTEM_PROMPT, user));
    if (!parsed.success) {
      failures.push(`AI trả JSON sai định dạng (${parsed.error.issues[0]?.path.join(".") ?? "?"})`);
      continue;
    }
    if (!allowed.includes(parsed.data.condition)) {
      failures.push(`AI chọn tình trạng ngoài danh sách (${parsed.data.condition})`);
      continue;
    }

    const resolved = await resolveImage(parsed.data.condition, options.userConditions);
    if (resolved.image === undefined) {
      imageFailed = true;
      failures.push(`không có ảnh cho ${parsed.data.condition} [${resolved.note}]`);
      continue;
    }
    const { reference } = parsed.data;
    return {
      image: resolved.image,
      generated: {
        ...parsed.data,
        reference: {
          diagnosis: cleanCited(reference.diagnosis),
          steps: reference.steps.map(cleanCited),
          products: reference.products.map(cleanCited),
          notes: reference.notes.map(cleanCited),
        },
      },
    };
  }
  console.error("generateCase thất bại:", failures.join(" | "));
  const detail = failures.join(" | ");
  if (imageFailed) {
    throw new NoImageError(`Không tìm được ảnh phù hợp. Chi tiết: ${detail}. Hãy thử lại hoặc thêm ảnh của bạn vào Thư viện ảnh.`);
  }
  throw new Error(`Không tạo được ca. Chi tiết: ${detail}`);
}

export function collectReferenceSourceIds(generated: CaseCore): string[] {
  const { diagnosis, steps, products, notes } = generated.reference;
  const ids = [diagnosis, ...steps, ...products, ...notes].flatMap((entry) => entry.sourceIds);
  return [...new Set(ids)];
}
