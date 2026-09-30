import type { ReactNode } from "react";
import { CaseCard } from "@/components/CaseCard";
import { CASES } from "@/data/cases";

export default function HomePage(): ReactNode {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Chọn ca để luyện tập</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((skinCase) => (
          <CaseCard key={skinCase.id} skinCase={skinCase} />
        ))}
      </div>
    </section>
  );
}
