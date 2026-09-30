export enum SkinType {
  Oily = "oily",
  Dry = "dry",
  Combination = "combination",
  Sensitive = "sensitive",
}

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export enum ScoreCriterion {
  Diagnosis = "diagnosis",
  Steps = "steps",
  Products = "products",
  Notes = "notes",
}

export const SKIN_TYPE_LABEL: Record<SkinType, string> = {
  [SkinType.Oily]: "Da dầu",
  [SkinType.Dry]: "Da khô",
  [SkinType.Combination]: "Da hỗn hợp",
  [SkinType.Sensitive]: "Da nhạy cảm",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Dễ",
  [Difficulty.Medium]: "Trung bình",
  [Difficulty.Hard]: "Khó",
};

export const CRITERION_LABEL: Record<ScoreCriterion, string> = {
  [ScoreCriterion.Diagnosis]: "Chẩn đoán",
  [ScoreCriterion.Steps]: "Quy trình điều trị",
  [ScoreCriterion.Products]: "Sản phẩm",
  [ScoreCriterion.Notes]: "Lưu ý & chăm sóc tại nhà",
};

export const CRITERION_MAX: Record<ScoreCriterion, number> = {
  [ScoreCriterion.Diagnosis]: 30,
  [ScoreCriterion.Steps]: 30,
  [ScoreCriterion.Products]: 25,
  [ScoreCriterion.Notes]: 15,
};

export enum AiProvider {
  Gemini = "gemini",
  OpenAiCompatible = "openai-compatible",
}

export const ACCESS_CODE_HEADER = "x-access-code";
