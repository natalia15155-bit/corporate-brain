import {
  demoUsers,
} from "../access-control.ts";
import { demoDecisionProvider } from "./demo-provider.ts";
import { evaluateEvidence } from "./evidence-evaluator.ts";
import { createOpenRouterDecisionProvider } from "./openrouter-provider.ts";
import { getRuntimeConfig } from "./runtime-config.ts";
import type { DecisionCard, DecisionRequest } from "./types.ts";
import { demoEvidenceAdapter } from "../evidence/demo-evidence-adapter.ts";
import { createDataHubEvidenceAdapter } from "../evidence/datahub-evidence-adapter.ts";
import { dataHubSnapshotEvidenceAdapter } from "../evidence/datahub-snapshot-adapter.ts";

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
  environment: Record<string, string | undefined> = process.env,
): Promise<DecisionCard> {
  const config = getRuntimeConfig(environment);
  const user = demoUsers.find((candidate) => candidate.id === request.userId);

  if (!user) {
    throw new Error("Resolved demonstration persona is unavailable.");
  }

  const evidenceAdapter =
    environment.EVIDENCE_SOURCE?.trim().toLowerCase() === "snapshot"
      ? dataHubSnapshotEvidenceAdapter
      : config.evidenceSource === "datahub"
        ? createDataHubEvidenceAdapter({ environment })
        : demoEvidenceAdapter;
  const retrieval = await evidenceAdapter.retrieve({
    question: request.question,
    locale: request.locale,
    user,
  });
  const evidence = retrieval.evidence;
  const evaluation = evaluateEvidence({
    evidence,
    requiredEvidenceSatisfied: retrieval.requiredEvidenceSatisfied,
  });
  const provider =
    !evaluation.sufficient || config.provider === "demo"
      ? demoDecisionProvider
      : createOpenRouterDecisionProvider(environment);

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
    evidenceSource: retrieval.source,
    generatedAt: new Date().toISOString(),
  };
}

