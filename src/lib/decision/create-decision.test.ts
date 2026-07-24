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

