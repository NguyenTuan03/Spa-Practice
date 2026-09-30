import "server-only";
import type { CaseKey } from "@/types";
import { ACNE_KEY } from "./keys/acne";
import { AGING_KEY } from "./keys/aging";
import { BLACKHEADS_KEY } from "./keys/blackheads";
import { DRY_KEY } from "./keys/dry";
import { MELASMA_KEY } from "./keys/melasma";
import { ROSACEA_KEY } from "./keys/rosacea";

const CASE_KEYS: CaseKey[] = [ACNE_KEY, DRY_KEY, MELASMA_KEY, ROSACEA_KEY, BLACKHEADS_KEY, AGING_KEY];

export function getCaseKey(caseId: string): CaseKey | undefined {
  return CASE_KEYS.find((key) => key.caseId === caseId);
}

export function getAllCaseKeys(): CaseKey[] {
  return CASE_KEYS;
}
