import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { CRITERION_LABEL, CRITERION_MAX, ScoreCriterion } from "@/enums";
import type { ExpertAnswer, ScoreResult, SkinCase, TreatmentPlanInput } from "@/types";

const DEFAULT_MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 1500;

const criterionSchema = z.object({
  criterion: z.nativeEnum(ScoreCriterion),
  score: z.number(),
  comment: z.string(),
});

const resultSchema = z.object({
  breakdown: z.array(criterionSchema),
  strengths: z.array(z.string()),
  missing: z.array(z.string()),
  advice: z.string(),
});

const SYSTEM_PROMPT = `Bạn là chuyên gia đào tạo kỹ thuật viên chăm sóc da mặt tại spa. Hãy chấm bài phác đồ của học viên bằng cách so sánh với đáp án chuyên gia.
Chấm theo ý nghĩa, không cần trùng từ. Sản phẩm/hoạt chất tương đương vẫn được điểm. Đánh giá thấp nội dung sai an toàn (ví dụ đề xuất peel mạnh cho da đang tổn thương).
Thang điểm: ${Object.values(ScoreCriterion)
  .map((key) => `${key} (${CRITERION_LABEL[key]}) tối đa ${CRITERION_MAX[key]}`)
  .join(", ")}.
Chỉ trả về JSON hợp lệ, không kèm văn bản khác, đúng dạng:
{"breakdown":[{"criterion":"diagnosis|steps|products|notes","score":number,"comment":string}],"strengths":[string],"missing":[string],"advice":string}
Viết nhận xét bằng tiếng Việt, ngắn gọn, cụ thể.`;

function buildUserPrompt(skinCase: SkinCase, expert: ExpertAnswer, input: TreatmentPlanInput): string {
  return JSON.stringify({
    case: { title: skinCase.title, description: skinCase.description },
    expertAnswer: expert,
    studentAnswer: input,
  });
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Claude không trả về JSON");
  return JSON.parse(text.slice(start, end + 1));
}

function normalize(parsed: z.infer<typeof resultSchema>): ScoreResult {
  const breakdown = Object.values(ScoreCriterion).map((criterion) => {
    const found = parsed.breakdown.find((item) => item.criterion === criterion);
    const score = Math.min(Math.max(Math.round(found?.score ?? 0), 0), CRITERION_MAX[criterion]);
    return { criterion, score, comment: found?.comment ?? "" };
  });
  const total = breakdown.reduce((sum, item) => sum + item.score, 0);
  return { total, breakdown, strengths: parsed.strengths, missing: parsed.missing, advice: parsed.advice };
}

export async function scorePlan(
  skinCase: SkinCase,
  expert: ExpertAnswer,
  input: TreatmentPlanInput,
): Promise<ScoreResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Thiếu ANTHROPIC_API_KEY trong môi trường");

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(skinCase, expert, input) }],
  });

  const text = message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("");
  return normalize(resultSchema.parse(extractJson(text)));
}
