import Link from "next/link";
import type { ReactNode } from "react";
import { DIFFICULTY_LABEL, SKIN_TYPE_LABEL } from "@/enums";
import type { SkinCase } from "@/types";

interface CaseCardProps {
  skinCase: SkinCase;
}

export function CaseCard({ skinCase }: CaseCardProps): ReactNode {
  return (
    <Link
      href={`/cases/${skinCase.id}`}
      className="block overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={skinCase.imageUrl} alt={skinCase.title} className="h-44 w-full object-cover" />
      <div className="space-y-2 p-4">
        <h2 className="font-semibold">{skinCase.title}</h2>
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-rose-50 px-2 py-0.5 text-rose-700">{SKIN_TYPE_LABEL[skinCase.skinType]}</span>
          <span className="rounded bg-stone-100 px-2 py-0.5">{DIFFICULTY_LABEL[skinCase.difficulty]}</span>
        </div>
      </div>
    </Link>
  );
}
