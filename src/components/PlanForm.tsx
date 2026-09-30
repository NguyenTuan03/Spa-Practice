"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { saveAttempt } from "@/lib/storage";
import type { Attempt, ScoreResponse, TreatmentPlanInput } from "@/types";

interface PlanFormProps {
  caseId: string;
}

interface FieldConfig {
  key: keyof TreatmentPlanInput;
  label: string;
  hint: string;
  required: boolean;
}

const FIELDS: FieldConfig[] = [
  { key: "diagnosis", label: "Chẩn đoán", hint: "Tình trạng da và nguyên nhân", required: true },
  { key: "steps", label: "Quy trình điều trị", hint: "Các bước tại spa, mỗi bước một dòng", required: true },
  { key: "products", label: "Sản phẩm / hoạt chất", hint: "Mỗi sản phẩm một dòng", required: true },
  { key: "notes", label: "Lưu ý & chăm sóc tại nhà", hint: "Dặn dò, khi nào chuyển bác sĩ", required: false },
];

const EMPTY_INPUT: TreatmentPlanInput = { diagnosis: "", steps: "", products: "", notes: "" };

export function PlanForm({ caseId }: PlanFormProps): ReactNode {
  const router = useRouter();
  const [input, setInput] = useState<TreatmentPlanInput>(EMPTY_INPUT);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId, input }),
    });
    const data = (await res.json()) as ScoreResponse | { error: string };
    setLoading(false);

    if (!res.ok || "error" in data) {
      setError("error" in data ? data.error : "Chấm điểm thất bại");
      return;
    }

    const attempt: Attempt = {
      id: crypto.randomUUID(),
      caseId,
      input,
      response: data,
      createdAt: new Date().toISOString(),
    };
    saveAttempt(attempt);
    router.push(`/result/${attempt.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-rose-100 bg-white p-4">
      <h2 className="font-semibold">Phác đồ của bạn</h2>
      {FIELDS.map((field) => (
        <label key={field.key} className="block space-y-1">
          <span className="text-sm font-medium">{field.label}</span>
          <textarea
            required={field.required}
            rows={field.key === "diagnosis" ? 3 : 5}
            placeholder={field.hint}
            value={input[field.key]}
            onChange={(event) => setInput({ ...input, [field.key]: event.target.value })}
            className="w-full rounded-lg border border-stone-200 p-2 text-sm focus:border-rose-400 focus:outline-none"
          />
        </label>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-rose-600 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Claude đang chấm..." : "Nộp bài và chấm điểm"}
      </button>
    </form>
  );
}
