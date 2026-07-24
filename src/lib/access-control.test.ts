import assert from "node:assert/strict";
import test from "node:test";
import {
  demoUsers,
  evidenceAssets,
  getAuthorizedEvidence,
  hasSufficientEvidence,
} from "./access-control.ts";

test("executive receives all explicitly authorized evidence", () => {
  const executive = demoUsers[0];
  assert.equal(getAuthorizedEvidence(executive).length, evidenceAssets.length);
  assert.equal(hasSufficientEvidence(executive), true);
});

test("growth analyst never receives finance evidence", () => {
  const analyst = demoUsers[1];
  const visible = getAuthorizedEvidence(analyst);

  assert.equal(visible.some((item) => item.domain === "finance"), false);
  assert.equal(visible.some((item) => item.name.includes("Finance")), false);
  assert.equal(hasSufficientEvidence(analyst), false);
});

test("unlisted domains are denied by default", () => {
  const noAccessUser = { ...demoUsers[0], allowedDomains: [] };
  assert.deepEqual(getAuthorizedEvidence(noAccessUser), []);
  assert.equal(hasSufficientEvidence(noAccessUser), false);
});
