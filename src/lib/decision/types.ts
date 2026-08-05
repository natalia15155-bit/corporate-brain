import type {
  DemoUser,
  EvidenceAsset,
  RoleId,
} from "../access-control.ts";
import type { Locale } from "../i18n.ts";
import type { EvidenceSourceId } from "../evidence/types.ts";
import type { QuestionIntent } from "./question-intent.ts";
import type { ReadinessAssessment } from "../capabilities/types.ts";
import type { AnalyticalResult } from "../analytics/types.ts";

export type TrustBand = "medium" | "insufficient";
export type DecisionStatus = "recommendation" | "abstention";
export type ProviderId = "demo" | "openrouter";
export type ResponseStage =
  | "data-discovery"
  | "analysis"
  | "proposal"
  | "decision";
export type DecisionGateStatus = "open" | "ready";
export type DecisionGateNextAction =
  | "ask-follow-up"
  | "convert-to-proposal"
  | "request-access"
  | "save-alert-plan"
  | "approve-decision";
export type DecisionErrorCode =
  | "INVALID_REQUEST"
  | "UNKNOWN_PERSONA"
  | "RATE_LIMITED"
  | "PROVIDER_UNAVAILABLE";

export interface DecisionRequest {
  question: string;
  userId: string;
  locale: Locale;
}

export interface EvidenceEvaluation {
  trustBand: TrustBand;
  sufficient: boolean;
  warnings: readonly string[];
  gaps: readonly string[];
}

export interface DecisionSynthesisInput {
  question: string;
  intent: QuestionIntent;
  locale: Locale;
  user: DemoUser;
  evidence: readonly EvidenceAsset[];
  evaluation: EvidenceEvaluation;
  readiness: ReadinessAssessment | null;
  analysis?: AnalyticalResult | null;
}

export interface DecisionSynthesis {
  recommendation: string;
  outcome: string | null;
  risks: readonly string[];
  roleInsight: string;
}

export interface DecisionGate {
  stage: ResponseStage;
  status: DecisionGateStatus;
  canSaveDecision: boolean;
  canSaveInsight: boolean;
  canSaveAction: boolean;
  canSaveAlertPlan: boolean;
  completed: readonly string[];
  missing: readonly string[];
  nextAction: DecisionGateNextAction;
}

export interface DecisionCard {
  id: string;
  question: string;
  intent: QuestionIntent;
  status: DecisionStatus;
  trustBand: TrustBand;
  evidence: readonly EvidenceAsset[];
  warnings: readonly string[];
  gaps: readonly string[];
  recommendation: string;
  outcome: string | null;
  risks: readonly string[];
  roleInsight: string;
  readiness: ReadinessAssessment | null;
  analysis?: AnalyticalResult | null;
  decisionGate: DecisionGate;
  presentationRole: RoleId;
  provider: ProviderId;
  evidenceSource: EvidenceSourceId;
  evidenceFallback: boolean;
  generatedAt: string;
}

export interface DecisionProvider {
  readonly id: ProviderId;
  synthesize(input: DecisionSynthesisInput): Promise<DecisionSynthesis>;
}

export type DecisionApiResult =
  | { ok: true; decision: DecisionCard }
  | {
      ok: false;
      error: {
        code: DecisionErrorCode;
        message: string;
      };
    };
