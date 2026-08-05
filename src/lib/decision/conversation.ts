import type { DecisionCard } from "./types.ts";

export interface ConversationTurn {
  id: string;
  question: string;
  title: string;
  summary: string;
  stage: DecisionCard["decisionGate"]["stage"];
  status: DecisionCard["decisionGate"]["status"];
  generatedAt: string;
}
