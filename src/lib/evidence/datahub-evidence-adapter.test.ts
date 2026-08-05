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
            ownership: {
              owners: [{ owner: { displayName: "Growth Analytics" } }],
            },
            platform: { name: "Snowflake" },
            domain: { name: "Growth" },
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
  assert.equal(result.evidence[0].owner, "Growth Analytics");
  assert.equal(result.evidence[0].type, "DataHub · Snowflake");
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

test("falls back to focused DataHub searches for a multi-concept analyst question", async () => {
  const searchQueries: string[] = [];
  const inventoryUrn =
    "urn:li:dataset:(urn:li:dataPlatform:snowflake,inventory-position,PROD)";
  const client: McpToolClient = {
    async listTools() {
      return [
        { name: "search", inputSchema: { properties: { query: {} } } },
        { name: "get_entities", inputSchema: { properties: { urns: {} } } },
      ];
    },
    async callTool(name, arguments_) {
      if (name === "search") {
        const query = String(arguments_.query);
        searchQueries.push(query);
        return toolText(
          query === "inventory"
            ? { results: [{ urn: inventoryUrn, name: "Inventory Position" }] }
            : { results: [] },
        );
      }
      return toolText({
        entities: [
          {
            urn: inventoryUrn,
            name: "Inventory Position by Warehouse",
            description: "Available and inbound stock by SKU.",
            ownership: { owners: [{ owner: { displayName: "Supply Operations" } }] },
            platform: { name: "Snowflake" },
            domain: { name: "Operations" },
          },
        ],
      });
    },
    async close() {},
  };
  const adapter = createDataHubEvidenceAdapter({
    environment: { DATAHUB_MCP_URL: "https://datahub.example/mcp" },
    connect: async () => client,
  });

  const question =
    "Can we build an ecommerce dashboard with stockout and complaint alerts for star products?";
  const result = await adapter.retrieve({
    question,
    locale: "en",
    user: demoUsers[1],
  });

  assert.equal(searchQueries[0], question);
  assert.equal(searchQueries.includes("inventory"), true);
  assert.equal(result.evidence.length, 1);
  assert.equal(result.evidence[0].id, inventoryUrn);
  assert.equal(result.evidence[0].domain, "operations");
  assert.deepEqual(result.evidence[0].capabilities, [
    "commerce.products",
    "commerce.inventory",
  ]);
});

test("supplements broad results and infers live business capabilities", async () => {
  const searchQueries: string[] = [];
  const productUrn =
    "urn:li:dataset:(urn:li:dataPlatform:postgres,product-master,PROD)";
  const complaintUrn =
    "urn:li:dataset:(urn:li:dataPlatform:snowflake,product-complaints,PROD)";
  const client: McpToolClient = {
    async listTools() {
      return [
        { name: "search", inputSchema: { properties: { query: {} } } },
        { name: "get_entities", inputSchema: { properties: { urns: {} } } },
      ];
    },
    async callTool(name, arguments_) {
      if (name === "search") {
        const query = String(arguments_.query);
        searchQueries.push(query);
        if (query === "products") {
          return toolText({ results: [{ urn: productUrn }] });
        }
        if (query === "complaints") {
          return toolText({ results: [{ urn: complaintUrn }] });
        }
        return toolText({ results: [{ urn: productUrn }] });
      }
      return toolText({
        entities: [
          {
            urn: productUrn,
            name: "Product Master and Star Products",
            description: "Governed SKU catalog with is_star_product.",
            owner: "Product Operations",
            platform: "Postgres",
            domain: "Product",
          },
          {
            urn: complaintUrn,
            name: "Product Complaints",
            description: "Complaint rate and severity linked to SKU.",
            owner: "CX Analytics",
            platform: "Snowflake",
            domain: "CX",
          },
        ],
      });
    },
    async close() {},
  };
  const adapter = createDataHubEvidenceAdapter({
    environment: { DATAHUB_MCP_URL: "https://datahub.example/mcp" },
    connect: async () => client,
  });

  const result = await adapter.retrieve({
    question: "Can we alert on complaints for star products?",
    locale: "en",
    user: demoUsers[1],
  });

  assert.equal(searchQueries.includes("products"), true);
  assert.equal(searchQueries.includes("complaints"), true);
  assert.deepEqual(result.evidence[0].capabilities, [
    "commerce.products",
    "commerce.product-priority",
  ]);
  assert.deepEqual(result.evidence[1].capabilities, [
    "commerce.products",
    "cx.product-complaints",
  ]);
});
