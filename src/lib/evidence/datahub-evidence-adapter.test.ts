import assert from "node:assert/strict";
import test from "node:test";
import { demoUsers } from "../access-control.ts";
import {
  createDataHubEvidenceAdapter,
} from "./datahub-evidence-adapter.ts";
import type { McpToolClient } from "./datahub-mcp-client.ts";

function toolText(value: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(value) }],
  };
}

test("retrieves and normalizes authorized evidence through DataHub MCP", async () => {
  const calls: Array<{ name: string; arguments_: Record<string, unknown> }> = [];
  let closed = false;
  const client: McpToolClient = {
    async listTools() {
      return [
        {
          name: "search",
          inputSchema: {
            properties: { query: {}, limit: {}, filters: {} },
          },
        },
        { name: "get_entities", inputSchema: { properties: { urns: {} } } },
      ];
    },
    async callTool(name, arguments_) {
      calls.push({ name, arguments_ });
      if (name === "search") {
        return toolText({
          results: [
            {
              urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,growth.retention,PROD)",
              name: "Retention Metrics",
            },
            {
              urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,shared.customer360,PROD)",
              name: "Customer 360",
            },
            {
              urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,finance.margin,PROD)",
              name: "Finance Margin",
            },
          ],
        });
      }
      return toolText({
        entities: [
          {
            urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,growth.retention,PROD)",
            name: "Retention Metrics",
            description: "Certified retention metrics.",
            owner: "Growth Analytics",
            platform: "Snowflake",
            domain: "Growth",
          },
          {
            urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,shared.customer360,PROD)",
            name: "Customer 360",
            description: "Canonical customer dataset.",
            owner: "Customer Data",
            platform: "Snowflake",
            domain: "Shared",
          },
          {
            urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,finance.margin,PROD)",
            name: "Finance Margin",
            owner: "Finance",
            platform: "Snowflake",
            domain: "Finance",
          },
        ],
      });
    },
    async close() {
      closed = true;
    },
  };
  const adapter = createDataHubEvidenceAdapter({
    environment: {
      DATAHUB_MCP_URL: "https://datahub.example/mcp",
      DATAHUB_TOKEN: "synthetic-token",
    },
    connect: async () => client,
  });

  const result = await adapter.retrieve({
    question: "Should we consolidate customer data?",
    locale: "en",
    user: demoUsers[1],
  });

  assert.equal(result.source, "datahub");
  assert.equal(result.evidence.length, 2);
  assert.equal(
    result.evidence.some((asset) => asset.domain === "finance"),
    false,
  );
  assert.equal(result.requiredEvidenceSatisfied, true);
  assert.deepEqual(calls.map((call) => call.name), [
    "search",
    "get_entities",
  ]);
  assert.deepEqual(calls[0].arguments_.filters, {
    domains: [
      "shared",
      "growth",
      "ecommerce",
      "product",
      "cx",
      "operations",
    ],
  });
  assert.equal(closed, true);
});

test("returns insufficient evidence when DataHub search has no matches", async () => {
  const client: McpToolClient = {
    async listTools() {
      return [
        { name: "search", inputSchema: { properties: { query: {} } } },
        { name: "get_entities", inputSchema: { properties: { urns: {} } } },
      ];
    },
    async callTool() {
      return toolText({ results: [] });
    },
    async close() {},
  };
  const adapter = createDataHubEvidenceAdapter({
    environment: { DATAHUB_MCP_URL: "https://datahub.example/mcp" },
    connect: async () => client,
  });

  const result = await adapter.retrieve({
    question: "Is there evidence for this decision?",
    locale: "en",
    user: demoUsers[0],
  });

  assert.equal(result.evidence.length, 0);
  assert.equal(result.requiredEvidenceSatisfied, false);
});
