"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AdvancedScoreView } from "@/components/AdvancedScoreView";
import { ImageLibraryManager } from "@/components/ImageLibraryManager";
import { ChevronDownIcon, FlaskIcon, SparklesIcon, SpinnerIcon } from "@/components/icons";
import { PlanFields } from "@/components/PlanFields";
import { Badge } from "@/components/ui";
import {
  DIFFICULTY_LABEL,
  Difficulty,
  SKIN_CONDITION_LABEL,
  SKIN_TYPE_LABEL,
  SkinCondition,
  SkinType,
} from "@/enums";
import {
  getAccessCode,
  loadAdvancedAttempts,
  postAi,
  saveAdvancedAttempt,
  setAccessCode,
} from "@/lib/advanced-storage";
import { getUserConditions, loadUserImages, pickUserImage } from "@/lib/user-images";
import type { SourceRef, TreatmentPlanInput } from "@/types";
import type {
  AdvancedAttempt,
  CaseCore,
  GenerateCaseResponse,
  GeneratedCase,
  GradeResponse,
  LibraryImage,
} from "@/types/advanced";

const ANY = "";
const selectClass =
  "w-full appearance-none rounded-xl border border-stone-200 bg-white p-3 pr-9 text-base text-stone-700 shadow-sm transition-colors duration-200 focus:border-rose-400 focus:outline-none sm:text-sm";

// Bỏ ảnh (có thể là data URL lớn) trước khi gửi server hoặc lưu lịch sử
function toCaseCore(value: GeneratedCase): CaseCore {
  return {
    title: value.title,
    description: value.description,
    skinType: value.skinType,
    difficulty: value.difficulty,
    condition: value.condition,
    reference: value.reference,
  };
}

function scoreTone(total: number): "green" | "amber" | "red" {
  if (total >= 80) return "green";
  if (total >= 50) return "amber";
  return "red";
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: T | typeof ANY;
  onChange: (value: T | typeof ANY) => void;
  options: T[];
  labels: Record<T, string>;
}): ReactNode {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-stone-500">{label}</span>
      <div className="relative">
        <select value={value} onChange={(event) => onChange(event.target.value as T | typeof ANY)} className={selectClass}>
          <option value={ANY}>AI tự chọn</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {labels[option]}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      </div>
    </label>
  );
}

export default function AdvancedPage(): ReactNode {
  const [code, setCode] = useState<string>("");
  const [skinType, setSkinType] = useState<SkinType | typeof ANY>(ANY);
  const [difficulty, setDifficulty] = useState<Difficulty | typeof ANY>(ANY);
  const [condition, setCondition] = useState<SkinCondition | typeof ANY>(ANY);
  const [referenceSources, setReferenceSources] = useState<SourceRef[]>([]);
  const [userImages, setUserImages] = useState<LibraryImage[]>([]);
  const [generated, setGenerated] = useState<GeneratedCase | undefined>();
  const [result, setResult] = useState<GradeResponse | undefined>();
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<AdvancedAttempt[]>([]);

  useEffect(() => {
    setCode(getAccessCode());
    setHistory(loadAdvancedAttempts());
    setUserImages(loadUserImages());
  }, []);

  async function handleCreate(): Promise<void> {
    setCreating(true);
    setError("");
    setResult(undefined);
    setAccessCode(code);
    const data = await postAi<
      { skinType?: SkinType; difficulty?: Difficulty; condition?: SkinCondition; userConditions: SkinCondition[] },
      GenerateCaseResponse
    >("/api/ai/generate-case", {
      skinType: skinType || undefined,
      difficulty: difficulty || undefined,
      condition: condition || undefined,
      userConditions: getUserConditions(userImages),
    });
    setCreating(false);
    if (typeof data === "string") {
      setError(data);
      return;
    }
    const image = pickUserImage(userImages, data.generated.condition) ?? data.image;
    if (!image) {
      setError("Không có ảnh cho ca này, hãy thử lại");
      return;
    }
    setGenerated({ ...data.generated, image });
    setReferenceSources(data.sources);
  }

  async function handleGrade(input: TreatmentPlanInput): Promise<string | undefined> {
    if (!generated) return "Chưa có ca";
    const data = await postAi<{ generated: CaseCore; input: TreatmentPlanInput }, GradeResponse>(
      "/api/ai/grade",
      { generated: toCaseCore(generated), input },
    );
    if (typeof data === "string") return data;

    const attempt: AdvancedAttempt = {
      id: crypto.randomUUID(),
      generated: toCaseCore(generated),
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
    <div className="space-y-8">
      <section className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
          Nâng cao: AI ra đề và chấm điểm
        </h1>
        <p className="text-sm text-stone-500 sm:text-base">
          Chọn tiêu chí (hoặc để AI tự chọn), tạo một ca da liễu, viết phác đồ điều trị rồi nộp để AI chấm điểm và
          góp ý.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm shadow-rose-900/5 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="Loại da" value={skinType} onChange={setSkinType} options={Object.values(SkinType)} labels={SKIN_TYPE_LABEL} />
          <FilterSelect
            label="Độ khó"
            value={difficulty}
            onChange={setDifficulty}
            options={Object.values(Difficulty)}
            labels={DIFFICULTY_LABEL}
          />
          <FilterSelect
            label="Tình trạng"
            value={condition}
            onChange={setCondition}
            options={Object.values(SkinCondition)}
            labels={SKIN_CONDITION_LABEL}
          />
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-stone-500">Mã truy cập</span>
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Nếu có"
              className="w-full rounded-xl border border-stone-200 bg-white p-3 text-base text-stone-700 shadow-sm transition-colors duration-200 focus:border-rose-400 focus:outline-none sm:text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm shadow-rose-600/30 transition-all duration-200 hover:bg-rose-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
        >
          {creating ? <SpinnerIcon className="h-4 w-4" /> : <SparklesIcon className="h-4 w-4" />}
          {creating ? "AI đang tạo ca..." : "Tạo ca bằng AI"}
        </button>
      </section>

      <ImageLibraryManager images={userImages} onChange={setUserImages} />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {generated && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm shadow-rose-900/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generated.image.url}
                alt={generated.title}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <p className="text-xs text-stone-500">
              Ảnh minh họa: {generated.image.credit}, {generated.image.license}.{" "}
              <a href={generated.image.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-rose-700 underline underline-offset-2">
                Nguồn ảnh
              </a>
              . Mức độ trên ảnh có thể khác mô tả ca.
            </p>
            <div className="space-y-2 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm shadow-rose-900/5">
              <h2 className="text-xl font-bold text-stone-900">{generated.title}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge tone="rose">{SKIN_TYPE_LABEL[generated.skinType]}</Badge>
                <Badge tone="amber">{DIFFICULTY_LABEL[generated.difficulty]}</Badge>
                <Badge tone="neutral" icon={<FlaskIcon className="h-3.5 w-3.5" />}>
                  Ca do AI tạo
                </Badge>
              </div>
              <p className="leading-relaxed text-stone-700">{generated.description}</p>
            </div>
          </section>
          {!result && (
            <PlanFields key={generated.title + generated.description} submitLabel="Nộp bài cho AI chấm" loadingLabel="AI đang chấm..." onSubmit={handleGrade} />
          )}
        </div>
      )}

      {generated && result && <AdvancedScoreView generated={generated} referenceSources={referenceSources} response={result} />}

      {history.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-stone-800">Lịch sử tab Nâng cao</h2>
          <ul className="space-y-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-white p-3 shadow-sm shadow-rose-900/5"
              >
                <span className="truncate text-sm text-stone-700">{entry.generated.title}</span>
                <Badge tone={scoreTone(entry.response.grade.total)}>{entry.response.grade.total}/100</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
