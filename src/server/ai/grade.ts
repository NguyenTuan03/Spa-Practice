import "server-only";
import { z } from "zod";
import { CRITERION_LABEL, CRITERION_MAX, ScoreCriterion } from "@/enums";
import type { TreatmentPlanInput } from "@/types";
import type { AiGrade, GeneratedCase } from "@/types/advanced";
import { completeJson } from "./client";
import { VALID_SOURCE_IDS, buildKnowledgeBase } from "./knowledge";

const gradeSchema = z.object({
  breakdown: z.array(z.object({ criterion: z.nativeEnum(ScoreCriterion), score: z.number(), comment: z.string() })),
  correct: z.array(z.object({ point: z.string(), evidence: z.string() })),
  missing: z.array(z.string()),
  unsafe: z.array(z.object({ issue: z.string(), reason: z.string() })),
  advice: z.string(),
  sourceIds: z.array(z.string()),
});

const SYSTEM_PROMPT = `Bạn là giảng viên chấm bài phác đồ chăm sóc da mặt cho học viên spa. So sánh BÀI LÀM với PHÁC ĐỒ THAM CHIẾU và KIẾN THỨC ĐÃ KIỂM CHỨNG.
Quy tắc:
- Chấm theo ý nghĩa, cách diễn đạt khác hoặc hoạt chất tương đương vẫn được điểm. Không cho điểm ý học viên không viết.
- Mỗi ý đúng phải kèm "evidence" là trích nguyên văn ngắn từ bài làm. Không bịa trích dẫn.
- Nêu rõ hành động thiếu an toàn (ví dụ tẩy da chết mạnh trên da kích ứng) trong "unsafe" và trừ điểm tiêu chí liên quan.
- Thang điểm tối đa: ${Object.values(ScoreCriterion).map((c) => `${c} (${CRITERION_LABEL[c]}) ${CRITERION_MAX[c]}`).join(", ")}.
- sourceIds chỉ chọn từ danh sách NGUỒN, chỉ khi nhận xét dựa vào nguồn đó.
- Nhận xét ngắn gọn, cụ thể, tiếng Việt.
Chỉ trả JSON đúng dạng: {"breakdown":[{"criterion":"diagnosis|steps|products|notes","score":number,"comment":string}],"correct":[{"point":string,"evidence":string}],"missing":string[],"unsafe":[{"issue":string,"reason":string}],"advice":string,"sourceIds":string[]}`;

export async function gradePlan(generated: GeneratedCase, input: TreatmentPlanInput): Promise<AiGrade> {
  const user = `${buildKnowledgeBase()}\n\nCA: ${JSON.stringify({
    title: generated.title,
    description: generated.description,
  })}\nPHÁC ĐỒ THAM CHIẾU: ${JSON.stringify(generated.reference)}\nBÀI LÀM: ${JSON.stringify(input)}`;
  const parsed = gradeSchema.parse(await completeJson(SYSTEM_PROMPT, user));

  const breakdown = Object.values(ScoreCriterion).map((criterion) => {
    const found = parsed.breakdown.find((entry) => entry.criterion === criterion);
    const max = CRITERION_MAX[criterion];
    const score = Math.min(Math.max(Math.round(found?.score ?? 0), 0), max);
    return { criterion, score, max, comment: found?.comment ?? "" };
  });
  const total = breakdown.reduce((sum, entry) => sum + entry.score, 0);
  const sourceIds = parsed.sourceIds.filter((id) => VALID_SOURCE_IDS.includes(id));
  return { total, breakdown, correct: parsed.correct, missing: parsed.missing, unsafe: parsed.unsafe, advice: parsed.advice, sourceIds };
}
