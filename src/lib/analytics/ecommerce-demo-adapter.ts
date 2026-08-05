import type { DemoUser } from "../access-control.ts";
import { ecommerceAssetIds } from "../evidence/datahub-snapshot-adapter.ts";
import type { Locale } from "../i18n.ts";
import type { AnalyticalResult } from "./types.ts";

const productMetrics = [
  { name: "Luna LED Mask", unitsSold: 1_200, grossSales: 210_000, refunds: 20_000, cogs: 125_000 },
  { name: "Aurora Renewal Serum", unitsSold: 2_300, grossSales: 184_000, refunds: 10_000, cogs: 72_000 },
  { name: "Radiance Ritual Kit", unitsSold: 900, grossSales: 162_000, refunds: 8_000, cogs: 70_000 },
] as const;

function money(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-AR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function asksProfitability(question: string): boolean {
  const normalized = question.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  return /rentab|profit|margin/.test(normalized);
}

function asksUnitsSold(question: string): boolean {
  const normalized = question.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  return /units? sold|unidades? vendidas?|sales volume|volumen de ventas/.test(normalized);
}

function units(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-AR" : "en-US").format(value);
}

export function analyzeEcommerceQuestion(input: {
  question: string;
  locale: Locale;
  user: DemoUser;
}): AnalyticalResult {
  const { locale, user } = input;
  const profitability = asksProfitability(input.question);
  const unitComparison = asksUnitsSold(input.question);
  const mayUseFinance = user.allowedDomains.includes("finance");

  if (unitComparison) {
    const ranked = [...productMetrics].sort(
      (left, right) => right.unitsSold - left.unitsSold,
    );
    const winner = ranked[0];

    return {
      status: "answered",
      title: locale === "es" ? "Unidades vendidas por producto" : "Units sold by product",
      answer:
        locale === "es"
          ? `${winner.name} lidera el volumen con ${units(winner.unitsSold, locale)} unidades vendidas.`
          : `${winner.name} leads volume with ${units(winner.unitsSold, locale)} units sold.`,
      primaryValue: units(winner.unitsSold, locale),
      primaryLabel: locale === "es" ? "unidades vendidas" : "units sold",
      period: locale === "es" ? "Últimos 30 días · datos sintéticos" : "Last 30 days · synthetic data",
      metricDefinition:
        locale === "es"
          ? "Suma de la cantidad de artículos de órdenes válidas"
          : "Sum of item quantities from valid orders",
      bars: ranked.map((product) => ({
        label: product.name,
        value: product.unitsSold,
        formattedValue: units(product.unitsSold, locale),
      })),
      sourceAssetIds: [ecommerceAssetIds.orderItemsOverview, ecommerceAssetIds.products],
      limitations: [
        locale === "es"
          ? "El volumen no representa ingresos ni rentabilidad; excluye órdenes canceladas en la definición productiva."
          : "Volume is not revenue or profitability; the production definition excludes cancelled orders.",
      ],
      suggestedFollowUps:
        locale === "es"
          ? ["Comparar ventas por producto", "Analizar reclamos por producto", "Ver fuentes y responsables"]
          : ["Compare sales by product", "Analyze complaints by product", "View sources and owners"],
    };
  }

  if (profitability && mayUseFinance) {
    const ranked = productMetrics
      .map((product) => ({
        ...product,
        contribution: product.grossSales - product.refunds - product.cogs,
      }))
      .sort((left, right) => right.contribution - left.contribution);
    const winner = ranked[0];

    return {
      status: "answered",
      title: locale === "es" ? "Rentabilidad por producto" : "Product profitability",
      answer:
        locale === "es"
          ? `${winner.name} es el producto con mayor contribución en la muestra autorizada.`
          : `${winner.name} has the highest contribution profit in the authorized sample.`,
      primaryValue: money(winner.contribution, locale),
      primaryLabel: locale === "es" ? "contribución" : "contribution profit",
      period: locale === "es" ? "Últimos 30 días · datos sintéticos" : "Last 30 days · synthetic data",
      metricDefinition:
        locale === "es"
          ? "Ventas brutas − reembolsos − costo de mercadería"
          : "Gross sales − refunds − cost of goods sold",
      bars: ranked.map((product) => ({
        label: product.name,
        value: product.contribution,
        formattedValue: money(product.contribution, locale),
      })),
      sourceAssetIds: [
        ecommerceAssetIds.orderItemsOverview,
        ecommerceAssetIds.products,
        "urn:li:dataset:(urn:li:dataPlatform:s3,returns,PROD)",
        "urn:li:dataset:(urn:li:dataPlatform:snowflake,net_revenue,PROD)",
      ],
      limitations: [
        locale === "es"
          ? "La demo usa una muestra sintética; en producción el cálculo debe ejecutarse en el motor analítico autorizado."
          : "The demo uses a synthetic sample; production calculations must run in the authorized analytics engine.",
      ],
      suggestedFollowUps:
        locale === "es"
          ? ["¿Por qué lidera Aurora?", "Compará margen y tasa de reclamos", "Convertir este análisis en una propuesta"]
          : ["Why does Aurora lead?", "Compare margin and complaint rate", "Turn this analysis into a proposal"],
    };
  }

  const ranked = [...productMetrics].sort((left, right) => right.grossSales - left.grossSales);
  const winner = ranked[0];
  const blockedProfitability = profitability && !mayUseFinance;

  return {
    status: blockedProfitability ? "partial" : "answered",
    title: blockedProfitability
      ? locale === "es" ? "Respuesta más cercana autorizada" : "Closest authorized answer"
      : locale === "es" ? "Ventas brutas por producto" : "Gross sales by product",
    answer: blockedProfitability
      ? locale === "es"
        ? `No puedo afirmar cuál es el más rentable porque este rol no puede usar costos y reembolsos. Sí puedo confirmar que ${winner.name} lidera las ventas brutas.`
        : `I cannot identify the most profitable product because this role cannot use costs and refunds. I can confirm that ${winner.name} leads gross sales.`
      : locale === "es"
        ? `${winner.name} lidera las ventas brutas en la muestra autorizada.`
        : `${winner.name} leads gross sales in the authorized sample.`,
    primaryValue: money(winner.grossSales, locale),
    primaryLabel: locale === "es" ? "ventas brutas" : "gross sales",
    period: locale === "es" ? "Últimos 30 días · datos sintéticos" : "Last 30 days · synthetic data",
    metricDefinition: locale === "es" ? "Cantidad × precio unitario" : "Quantity × unit price",
    bars: ranked.map((product) => ({
      label: product.name,
      value: product.grossSales,
      formattedValue: money(product.grossSales, locale),
    })),
    sourceAssetIds: [ecommerceAssetIds.orderItemsOverview, ecommerceAssetIds.products],
    limitations: blockedProfitability
      ? [
          locale === "es"
            ? "Faltan costo de mercadería y reembolsos autorizados; ventas no equivale a rentabilidad."
            : "Authorized COGS and refunds are missing; sales are not profitability.",
        ]
      : [
          locale === "es"
            ? "Ventas brutas no descuenta reembolsos, descuentos ni costos."
            : "Gross sales do not subtract refunds, discounts or costs.",
        ],
    suggestedFollowUps: blockedProfitability
      ? locale === "es"
        ? ["Solicitar la métrica aprobada de margen", "Comparar unidades vendidas", "Ver fuentes y responsables"]
        : ["Request the approved margin metric", "Compare units sold", "View sources and owners"]
      : locale === "es"
        ? ["Comparar por categoría", "Ver evolución semanal", "Analizar reclamos por producto"]
        : ["Compare by category", "Show weekly trend", "Analyze complaints by product"],
  };
}
