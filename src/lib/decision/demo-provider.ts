import type {
  DecisionProvider,
  DecisionSynthesis,
  DecisionSynthesisInput,
} from "./types.ts";

function uniqueAssetTypes(input: DecisionSynthesisInput): string[] {
  return Array.from(
    new Set(
      input.evidence.map((asset) =>
        asset.type.replace(/^DataHub\s*·\s*/i, ""),
      ),
    ),
  );
}

function visibleWarnings(input: DecisionSynthesisInput): number {
  return input.evidence.filter((asset) => asset.tone === "warning").length;
}

function usesLiveDataHub(input: DecisionSynthesisInput): boolean {
  return input.evidence.some((asset) => asset.freshness === "From DataHub");
}

function synthesizeReadinessEnglish(
  input: DecisionSynthesisInput,
): DecisionSynthesis {
  const assessment = input.readiness;
  if (!assessment) {
    return {
      recommendation:
        "I found a readiness question, but no matching business capability pack is configured yet.",
      outcome: null,
      risks: [
        "Define the required capabilities before treating the available catalog as complete.",
      ],
      roleInsight:
        "Create a reusable capability pack for this business area instead of inferring requirements from asset count.",
    };
  }

  const missing = assessment.requirements
    .filter((requirement) => requirement.status === "missing")
    .map((requirement) => requirement.label);
  const ready = assessment.status === "ready";

  return {
    recommendation: ready
      ? `The ${assessment.title} is ready to prototype: ${assessment.readyCount} of ${assessment.totalCount} required capabilities are covered by authorized evidence. The proposed lineage and ${assessment.proposedAlerts.length} alert rules can now be reviewed and saved as an operational plan.`
      : `The ${assessment.title} is not ready yet: ${assessment.readyCount} of ${assessment.totalCount} capabilities are covered. Missing: ${missing.join(", ")}.`,
    outcome: `${assessment.readyCount}/${assessment.totalCount} ready`,
    risks: ready
      ? [
          "Alert thresholds are proposed defaults and require owner confirmation before activation.",
          "The public demo stores the approved plan in browser memory; it does not send live notifications.",
          usesLiveDataHub(input)
            ? "Capability coverage was evaluated against the live read-only DataHub MCP connection."
            : "Source freshness remains illustrative while the public demo uses the DataHub snapshot.",
        ]
      : [
          "Missing critical capabilities prevent a trustworthy dashboard recommendation.",
          "Do not infer restricted or unavailable sources from the visible catalog.",
        ],
    roleInsight: ready
      ? "Validate metric definitions with Ecommerce, Operations, CX and Product before activation."
      : "Route each missing capability to its accountable data owner before building the dashboard.",
  };
}

function synthesizeReadinessSpanish(
  input: DecisionSynthesisInput,
): DecisionSynthesis {
  const assessment = input.readiness;
  if (!assessment) {
    return {
      recommendation:
        "Detecté una consulta de preparación, pero todavía no existe un pack de capacidades para esta área.",
      outcome: null,
      risks: [
        "Definí las capacidades requeridas antes de considerar completo el catálogo disponible.",
      ],
      roleInsight:
        "Creá un pack reutilizable para esta área en lugar de inferir requisitos por cantidad de activos.",
    };
  }

  const missing = assessment.requirements
    .filter((requirement) => requirement.status === "missing")
    .map((requirement) => requirement.label);
  const ready = assessment.status === "ready";

  return {
    recommendation: ready
      ? `${assessment.title} está listo para un prototipo: ${assessment.readyCount} de ${assessment.totalCount} capacidades requeridas están cubiertas por evidencia autorizada. Ya podés revisar el linaje propuesto y las ${assessment.proposedAlerts.length} reglas de alerta antes de guardarlas como plan operativo.`
      : `${assessment.title} todavía no está listo: hay ${assessment.readyCount} de ${assessment.totalCount} capacidades cubiertas. Faltan: ${missing.join(", ")}.`,
    outcome: `${assessment.readyCount}/${assessment.totalCount} listas`,
    risks: ready
      ? [
          "Los umbrales son valores iniciales y requieren confirmación de los responsables antes de activarse.",
          "La demo pública guarda el plan aprobado en la memoria del navegador; no envía notificaciones reales.",
          usesLiveDataHub(input)
            ? "La cobertura se evaluó contra la conexión MCP de DataHub en vivo y de solo lectura."
            : "La actualización de fuentes es ilustrativa mientras la demo pública usa el snapshot de DataHub.",
        ]
      : [
          "Las capacidades críticas faltantes impiden recomendar el dashboard de forma confiable.",
          "No se deben inferir fuentes restringidas o inexistentes desde el catálogo visible.",
        ],
    roleInsight: ready
      ? "Validá las definiciones con Ecommerce, Operaciones, CX y Producto antes de activar las alertas."
      : "Derivá cada capacidad faltante a su responsable antes de construir el dashboard.",
  };
}

function synthesizeDiscoveryEnglish(
  input: DecisionSynthesisInput,
): DecisionSynthesis {
  const types = uniqueAssetTypes(input);
  const warnings = visibleWarnings(input);
  const examples = input.evidence
    .slice(0, 3)
    .map((asset) => asset.name)
    .join(", ");

  return {
    recommendation:
      `Your ${input.user.team} profile can access ${input.evidence.length} authorized DataHub assets across ${types.join(", ")}. ` +
      `Start with ${examples} and use the owner, freshness and quality signals to decide what is safe to review.`,
    outcome: `${input.evidence.length} assets`,
    risks: [
      "Sources outside this role's authorized domains remain hidden.",
      warnings > 0
        ? `${warnings} visible asset requires quality review before use.`
        : "No visible asset currently carries a quality warning.",
      usesLiveDataHub(input)
        ? "Results were retrieved from the live read-only DataHub MCP connection."
        : "The public demo uses a read-only DataHub snapshot; freshness values are illustrative.",
    ],
    roleInsight:
      input.user.role === "data-steward"
        ? "Prioritize the visible finance quality warning, then confirm ownership and downstream impact."
        : "Use the catalog below to narrow the question before requesting a decision brief.",
  };
}

function synthesizeDiscoverySpanish(
  input: DecisionSynthesisInput,
): DecisionSynthesis {
  const types = uniqueAssetTypes(input);
  const warnings = visibleWarnings(input);
  const examples = input.evidence
    .slice(0, 3)
    .map((asset) => asset.name)
    .join(", ");

  return {
    recommendation:
      `Tu perfil de ${input.user.team} puede consultar ${input.evidence.length} activos autorizados de DataHub: ${types.join(", ")}. ` +
      `Podés empezar por ${examples} y revisar responsable, actualización y calidad antes de usarlos.`,
    outcome: `${input.evidence.length} activos`,
    risks: [
      "Las fuentes fuera de los dominios autorizados para este rol permanecen ocultas.",
      warnings > 0
        ? `${warnings} activo visible requiere una revisión de calidad antes de usarlo.`
        : "Ningún activo visible tiene actualmente una advertencia de calidad.",
      usesLiveDataHub(input)
        ? "Los resultados se recuperaron desde la conexión MCP de DataHub en vivo y de solo lectura."
        : "La demo pública usa un snapshot de DataHub de solo lectura; la actualización es ilustrativa.",
    ],
    roleInsight:
      input.user.role === "data-steward"
        ? "Priorizá la advertencia visible de Finanzas y luego confirmá responsables e impacto aguas abajo."
        : "Usá el catálogo para acotar la consulta antes de solicitar un informe de decisión.",
  };
}

function synthesizeEnglish(
  input: DecisionSynthesisInput,
): DecisionSynthesis {
  if (input.intent === "analysis" && input.analysis) {
    return {
      recommendation: input.analysis.answer,
      outcome: input.analysis.primaryValue,
      risks: input.analysis.limitations,
      roleInsight:
        input.analysis.status === "partial"
          ? "Use the closest authorized metric without treating it as the requested profitability result."
          : "The result is calculated deterministically; use the evidence trail to validate its business definition.",
    };
  }
  if (input.intent === "readiness") {
    return synthesizeReadinessEnglish(input);
  }

  if (input.intent === "data-discovery") {
    return synthesizeDiscoveryEnglish(input);
  }

  if (!input.evaluation.sufficient) {
    return {
      recommendation:
        "I cannot provide a trustworthy recommendation with the authorized evidence available to this profile.",
      outcome: null,
      risks: [
        "The available scope does not support a complete risk assessment.",
        "Request an authorized reviewer instead of inferring hidden context.",
      ],
      roleInsight:
        "Visible sources remain traceable, but they are insufficient for a final decision.",
    };
  }

  const roleInsight = {
    executive:
      "A phased decision protects downside while preserving the expected growth opportunity.",
    analyst:
      "The authorized sources are traceable; review freshness and lineage before scaling.",
    "data-steward":
      "Resolve the freshness warning and confirm accountable ownership before the next review.",
  }[input.user.role];

  return {
    recommendation:
      "Proceed with a staged consolidation, beginning with the retention domain and keeping the legacy finance feed read-only until its freshness warning is resolved.",
    outcome: "+22%",
    risks: [
      "Diminishing returns if spend exceeds the tested threshold.",
      "Content production remains the primary bottleneck.",
      "Recent channel volatility requires weekly review.",
    ],
    roleInsight,
  };
}

function synthesizeSpanish(
  input: DecisionSynthesisInput,
): DecisionSynthesis {
  if (input.intent === "analysis" && input.analysis) {
    return {
      recommendation: input.analysis.answer,
      outcome: input.analysis.primaryValue,
      risks: input.analysis.limitations,
      roleInsight:
        input.analysis.status === "partial"
          ? "Usá la métrica autorizada más cercana sin presentarla como el resultado de rentabilidad solicitado."
          : "El resultado se calcula de forma determinística; validá su definición de negocio en el rastro de evidencia.",
    };
  }
  if (input.intent === "readiness") {
    return synthesizeReadinessSpanish(input);
  }

  if (input.intent === "data-discovery") {
    return synthesizeDiscoverySpanish(input);
  }
  if (!input.evaluation.sufficient) {
    return {
      recommendation:
        "No puedo brindar una recomendación confiable con la evidencia autorizada disponible para este perfil.",
      outcome: null,
      risks: [
        "El alcance disponible no permite evaluar todos los riesgos.",
        "Solicitá una revisión autorizada en lugar de inferir contexto oculto.",
      ],
      roleInsight:
        "Las fuentes visibles son trazables, pero no alcanzan para una decisión final.",
    };
  }

  const roleInsight = {
    executive:
      "Una decisión gradual protege el resultado y conserva la oportunidad de crecimiento.",
    analyst:
      "Las fuentes autorizadas son trazables; revisá actualización y linaje antes de escalar.",
    "data-steward":
      "Resolvé la advertencia de actualización y confirmá al responsable antes de revisar.",
  }[input.user.role];

  return {
    recommendation:
      "Avanzá con una consolidación gradual, comenzando por retención y manteniendo la fuente financiera anterior en modo de sólo lectura hasta resolver su advertencia de actualización.",
    outcome: "+22%",
    risks: [
      "Rendimientos decrecientes si la inversión supera el umbral probado.",
      "La producción de contenido sigue siendo el principal cuello de botella.",
      "La volatilidad reciente exige una revisión semanal.",
    ],
    roleInsight,
  };
}

export const demoDecisionProvider: DecisionProvider = {
  id: "demo",
  async synthesize(input) {
    return input.locale === "es"
      ? synthesizeSpanish(input)
      : synthesizeEnglish(input);
  },
};

