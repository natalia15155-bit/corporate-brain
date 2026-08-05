import {
  demoUsers,
} from "../access-control.ts";
import { demoDecisionProvider } from "./demo-provider.ts";
import { evaluateEvidence } from "./evidence-evaluator.ts";
import { createOpenRouterDecisionProvider } from "./openrouter-provider.ts";
import { getRuntimeConfig } from "./runtime-config.ts";
import type { DecisionCard, DecisionRequest } from "./types.ts";
import { classifyQuestionIntent } from "./question-intent.ts";
import { demoEvidenceAdapter } from "../evidence/demo-evidence-adapter.ts";
import { createDataHubEvidenceAdapter } from "../evidence/datahub-evidence-adapter.ts";
import { dataHubSnapshotEvidenceAdapter } from "../evidence/datahub-snapshot-adapter.ts";
import { detectCapabilityPack } from "../capabilities/ecommerce-control-pack.ts";
import { evaluateCapabilityPack } from "../capabilities/evaluate-readiness.ts";
import { analyzeEcommerceQuestion } from "../analytics/ecommerce-demo-adapter.ts";
import { evaluateDecisionGate } from "./decision-gate.ts";
import type {
  EvidenceAdapter,
  EvidenceRetrievalInput,
  EvidenceRetrievalResult,
} from "../evidence/types.ts";
import { EvidenceSourceError } from "../evidence/types.ts";

const DEFAULT_LIVE_EVIDENCE_TIMEOUT_MS = 12_000;

class LiveEvidenceTimeoutError extends Error {
  constructor() {
    super("Live DataHub evidence retrieval exceeded the demo timeout.");
    this.name = "LiveEvidenceTimeoutError";
  }
}

async function retrieveWithTimeout(
  adapter: EvidenceAdapter,
  input: EvidenceRetrievalInput,
  timeoutMs: number,
): Promise<EvidenceRetrievalResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      adapter.retrieve(input),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new LiveEvidenceTimeoutError()), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

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
  const intent = classifyQuestionIntent(request.question);
  const capabilityPack =
    intent === "readiness" ? detectCapabilityPack(request.question) : null;
  const user = demoUsers.find((candidate) => candidate.id === request.userId);

  if (!user) {
    throw new Error("Resolved demonstration persona is unavailable.");
  }

  const configuredSource = environment.EVIDENCE_SOURCE?.trim().toLowerCase();
  const evidenceAdapter =
    configuredSource === "snapshot"
      ? dataHubSnapshotEvidenceAdapter
      : config.evidenceSource === "datahub"
        ? createDataHubEvidenceAdapter({ environment })
        : demoEvidenceAdapter;
  const retrievalInput = {
    question: request.question,
    locale: request.locale,
    user,
  };
  let evidenceFallback = false;
  let retrieval: EvidenceRetrievalResult;

  if (configuredSource === "datahub") {
    const configuredTimeout = Number(environment.DATAHUB_DEMO_TIMEOUT_MS);
    const timeoutMs =
      Number.isFinite(configuredTimeout) && configuredTimeout >= 3_000
        ? Math.min(configuredTimeout, 20_000)
        : DEFAULT_LIVE_EVIDENCE_TIMEOUT_MS;
    try {
      retrieval = await retrieveWithTimeout(
        evidenceAdapter,
        retrievalInput,
        timeoutMs,
      );
    } catch (error) {
      if (
        !(error instanceof LiveEvidenceTimeoutError) &&
        !(error instanceof EvidenceSourceError)
      ) {
        throw error;
      }
      retrieval = await dataHubSnapshotEvidenceAdapter.retrieve(retrievalInput);
      evidenceFallback = true;
    }
  } else {
    retrieval = await evidenceAdapter.retrieve(retrievalInput);
  }
  const evidence = retrieval.evidence;
  const readiness = capabilityPack
    ? evaluateCapabilityPack({
        pack: capabilityPack,
        evidence,
        locale: request.locale,
      })
    : null;
  const analysis =
    intent === "analysis"
      ? analyzeEcommerceQuestion({
          question: request.question,
          locale: request.locale,
          user,
        })
      : null;
  const evaluation = evaluateEvidence({
    evidence,
    requiredEvidenceSatisfied: readiness
      ? readiness.status === "ready"
      : retrieval.requiredEvidenceSatisfied,
  });
  const provider =
    !evaluation.sufficient ||
    config.provider === "demo" ||
    readiness !== null
      ? demoDecisionProvider
      : createOpenRouterDecisionProvider(environment);

  const synthesis = await provider.synthesize({
    question: request.question,
    intent,
    locale: request.locale,
    user,
    evidence,
    evaluation,
    readiness,
    analysis,
  });

  const decisionStatus = evaluation.sufficient ? "recommendation" : "abstention";
  const decisionGate = evaluateDecisionGate({
    intent,
    status: decisionStatus,
    trustBand: evaluation.trustBand,
    evidenceCount: evidence.length,
    warnings: evaluation.warnings,
    gaps: evaluation.gaps,
    analysis,
    readiness,
    outcome: synthesis.outcome,
    risks: synthesis.risks,
  });

  return {
    id: createDecisionId(request.question, request.userId),
    question: request.question,
    intent,
    status: decisionStatus,
    trustBand: evaluation.trustBand,
    evidence,
    warnings: evaluation.warnings,
    gaps: evaluation.gaps,
    recommendation: synthesis.recommendation,
    outcome: synthesis.outcome,
    risks: synthesis.risks,
    roleInsight: synthesis.roleInsight,
    readiness,
    analysis,
    decisionGate,
    presentationRole: user.role,
    provider: provider.id,
    evidenceSource: retrieval.source,
    evidenceFallback,
    generatedAt: new Date().toISOString(),
  };
}

