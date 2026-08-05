import type { ReadinessAssessment } from "../capabilities/types.ts";
import type { AnalyticalResult } from "../analytics/types.ts";
import type {
  DecisionGate,
  DecisionStatus,
  TrustBand,
} from "./types.ts";
import type { QuestionIntent } from "./question-intent.ts";

interface DecisionGateInput {
  intent: QuestionIntent;
  status: DecisionStatus;
  trustBand: TrustBand;
  evidenceCount: number;
  warnings: readonly string[];
  gaps: readonly string[];
  analysis?: AnalyticalResult | null;
  readiness?: ReadinessAssessment | null;
  outcome: string | null;
  risks: readonly string[];
}

const standardDecisionCriteria = [
  "Business objective is explicit",
  "Authorized evidence is sufficient",
  "Recommendation, outcome, and risks are present",
] as const;

export function evaluateDecisionGate(input: DecisionGateInput): DecisionGate {
  if (input.intent === "data-discovery") {
    return {
      stage: "data-discovery",
      status: "open",
      canSaveDecision: false,
      canSaveInsight: true,
      canSaveAction: false,
      canSaveAlertPlan: false,
      completed: [
        "Authorized catalog filtered by role",
        "Owners, fields, and lineage are visible",
      ],
      missing: ["A business question, target metric, and decision owner"],
      nextAction: "ask-follow-up",
    };
  }

  if (input.intent === "analysis" && input.analysis) {
    const answered = input.analysis.status === "answered";

    return {
      stage: "analysis",
      status: "open",
      canSaveDecision: false,
      canSaveInsight: true,
      canSaveAction: answered,
      canSaveAlertPlan: false,
      completed: answered
        ? [
            "Metric definition selected",
            "Relevant sources identified",
            "Result calculated from authorized data",
          ]
        : [
            "Closest authorized answer produced",
            "Restricted source details were not disclosed",
          ],
      missing: answered
        ? [
            "Decision objective",
            "Alternatives",
            "Decision owner and review date",
          ]
        : [
            "Authorized access to the missing metric inputs",
            "A complete profitability definition for this role",
          ],
      nextAction: answered ? "convert-to-proposal" : "request-access",
    };
  }

  if (input.intent === "readiness" && input.readiness) {
    const ready = input.readiness.status === "ready";

    return {
      stage: "proposal",
      status: "open",
      canSaveDecision: false,
      canSaveInsight: true,
      canSaveAction: true,
      canSaveAlertPlan: ready,
      completed: ready
        ? [
            "Business capability checked",
            "Required sources found",
            "Operational alert rules drafted",
          ]
        : [
            "Business capability checked",
            "Missing sources identified",
          ],
      missing: ready
        ? ["Human approval and live notification routing"]
        : input.readiness.requirements
            .filter((requirement) => requirement.status === "missing")
            .map((requirement) => requirement.label),
      nextAction: ready ? "save-alert-plan" : "ask-follow-up",
    };
  }

  const readyForDecision =
    input.status === "recommendation" &&
    input.trustBand === "medium" &&
    input.evidenceCount > 0 &&
    input.outcome !== null &&
    input.risks.length > 0 &&
    input.gaps.length === 0;

  return {
    stage: readyForDecision ? "decision" : "proposal",
    status: readyForDecision ? "ready" : "open",
    canSaveDecision: readyForDecision,
    canSaveInsight: true,
    canSaveAction: !readyForDecision,
    canSaveAlertPlan: false,
    completed: readyForDecision
      ? standardDecisionCriteria
      : [
          "Question interpreted",
          "Authorized evidence retrieved",
          "Risk review started",
        ],
    missing: readyForDecision
      ? []
      : [
          ...input.gaps,
          ...(input.warnings.length > 0 ? ["Warning review"] : []),
          "Final approval criteria",
        ],
    nextAction: readyForDecision ? "approve-decision" : "convert-to-proposal",
  };
}
