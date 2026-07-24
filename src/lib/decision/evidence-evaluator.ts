import type { EvidenceAsset } from "../access-control.ts";
import type { EvidenceEvaluation } from "./types.ts";

interface EvidenceEvaluationInput {
  evidence: readonly EvidenceAsset[];
  requiredEvidenceSatisfied: boolean;
}

export function evaluateEvidence({
  evidence,
  requiredEvidenceSatisfied,
}: EvidenceEvaluationInput): EvidenceEvaluation {
  const warnings = evidence
    .filter((item) => item.tone === "warning")
    .map((item) => `Evidence ${item.id} requires review.`);

  if (!requiredEvidenceSatisfied || evidence.length === 0) {
    return {
      trustBand: "insufficient",
      sufficient: false,
      warnings,
      gaps: ["Additional authorized evidence is required."],
    };
  }

  return {
    trustBand: "medium",
    sufficient: true,
    warnings,
    gaps: warnings.length ? ["Resolve current evidence warnings."] : [],
  };
}

