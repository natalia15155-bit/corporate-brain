import {
  demoUsers,
  getAuthorizedEvidence,
  hasSufficientEvidence,
} from "../access-control.ts";
import { demoDecisionProvider } from "./demo-provider.ts";
import { evaluateEvidence } from "./evidence-evaluator.ts";
import { getRuntimeConfig } from "./runtime-config.ts";
import type { DecisionCard, DecisionRequest } from "./types.ts";

function createDecisionId(question: string, userId: string): string {
  let hash = 2166136261;
  const value = `${userId}:${question.toLowerCase()}`;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `DEC-${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
}

export async function createDecision(
  request: DecisionRequest,
): Promise<DecisionCard> {
  const config = getRuntimeConfig();
  const user = demoUsers.find((candidate) => candidate.id === request.userId);

  if (!user) {
    throw new Error("Resolved demonstration persona is unavailable.");
  }

  const evidence = getAuthorizedEvidence(user);
  const evaluation = evaluateEvidence({
    evidence,
    requiredEvidenceSatisfied: hasSufficientEvidence(user),
  });
  const provider = config.provider === "demo" ? demoDecisionProvider : null;

  if (!provider) {
    throw new Error("Configured provider is unavailable.");
  }

  const synthesis = await provider.synthesize({
    question: request.question,
    locale: request.locale,
    user,
    evidence,
    evaluation,
  });

  return {
    id: createDecisionId(request.question, request.userId),
    question: request.question,
    status: evaluation.sufficient ? "recommendation" : "abstention",
    trustBand: evaluation.trustBand,
    evidence,
    warnings: evaluation.warnings,
    gaps: evaluation.gaps,
    recommendation: synthesis.recommendation,
    outcome: synthesis.outcome,
    risks: synthesis.risks,
    roleInsight: synthesis.roleInsight,
    presentationRole: user.role,
    provider: provider.id,
    generatedAt: new Date().toISOString(),
  };
}

