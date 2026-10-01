import type { ReactNode } from "react";
import type { SourceRef } from "@/types";

interface CitationProps {
  sourceIds: string[];
  sources: SourceRef[];
  emptyLabel?: string;
}

const DEFAULT_EMPTY_LABEL = "(kinh nghiệm thực hành, chưa có trích dẫn)";

export function Citation({ sourceIds, sources, emptyLabel = DEFAULT_EMPTY_LABEL }: CitationProps): ReactNode {
  if (sourceIds.length === 0) {
    return <span className="ml-1 text-xs italic text-stone-400">{emptyLabel}</span>;
  }
  return (
    <span className="ml-1 inline-flex gap-1 align-middle">
      {sourceIds.map((id) => (
        <span
          key={id}
          className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-inset ring-rose-200"
        >
          {sources.findIndex((source) => source.id === id) + 1}
        </span>
      ))}
    </span>
  );
}
