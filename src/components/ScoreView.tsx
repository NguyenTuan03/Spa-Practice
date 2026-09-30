import type { ReactNode } from "react";
import { CRITERION_LABEL, CRITERION_MAX } from "@/enums";
import type { ScoreResponse } from "@/types";

interface ScoreViewProps {
  response: ScoreResponse;
}

const MAX_TOTAL = Object.values(CRITERION_MAX).reduce((sum, value) => sum + value, 0);

function BulletList({ items }: { items: string[] }): ReactNode {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ScoreView({ response }: ScoreViewProps): ReactNode {
  const { result, expert } = response;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-rose-600 p-6 text-center text-white">
        <p className="text-sm">Tổng điểm</p>
        <p className="text-5xl font-bold">
          {result.total}/{MAX_TOTAL}
        </p>
      </div>

      <section className="space-y-3">
        {result.breakdown.map((item) => (
          <div key={item.criterion} className="rounded-lg border border-rose-100 bg-white p-3">
            <div className="flex justify-between font-medium">
              <span>{CRITERION_LABEL[item.criterion]}</span>
              <span>
                {item.score}/{CRITERION_MAX[item.criterion]}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">{item.comment}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-semibold text-green-700">Làm tốt</h3>
          <BulletList items={result.strengths} />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-amber-700">Còn thiếu</h3>
          <BulletList items={result.missing} />
        </div>
      </section>

      <p className="rounded-lg bg-stone-100 p-3 text-sm">{result.advice}</p>

      <section className="space-y-3 rounded-xl border border-rose-100 bg-white p-4">
        <h3 className="font-semibold">Đáp án chuyên gia (tham khảo)</h3>
        <p className="text-sm">{expert.diagnosis}</p>
        <h4 className="text-sm font-medium">Quy trình</h4>
        <BulletList items={expert.steps} />
        <h4 className="text-sm font-medium">Sản phẩm</h4>
        <BulletList items={expert.products} />
        <h4 className="text-sm font-medium">Lưu ý</h4>
        <BulletList items={expert.notes} />
      </section>
    </div>
  );
}
