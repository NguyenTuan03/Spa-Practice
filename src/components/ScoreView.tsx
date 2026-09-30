import type { ReactNode } from "react";
import { CRITERION_LABEL, CRITERION_MAX, ScoreCriterion } from "@/enums";
import { SourceList } from "@/components/SourceList";
import type { ChecklistItem, RedFlag, ScoreResponse, SourceRef } from "@/types";

interface ScoreViewProps {
  response: ScoreResponse;
}

interface CitationProps {
  sourceIds: string[];
  sources: SourceRef[];
}

const MAX_TOTAL = Object.values(CRITERION_MAX).reduce((sum, value) => sum + value, 0);

function Citation({ sourceIds, sources }: CitationProps): ReactNode {
  if (sourceIds.length === 0) {
    return <span className="ml-1 text-xs text-stone-400">(kinh nghiệm thực hành, chưa có trích dẫn)</span>;
  }
  return (
    <span className="ml-1 text-xs text-rose-700">
      {sourceIds.map((id) => `[${sources.findIndex((source) => source.id === id) + 1}]`).join(" ")}
    </span>
  );
}

function ItemList({ items, sources, mark }: { items: ChecklistItem[]; sources: SourceRef[]; mark: string }): ReactNode {
  return (
    <ul className="space-y-1 text-sm">
      {items.map((entry) => (
        <li key={entry.id}>
          <span className="mr-1 font-bold">{mark}</span>
          {entry.label}
          <Citation sourceIds={entry.sourceIds} sources={sources} />
        </li>
      ))}
    </ul>
  );
}

function FlagList({ flags, sources }: { flags: RedFlag[]; sources: SourceRef[] }): ReactNode {
  if (flags.length === 0) return null;
  return (
    <section className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
      <h3 className="font-semibold text-red-700">Cảnh báo an toàn (trừ điểm)</h3>
      <ul className="mt-1 space-y-1">
        {flags.map((flag) => (
          <li key={flag.id}>
            {flag.label}
            <Citation sourceIds={flag.sourceIds} sources={sources} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ScoreView({ response }: ScoreViewProps): ReactNode {
  const { result, sources } = response;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-rose-600 p-6 text-center text-white">
        <p className="text-sm">Tổng điểm</p>
        <p className="text-5xl font-bold">
          {result.total}/{MAX_TOTAL}
        </p>
        {result.penalty > 0 && <p className="mt-1 text-sm">Đã trừ {result.penalty} điểm an toàn</p>}
      </div>

      <FlagList flags={result.flagged} sources={sources} />

      {Object.values(ScoreCriterion).map((criterion) => {
        const stat = result.breakdown.find((entry) => entry.criterion === criterion);
        const done = result.matched.filter((entry) => entry.criterion === criterion);
        const todo = result.missed.filter((entry) => entry.criterion === criterion);
        return (
          <section key={criterion} className="space-y-2 rounded-xl border border-rose-100 bg-white p-4">
            <div className="flex justify-between font-semibold">
              <span>{CRITERION_LABEL[criterion]}</span>
              <span>
                {stat?.score ?? 0}/{CRITERION_MAX[criterion]} ({stat?.matched ?? 0}/{stat?.total ?? 0} ý)
              </span>
            </div>
            <div className="text-green-700"><ItemList items={done} sources={sources} mark="✓" /></div>
            <div className="text-amber-700"><ItemList items={todo} sources={sources} mark="✗" /></div>
          </section>
        );
      })}

      <section className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
        <h3 className="font-semibold">Nguồn tham khảo</h3>
        <SourceList sources={sources} />
        <p className="text-xs text-stone-500">
          Điểm được chấm tự động bằng từ khóa nên chỉ mang tính luyện tập; cách diễn đạt khác có thể bị tính thiếu ý.
          Nội dung chỉ để học, không thay thế chẩn đoán của bác sĩ da liễu.
        </p>
      </section>
    </div>
  );
}
