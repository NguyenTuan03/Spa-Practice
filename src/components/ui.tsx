import type { ReactNode } from "react";

type Tone = "neutral" | "rose" | "green" | "amber" | "red";

const BADGE_TONE: Record<Tone, string> = {
  neutral: "bg-stone-100 text-stone-700 ring-stone-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}

export function Badge({ children, tone = "neutral", icon }: BadgeProps): ReactNode {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${BADGE_TONE[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

function scoreTone(ratio: number): { bar: string; text: string } {
  if (ratio >= 0.8) return { bar: "bg-emerald-500", text: "text-emerald-700" };
  if (ratio >= 0.5) return { bar: "bg-amber-500", text: "text-amber-700" };
  return { bar: "bg-red-500", text: "text-red-700" };
}

interface ScoreBarProps {
  label: string;
  score: number;
  max: number;
}

export function ScoreBar({ label, score, max }: ScoreBarProps): ReactNode {
  const ratio = max > 0 ? Math.min(1, Math.max(0, score / max)) : 0;
  const tone = scoreTone(ratio);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-sm font-medium">
        <span className="text-stone-700">{label}</span>
        <span className={tone.text}>
          {score}/{max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full ${tone.bar} transition-[width] duration-500 ease-out`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreRingProps {
  value: number;
  max: number;
  size?: number;
}

export function ScoreRing({ value, max, size = 136 }: ScoreRingProps): ReactNode {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const deg = ratio * 360;
  return (
    <div
      className="relative mx-auto grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#fda4af ${deg}deg, rgba(255,255,255,0.25) ${deg}deg)`,
      }}
      role="img"
      aria-label={`Điểm ${value} trên ${max}`}
    >
      <div className="grid aspect-square w-[80%] place-items-center rounded-full bg-rose-600 text-white">
        <div className="text-center">
          <p className="font-display text-3xl leading-none font-bold">{value}</p>
          <p className="mt-1 text-[11px] text-rose-100">/{max} điểm</p>
        </div>
      </div>
    </div>
  );
}

interface SectionHeadingProps {
  icon: ReactNode;
  children: ReactNode;
}

export function SectionHeading({ icon, children }: SectionHeadingProps): ReactNode {
  return (
    <h3 className="flex items-center gap-2 font-semibold text-stone-800">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">{icon}</span>
      {children}
    </h3>
  );
}
