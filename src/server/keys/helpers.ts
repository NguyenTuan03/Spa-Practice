import { ScoreCriterion } from "@/enums";
import type { ChecklistItem } from "@/types";

const { Diagnosis, Steps, Products, Notes } = ScoreCriterion;

export function item(
  id: string,
  criterion: ScoreCriterion,
  label: string,
  keywords: string[],
  sourceIds: string[],
): ChecklistItem {
  return { id, criterion, label, keywords, sourceIds };
}

export { Diagnosis, Steps, Products, Notes };
