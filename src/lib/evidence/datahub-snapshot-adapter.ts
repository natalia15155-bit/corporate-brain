import type { DemoUser, DomainId, EvidenceAsset } from "../access-control.ts";
import type { EvidenceAdapter, EvidenceRetrievalInput } from "./types.ts";

// A read-only projection of the official DataHub showcase-ecommerce pack.
// It keeps the public demo deterministic while the live MCP connection is
// reserved for the final integration environment.
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
  {
    id: "urn:li:dataset:(urn:li:dataPlatform:postgres,orders,PROD)",
    name: "Orders Production Dataset",
    description:
      "Canonical order events with status transitions, payment state and fulfillment timestamps for operational reporting.",
    type: "DataHub · PostgreSQL dataset",
    owner: "Order Platform",
    freshness: "42 min",
    quality: "99.2%",
    tone: "verified",
    domain: "growth",
    sensitivity: "internal",
    required: true,
    source: "datahub",
  },
  {
    id: "urn:li:dataset:(urn:li:dataPlatform:snowflake,customer_360,PROD)",
    name: "Customer 360 Model",
    description:
      "Curated customer identity and lifecycle model used by retention, churn and executive reporting workflows.",
    type: "DataHub · Snowflake dataset",
    owner: "Analytics Engineering",
    freshness: "1 hr",
    quality: "98.7%",
    tone: "verified",
    domain: "shared",
    sensitivity: "internal",
    required: true,
    source: "datahub",
  },
  {
    id: "urn:li:dashboard:(urn:li:dataPlatform:looker,retention-overview,PROD)",
    name: "Retention Overview Dashboard",
    description:
      "Executive dashboard downstream of Customer 360 and Orders, with documented metric definitions and owners.",
    type: "DataHub · Looker dashboard",
    owner: "Growth Analytics",
    freshness: "2 hr",
    quality: "Monitored",
    tone: "verified",
    domain: "growth",
    sensitivity: "internal",
    required: false,
    source: "datahub",
  },
  {
    id: "urn:li:dataset:(urn:li:dataPlatform:s3,returns,PROD)",
    name: "Returns and Refunds Feed",
    description:
      "Refund and return events joined to order items; a dependency for net revenue and customer experience analysis.",
    type: "DataHub · S3 dataset",
    owner: "Finance Data",
    freshness: "6 hr",
    quality: "96.8%",
    tone: "verified",
    domain: "finance",
    sensitivity: "confidential",
    required: false,
    source: "datahub",
  },
  {
    id: "urn:li:dataset:(urn:li:dataPlatform:snowflake,net_revenue,PROD)",
    name: "Net Revenue Metric Layer",
    description:
      "Governed metric layer for net revenue, connecting orders, refunds and the finance glossary definition.",
    type: "DataHub · Snowflake metric",
    owner: "Finance Data",
    freshness: "3 hr",
    quality: "Review required",
    tone: "warning",
    domain: "finance",
    sensitivity: "confidential",
    required: true,
    source: "datahub",
  },
  {
    id: "urn:li:pipeline:(urn:li:dataPlatform:airflow,orders-daily,PROD)",
    name: "Orders Daily Pipeline",
    description:
      "Airflow pipeline that publishes the orders dataset and records the upstream-to-dashboard lineage chain.",
    type: "DataHub · Airflow pipeline",
    owner: "Data Platform",
    freshness: "Last run 38 min ago",
    quality: "Healthy",
    tone: "verified",
    domain: "shared",
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
