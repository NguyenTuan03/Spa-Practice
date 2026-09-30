import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PlanForm } from "@/components/PlanForm";
import { DIFFICULTY_LABEL, SKIN_TYPE_LABEL } from "@/enums";
import { getCase } from "@/data/cases";

interface CasePageProps {
  params: Promise<{ id: string }>;
}

export default async function CasePage({ params }: CasePageProps): Promise<ReactNode> {
  const { id } = await params;
  const skinCase = getCase(id);
  if (!skinCase) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={skinCase.imageUrl} alt={skinCase.title} className="w-full rounded-xl border border-rose-100" />
        <h1 className="text-xl font-bold">{skinCase.title}</h1>
        <p className="text-sm text-stone-500">
          {SKIN_TYPE_LABEL[skinCase.skinType]} · {DIFFICULTY_LABEL[skinCase.difficulty]}
        </p>
        <p className="leading-relaxed">{skinCase.description}</p>
      </section>
      <PlanForm caseId={skinCase.id} />
    </div>
  );
}
