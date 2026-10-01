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

export interface CaseCore {
  title: string;
  description: string;
  skinType: SkinType;
  difficulty: Difficulty;
  condition: SkinCondition;
  reference: ReferencePlan;
}

export interface GeneratedCase extends CaseCore {
  image: LibraryImage;
}

// image = ảnh do server tìm (thư viện tĩnh hoặc Commons); null nghĩa là dùng ảnh của người dùng
export interface GenerateCaseResponse {
  generated: CaseCore;
  image: LibraryImage | null;
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

export interface AiWrongPoint {
  statement: string;
  correction: string;
}

export interface AiUnsafePoint {
  issue: string;
  reason: string;
}

export interface AiGrade {
  total: number;
  breakdown: AiCriterionScore[];
  correct: AiCorrectPoint[];
  wrong: AiWrongPoint[];
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
  generated: CaseCore;
  input: TreatmentPlanInput;
  response: GradeResponse;
  createdAt: string;
}
