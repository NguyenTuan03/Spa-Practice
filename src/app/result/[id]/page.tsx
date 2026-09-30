"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ScoreView } from "@/components/ScoreView";
import { getAttempt } from "@/lib/storage";
import type { Attempt } from "@/types";

export default function ResultPage(): ReactNode {
  const params = useParams<{ id: string }>();
  const [attempt, setAttempt] = useState<Attempt | undefined>();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    setAttempt(getAttempt(params.id));
    setReady(true);
  }, [params.id]);

  if (!ready) return null;
  if (!attempt) return <p>Không tìm thấy kết quả. <Link href="/" className="text-rose-700 underline">Về danh sách</Link></p>;

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-rose-700 underline">← Luyện ca khác</Link>
      <ScoreView response={attempt.response} />
    </div>
  );
}
