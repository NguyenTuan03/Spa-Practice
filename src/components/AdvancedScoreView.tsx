import type { ReactNode } from "react";
import { Citation } from "@/components/Citation";
import { SourceList } from "@/components/SourceList";
import { CRITERION_LABEL } from "@/enums";
import type { SourceRef } from "@/types";
import type { CitedText, GeneratedCase, GradeResponse } from "@/types/advanced";

interface AdvancedScoreViewProps {
  generated: GeneratedCase;
  referenceSources: SourceRef[];
  response: GradeResponse;
}

const MAX_TOTAL = 100;
const AI_EMPTY_LABEL = "(AI tổng hợp, chưa có nguồn cụ thể)";

function mergeSources(first: SourceRef[], second: SourceRef[]): SourceRef[] {
  return [...first, ...second.filter((item) => !first.some((existing) => existing.id === item.id))];
}

function CitedList({ items, sources }: { items: CitedText[]; sources: SourceRef[] }): ReactNode {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm">
      {items.map((entry) => (
        <li key={entry.text}>
          {entry.text}
          <Citation sourceIds={entry.sourceIds} sources={sources} emptyLabel={AI_EMPTY_LABEL} />
        </li>
      ))}
    </ul>
  );
}

function Bullets({ items }: { items: string[] }): ReactNode {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm">
      {items.map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  );
}

export function AdvancedScoreView({ generated, referenceSources, response }: AdvancedScoreViewProps): ReactNode {
  const { grade } = response;
  const sources = mergeSources(referenceSources, response.sources);
  const { reference } = generated;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-rose-600 p-6 text-center text-white">
        <p className="text-sm">Điểm do AI chấm</p>
        <p className="text-5xl font-bold">
          {grade.total}/{MAX_TOTAL}
        </p>
      </div>

      {grade.unsafe.length > 0 && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
          <h3 className="font-semibold text-red-700">Điểm thiếu an toàn</h3>
          <ul className="mt-1 space-y-1">
            {grade.unsafe.map((entry) => (
              <li key={entry.issue}>
                <b>{entry.issue}</b>: {entry.reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        {grade.breakdown.map((entry) => (
          <div key={entry.criterion} className="rounded-lg border border-rose-100 bg-white p-3">
            <div className="flex justify-between font-medium">
              <span>{CRITERION_LABEL[entry.criterion]}</span>
              <span>
                {entry.score}/{entry.max}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">{entry.comment}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-semibold text-green-700">Làm đúng (kèm trích từ bài)</h3>
          <ul className="space-y-2 text-sm">
            {grade.correct.map((entry) => (
              <li key={entry.point}>
                {entry.point}
                <span className="block text-xs italic text-stone-500">“{entry.evidence}”</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-amber-700">Còn thiếu</h3>
          <Bullets items={grade.missing} />
        </div>
      </section>

      <p className="rounded-lg bg-stone-100 p-3 text-sm">
        {grade.advice}
        <Citation sourceIds={grade.sourceIds} sources={sources} emptyLabel="" />
      </p>

      <section className="space-y-2 rounded-xl border border-rose-100 bg-white p-4">
        <h3 className="font-semibold">Phác đồ tham chiếu do AI soạn (số [n] là nguồn bên dưới)</h3>
        <p className="text-sm">
          {reference.diagnosis.text}
          <Citation sourceIds={reference.diagnosis.sourceIds} sources={sources} emptyLabel={AI_EMPTY_LABEL} />
        </p>
        <h4 className="text-sm font-medium">Quy trình</h4>
        <CitedList items={reference.steps} sources={sources} />
        <h4 className="text-sm font-medium">Sản phẩm</h4>
        <CitedList items={reference.products} sources={sources} />
        <h4 className="text-sm font-medium">Lưu ý</h4>
        <CitedList items={reference.notes} sources={sources} />
      </section>

      {sources.length > 0 && (
        <section className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="font-semibold">Nguồn tham khảo</h3>
          <SourceList sources={sources} />
        </section>
      )}

      <p className="text-xs text-stone-500">
        Ca, phác đồ tham chiếu và điểm đều do AI tạo, chưa có chuyên gia duyệt nên có thể sai. Nguồn được gắn chỉ khi AI
        nói ý đó dựa vào nguồn, hãy mở link để đối chiếu. Ý ghi &quot;chưa có nguồn cụ thể&quot; cần kiểm chứng thêm.
      </p>
    </div>
  );
}
