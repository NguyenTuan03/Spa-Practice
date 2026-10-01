"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ListChecksIcon, SpinnerIcon } from "@/components/icons";
import type { TreatmentPlanInput } from "@/types";

interface PlanFieldsProps {
  submitLabel: string;
  loadingLabel: string;
  // Trả về thông báo lỗi nếu thất bại, undefined nếu thành công
  onSubmit: (input: TreatmentPlanInput) => Promise<string | undefined>;
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

export function PlanFields({ submitLabel, loadingLabel, onSubmit }: PlanFieldsProps): ReactNode {
  const [input, setInput] = useState<TreatmentPlanInput>(EMPTY_INPUT);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError("");
    const message = await onSubmit(input);
    setLoading(false);
    if (message) setError(message);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm shadow-rose-900/5 sm:p-5">
      <h2 className="flex items-center gap-2 font-semibold text-stone-800">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
          <ListChecksIcon className="h-4 w-4" />
        </span>
        Phác đồ của bạn
      </h2>
      {FIELDS.map((field) => (
        <label key={field.key} className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">
            {field.label}
            {!field.required && <span className="ml-1 font-normal text-stone-400">(không bắt buộc)</span>}
          </span>
          <textarea
            required={field.required}
            rows={field.key === "diagnosis" ? 3 : 5}
            placeholder={field.hint}
            value={input[field.key]}
            onChange={(event) => setInput({ ...input, [field.key]: event.target.value })}
            className="w-full resize-y rounded-xl border border-stone-200 p-3 text-base text-stone-700 shadow-sm transition-colors duration-200 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none sm:text-sm"
          />
        </label>
      ))}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-rose-600/30 transition-all duration-200 hover:bg-rose-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
      >
        {loading && <SpinnerIcon className="h-4 w-4" />}
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
