import type { Difficulty, ScoreCriterion, SkinType } from "@/enums";

export interface SkinCase {
  id: string;
  title: string;
  imageUrl: string;
  imageCredit?: string;
  description: string;
  skinType: SkinType;
  difficulty: Difficulty;
}

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

export interface CriterionScore {
  criterion: ScoreCriterion;
  score: number;
  max: number;
  matched: number;
  total: number;
}

export interface ScoreResult {
  total: number;
  penalty: number;
  breakdown: CriterionScore[];
  matched: ChecklistItem[];
  missed: ChecklistItem[];
  flagged: RedFlag[];
}

export interface ScoreResponse {
  result: ScoreResult;
  sources: SourceRef[];
}

export interface Attempt {
  id: string;
  caseId: string;
  input: TreatmentPlanInput;
  response: ScoreResponse;
  createdAt: string;
}
