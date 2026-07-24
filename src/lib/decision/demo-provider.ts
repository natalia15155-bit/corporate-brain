import type {
  DecisionProvider,
  DecisionSynthesis,
  DecisionSynthesisInput,
} from "./types.ts";

function synthesizeEnglish(
  input: DecisionSynthesisInput,
): DecisionSynthesis {
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

