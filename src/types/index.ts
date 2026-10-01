import type { ScoreCriterion } from "@/enums";

export interface SourceRef {
  id: string;
  title: string;
  authors: string;
  publisher: string;
  year: string;
  url: string;
  reviewers?: string[];
}

export interface ChecklistItem {
  id: string;
  criterion: ScoreCriterion;
  label: string;
  keywords: string[];
  sourceIds: string[];
}

export interface RedFlag {
  id: string;
  label: string;
  keywords: string[];
  sourceIds: string[];
}

export interface CaseKey {
  caseId: string;
  items: ChecklistItem[];
  redFlags: RedFlag[];
}

export interface TreatmentPlanInput {
  diagnosis: string;
  steps: string;
  products: string;
  notes: string;
}

