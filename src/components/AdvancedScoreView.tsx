import type { ReactNode } from "react";
import { Citation } from "@/components/Citation";
import { SourceList } from "@/components/SourceList";
import {
  AlertTriangleIcon,
  BookIcon,
  CheckCircleIcon,
  ListChecksIcon,
} from "@/components/icons";
import { ScoreBar, ScoreRing, SectionHeading } from "@/components/ui";
import { CRITERION_LABEL } from "@/enums";
import type { SourceRef } from "@/types";
import type { CaseCore, CitedText, GradeResponse } from "@/types/advanced";

interface AdvancedScoreViewProps {
  generated: CaseCore;
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
    <ul className="list-disc space-y-1.5 pl-5 text-sm text-stone-700">
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
    <ul className="list-disc space-y-1.5 pl-5 text-sm text-stone-700">
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
      <div className="rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 p-6 text-center text-white shadow-lg shadow-rose-900/20 sm:p-8">
        <p className="text-sm font-medium text-rose-100">Điểm do AI chấm</p>
        <div className="mt-4">
          <ScoreRing value={grade.total} max={MAX_TOTAL} />
        </div>
      </div>

      {grade.wrong.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4">
          <SectionHeading icon={<AlertTriangleIcon className="h-4 w-4" />}>
            <span className="text-red-700">Ý sai</span>
          </SectionHeading>
          <ul className="space-y-2.5 pl-9 text-sm text-stone-700">
            {grade.wrong.map((entry) => (
              <li key={entry.statement}>
                <span className="italic">&ldquo;{entry.statement}&rdquo;</span>
                <span className="mt-0.5 block text-red-800">{entry.correction}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {grade.unsafe.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4">
          <SectionHeading icon={<AlertTriangleIcon className="h-4 w-4" />}>
            <span className="text-red-700">Điểm thiếu an toàn</span>
          </SectionHeading>
          <ul className="space-y-1.5 pl-9 text-sm text-stone-700">
            {grade.unsafe.map((entry) => (
              <li key={entry.issue}>
                <b className="text-red-800">{entry.issue}</b>: {entry.reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm shadow-rose-900/5 sm:p-5">
        <SectionHeading icon={<ListChecksIcon className="h-4 w-4" />}>Chi tiết theo tiêu chí</SectionHeading>
        <div className="space-y-4 pl-9">
          {grade.breakdown.map((entry) => (
            <div key={entry.criterion}>
              <ScoreBar label={CRITERION_LABEL[entry.criterion]} score={entry.score} max={entry.max} />
              <p className="mt-1.5 text-sm text-stone-500">{entry.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <SectionHeading icon={<CheckCircleIcon className="h-4 w-4 text-emerald-600" />}>
            <span className="text-emerald-700">Làm đúng</span>
          </SectionHeading>
          <ul className="space-y-2.5 pl-9 text-sm text-stone-700">
            {grade.correct.map((entry) => (
              <li key={entry.point}>
                {entry.point}
                <span className="mt-0.5 block text-xs italic text-stone-500">&ldquo;{entry.evidence}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <SectionHeading icon={<AlertTriangleIcon className="h-4 w-4 text-amber-600" />}>
            <span className="text-amber-700">Còn thiếu</span>
          </SectionHeading>
          <div className="pl-9">
            <Bullets items={grade.missing} />
          </div>
        </div>
      </section>

      <p className="rounded-2xl bg-stone-100 p-4 text-sm leading-relaxed text-stone-700">
        {grade.advice}
        <Citation sourceIds={grade.sourceIds} sources={sources} emptyLabel="" />
      </p>

      <section className="space-y-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm shadow-rose-900/5 sm:p-5">
        <SectionHeading icon={<BookIcon className="h-4 w-4" />}>
          Phác đồ tham chiếu do AI soạn <span className="font-normal text-stone-400">(số [n] là nguồn bên dưới)</span>
        </SectionHeading>
        <div className="space-y-3 pl-9">
          <p className="text-sm text-stone-700">
            {reference.diagnosis.text}
            <Citation sourceIds={reference.diagnosis.sourceIds} sources={sources} emptyLabel={AI_EMPTY_LABEL} />
          </p>
          <div>
            <h4 className="mb-1 text-sm font-medium text-stone-800">Quy trình</h4>
            <CitedList items={reference.steps} sources={sources} />
          </div>
          <div>
            <h4 className="mb-1 text-sm font-medium text-stone-800">Sản phẩm</h4>
            <CitedList items={reference.products} sources={sources} />
          </div>
          <div>
            <h4 className="mb-1 text-sm font-medium text-stone-800">Lưu ý</h4>
            <CitedList items={reference.notes} sources={sources} />
          </div>
        </div>
      </section>

      {sources.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm shadow-rose-900/5 sm:p-5">
          <h3 className="font-semibold text-stone-800">Nguồn tham khảo</h3>
          <SourceList sources={sources} />
        </section>
      )}

      <p className="text-xs leading-relaxed text-stone-500">
        Ca, phác đồ tham chiếu và điểm đều do AI tạo, chưa có chuyên gia duyệt nên có thể sai. Nguồn được gắn chỉ khi AI
        nói ý đó dựa vào nguồn, hãy mở link để đối chiếu. Ý ghi &quot;chưa có nguồn cụ thể&quot; cần kiểm chứng thêm.
      </p>
    </div>
  );
}
