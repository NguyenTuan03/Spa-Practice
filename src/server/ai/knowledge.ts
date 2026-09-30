import "server-only";
import { CRITERION_LABEL, ScoreCriterion } from "@/enums";
import { getAllCaseKeys } from "@/server/expert-data";
import { SOURCES } from "@/server/sources";

// Cơ sở kiến thức đưa vào prompt để AI bám theo nguồn đã kiểm chứng thay vì tự bịa.
export function buildKnowledgeBase(): string {
  const sourceLines = SOURCES.map((source) => `[${source.id}] ${source.title} (${source.authors}, ${source.year})`);
  const caseBlocks = getAllCaseKeys().map((key) => {
    const groups = Object.values(ScoreCriterion).map((criterion) => {
      const lines = key.items
        .filter((entry) => entry.criterion === criterion)
        .map((entry) => `- ${entry.label} {${entry.sourceIds.join(",") || "thực hành"}}`);
      return `${CRITERION_LABEL[criterion]}:\n${lines.join("\n")}`;
    });
    return `## ${key.caseId}\n${groups.join("\n")}`;
  });
  return `NGUỒN:\n${sourceLines.join("\n")}\n\nKIẾN THỨC ĐÃ KIỂM CHỨNG THEO CA:\n${caseBlocks.join("\n\n")}`;
}

export const VALID_SOURCE_IDS: string[] = SOURCES.map((source) => source.id);
