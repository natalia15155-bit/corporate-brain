"""Seed the synthetic Corporate Brain ecommerce catalog into DataHub.

The records contain metadata only: schemas, ownership, domains, documentation,
and lineage. They intentionally contain no customer or company information.
"""

from __future__ import annotations

import argparse
import os
from dataclasses import dataclass

from datahub.emitter.mce_builder import make_data_platform_urn, make_dataset_urn
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.emitter.rest_emitter import DatahubRestEmitter
from datahub.metadata.schema_classes import (
    DatasetLineageTypeClass,
    DatasetPropertiesClass,
    DomainPropertiesClass,
    DomainsClass,
    OwnerClass,
    OwnershipClass,
    OwnershipTypeClass,
    OtherSchemaClass,
    SchemaFieldClass,
    SchemaFieldDataTypeClass,
    SchemaMetadataClass,
    StringTypeClass,
    UpstreamClass,
    UpstreamLineageClass,
)


@dataclass(frozen=True)
class Asset:
    key: str
    platform: str
    dataset: str
    name: str
    domain: str
    owner: str
    description: str
    fields: tuple[str, ...]
    upstream: tuple[str, ...] = ()

    @property
    def urn(self) -> str:
        return make_dataset_urn(self.platform, self.dataset, "PROD")


DOMAINS = {
    "shared": "Shared",
    "ecommerce": "Ecommerce",
    "product": "Product",
    "operations": "Operations",
    "cx": "Customer Experience",
}

ASSETS = (
    Asset(
        "orders",
        "postgres",
        "orders",
        "Orders Production Dataset",
        "ecommerce",
        "Order Platform",
        "Canonical order events for GMV, payment state, fulfillment, and operational reporting. Join to order_items on order_id. Exclude cancelled and failed payments from net sales.",
        ("order_id", "customer_id", "status", "payment_state", "ordered_at", "fulfilled_at", "gross_value"),
    ),
    Asset(
        "order_items",
        "postgres",
        "order_items",
        "Order Items by SKU",
        "ecommerce",
        "Analytics Engineering",
        "Line-item grain for product revenue, units sold, returns, and delivery SLA analysis. One row per order_id and sku.",
        ("order_id", "sku", "quantity", "unit_price", "returned_quantity"),
        ("orders",),
    ),
    Asset(
        "products",
        "postgres",
        "product-master",
        "Product Master and Star Products",
        "product",
        "Product Operations",
        "Governed SKU catalog. is_star_product is the approved business flag for priority products and product_owner is the escalation owner.",
        ("sku", "product_name", "category", "lifecycle_status", "is_star_product", "product_owner"),
    ),
    Asset(
        "inventory",
        "snowflake",
        "inventory-position",
        "Inventory Position by Warehouse",
        "operations",
        "Supply Operations",
        "Near-real-time available, reserved, and inbound stock by SKU and warehouse. Use available_units and expected_restock_at for stockout alerts.",
        ("sku", "warehouse_id", "available_units", "reserved_units", "inbound_units", "expected_restock_at"),
        ("products",),
    ),
    Asset(
        "sales_velocity",
        "dbt",
        "sales-velocity",
        "SKU Sales Velocity and Days of Cover",
        "ecommerce",
        "Ecommerce Analytics",
        "Curated product demand model. days_of_cover combines sell-through velocity with current inventory and is the preferred stockout-risk measure.",
        ("sku", "units_sold_7d", "units_sold_30d", "daily_sales_velocity", "days_of_cover"),
        ("order_items", "products", "inventory"),
    ),
    Asset(
        "complaints",
        "snowflake",
        "product-complaints",
        "Product Complaints and Quality Signals",
        "cx",
        "CX Insights",
        "CX cases linked to SKU. complaint_rate_7d and severity support critical Product and CX review alerts without exposing message contents.",
        ("case_id", "sku", "reason_category", "severity", "opened_at", "complaint_rate_7d"),
        ("products", "orders"),
    ),
    Asset(
        "alert_routing",
        "postgres",
        "ecommerce-alert-routing",
        "Ecommerce Alert Routing Policy",
        "shared",
        "Data Governance",
        "Approved routing and review SLA for stockout and product-quality alerts. Critical complaints go to CX and Product; stockout risks go to Ecommerce and Operations.",
        ("alert_type", "severity", "recipient_team", "accountable_owner", "review_sla_hours"),
    ),
    Asset(
        "control_dashboard",
        "looker",
        "ecommerce-control",
        "Ecommerce Control Dashboard Blueprint",
        "ecommerce",
        "Ecommerce Analytics",
        "Control dashboard specification for sales, fulfillment, star-product stockout risk, and complaint escalation. Its upstream metadata defines the minimum viable source set.",
        ("metric_name", "business_definition", "source_asset", "refresh_sla", "alert_threshold"),
        ("orders", "products", "inventory", "sales_velocity", "complaints", "alert_routing"),
    ),
)


def domain_urn(domain: str) -> str:
    return f"urn:li:domain:{domain}"


def user_urn(owner: str) -> str:
    slug = owner.lower().replace("&", "and").replace(" ", "-")
    return f"urn:li:corpuser:{slug}"


def emit(emitter: DatahubRestEmitter, urn: str, aspect: object) -> None:
    emitter.emit_mcp(MetadataChangeProposalWrapper(entityUrn=urn, aspect=aspect))


def seed(emitter: DatahubRestEmitter) -> None:
    by_key = {asset.key: asset for asset in ASSETS}

    for slug, title in DOMAINS.items():
        emit(
            emitter,
            domain_urn(slug),
            DomainPropertiesClass(
                name=title,
                description=f"Corporate Brain demo domain for {title} evidence and access control.",
            ),
        )

    for asset in ASSETS:
        emit(
            emitter,
            asset.urn,
            DatasetPropertiesClass(
                name=asset.name,
                description=asset.description,
                customProperties={
                    "Corporate Brain capability": asset.key.replace("_", "."),
                    "Demo data": "synthetic metadata only",
                    "Business owner": asset.owner,
                },
            ),
        )
        emit(emitter, asset.urn, DomainsClass(domains=[domain_urn(asset.domain)]))
        emit(
            emitter,
            asset.urn,
            OwnershipClass(
                owners=[
                    OwnerClass(
                        owner=user_urn(asset.owner),
                        type=OwnershipTypeClass.DATAOWNER,
                    )
                ]
            ),
        )
        emit(
            emitter,
            asset.urn,
            SchemaMetadataClass(
                schemaName=asset.dataset,
                platform=make_data_platform_urn(asset.platform),
                version=0,
                hash="corporate-brain-v1",
                platformSchema=OtherSchemaClass(rawSchema=""),
                fields=[
                    SchemaFieldClass(
                        fieldPath=field,
                        type=SchemaFieldDataTypeClass(type=StringTypeClass()),
                        nativeDataType="STRING",
                        nullable=True,
                        description=f"Governed field {field} for {asset.name}.",
                    )
                    for field in asset.fields
                ],
            ),
        )

    for asset in ASSETS:
        if not asset.upstream:
            continue
        emit(
            emitter,
            asset.urn,
            UpstreamLineageClass(
                upstreams=[
                    UpstreamClass(
                        dataset=by_key[key].urn,
                        type=DatasetLineageTypeClass.TRANSFORMED,
                    )
                    for key in asset.upstream
                ]
            ),
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--gms-url", default="http://127.0.0.1:8080")
    args = parser.parse_args()
    emitter = DatahubRestEmitter(
        gms_server=args.gms_url,
        token=os.environ.get("DATAHUB_GMS_TOKEN"),
    )
    emitter.test_connection()
    seed(emitter)
    print(f"Seeded {len(ASSETS)} assets and {len(DOMAINS)} domains into DataHub.")


if __name__ == "__main__":
    main()
