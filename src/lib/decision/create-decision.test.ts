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
  assert.equal(decision.readiness?.status, "ready");
  assert.equal(decision.readiness?.readyCount, 7);
  assert.equal(decision.readiness?.proposedAlerts.length, 2);
  assert.equal(
    decision.readiness?.proposedAlerts.every((alert) => alert.enabled),
    true,
  );
});

