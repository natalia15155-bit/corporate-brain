export type DomainId = "shared" | "growth" | "finance";
export type RoleId = "executive" | "analyst" | "data-steward";
export type EvidenceId = "EVP-029" | "EVP-044" | "EVP-052";

export interface DemoUser {
  id: string;
  name: string;
  initials: string;
  role: RoleId;
  team: string;
  allowedDomains: readonly DomainId[];
}

export interface EvidenceAsset {
  id: EvidenceId;
  name: string;
  type: string;
  owner: string;
  freshness: string;
  quality: string;
  tone: "verified" | "warning";
  domain: DomainId;
  sensitivity: "internal" | "confidential";
  required: boolean;
}

export const demoUsers: readonly DemoUser[] = [
  {
    id: "alex-executive",
    name: "Alex Morgan",
    initials: "AM",
    role: "executive",
    team: "Executive Office",
    allowedDomains: ["shared", "growth", "finance"],
  },
  {
    id: "maya-growth",
    name: "Maya Chen",
    initials: "MC",
    role: "analyst",
    team: "Growth",
    allowedDomains: ["shared", "growth"],
  },
  {
    id: "sofia-finance",
    name: "Sofia Reyes",
    initials: "SR",
    role: "data-steward",
    team: "Finance",
    allowedDomains: ["shared", "finance"],
  },
] as const;

export const evidenceAssets: readonly EvidenceAsset[] = [
  {
    id: "EVP-029",
    name: "Market Saturation Analysis",
    type: "DataHub · Certified dataset",
    owner: "Growth Analytics",
    freshness: "18 min",
    quality: "98.4%",
    tone: "verified",
    domain: "growth",
    sensitivity: "internal",
    required: true,
  },
  {
    id: "EVP-044",
    name: "Customer Acquisition Cost Trends",
    type: "DataHub · Executive dashboard",
    owner: "Finance AI",
    freshness: "2 hr",
    quality: "96.1%",
    tone: "verified",
    domain: "shared",
    sensitivity: "internal",
    required: true,
  },
  {
    id: "EVP-052",
    name: "Finance Customer Feed",
    type: "DataHub · Restricted data flow",
    owner: "Finance Data",
    freshness: "31 hr",
    quality: "Warning",
    tone: "warning",
    domain: "finance",
    sensitivity: "confidential",
    required: true,
  },
] as const;

export function canAccessEvidence(
  user: DemoUser,
  evidence: EvidenceAsset,
): boolean {
  return user.allowedDomains.includes(evidence.domain);
}

export function getAuthorizedEvidence(
  user: DemoUser,
  evidence: readonly EvidenceAsset[] = evidenceAssets,
): readonly EvidenceAsset[] {
  return evidence.filter((item) => canAccessEvidence(user, item));
}

export function hasSufficientEvidence(
  user: DemoUser,
  evidence: readonly EvidenceAsset[] = evidenceAssets,
): boolean {
  return evidence
    .filter((item) => item.required)
    .every((item) => canAccessEvidence(user, item));
}
