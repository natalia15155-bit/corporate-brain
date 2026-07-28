import type { AlertRule } from "../capabilities/types.ts";
import type { Locale } from "../i18n.ts";
import { normalizeUntrustedText } from "../http/request-security.ts";
import type { MemoryItemKind } from "./types.ts";

const memoryKinds = new Set<MemoryItemKind>([
  "decision",
  "action",
  "knowledge",
  "alert-plan",
]);

export interface MemoryWriteRequest {
  question: string;
  userId: string;
  locale: Locale;
  kind: MemoryItemKind;
  alertRules: readonly Pick<
    AlertRule,
    "id" | "enabled" | "threshold"
  >[];
}

export function parseMemoryWriteRequest(input: unknown): MemoryWriteRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("A memory write request is required.");
  }
  const value = input as Record<string, unknown>;
  const question =
    typeof value.question === "string"
      ? normalizeUntrustedText(value.question, 501)
      : "";
  const userId =
    typeof value.userId === "string"
      ? normalizeUntrustedText(value.userId, 80)
      : "";
  const locale = value.locale;
  const kind = value.kind;

  if (question.length < 10 || question.length > 500) {
    throw new Error("The question must contain between 10 and 500 characters.");
  }
  if (locale !== "en" && locale !== "es") {
    throw new Error("Locale must be en or es.");
  }
  if (typeof kind !== "string" || !memoryKinds.has(kind as MemoryItemKind)) {
    throw new Error("The memory item type is not supported.");
  }

  const rawAlerts = Array.isArray(value.alertRules)
    ? value.alertRules.slice(0, 10)
    : [];
  const alertRules = rawAlerts.map((candidate) => {
    if (!candidate || typeof candidate !== "object") {
      throw new Error("An alert rule is invalid.");
    }
    const alert = candidate as Record<string, unknown>;
    if (
      typeof alert.id !== "string" ||
      typeof alert.enabled !== "boolean" ||
      typeof alert.threshold !== "number" ||
      !Number.isFinite(alert.threshold) ||
      alert.threshold < 0 ||
      alert.threshold > 365
    ) {
      throw new Error("An alert rule is invalid.");
    }
    return {
      id: normalizeUntrustedText(alert.id, 100),
      enabled: alert.enabled,
      threshold: alert.threshold,
    };
  });

  return {
    question,
    userId,
    locale,
    kind: kind as MemoryItemKind,
    alertRules,
  };
}
