import type { AlertRule } from "../capabilities/types.ts";

export type MemoryItemKind =
  | "decision"
  | "action"
  | "knowledge"
  | "alert-plan";

export interface CorporateMemoryItem {
  id: string;
  kind: MemoryItemKind;
  title: string;
  summary: string;
  team: string;
  createdBy: string;
  createdAt: string;
  evidenceIds: readonly string[];
  alertRules: readonly AlertRule[];
  syncStatus?: "browser-only" | "datahub-synced" | "datahub-error";
  dataHubDocumentUrn?: string | null;
}
