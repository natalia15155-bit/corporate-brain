import assert from "node:assert/strict";
import test from "node:test";
import { demoUsers, getAuthorizedEvidence } from "../access-control.ts";
import { evaluateEvidence } from "./evidence-evaluator.ts";
import { createOpenRouterDecisionProvider } from "./openrouter-provider.ts";

test("validates a structured response from an explicitly free OpenRouter model", async () => {
  let requestedUrl = "";
  let requestedAuthorization = "";
  const fakeFetch: typeof fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedAuthorization = new Headers(init?.headers).get("Authorization") ?? "";

    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                recommendation:
                  "Consolidate the authorized customer sources in controlled stages.",
                outcome: "Faster customer analysis",
                risks: ["Validate ownership before the final migration."],
                roleInsight: "Prioritize business impact and material risks.",
              }),
            },
          },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  const user = demoUsers[0];
  const evidence = getAuthorizedEvidence(user);
  const provider = createOpenRouterDecisionProvider(
    {
      OPENROUTER_API_KEY: "test-key",
      OPENROUTER_MODEL: "openrouter/free",
    },
    fakeFetch,
  );

  const result = await provider.synthesize({
    question: "Should we consolidate customer data?",
    intent: "decision",
    locale: "en",
    user,
    evidence,
    evaluation: evaluateEvidence({
      evidence,
      requiredEvidenceSatisfied: true,
    }),
  });

  assert.equal(requestedUrl, "https://openrouter.ai/api/v1/chat/completions");
  assert.equal(requestedAuthorization, "Bearer test-key");
  assert.match(result.recommendation, /Consolidate/);
  assert.equal(result.risks.length, 1);
});

test("rejects models that are not explicitly free", async () => {
  const provider = createOpenRouterDecisionProvider({
    OPENROUTER_API_KEY: "test-key",
    OPENROUTER_MODEL: "paid/model",
  });
  const user = demoUsers[0];
  const evidence = getAuthorizedEvidence(user);

  await assert.rejects(
    () =>
      provider.synthesize({
        question: "Should we consolidate customer data?",
        intent: "decision",
        locale: "en",
        user,
        evidence,
        evaluation: evaluateEvidence({
          evidence,
          requiredEvidenceSatisfied: true,
        }),
      }),
    /not explicitly free/,
  );
});
