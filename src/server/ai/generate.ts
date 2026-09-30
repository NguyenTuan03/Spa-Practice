import "server-only";
import { z } from "zod";
import { Difficulty, SkinType } from "@/enums";
import type { GeneratedCase } from "@/types/advanced";
import { completeJson } from "./client";
import { VALID_SOURCE_IDS, buildKnowledgeBase } from "./knowledge";

const generatedSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  skinType: z.nativeEnum(SkinType),
  difficulty: z.nativeEnum(Difficulty),
  reference: z.object({
    diagnosis: z.string().min(1),
    steps: z.array(z.string()).min(1),
    products: z.array(z.string()).min(1),
    notes: z.array(z.string()),
  }),
  sourceIds: z.array(z.string()),
});

const SYSTEM_PROMPT = `Bạn là huấn luyện viên kỹ thuật viên chăm sóc da mặt tại spa. Hãy tạo MỘT ca khách hàng mô phỏng bằng tiếng Việt để học viên luyện phác đồ, kèm phác đồ tham chiếu.
Quy tắc:
- Khách hàng hoàn toàn hư cấu; mô tả 3-5 câu gồm tuổi, giới, vấn đề da, thói quen chăm sóc, yếu tố làm nặng.
- Phác đồ tham chiếu CHỈ dựa trên các nguyên tắc có trong KIẾN THỨC ĐÃ KIỂM CHỨNG. Không thêm liều lượng, thuốc kê đơn hay khẳng định y khoa ngoài kiến thức đó. Dùng tên hoạt chất, không dùng tên thương hiệu.
- Luôn có ý chuyển bác sĩ da liễu khi cần. Không tạo ca bệnh nặng cần can thiệp y khoa khẩn.
- sourceIds chỉ chọn từ danh sách NGUỒN.
Chỉ trả JSON đúng dạng: {"title":string,"description":string,"skinType":"oily|dry|combination|sensitive","difficulty":"easy|medium|hard","reference":{"diagnosis":string,"steps":string[],"products":string[],"notes":string[]},"sourceIds":string[]}`;

export async function generateCase(skinType?: SkinType, difficulty?: Difficulty): Promise<GeneratedCase> {
  const request = {
    skinType: skinType ?? "tự chọn",
    difficulty: difficulty ?? "tự chọn",
    seed: Math.random().toString(36).slice(2, 8),
  };
  const user = `${buildKnowledgeBase()}\n\nYÊU CẦU: ${JSON.stringify(request)}\nHãy đa dạng hóa ca (khác các ca mẫu nếu có thể).`;
  const parsed = generatedSchema.parse(await completeJson(SYSTEM_PROMPT, user));
  return { ...parsed, sourceIds: parsed.sourceIds.filter((id) => VALID_SOURCE_IDS.includes(id)) };
}
