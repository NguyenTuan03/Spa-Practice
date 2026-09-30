import "server-only";
import { CRITERION_MAX, ScoreCriterion } from "@/enums";
import type {
  CaseKey,
  ChecklistItem,
  CriterionScore,
  RedFlag,
  ScoreResult,
  TreatmentPlanInput,
} from "@/types";

const PENALTY_PER_FLAG = 5;
const MAX_PENALTY = 10;
const CLAUSE_SPLIT = /[.;,\n!?]+/;
const NEGATIONS: string[] = [" khong ", " tranh ", " han che ", " ngung ", " cam ", " chua ", " bo qua ", " giam "];

function stripMarks(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\- ]+/g, " ")
    .replace(/\s+/g, " ");
}

function normalizeText(raw: string): string {
  return ` ${stripMarks(raw).trim()} `;
}

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(stripMarks(keyword)));
}

function isNegated(clause: string): boolean {
  return NEGATIONS.some((negation) => clause.includes(negation));
}

function isFlagged(clauses: string[], flag: RedFlag): boolean {
  return clauses.some((clause) => matchesAny(clause, flag.keywords) && !isNegated(clause));
}

function scoreCriterion(criterion: ScoreCriterion, items: ChecklistItem[], matchedIds: Set<string>): CriterionScore {
  const scoped = items.filter((entry) => entry.criterion === criterion);
  const matched = scoped.filter((entry) => matchedIds.has(entry.id)).length;
  const max = CRITERION_MAX[criterion];
  const score = scoped.length === 0 ? 0 : Math.round((max * matched) / scoped.length);
  return { criterion, score, max, matched, total: scoped.length };
}

export function scorePlan(key: CaseKey, input: TreatmentPlanInput): ScoreResult {
  const rawText = [input.diagnosis, input.steps, input.products, input.notes].join("\n");
  const text = normalizeText(rawText);
  // Cảnh báo an toàn chỉ xét phần đề xuất điều trị, không xét phần chẩn đoán (mô tả nguyên nhân)
  const adviceText = [input.steps, input.products, input.notes].join("\n");
  const clauses = adviceText.split(CLAUSE_SPLIT).map(normalizeText);

  const matched = key.items.filter((entry) => matchesAny(text, entry.keywords));
  const missed = key.items.filter((entry) => !matched.includes(entry));
  const matchedIds = new Set(matched.map((entry) => entry.id));

  const breakdown = Object.values(ScoreCriterion).map((criterion) => scoreCriterion(criterion, key.items, matchedIds));
  const flagged = key.redFlags.filter((flag) => isFlagged(clauses, flag));
  const penalty = Math.min(flagged.length * PENALTY_PER_FLAG, MAX_PENALTY);
  const sum = breakdown.reduce((acc, entry) => acc + entry.score, 0);

  return { total: Math.max(sum - penalty, 0), penalty, breakdown, matched, missed, flagged };
}
