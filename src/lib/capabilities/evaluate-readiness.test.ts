import assert from "node:assert/strict";
import test from "node:test";
import { demoUsers } from "../access-control.ts";
import { dataHubSnapshotAssets } from "../evidence/datahub-snapshot-adapter.ts";
import { ecommerceControlPack } from "./ecommerce-control-pack.ts";
import { evaluateCapabilityPack } from "./evaluate-readiness.ts";

test("Ecommerce analyst has the evidence required for the control pack", () => {
  const user = demoUsers.find((candidate) => candidate.id === "maya-growth");
  assert.ok(user);

  const evidence = dataHubSnapshotAssets.filter((asset) =>
    user.allowedDomains.includes(asset.domain),
  );
  const assessment = evaluateCapabilityPack({
    pack: ecommerceControlPack,
    evidence,
    locale: "es",
  });

  assert.equal(assessment.status, "ready");
  assert.equal(assessment.readyCount, assessment.totalCount);
  assert.equal(assessment.proposedAlerts.every((rule) => rule.enabled), true);
  assert.ok(assessment.lineage.length >= 4);
});

test("Finance steward cannot receive a false complete Ecommerce assessment", () => {
  const user = demoUsers.find((candidate) => candidate.id === "sofia-finance");
  assert.ok(user);

  const evidence = dataHubSnapshotAssets.filter((asset) =>
    user.allowedDomains.includes(asset.domain),
  );
  const assessment = evaluateCapabilityPack({
    pack: ecommerceControlPack,
    evidence,
    locale: "en",
  });

  assert.notEqual(assessment.status, "ready");
  assert.ok(
    assessment.requirements.some(
      (requirement) => requirement.status === "missing",
    ),
  );
});
