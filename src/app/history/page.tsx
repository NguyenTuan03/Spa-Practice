"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCase } from "@/data/cases";
import { loadAttempts } from "@/lib/storage";
import type { Attempt } from "@/types";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export default function HistoryPage(): ReactNode {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    setAttempts(loadAttempts());
  }, []);

  const scores = attempts.map((item) => item.response.result.total);
  const best = scores.length > 0 ? Math.max(...scores) : 0;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Lịch sử luyện tập</h1>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-white p-3 shadow-sm"><p className="text-xs text-stone-500">Số lần</p><p className="text-2xl font-bold">{attempts.length}</p></div>
        <div className="rounded-lg bg-white p-3 shadow-sm"><p className="text-xs text-stone-500">Điểm TB</p><p className="text-2xl font-bold">{average(scores)}</p></div>
        <div className="rounded-lg bg-white p-3 shadow-sm"><p className="text-xs text-stone-500">Cao nhất</p><p className="text-2xl font-bold">{best}</p></div>
      </div>
      {attempts.length === 0 && <p className="text-stone-500">Chưa có lần luyện tập nào.</p>}
      <ul className="space-y-2">
        {attempts.map((attempt) => (
          <li key={attempt.id}>
            <Link
              href={`/result/${attempt.id}`}
              className="flex items-center justify-between rounded-lg border border-rose-100 bg-white p-3 hover:shadow-sm"
            >
              <span>
                <span className="font-medium">{getCase(attempt.caseId)?.title ?? attempt.caseId}</span>
                <span className="block text-xs text-stone-500">{new Date(attempt.createdAt).toLocaleString("vi-VN")}</span>
              </span>
              <span className="text-lg font-bold text-rose-700">{attempt.response.result.total}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
