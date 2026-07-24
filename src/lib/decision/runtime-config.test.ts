import assert from "node:assert/strict";
import test from "node:test";
import {
  getRuntimeConfig,
  UnsafeProviderConfigurationError,
} from "./runtime-config.ts";

test("defaults to the deterministic zero-cost provider", () => {
  assert.deepEqual(getRuntimeConfig({}), {
    provider: "demo",
    evidenceSource: "demo",
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

test("allows OpenRouter only with a key and explicitly free model", () => {
  assert.deepEqual(
    getRuntimeConfig({
      AI_PROVIDER: "openrouter",
      OPENROUTER_API_KEY: "synthetic-test-key",
      OPENROUTER_MODEL: "nvidia/test-model:free",
      ALLOW_PAID_MODELS: "false",
      EVIDENCE_SOURCE: "datahub",
    }),
    {
      provider: "openrouter",
      evidenceSource: "datahub",
      demoMode: false,
    },
  );

  assert.throws(
    () =>
      getRuntimeConfig({
        AI_PROVIDER: "openrouter",
        OPENROUTER_API_KEY: "synthetic-test-key",
        OPENROUTER_MODEL: "paid/model",
      }),
    UnsafeProviderConfigurationError,
  );
});

