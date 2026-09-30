import { ACCESS_CODE_HEADER } from "@/enums";
import type { AdvancedAttempt } from "@/types/advanced";

const ATTEMPTS_KEY = "spa-practice:advanced-attempts";
const CODE_KEY = "spa-practice:access-code";

export function loadAdvancedAttempts(): AdvancedAttempt[] {
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY);
    return raw ? (JSON.parse(raw) as AdvancedAttempt[]) : [];
  } catch {
    return [];
  }
}

export function saveAdvancedAttempt(attempt: AdvancedAttempt): void {
  try {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify([attempt, ...loadAdvancedAttempts()]));
  } catch {
    // bỏ qua nếu localStorage không khả dụng
  }
}

export function getAccessCode(): string {
  try {
    return window.localStorage.getItem(CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setAccessCode(code: string): void {
  try {
    window.localStorage.setItem(CODE_KEY, code);
  } catch {
    // bỏ qua
  }
}

export async function postAi<TBody, TResponse>(url: string, body: TBody): Promise<TResponse | string> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", [ACCESS_CODE_HEADER]: getAccessCode() },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as TResponse | { error: string };
  if (!res.ok) return (data as { error: string }).error ?? "Yêu cầu thất bại";
  return data as TResponse;
}
