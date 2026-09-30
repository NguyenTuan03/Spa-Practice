import { NextResponse } from "next/server";
import { z } from "zod";
import { getCase } from "@/data/cases";
import { getExpertAnswer } from "@/server/expert-answers";
import { scorePlan } from "@/server/scoring";
import type { ScoreResponse } from "@/types";

export const maxDuration = 60;

const MIN_LENGTH = 1;

const bodySchema = z.object({
  caseId: z.string().min(MIN_LENGTH),
  input: z.object({
    diagnosis: z.string().min(MIN_LENGTH),
    steps: z.string().min(MIN_LENGTH),
    products: z.string().min(MIN_LENGTH),
    notes: z.string(),
  }),
});

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const { caseId, input } = parsed.data;
  const skinCase = getCase(caseId);
  const expert = getExpertAnswer(caseId);
  if (!skinCase || !expert) {
    return NextResponse.json({ error: "Không tìm thấy ca" }, { status: 404 });
  }

  try {
    const result = await scorePlan(skinCase, expert, input);
    const body: ScoreResponse = { result, expert };
    return NextResponse.json(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi chấm điểm";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
