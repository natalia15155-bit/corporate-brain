export type DomainId =
  | "shared"
  | "growth"
  | "ecommerce"
  | "product"
  | "cx"
  | "operations"
  | "finance";
export type RoleId = "executive" | "analyst" | "data-steward";
export type EvidenceId = string;

export interface LocalizedProfileText {
  en: string;
  es: string;
}

export interface RoleProfile {
  purpose: LocalizedProfileText;
  responsibilities: readonly LocalizedProfileText[];
}

export interface DemoUser {
  id: string;
  name: string;
  initials: string;
  role: RoleId;
  team: string;
  allowedDomains: readonly DomainId[];
  profile: RoleProfile;
}

export interface EvidenceAsset {
  id: EvidenceId;
  name: string;
  description: string;
  type: string;
  owner: string;
  freshness: string;
  quality: string;
  tone: "verified" | "warning";
  domain: DomainId;
  sensitivity: "internal" | "confidential";
  required: boolean;
  source: "demo" | "datahub";
  capabilities?: readonly string[];
  upstream?: readonly EvidenceId[];
  fields?: readonly string[];
}

export const demoUsers: readonly DemoUser[] = [
  {
    id: "alex-executive",
    name: "Alex Morgan",
    initials: "AM",
    role: "executive",
    team: "Executive Office",
    allowedDomains: [
      "shared",
      "growth",
      "ecommerce",
      "product",
      "cx",
      "operations",
      "finance",
    ],
    profile: {
      purpose: {
        en: "Compare company-wide impact, risk and ownership before approving a course of action.",
        es: "Comparar impacto, riesgo y responsables de toda la empresa antes de aprobar un curso de acción.",
      },
      responsibilities: [
        {
          en: "Review cross-functional outcomes and unresolved risks.",
          es: "Revisar resultados transversales y riesgos pendientes.",
        },
        {
          en: "Approve consequential decisions and accountable owners.",
          es: "Aprobar decisiones relevantes y responsables.",
        },
      ],
    },
  },
  {
    id: "maya-growth",
    name: "Maya Chen",
    initials: "MC",
    role: "analyst",
    team: "Ecommerce",
    allowedDomains: [
      "shared",
      "growth",
      "ecommerce",
      "product",
      "cx",
      "operations",
    ],
    profile: {
      purpose: {
        en: "Turn authorized Ecommerce data into monitored metrics, dashboards and actionable alerts.",
        es: "Convertir los datos autorizados de Ecommerce en métricas, tableros y alertas accionables.",
      },
      responsibilities: [
        {
          en: "Validate source coverage, lineage, freshness and quality.",
          es: "Validar cobertura, linaje, actualización y calidad de las fuentes.",
        },
        {
          en: "Define metrics and alert thresholds with the accountable teams.",
          es: "Definir métricas y umbrales de alerta con los equipos responsables.",
        },
      ],
    },
  },
  {
    id: "sofia-finance",
    name: "Sofia Reyes",
    initials: "SR",
    role: "data-steward",
    team: "Finance",
    allowedDomains: ["shared", "finance"],
    profile: {
      purpose: {
        en: "Protect Finance data quality, ownership, definitions and authorized use.",
        es: "Proteger la calidad, propiedad, definiciones y uso autorizado de los datos de Finanzas.",
      },
      responsibilities: [
        {
          en: "Resolve quality warnings and ownership gaps.",
          es: "Resolver advertencias de calidad y vacíos de responsabilidad.",
        },
        {
          en: "Confirm that sensitive sources are used within policy.",
          es: "Confirmar que las fuentes sensibles se usen dentro de las políticas.",
        },
      ],
    },
  },
] as const;

export const evidenceAssets: readonly EvidenceAsset[] = [
  {
    id: "EVP-029",
    name: "Market Saturation Analysis",
    description:
      "Competitor spend declined while high-yield channels continued to create qualified demand.",
    type: "DataHub · Certified dataset",
    owner: "Growth Analytics",
    freshness: "18 min",
    quality: "98.4%",
    tone: "verified",
    domain: "growth",
    sensitivity: "internal",
    required: true,
    source: "demo",
  },
  {
    id: "EVP-044",
    name: "Customer Acquisition Cost Trends",
    description:
      "Current blended CAC remains below the lifetime-value efficiency threshold.",
    type: "DataHub · Executive dashboard",
    owner: "Finance AI",
    freshness: "2 hr",
    quality: "96.1%",
    tone: "verified",
    domain: "shared",
    sensitivity: "internal",
    required: true,
    source: "demo",
  },
  {
    id: "EVP-052",
    name: "Finance Customer Feed",
    description:
      "The customer finance feed missed its freshness target and requires owner review.",
    type: "DataHub · Restricted data flow",
    owner: "Finance Data",
    freshness: "31 hr",
    quality: "Warning",
    tone: "warning",
    domain: "finance",
    sensitivity: "confidential",
    required: true,
    source: "demo",
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
