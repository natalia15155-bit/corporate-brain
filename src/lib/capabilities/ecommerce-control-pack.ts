import type { BusinessCapabilityPack } from "./types.ts";

export const ecommerceControlPack: BusinessCapabilityPack = {
  id: "ecommerce-control",
  area: "Ecommerce",
  title: {
    en: "Ecommerce control dashboard and alerts",
    es: "Dashboard de control y alertas de Ecommerce",
  },
  triggers: [
    "ecommerce",
    "inventory",
    "stock",
    "stockout",
    "quiebre",
    "reclamo",
    "complaint",
    "product alert",
    "alerta",
  ],
  requirements: [
    {
      id: "orders",
      capability: "commerce.orders",
      label: { en: "Orders", es: "Órdenes" },
      description: {
        en: "Order and line-item facts for demand and fulfillment metrics.",
        es: "Órdenes y líneas de pedido para métricas de demanda y cumplimiento.",
      },
      critical: true,
    },
    {
      id: "products",
      capability: "commerce.products",
      label: { en: "Product catalog", es: "Catálogo de productos" },
      description: {
        en: "SKU, category, lifecycle and accountable product owner.",
        es: "SKU, categoría, ciclo de vida y responsable del producto.",
      },
      critical: true,
    },
    {
      id: "priority-products",
      capability: "commerce.product-priority",
      label: { en: "Star products", es: "Productos estrella" },
      description: {
        en: "An approved business definition of priority products.",
        es: "Una definición de negocio aprobada para productos prioritarios.",
      },
      critical: true,
    },
    {
      id: "inventory",
      capability: "commerce.inventory",
      label: { en: "Inventory position", es: "Posición de inventario" },
      description: {
        en: "Available, reserved and inbound stock by SKU and warehouse.",
        es: "Stock disponible, reservado y entrante por SKU y depósito.",
      },
      critical: true,
    },
    {
      id: "sales-velocity",
      capability: "commerce.sales-velocity",
      label: { en: "Sales velocity", es: "Velocidad de ventas" },
      description: {
        en: "Recent units sold and calculated days of cover.",
        es: "Unidades vendidas recientemente y días de cobertura calculados.",
      },
      critical: true,
    },
    {
      id: "complaints",
      capability: "cx.product-complaints",
      label: { en: "Product complaints", es: "Reclamos por producto" },
      description: {
        en: "Complaint volume, rate, severity and reason linked to SKU.",
        es: "Volumen, tasa, severidad y motivo de reclamos vinculados al SKU.",
      },
      critical: true,
    },
    {
      id: "alert-routing",
      capability: "workflow.alert-routing",
      label: { en: "Alert routing", es: "Enrutamiento de alertas" },
      description: {
        en: "Approved owners and destinations for operational alerts.",
        es: "Responsables y destinos aprobados para alertas operativas.",
      },
      critical: true,
    },
  ],
  alertRules: [
    {
      id: "star-product-stockout",
      name: {
        en: "Star product stockout risk",
        es: "Riesgo de quiebre de producto estrella",
      },
      description: {
        en: "Escalate when a star product falls below the configured days of cover.",
        es: "Escalar cuando un producto estrella cae por debajo de los días de cobertura configurados.",
      },
      metric: "days_of_cover",
      operator: "<",
      threshold: 3,
      unit: "days",
      severity: "critical",
      recipients: ["Ecommerce", "Operations", "Product"],
      evidenceCapabilities: [
        "commerce.products",
        "commerce.product-priority",
        "commerce.inventory",
        "commerce.sales-velocity",
      ],
    },
    {
      id: "product-complaint-rate",
      name: {
        en: "Critical product complaint rate",
        es: "Tasa crítica de reclamos por producto",
      },
      description: {
        en: "Escalate products whose seven-day complaint rate exceeds the configured threshold.",
        es: "Escalar productos cuya tasa de reclamos de siete días supera el umbral configurado.",
      },
      metric: "complaint_rate_7d",
      operator: ">",
      threshold: 5,
      unit: "%",
      severity: "critical",
      recipients: ["CX", "Product"],
      evidenceCapabilities: [
        "commerce.orders",
        "commerce.products",
        "cx.product-complaints",
      ],
    },
  ],
};

export const businessCapabilityPacks = [ecommerceControlPack] as const;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function detectCapabilityPack(
  question: string,
): BusinessCapabilityPack | null {
  const normalized = normalize(question);

  return (
    businessCapabilityPacks.find((pack) =>
      pack.triggers.some((trigger) => normalized.includes(normalize(trigger))),
    ) ?? null
  );
}
