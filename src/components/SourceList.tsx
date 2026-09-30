import type { ReactNode } from "react";
import type { SourceRef } from "@/types";

interface SourceListProps {
  sources: SourceRef[];
}

export function SourceList({ sources }: SourceListProps): ReactNode {
  return (
    <ol className="list-decimal space-y-2 pl-5 text-sm">
      {sources.map((source) => (
        <li key={source.id}>
          <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-rose-700 underline">
            {source.title}
          </a>
          <span className="block text-stone-600">
            {source.authors}. {source.publisher}, {source.year}.
          </span>
          {source.reviewers && <span className="block text-stone-600">Bác sĩ thẩm định: {source.reviewers.join("; ")}</span>}
        </li>
      ))}
    </ol>
  );
}
