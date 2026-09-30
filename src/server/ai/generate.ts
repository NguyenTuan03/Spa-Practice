import "server-only";
import { z } from "zod";
import { Difficulty, SKIN_CONDITION_LABEL, SkinCondition, SkinType } from "@/enums";
import { getAvailableConditions, pickImage } from "@/data/image-library";
import type { CitedText, GeneratedCase } from "@/types/advanced";
import { completeJson } from "./client";
import { VALID_SOURCE_IDS, buildKnowledgeBase } from "./knowledge";

const MAX_ATTEMPTS = 2;

export class NoImageError extends Error {}

const citedSchema = z.object({ text: z.string().min(1), sourceIds: z.array(z.string()) });

const generatedSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  skinType: z.nativeEnum(SkinType),
  difficulty: z.nativeEnum(Difficulty),
  condition: z.nativeEnum(SkinCondition),
  reference: z.object({
    diagnosis: citedSchema,
    steps: z.array(citedSchema).min(1),
    products: z.array(citedSchema).min(1),
    notes: z.array(citedSchema),
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
}

export async function generateCase(options: GenerateOptions): Promise<GeneratedCase> {
  const available = getAvailableConditions();
  if (available.length === 0) {
    throw new NoImageError("Thư viện ảnh đang trống. Thêm ảnh vào src/data/image-library.ts trước khi tạo ca.");
  }
  if (options.condition && !available.includes(options.condition)) {
    throw new NoImageError(`Chưa có ảnh cho tình trạng "${SKIN_CONDITION_LABEL[options.condition]}" trong thư viện.`);
  }
  const allowed = options.condition ? [options.condition] : available;
  const allowedText = allowed.map((condition) => `${condition} (${SKIN_CONDITION_LABEL[condition]})`).join("; ");

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const request = {
      skinType: options.skinType ?? "tự chọn",
      difficulty: options.difficulty ?? "tự chọn",
      seed: Math.random().toString(36).slice(2, 8),
    };
    const user = `${buildKnowledgeBase()}\n\nYÊU CẦU: ${JSON.stringify(request)}\nCHỈ ĐƯỢC chọn condition trong: ${allowedText}.`;
    const parsed = generatedSchema.safeParse(await completeJson(SYSTEM_PROMPT, user));
    if (!parsed.success || !allowed.includes(parsed.data.condition)) continue;

    const image = pickImage(parsed.data.condition);
    if (!image) continue;
    const { reference } = parsed.data;
    return {
      ...parsed.data,
      image,
      reference: {
        diagnosis: cleanCited(reference.diagnosis),
        steps: reference.steps.map(cleanCited),
        products: reference.products.map(cleanCited),
        notes: reference.notes.map(cleanCited),
      },
    };
  }
  throw new Error("AI không tạo được ca hợp lệ, hãy thử lại");
}

export function collectReferenceSourceIds(generated: GeneratedCase): string[] {
  const { diagnosis, steps, products, notes } = generated.reference;
  const ids = [diagnosis, ...steps, ...products, ...notes].flatMap((entry) => entry.sourceIds);
  return [...new Set(ids)];
}
