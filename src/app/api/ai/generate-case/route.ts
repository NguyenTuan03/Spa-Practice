import { NextResponse } from "next/server";
import { z } from "zod";
import { Difficulty, SkinType } from "@/enums";
import { generateCase } from "@/server/ai/generate";
import { guardAiRequest } from "@/server/ai/guard";
import { getSources } from "@/server/sources";
import type { GenerateCaseResponse } from "@/types/advanced";

export const maxDuration = 60;

const bodySchema = z.object({
  skinType: z.nativeEnum(SkinType).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const blocked = guardAiRequest(request);
  if (blocked) return blocked;

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });

  try {
    const generated = await generateCase(parsed.data.skinType, parsed.data.difficulty);
    const body: GenerateCaseResponse = { generated, sources: getSources(generated.sourceIds) };
    return NextResponse.json(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không tạo được ca";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
