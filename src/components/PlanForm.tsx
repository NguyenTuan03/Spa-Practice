"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { PlanFields } from "@/components/PlanFields";
import { saveAttempt } from "@/lib/storage";
import type { Attempt, ScoreResponse, TreatmentPlanInput } from "@/types";

interface PlanFormProps {
  caseId: string;
}

export function PlanForm({ caseId }: PlanFormProps): ReactNode {
  const router = useRouter();

  async function submit(input: TreatmentPlanInput): Promise<string | undefined> {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId, input }),
    });
    const data = (await res.json()) as ScoreResponse | { error: string };
    if (!res.ok || "error" in data) return "error" in data ? data.error : "Chấm điểm thất bại";

    const attempt: Attempt = {
      id: crypto.randomUUID(),
      caseId,
      input,
      response: data,
      createdAt: new Date().toISOString(),
    };
    saveAttempt(attempt);
    router.push(`/result/${attempt.id}`);
    return undefined;
  }

  return <PlanFields submitLabel="Nộp bài và chấm điểm" loadingLabel="Đang chấm..." onSubmit={submit} />;
}
