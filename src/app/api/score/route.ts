import { NextResponse } from "next/server";
import { z } from "zod";
import { getCase } from "@/data/cases";
import { getCaseKey } from "@/server/expert-data";
import { scorePlan } from "@/server/scoring";
import { getSources } from "@/server/sources";
import type { ScoreResponse } from "@/types";

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
  const key = getCaseKey(caseId);
  if (!getCase(caseId) || !key) {
    return NextResponse.json({ error: "Không tìm thấy ca" }, { status: 404 });
  }

  const result = scorePlan(key, input);
  const sourceIds = [...result.matched, ...result.missed, ...result.flagged].flatMap((entry) => entry.sourceIds);
  const body: ScoreResponse = { result, sources: getSources([...new Set(sourceIds)]) };
  return NextResponse.json(body);
}
