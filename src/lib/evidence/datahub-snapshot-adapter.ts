import type { DemoUser, DomainId, EvidenceAsset } from "../access-control.ts";
import type { EvidenceAdapter, EvidenceRetrievalInput } from "./types.ts";

// A small, offline projection of the official DataHub showcase-ecommerce pack.
// It keeps local development fast while the live MCP connection is reserved for
// integration tests and the public demo.
const snapshotAssets: readonly EvidenceAsset[] = [
  {
    id: "urn:li:document:ecomm-catalog",
    name: "E-Commerce Data Catalog",
    description:
      "The catalog documents the Order Entry platform and its flow from PostgreSQL through S3, Snowflake, dbt and BI tools.",
    type: "DataHub · Document",
    owner: "Data Platform",
    freshness: "Snapshot from DataHub",
    quality: "Published",
    tone: "verified",
    domain: "shared",
    sensitivity: "internal",
    required: true,
    source: "datahub",
  },
  {
    id: "urn:li:document:ecomm-orders",
    name: "Orders Table",
    description:
      "Central order fact table for GMV, payment and fulfillment analysis. DataHub documents status rules and revenue gotchas.",
    type: "DataHub · Table overview",
    owner: "Analytics Engineering",
    freshness: "Snapshot from DataHub",
    quality: "Published",
    tone: "verified",
    domain: "growth",
    sensitivity: "internal",
    required: true,
    source: "datahub",
  },
  {
    id: "urn:li:document:ecomm-order-items",
    name: "Order Items Table",
    description:
      "Line-item grain for product revenue, return-rate and delivery-SLA analysis, including documented price hierarchy.",
    type: "DataHub · Table overview",
    owner: "Analytics Engineering",
    freshness: "Snapshot from DataHub",
    quality: "Published",
    tone: "verified",
    domain: "growth",
    sensitivity: "internal",
    required: false,
    source: "datahub",
  },
] as const;

function score(asset: EvidenceAsset, question: string): number {
  const haystack = `${asset.name} ${asset.description}`.toLowerCase();
  return question
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .reduce((total, word) => total + (haystack.includes(word) ? 2 : 0), 0);
}

function canAccess(user: DemoUser, asset: EvidenceAsset): boolean {
  return user.allowedDomains.includes(asset.domain as DomainId);
}

export const dataHubSnapshotEvidenceAdapter: EvidenceAdapter = {
  id: "datahub",
  async retrieve(input: EvidenceRetrievalInput) {
    const evidence = snapshotAssets
      .filter((asset) => canAccess(input.user, asset))
      .map((asset, index) => ({ asset, relevance: score(asset, input.question) + (index === 0 ? 1 : 0) }))
      .sort((left, right) => right.relevance - left.relevance)
      .map(({ asset }) => asset)
      .slice(0, 8);

    return {
      source: "datahub",
      evidence,
      requiredEvidenceSatisfied:
        evidence.length >= 2 && evidence.every((asset) => asset.owner !== "Unassigned"),
    };
  },
};
