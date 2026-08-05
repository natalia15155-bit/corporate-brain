import assert from "node:assert/strict";
import test from "node:test";
import { createDecision } from "./create-decision.ts";

test("creates a structured recommendation for an authorized executive", async () => {
  const decision = await createDecision({
    question: "Should we consolidate customer data into Customer 360?",
    userId: "alex-executive",
    locale: "en",
  });

  assert.equal(decision.status, "recommendation");
  assert.equal(decision.provider, "demo");
  assert.equal(decision.evidence.length, 3);
  assert.equal(decision.decisionGate.stage, "proposal");
  assert.equal(decision.decisionGate.canSaveDecision, false);
  assert.match(decision.id, /^DEC-[A-F0-9]{8}$/);
});

test("creates an abstention without leaking hidden evidence", async () => {
  const decision = await createDecision({
    question: "Should we consolidate customer data into Customer 360?",
    userId: "maya-growth",
    locale: "en",
  });
  const serialized = JSON.stringify(decision);

  assert.equal(decision.status, "abstention");
  assert.equal(decision.decisionGate.canSaveDecision, false);
  assert.equal(decision.evidence.length, 2);
  assert.equal(serialized.includes("Finance Customer Feed"), false);
  assert.equal(serialized.includes("EVP-052"), false);
});

test("answers data discovery questions from the role-authorized snapshot", async () => {
  const decision = await createDecision(
    {
      question: "¿Qué tipo de datos tenemos disponibles?",
      userId: "sofia-finance",
      locale: "es",
    },
    {
      EVIDENCE_SOURCE: "snapshot",
      AI_PROVIDER: "demo",
      DEMO_MODE: "true",
    },
  );
  const serialized = JSON.stringify(decision);

  assert.equal(decision.intent, "data-discovery");
  assert.equal(decision.decisionGate.stage, "data-discovery");
  assert.equal(decision.decisionGate.canSaveDecision, false);
  assert.match(decision.recommendation, /activos autorizados de DataHub/);
  assert.equal(decision.evidence.some((asset) => asset.domain === "finance"), true);
  assert.equal(decision.evidence.some((asset) => asset.domain === "growth"), false);
  assert.equal(serialized.includes("Retention Overview Dashboard"), false);
});

test("evaluates Ecommerce dashboard and alert readiness from capabilities", async () => {
  const decision = await createDecision(
    {
      question:
        "¿Qué datos necesito para construir un dashboard y configurar alertas de quiebre de stock y reclamos?",
      userId: "maya-growth",
      locale: "es",
    },
    {
      EVIDENCE_SOURCE: "snapshot",
      AI_PROVIDER: "demo",
      DEMO_MODE: "true",
    },
  );

  assert.equal(decision.intent, "readiness");
  assert.equal(decision.status, "recommendation");
  assert.equal(decision.decisionGate.stage, "proposal");
  assert.equal(decision.decisionGate.canSaveAlertPlan, true);
  assert.equal(decision.decisionGate.canSaveDecision, false);
  assert.equal(decision.readiness?.status, "ready");
  assert.equal(decision.readiness?.readyCount, 7);
  assert.equal(decision.readiness?.proposedAlerts.length, 2);
  assert.equal(
    decision.readiness?.proposedAlerts.every((alert) => alert.enabled),
    true,
  );
});

test("gives an analyst the closest authorized metric without inventing profitability", async () => {
  const result = await createDecision(
    {
      question: "¿Qué producto es el más rentable?",
      userId: "maya-growth",
      locale: "es",
    },
    {
      EVIDENCE_SOURCE: "snapshot",
      AI_PROVIDER: "demo",
      DEMO_MODE: "true",
    },
  );

  assert.equal(result.intent, "analysis");
  assert.equal(result.analysis?.status, "partial");
  assert.equal(result.decisionGate.stage, "analysis");
  assert.equal(result.decisionGate.nextAction, "request-access");
  assert.equal(result.decisionGate.canSaveDecision, false);
  assert.match(result.recommendation, /no puedo afirmar cuál es el más rentable/i);
  assert.match(result.analysis?.primaryLabel ?? "", /ventas brutas/i);
  assert.equal(result.analysis?.bars.length, 3);
});

test("gives an executive a complete profitability analysis without approving a decision", async () => {
  const result = await createDecision(
    {
      question: "Which product is the most profitable?",
      userId: "alex-executive",
      locale: "en",
    },
    {
      EVIDENCE_SOURCE: "snapshot",
      AI_PROVIDER: "demo",
      DEMO_MODE: "true",
    },
  );

  assert.equal(result.intent, "analysis");
  assert.equal(result.analysis?.status, "answered");
  assert.equal(result.analysis?.primaryLabel, "contribution profit");
  assert.equal(result.decisionGate.stage, "analysis");
  assert.equal(result.decisionGate.nextAction, "convert-to-proposal");
  assert.equal(result.decisionGate.canSaveInsight, true);
  assert.equal(result.decisionGate.canSaveDecision, false);
});

