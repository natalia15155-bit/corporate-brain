import assert from "node:assert/strict";
import test from "node:test";
import { getCatalogForUser } from "./get-catalog.ts";

test("Ecommerce catalog excludes finance assets", () => {
  const catalog = getCatalogForUser("maya-growth");

  assert.ok(catalog);
  assert.equal(catalog.assets.some((asset) => asset.domain === "finance"), false);
  assert.equal(catalog.domains.includes("finance"), false);
});

test("finance steward sees shared and finance assets but not growth", () => {
  const catalog = getCatalogForUser("sofia-finance");

  assert.ok(catalog);
  assert.equal(catalog.assets.some((asset) => asset.domain === "finance"), true);
  assert.equal(catalog.assets.some((asset) => asset.domain === "growth"), false);
  assert.equal(catalog.stats.warnings, 1);
});

test("unknown personas do not receive a catalog", () => {
  assert.equal(getCatalogForUser("unknown-user"), null);
});
