import type { Difficulty, ScoreCriterion, SkinCondition, SkinType } from "@/enums";
import type { SourceRef, TreatmentPlanInput } from "@/types";

export interface CitedText {
  text: string;
  sourceIds: string[];
}

export interface ReferencePlan {
  diagnosis: CitedText;
  steps: CitedText[];
  products: CitedText[];
  notes: CitedText[];
}

export interface LibraryImage {
  id: string;
  condition: SkinCondition;
  url: string;
  credit: string;
  license: string;
  sourceUrl: string;
}

export interface GeneratedCase {
  title: string;
  description: string;
  skinType: SkinType;
  difficulty: Difficulty;
  condition: SkinCondition;
  image: LibraryImage;
  reference: ReferencePlan;
}

export interface GenerateCaseResponse {
  generated: GeneratedCase;
  sources: SourceRef[];
}

export interface AiCriterionScore {
  criterion: ScoreCriterion;
  score: number;
  max: number;
  comment: string;
}

export interface AiCorrectPoint {
  point: string;
  evidence: string;
}

export interface AiUnsafePoint {
  issue: string;
  reason: string;
}

export interface AiGrade {
  total: number;
  breakdown: AiCriterionScore[];
  correct: AiCorrectPoint[];
  missing: string[];
  unsafe: AiUnsafePoint[];
  advice: string;
  sourceIds: string[];
}

export interface GradeResponse {
  grade: AiGrade;
  sources: SourceRef[];
}

export interface AdvancedAttempt {
  id: string;
  generated: GeneratedCase;
  input: TreatmentPlanInput;
  response: GradeResponse;
  createdAt: string;
}
