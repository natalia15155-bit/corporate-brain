import assert from "node:assert/strict";
import test from "node:test";
import { evidenceAssets } from "../access-control.ts";
import { evaluateEvidence } from "./evidence-evaluator.ts";

test("abstains when the authorized scope cannot satisfy required evidence", () => {
  const result = evaluateEvidence({
    evidence: evidenceAssets.slice(0, 2),
    requiredEvidenceSatisfied: false,
  });

  assert.equal(result.sufficient, false);
  assert.equal(result.trustBand, "insufficient");
  assert.deepEqual(result.gaps, [
    "Additional authorized evidence is required.",
  ]);
  assert.equal(
    JSON.stringify(result).includes("Finance Customer Feed"),
    false,
  );
});

test("returns an explainable trust band when required evidence is available", () => {
  const result = evaluateEvidence({
    evidence: evidenceAssets,
    requiredEvidenceSatisfied: true,
  });

  assert.equal(result.sufficient, true);
  assert.equal(result.trustBand, "medium");
  assert.equal(result.warnings.length, 1);
});

