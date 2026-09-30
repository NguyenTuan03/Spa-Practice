import { NextResponse } from "next/server";
import { z } from "zod";
import { Difficulty, SkinType } from "@/enums";
import { gradePlan } from "@/server/ai/grade";
import { guardAiRequest } from "@/server/ai/guard";
import { getSources } from "@/server/sources";
import type { GradeResponse } from "@/types/advanced";

export const maxDuration = 60;

const MAX_FIELD = 4000;
const longText = z.string().min(1).max(MAX_FIELD);
const list = z.array(z.string().max(MAX_FIELD)).max(30);

const bodySchema = z.object({
  generated: z.object({
    title: longText,
    description: longText,
    skinType: z.nativeEnum(SkinType),
    difficulty: z.nativeEnum(Difficulty),
    reference: z.object({ diagnosis: longText, steps: list, products: list, notes: list }),
    sourceIds: z.array(z.string()).max(20),
  }),
  input: z.object({
    diagnosis: longText,
    steps: longText,
    products: longText,
    notes: z.string().max(MAX_FIELD),
  }),
});

export async function POST(request: Request): Promise<NextResponse> {
  const blocked = guardAiRequest(request);
  if (blocked) return blocked;

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });

  try {
    const grade = await gradePlan(parsed.data.generated, parsed.data.input);
    const body: GradeResponse = { grade, sources: getSources(grade.sourceIds) };
    return NextResponse.json(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không chấm được bài";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
