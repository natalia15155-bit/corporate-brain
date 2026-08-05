import type { EvidenceAsset } from "../access-control.ts";
import type { Locale } from "../i18n.ts";

export interface LocalizedText {
  en: string;
  es: string;
}

export interface CapabilityRequirement {
  id: string;
  capability: string;
  label: LocalizedText;
  description: LocalizedText;
  critical: boolean;
}

export interface AlertRuleTemplate {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  metric: string;
  operator: "<" | ">";
  threshold: number;
  unit: string;
  severity: "warning" | "critical";
  recipients: readonly string[];
  evidenceCapabilities: readonly string[];
}

export interface BusinessCapabilityPack {
  id: string;
  area: string;
  title: LocalizedText;
  triggers: readonly string[];
  requirements: readonly CapabilityRequirement[];
  alertRules: readonly AlertRuleTemplate[];
}

export interface ReadinessRequirement {
  id: string;
  label: string;
  description: string;
  status: "ready" | "missing";
  critical: boolean;
  evidenceIds: readonly string[];
}

export interface LineageConnection {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  operator: "<" | ">";
  threshold: number;
  unit: string;
  severity: "warning" | "critical";
  recipients: readonly string[];
  evidenceIds: readonly string[];
  enabled: boolean;
}

export interface ReadinessAssessment {
  packId: string;
  area: string;
  title: string;
  status: "ready" | "partial" | "blocked";
  readyCount: number;
  totalCount: number;
  requirements: readonly ReadinessRequirement[];
  lineage: readonly LineageConnection[];
  proposedAlerts: readonly AlertRule[];
}

export interface EvaluateCapabilityPackInput {
  pack: BusinessCapabilityPack;
  evidence: readonly EvidenceAsset[];
  locale: Locale;
}
