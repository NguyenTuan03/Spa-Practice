"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AdvancedScoreView } from "@/components/AdvancedScoreView";
import { PlanFields } from "@/components/PlanFields";
import { DIFFICULTY_LABEL, Difficulty, SKIN_TYPE_LABEL, SkinType } from "@/enums";
import {
  getAccessCode,
  loadAdvancedAttempts,
  postAi,
  saveAdvancedAttempt,
  setAccessCode,
} from "@/lib/advanced-storage";
import type { TreatmentPlanInput } from "@/types";
import type { AdvancedAttempt, GenerateCaseResponse, GeneratedCase, GradeResponse } from "@/types/advanced";

const ANY = "";

export default function AdvancedPage(): ReactNode {
  const [code, setCode] = useState<string>("");
  const [skinType, setSkinType] = useState<SkinType | typeof ANY>(ANY);
  const [difficulty, setDifficulty] = useState<Difficulty | typeof ANY>(ANY);
  const [generated, setGenerated] = useState<GeneratedCase | undefined>();
  const [result, setResult] = useState<GradeResponse | undefined>();
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<AdvancedAttempt[]>([]);

  useEffect(() => {
    setCode(getAccessCode());
    setHistory(loadAdvancedAttempts());
  }, []);

  async function handleCreate(): Promise<void> {
    setCreating(true);
    setError("");
    setResult(undefined);
    setAccessCode(code);
    const data = await postAi<{ skinType?: SkinType; difficulty?: Difficulty }, GenerateCaseResponse>(
      "/api/ai/generate-case",
      { skinType: skinType || undefined, difficulty: difficulty || undefined },
    );
    setCreating(false);
    if (typeof data === "string") {
      setError(data);
      return;
    }
    setGenerated(data.generated);
  }

  async function handleGrade(input: TreatmentPlanInput): Promise<string | undefined> {
    if (!generated) return "Chưa có ca";
    const data = await postAi<{ generated: GeneratedCase; input: TreatmentPlanInput }, GradeResponse>(
      "/api/ai/grade",
      { generated, input },
    );
    if (typeof data === "string") return data;

    const attempt: AdvancedAttempt = {
      id: crypto.randomUUID(),
      generated,
      input,
      response: data,
      createdAt: new Date().toISOString(),
    };
    saveAdvancedAttempt(attempt);
    setHistory(loadAdvancedAttempts());
    setResult(data);
    return undefined;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nâng cao: AI ra đề và chấm điểm</h1>

      <section className="grid gap-3 rounded-xl border border-rose-100 bg-white p-4 sm:grid-cols-4">
        <select
          value={skinType}
          onChange={(event) => setSkinType(event.target.value as SkinType | typeof ANY)}
          className="rounded-lg border border-stone-200 p-2 text-sm"
        >
          <option value={ANY}>Loại da: AI chọn</option>
          {Object.values(SkinType).map((value) => (
            <option key={value} value={value}>{SKIN_TYPE_LABEL[value]}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value as Difficulty | typeof ANY)}
          className="rounded-lg border border-stone-200 p-2 text-sm"
        >
          <option value={ANY}>Độ khó: AI chọn</option>
          {Object.values(Difficulty).map((value) => (
            <option key={value} value={value}>{DIFFICULTY_LABEL[value]}</option>
          ))}
        </select>
        <input
          type="password"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Mã truy cập (nếu có)"
          className="rounded-lg border border-stone-200 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {creating ? "AI đang tạo ca..." : "Tạo ca bằng AI"}
        </button>
      </section>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {generated && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-2">
            <h2 className="text-xl font-bold">{generated.title}</h2>
            <p className="text-sm text-stone-500">
              {SKIN_TYPE_LABEL[generated.skinType]} · {DIFFICULTY_LABEL[generated.difficulty]} · ca do AI tạo
            </p>
            <p className="leading-relaxed">{generated.description}</p>
          </section>
          {!result && (
            <PlanFields key={generated.title + generated.description} submitLabel="Nộp bài cho AI chấm" loadingLabel="AI đang chấm..." onSubmit={handleGrade} />
          )}
        </div>
      )}

      {generated && result && <AdvancedScoreView generated={generated} response={result} />}

      {history.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">Lịch sử tab Nâng cao</h2>
          <ul className="space-y-1 text-sm">
            {history.map((entry) => (
              <li key={entry.id} className="flex justify-between rounded-lg border border-rose-100 bg-white p-2">
                <span>{entry.generated.title}</span>
                <span className="font-bold text-rose-700">{entry.response.grade.total}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
