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
    return <span className="ml-1 text-xs text-stone-400">{emptyLabel}</span>;
  }
  return (
    <span className="ml-1 text-xs text-rose-700">
      {sourceIds.map((id) => `[${sources.findIndex((source) => source.id === id) + 1}]`).join(" ")}
    </span>
  );
}
