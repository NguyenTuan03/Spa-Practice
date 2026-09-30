import type { Difficulty, ScoreCriterion, SkinType } from "@/enums";

export interface SkinCase {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  skinType: SkinType;
  difficulty: Difficulty;
}

export interface ExpertAnswer {
  caseId: string;
  diagnosis: string;
  steps: string[];
  products: string[];
  notes: string[];
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
  comment: string;
}

export interface ScoreResult {
  total: number;
  breakdown: CriterionScore[];
  strengths: string[];
  missing: string[];
  advice: string;
}

export interface ScoreResponse {
  result: ScoreResult;
  expert: ExpertAnswer;
}

export interface Attempt {
  id: string;
  caseId: string;
  input: TreatmentPlanInput;
  response: ScoreResponse;
  createdAt: string;
}
