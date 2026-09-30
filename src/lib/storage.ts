import type { Attempt } from "@/types";

const STORAGE_KEY = "spa-practice:attempts";

export function loadAttempts(): Attempt[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: Attempt): void {
  try {
    const next = [attempt, ...loadAttempts()];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage không khả dụng: bỏ qua, không chặn luồng chấm điểm
  }
}

export function getAttempt(id: string): Attempt | undefined {
  return loadAttempts().find((item) => item.id === id);
}
