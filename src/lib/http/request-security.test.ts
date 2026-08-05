import assert from "node:assert/strict";
import test from "node:test";
import {
  HttpRequestError,
  normalizeUntrustedText,
  readLimitedJson,
} from "./request-security.ts";
import {
  consumeRateLimit,
  resetRateLimitsForTests,
} from "./rate-limit.ts";

test("normalizes control characters without interpreting markup", () => {
  assert.equal(
    normalizeUntrustedText("  <script>\u0000alert(1)</script>  ", 100),
    "<script>alert(1)</script>",
  );
});

test("accepts small JSON and rejects oversized bodies", async () => {
  const input = await readLimitedJson(
    new Request("https://example.test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "safe" }),
    }),
  );
  assert.deepEqual(input, { question: "safe" });

  await assert.rejects(
    readLimitedJson(
      new Request("https://example.test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: "x".repeat(200) }),
      }),
      64,
    ),
    (error: unknown) =>
      error instanceof HttpRequestError && error.status === 413,
  );
});

test("limits repeated calls in a fixed window", () => {
  resetRateLimitsForTests();
  assert.equal(
    consumeRateLimit("client", { limit: 2, windowMs: 1_000, now: 100 })
      .allowed,
    true,
  );
  assert.equal(
    consumeRateLimit("client", { limit: 2, windowMs: 1_000, now: 200 })
      .allowed,
    true,
  );
  assert.equal(
    consumeRateLimit("client", { limit: 2, windowMs: 1_000, now: 300 })
      .allowed,
    false,
  );
  assert.equal(
    consumeRateLimit("client", { limit: 2, windowMs: 1_000, now: 1_200 })
      .allowed,
    true,
  );
});
