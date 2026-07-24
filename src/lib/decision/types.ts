import type {
  DemoUser,
  EvidenceAsset,
  RoleId,
} from "../access-control.ts";
import type { Locale } from "../i18n.ts";
import type { EvidenceSourceId } from "../evidence/types.ts";

export type TrustBand = "medium" | "insufficient";
export type DecisionStatus = "recommendation" | "abstention";
export type ProviderId = "demo" | "openrouter";
export type DecisionErrorCode =
  | "INVALID_REQUEST"
  | "UNKNOWN_PERSONA"
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
  locale: Locale;
  user: DemoUser;
  evidence: readonly EvidenceAsset[];
  evaluation: EvidenceEvaluation;
}

export interface DecisionSynthesis {
  recommendation: string;
  outcome: string | null;
  risks: readonly string[];
  roleInsight: string;
}

export interface DecisionCard {
  id: string;
  question: string;
  status: DecisionStatus;
  trustBand: TrustBand;
  evidence: readonly EvidenceAsset[];
  warnings: readonly string[];
  gaps: readonly string[];
  recommendation: string;
  outcome: string | null;
  risks: readonly string[];
  roleInsight: string;
  presentationRole: RoleId;
  provider: ProviderId;
  evidenceSource: EvidenceSourceId;
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
