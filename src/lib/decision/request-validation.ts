import { demoUsers } from "../access-control.ts";
import { normalizeUntrustedText } from "../http/request-security.ts";
import type { DecisionRequest } from "./types.ts";

export class InvalidDecisionRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDecisionRequestError";
  }
}

export class UnknownPersonaError extends Error {
  constructor() {
    super("The selected demonstration persona is not available.");
    this.name = "UnknownPersonaError";
  }
}

const promptOverridePatterns = [
  /ignore\s+(?:all\s+|any\s+|the\s+)?(?:previous|prior|above)\s+(?:instructions?|prompts?)/i,
  /(?:reveal|show|print|return)\s+(?:the\s+)?(?:system\s+prompt|api\s+key|secret|hidden\s+instructions?)/i,
  /(?:act|behave)\s+as\s+(?:the\s+)?system/i,
];

export function parseDecisionRequest(input: unknown): DecisionRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new InvalidDecisionRequestError("A JSON request body is required.");
  }

  const candidate = input as Record<string, unknown>;
  const question =
    typeof candidate.question === "string"
      ? normalizeUntrustedText(candidate.question, 501)
      : "";
  const userId =
    typeof candidate.userId === "string" ? candidate.userId.trim() : "";
  const locale = candidate.locale;

  if (question.length < 10 || question.length > 500) {
    throw new InvalidDecisionRequestError(
      "The question must contain between 10 and 500 characters.",
    );
  }

  if (promptOverridePatterns.some((pattern) => pattern.test(question))) {
    throw new InvalidDecisionRequestError(
      "The question contains an unsafe instruction override.",
    );
  }

  if (locale !== "en" && locale !== "es") {
    throw new InvalidDecisionRequestError("Locale must be en or es.");
  }

  if (!demoUsers.some((user) => user.id === userId)) {
    throw new UnknownPersonaError();
  }

  return { question, userId, locale };
}

