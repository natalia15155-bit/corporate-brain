import type { DemoUser, EvidenceAsset } from "../access-control.ts";
import type { Locale } from "../i18n.ts";

export type EvidenceSourceId = "demo" | "datahub";

export interface EvidenceRetrievalInput {
  question: string;
  locale: Locale;
  user: DemoUser;
}

export interface EvidenceRetrievalResult {
  source: EvidenceSourceId;
  evidence: readonly EvidenceAsset[];
  requiredEvidenceSatisfied: boolean;
}

export interface EvidenceAdapter {
  readonly id: EvidenceSourceId;
  retrieve(input: EvidenceRetrievalInput): Promise<EvidenceRetrievalResult>;
}

export class EvidenceSourceError extends Error {
  public readonly code:
    | "configuration"
    | "connection"
    | "invalid_response"
    | "insufficient_results";
  public readonly retryable: boolean;

  constructor(
    message: string,
    code:
      | "configuration"
      | "connection"
      | "invalid_response"
      | "insufficient_results",
    retryable = false,
  ) {
    super(message);
    this.name = "EvidenceSourceError";
    this.code = code;
    this.retryable = retryable;
  }
}
