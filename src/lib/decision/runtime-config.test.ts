import assert from "node:assert/strict";
import test from "node:test";
import {
  getRuntimeConfig,
  UnsafeProviderConfigurationError,
} from "./runtime-config.ts";

test("defaults to the deterministic zero-cost provider", () => {
  assert.deepEqual(getRuntimeConfig({}), {
    provider: "demo",
    demoMode: true,
  });
});

test("blocks paid OpenAI API configuration", () => {
  assert.throws(
    () => getRuntimeConfig({ AI_PROVIDER: "openai" }),
    UnsafeProviderConfigurationError,
  );
});

test("keeps future free-tier adapters disabled until verified", () => {
  assert.throws(
    () =>
      getRuntimeConfig({
        AI_PROVIDER: "groq",
        GROQ_API_KEY: "not-a-real-key",
      }),
    UnsafeProviderConfigurationError,
  );
});

