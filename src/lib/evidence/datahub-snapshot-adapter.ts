import type { DemoUser, DomainId, EvidenceAsset } from "../access-control.ts";
import type { EvidenceAdapter, EvidenceRetrievalInput } from "./types.ts";

export const ecommerceAssetIds = {
  catalog: "urn:li:document:ecomm-catalog",
  ordersOverview: "urn:li:document:ecomm-orders",
  orderItemsOverview: "urn:li:document:ecomm-order-items",
  orders:
    "urn:li:dataset:(urn:li:dataPlatform:postgres,orders,PROD)",
  customer360:
    "urn:li:dataset:(urn:li:dataPlatform:snowflake,customer_360,PROD)",
  retentionDashboard:
    "urn:li:dashboard:(urn:li:dataPlatform:looker,retention-overview,PROD)",
  ordersPipeline:
    "urn:li:pipeline:(urn:li:dataPlatform:airflow,orders-daily,PROD)",
  products:
    "urn:li:dataset:(urn:li:dataPlatform:postgres,product-master,PROD)",
  inventory:
    "urn:li:dataset:(urn:li:dataPlatform:snowflake,inventory-position,PROD)",
  salesVelocity:
    "urn:li:dataset:(urn:li:dataPlatform:dbt,sales-velocity,PROD)",
  complaints:
    "urn:li:dataset:(urn:li:dataPlatform:snowflake,product-complaints,PROD)",
  alertRouting: "urn:li:document:ecommerce-alert-routing",
  controlDashboard:
    "urn:li:dashboard:(urn:li:dataPlatform:looker,ecommerce-control,PROD)",
} as const;

// A read-only projection of the official DataHub showcase-ecommerce pack.
// It keeps the public demo deterministic while the live MCP connection is
// reserved for the final integration environment.
export const dataHubSnapshotAssets: readonly EvidenceAsset[] = [
  {
    id: ecommerceAssetIds.catalog,
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
    capabilities: ["catalog.discovery", "workflow.alert-routing"],
    fields: ["platform", "dataset", "owner", "downstream"],
  },
  {
    id: ecommerceAssetIds.ordersOverview,
    name: "Orders Table",
    description:
      "Central order fact table for GMV, payment and fulfillment analysis. DataHub documents status rules and revenue gotchas.",
    type: "DataHub · Table overview",
    owner: "Analytics Engineering",
    freshness: "Snapshot from DataHub",
    quality: "Published",
    tone: "verified",
    domain: "ecommerce",
    sensitivity: "internal",
    required: true,
    source: "datahub",
    capabilities: ["commerce.order-documentation"],
    upstream: [ecommerceAssetIds.orders],
    fields: ["order_id", "customer_id", "status", "ordered_at", "gross_value"],
  },
  {
    id: ecommerceAssetIds.orderItemsOverview,
    name: "Order Items Table",
    description:
      "Line-item grain for product revenue, return-rate and delivery-SLA analysis, including documented price hierarchy.",
    type: "DataHub · Table overview",
    owner: "Analytics Engineering",
    freshness: "Snapshot from DataHub",
    quality: "Published",
    tone: "verified",
    domain: "ecommerce",
    sensitivity: "internal",
    required: false,
    source: "datahub",
    capabilities: ["commerce.order-items"],
    upstream: [ecommerceAssetIds.orders],
    fields: ["order_id", "sku", "quantity", "unit_price", "returned_quantity"],
  },
  {
    id: ecommerceAssetIds.orders,
    name: "Orders Production Dataset",
    description:
      "Canonical order events with status transitions, payment state and fulfillment timestamps for operational reporting.",
    type: "DataHub · PostgreSQL dataset",
    owner: "Order Platform",
    freshness: "42 min",
    quality: "99.2%",
    tone: "verified",
    domain: "ecommerce",
    sensitivity: "internal",
    required: true,
    source: "datahub",
    capabilities: ["commerce.orders"],
    fields: [
      "order_id",
      "customer_id",
      "status",
      "payment_state",
      "ordered_at",
      "fulfilled_at",
    ],
  },
  {
    id: ecommerceAssetIds.customer360,
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
    capabilities: ["customer.identity", "customer.lifecycle"],
    upstream: [ecommerceAssetIds.orders],
    fields: ["customer_id", "segment", "lifecycle_stage", "last_order_at"],
  },
  {
    id: ecommerceAssetIds.retentionDashboard,
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
    capabilities: ["analytics.dashboard", "customer.retention"],
    upstream: [ecommerceAssetIds.customer360, ecommerceAssetIds.orders],
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
    id: ecommerceAssetIds.ordersPipeline,
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
    capabilities: ["pipeline.orchestration"],
    upstream: [ecommerceAssetIds.orders],
  },
  {
    id: ecommerceAssetIds.products,
    name: "Product Master and Star Products",
    description:
      "Governed SKU catalog with category, lifecycle, accountable product owner and the approved star-product classification.",
    type: "DataHub · PostgreSQL dataset",
    owner: "Product Operations",
    freshness: "24 min",
    quality: "99.6%",
    tone: "verified",
    domain: "product",
    sensitivity: "internal",
    required: true,
    source: "datahub",
    capabilities: ["commerce.products", "commerce.product-priority"],
    fields: [
      "sku",
      "product_name",
      "category",
      "lifecycle_status",
      "is_star_product",
      "product_owner",
    ],
  },
  {
    id: ecommerceAssetIds.inventory,
    name: "Inventory Position by Warehouse",
    description:
      "Near-real-time available, reserved and inbound stock by SKU and warehouse, with replenishment ownership.",
    type: "DataHub · Snowflake dataset",
    owner: "Supply Operations",
    freshness: "12 min",
    quality: "99.1%",
    tone: "verified",
    domain: "operations",
    sensitivity: "internal",
    required: true,
    source: "datahub",
    capabilities: ["commerce.inventory"],
    upstream: [ecommerceAssetIds.products],
    fields: [
      "sku",
      "warehouse_id",
      "available_units",
      "reserved_units",
      "inbound_units",
      "expected_restock_at",
    ],
  },
  {
    id: ecommerceAssetIds.salesVelocity,
    name: "SKU Sales Velocity and Days of Cover",
    description:
      "Curated product-level demand model with recent units sold, sales velocity and projected days of inventory cover.",
    type: "DataHub · dbt model",
    owner: "Ecommerce Analytics",
    freshness: "20 min",
    quality: "98.9%",
    tone: "verified",
    domain: "ecommerce",
    sensitivity: "internal",
    required: true,
    source: "datahub",
    capabilities: ["commerce.sales-velocity"],
    upstream: [
      ecommerceAssetIds.orderItemsOverview,
      ecommerceAssetIds.products,
      ecommerceAssetIds.inventory,
    ],
    fields: [
      "sku",
      "units_sold_7d",
      "units_sold_30d",
      "daily_sales_velocity",
      "days_of_cover",
    ],
  },
  {
    id: ecommerceAssetIds.complaints,
    name: "Product Complaints and Quality Signals",
    description:
      "CX cases linked to SKU with reason, severity and seven-day complaint rate for Product and CX review.",
    type: "DataHub · Snowflake dataset",
    owner: "CX Insights",
    freshness: "30 min",
    quality: "97.8%",
    tone: "verified",
    domain: "cx",
    sensitivity: "confidential",
    required: true,
    source: "datahub",
    capabilities: ["cx.product-complaints", "product.quality"],
    upstream: [ecommerceAssetIds.products, ecommerceAssetIds.orders],
    fields: [
      "case_id",
      "sku",
      "reason",
      "severity",
      "opened_at",
      "complaint_rate_7d",
    ],
  },
  {
    id: ecommerceAssetIds.alertRouting,
    name: "Ecommerce Alert Routing Policy",
    description:
      "Approved destinations, accountable teams and escalation rules for Ecommerce, Operations, CX and Product alerts.",
    type: "DataHub · Governance document",
    owner: "Data Governance",
    freshness: "Reviewed 3 days ago",
    quality: "Approved",
    tone: "verified",
    domain: "shared",
    sensitivity: "internal",
    required: true,
    source: "datahub",
    capabilities: ["workflow.alert-routing"],
    fields: ["alert_type", "severity", "recipient_team", "owner", "review_sla"],
  },
  {
    id: ecommerceAssetIds.controlDashboard,
    name: "Ecommerce Control Dashboard Blueprint",
    description:
      "Proposed control surface for sales, stockout risk and product complaint escalation, connected to its governed sources.",
    type: "DataHub · Looker dashboard",
    owner: "Ecommerce Analytics",
    freshness: "Draft",
    quality: "Ready to build",
    tone: "verified",
    domain: "ecommerce",
    sensitivity: "internal",
    required: false,
    source: "datahub",
    capabilities: ["analytics.dashboard", "commerce.control-dashboard"],
    upstream: [
      ecommerceAssetIds.orders,
      ecommerceAssetIds.products,
      ecommerceAssetIds.inventory,
      ecommerceAssetIds.salesVelocity,
      ecommerceAssetIds.complaints,
    ],
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
    const evidence = dataHubSnapshotAssets
      .filter((asset) => canAccess(input.user, asset))
      .map((asset, index) => ({ asset, relevance: score(asset, input.question) + (index === 0 ? 1 : 0) }))
      .sort((left, right) => right.relevance - left.relevance)
      .map(({ asset }) => asset)
      .slice(0, 16);

    return {
      source: "datahub",
      evidence,
      requiredEvidenceSatisfied:
        evidence.length >= 2 && evidence.every((asset) => asset.owner !== "Unassigned"),
    };
  },
};
