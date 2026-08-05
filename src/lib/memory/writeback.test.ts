import assert from "node:assert/strict";
import test from "node:test";
import { demoUsers } from "../access-control.ts";
import type { DecisionCard } from "../decision/types.ts";
import type { McpToolClient } from "../evidence/datahub-mcp-client.ts";
import { saveDecisionToDataHub } from "./writeback.ts";

const decision: DecisionCard = {
  id: "DEC-TEST",
  question: "Should we save this Ecommerce control plan?",
  intent: "decision",
  status: "recommendation",
  trustBand: "medium",
  evidence: [
    {
      id: "urn:li:dataset:(urn:li:dataPlatform:snowflake,ecommerce.orders,PROD)",
      name: "Orders",
      description: "Orders",
      type: "DataHub · Dataset",
      owner: "Ecommerce",
      freshness: "1h",
      quality: "Certified",
      tone: "verified",
      domain: "ecommerce",
      sensitivity: "internal",
      required: true,
      source: "datahub",
    },
  ],
  warnings: [],
  gaps: [],
  recommendation: "Save the approved Ecommerce operating plan.",
  outcome: "Shared context",
  risks: ["Review thresholds."],
  roleInsight: "Use authorized evidence.",
  readiness: null,
  decisionGate: {
    stage: "decision",
    status: "ready",
    canSaveDecision: true,
    canSaveInsight: true,
    canSaveAction: false,
    canSaveAlertPlan: false,
    completed: [
      "Business objective is explicit",
      "Authorized evidence is sufficient",
      "Recommendation, outcome, and risks are present",
    ],
    missing: [],
    nextAction: "approve-decision",
  },
  presentationRole: "analyst",
  provider: "demo",
  evidenceSource: "datahub",
  evidenceFallback: false,
  generatedAt: "2026-07-28T00:00:00.000Z",
};

test("writes a confirmed server decision with related DataHub assets", async () => {
  const calls: Array<{ name: string; arguments_: Record<string, unknown> }> = [];
  const client: McpToolClient = {
    async listTools() {
      return [{ name: "save_document", inputSchema: { properties: {} } }];
    },
    async callTool(name, arguments_) {
      calls.push({ name, arguments_ });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              urn: "urn:li:document:corporate-brain-test",
            }),
          },
        ],
      };
    },
    async close() {},
  };

  const result = await saveDecisionToDataHub(
    {
      decision,
      user: demoUsers[1],
      kind: "decision",
      alertRules: [],
    },
    {
      environment: {
        DATAHUB_WRITEBACK_ENABLED: "true",
        DATAHUB_MCP_URL: "https://datahub.example/mcp",
      },
      connect: async () => client,
    },
  );

  assert.equal(result.documentUrn, "urn:li:document:corporate-brain-test");
  assert.equal(calls[0].name, "save_document");
  assert.equal(calls[0].arguments_.document_type, "Decision");
  assert.deepEqual(calls[0].arguments_.related_assets, [
    "urn:li:dataset:(urn:li:dataPlatform:snowflake,ecommerce.orders,PROD)",
  ]);
});
