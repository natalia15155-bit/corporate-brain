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
      "The public demo uses a read-only DataHub snapshot; freshness values are illustrative.",
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
      "La demo pública usa un snapshot de DataHub de solo lectura; la actualización es ilustrativa.",
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

