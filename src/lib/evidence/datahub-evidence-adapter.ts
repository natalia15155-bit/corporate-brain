import type {
  DemoUser,
  DomainId,
  EvidenceAsset,
} from "../access-control.ts";
import {
  connectDataHubMcp,
  type McpToolClient,
  type McpToolDefinition,
} from "./datahub-mcp-client.ts";
import {
  EvidenceSourceError,
  type EvidenceAdapter,
  type EvidenceRetrievalInput,
} from "./types.ts";
import { normalizeUntrustedText } from "../http/request-security.ts";

interface DataHubAdapterOptions {
  connect?: typeof connectDataHubMcp;
  environment?: Record<string, string | undefined>;
}

interface CandidateEntity {
  urn: string;
  name?: string;
  description?: string;
  owner?: string;
  platform?: string;
  domain?: string;
}

function isValidDataHubUrn(value: string): boolean {
  return (
    value.length <= 500 &&
    /^urn:li:[A-Za-z0-9_]+:[A-Za-z0-9_:(,).=\-/]+$/.test(value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function firstString(
  record: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function findNestedString(
  value: unknown,
  keys: readonly string[],
  depth = 0,
): string | undefined {
  if (depth > 4) return undefined;
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 20)) {
      const result = findNestedString(item, keys, depth + 1);
      if (result) return result;
    }
    return undefined;
  }
  if (!isRecord(value)) return undefined;

  const direct = firstString(value, keys);
  if (direct) return direct;

  for (const nested of Object.values(value).slice(0, 30)) {
    const result = findNestedString(nested, keys, depth + 1);
    if (result) return result;
  }
  return undefined;
}

function collectEntities(
  value: unknown,
  entities: Map<string, CandidateEntity>,
  depth = 0,
) {
  if (depth > 6 || entities.size >= 12) return;
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 50)) {
      collectEntities(item, entities, depth + 1);
    }
    return;
  }
  if (!isRecord(value)) return;

  const urn = firstString(value, ["urn", "entityUrn", "entity_urn"]);
  if (urn && isValidDataHubUrn(urn)) {
    entities.set(urn, {
      urn,
      name: findNestedString(value, [
        "name",
        "title",
        "displayName",
        "display_name",
      ]),
      description: findNestedString(value, [
        "description",
        "documentation",
        "summary",
      ]),
      owner: findNestedString(value, [
        "owner",
        "ownerName",
        "owner_name",
      ]),
      platform: findNestedString(value, [
        "platform",
        "platformName",
        "type",
      ]),
      domain: findNestedString(value, ["domain", "domainName"]),
    });
  }

  for (const nested of Object.values(value).slice(0, 40)) {
    collectEntities(nested, entities, depth + 1);
  }
}

function parseTextPayload(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const urns = trimmed.match(/urn:li:[A-Za-z0-9_:(,).=\-]+/g) ?? [];
    return urns.map((urn) => ({ urn }));
  }
}

function unwrapToolResult(result: unknown): unknown[] {
  if (!isRecord(result) || !Array.isArray(result.content)) return [result];

  return result.content.flatMap((item) => {
    if (!isRecord(item)) return [];
    if (item.type === "text" && typeof item.text === "string") {
      return [parseTextPayload(item.text)];
    }
    if (item.type === "resource" && isRecord(item.resource)) {
      const text = item.resource.text;
      return typeof text === "string" ? [parseTextPayload(text)] : [];
    }
    return [];
  });
}

function collectSchemaFields(
  value: unknown,
  fields: Set<string>,
  depth = 0,
) {
  if (depth > 6 || fields.size >= 40) return;
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 100)) {
      collectSchemaFields(item, fields, depth + 1);
    }
    return;
  }
  if (!isRecord(value)) return;

  const field = firstString(value, [
    "fieldPath",
    "field_path",
    "columnName",
    "column_name",
  ]);
  if (field) fields.add(normalizeUntrustedText(field, 160));

  for (const nested of Object.values(value).slice(0, 50)) {
    collectSchemaFields(nested, fields, depth + 1);
  }
}

function buildEntityToolArguments(
  tool: McpToolDefinition,
  urn: string,
): Record<string, unknown> {
  const properties = tool.inputSchema?.properties ?? {};
  const arguments_: Record<string, unknown> = { urn };
  if ("direction" in properties) arguments_.direction = "upstream";
  if ("max_hops" in properties) arguments_.max_hops = 2;
  if ("maxHops" in properties) arguments_.maxHops = 2;
  if ("count" in properties) arguments_.count = 20;
  if ("limit" in properties) arguments_.limit = 20;
  return arguments_;
}

function buildSearchArguments(
  tool: McpToolDefinition,
  question: string,
  user: DemoUser,
): Record<string, unknown> {
  const properties = tool.inputSchema?.properties ?? {};
  const arguments_: Record<string, unknown> = { query: question };

  if ("count" in properties) arguments_.count = 8;
  if ("limit" in properties) arguments_.limit = 8;
  if ("domains" in properties) arguments_.domains = user.allowedDomains;
  if ("filters" in properties) {
    arguments_.filters = { domains: user.allowedDomains };
  }

  return arguments_;
}

function normalizeDomain(value: string | undefined): DomainId | null {
  const normalized = normalizeUntrustedText(value ?? "", 100).toLowerCase();
  if (normalized.includes("finance")) return "finance";
  if (
    normalized.includes("ecommerce") ||
    normalized.includes("e-commerce") ||
    normalized.includes("commerce")
  ) {
    return "ecommerce";
  }
  if (normalized.includes("product")) return "product";
  if (
    normalized.includes("customer experience") ||
    normalized === "cx" ||
    normalized.includes("support")
  ) {
    return "cx";
  }
  if (
    normalized.includes("operation") ||
    normalized.includes("supply") ||
    normalized.includes("logistics")
  ) {
    return "operations";
  }
  if (normalized.includes("growth") || normalized.includes("marketing")) {
    return "growth";
  }
  if (normalized.includes("shared")) return "shared";
  return null;
}

function nameFromUrn(urn: string): string {
  const entityName = urn.split(",")[1] ?? urn.split(":").at(-1) ?? urn;
  return entityName.replace(/[._-]+/g, " ").trim();
}

function normalizeEvidence(
  entity: CandidateEntity,
  index: number,
): EvidenceAsset | null {
  const domain = normalizeDomain(entity.domain);
  if (!domain) return null;
  const name = normalizeUntrustedText(
    entity.name ?? nameFromUrn(entity.urn),
    160,
  );
  const description = normalizeUntrustedText(
    entity.description ??
      "DataHub returned this asset as relevant organizational evidence.",
    1_200,
  );
  const owner = normalizeUntrustedText(entity.owner ?? "Unassigned", 160);
  const platform = normalizeUntrustedText(
    entity.platform ?? "Data asset",
    80,
  );

  return {
    id: entity.urn,
    name: name || "Unnamed DataHub asset",
    description,
    type: `DataHub · ${platform || "Data asset"}`,
    owner,
    freshness: "From DataHub",
    quality: owner !== "Unassigned" ? "Metadata available" : "Owner warning",
    tone: owner !== "Unassigned" ? "verified" : "warning",
    domain,
    sensitivity: domain === "finance" ? "confidential" : "internal",
    required: index < 2,
    source: "datahub",
  };
}

export function createDataHubEvidenceAdapter(
  options: DataHubAdapterOptions = {},
): EvidenceAdapter {
  const connect = options.connect ?? connectDataHubMcp;
  const environment = options.environment ?? process.env;

  return {
    id: "datahub",
    async retrieve(input: EvidenceRetrievalInput) {
      const url =
        environment.DATAHUB_MCP_URL ?? environment.DATAHUB_MCP_ENDPOINT;
      const token =
        environment.DATAHUB_TOKEN ?? environment.DATAHUB_MCP_TOKEN;

      const isStdio = environment.DATAHUB_MCP_TRANSPORT === "stdio";
      if (!url && !isStdio) {
        throw new EvidenceSourceError(
          "DataHub MCP is not configured on the server.",
          "configuration",
        );
      }

      let client: McpToolClient | null = null;
      try {
        client = await connect({
          url,
          token,
          transport: isStdio ? "stdio" : "http",
          command: environment.DATAHUB_MCP_COMMAND,
          args: environment.DATAHUB_MCP_ARGS
            ? environment.DATAHUB_MCP_ARGS.split(" ").filter(Boolean)
            : undefined,
          env: {
            DATAHUB_GMS_URL: environment.DATAHUB_GMS_URL ?? "http://localhost:8080",
          },
        });
        const tools = await client.listTools();
        const searchTool = tools.find((tool) => tool.name === "search");
        const getEntitiesTool = tools.find(
          (tool) => tool.name === "get_entities",
        );
        const listSchemaFieldsTool = tools.find(
          (tool) => tool.name === "list_schema_fields",
        );
        const getLineageTool = tools.find(
          (tool) => tool.name === "get_lineage",
        );

        if (!searchTool || !getEntitiesTool) {
          throw new EvidenceSourceError(
            "The DataHub MCP server does not expose the required read tools.",
            "invalid_response",
          );
        }

        const searchResult = await client.callTool(
          "search",
          buildSearchArguments(searchTool, input.question, input.user),
        );
        const searchEntities = new Map<string, CandidateEntity>();
        for (const payload of unwrapToolResult(searchResult)) {
          collectEntities(payload, searchEntities);
        }

        const urns = [...searchEntities.keys()].slice(0, 8);
        if (!urns.length) {
          return {
            source: "datahub",
            evidence: [],
            requiredEvidenceSatisfied: false,
          };
        }

        const entityResult = await client.callTool("get_entities", { urns });
        const detailedEntities = new Map<string, CandidateEntity>();
        for (const payload of unwrapToolResult(entityResult)) {
          collectEntities(payload, detailedEntities);
        }

        const sourceEntities =
          detailedEntities.size > 0 ? detailedEntities : searchEntities;
        let evidence = [...sourceEntities.values()]
          .map(normalizeEvidence)
          .filter(
            (asset): asset is EvidenceAsset =>
              asset !== null &&
              input.user.allowedDomains.includes(asset.domain),
          )
          .slice(0, 8);

        const enrichedEvidence = [];
        for (const asset of evidence) {
          if (
            enrichedEvidence.length >= 4 ||
            !asset.id.startsWith("urn:li:dataset:")
          ) {
            enrichedEvidence.push(asset);
            continue;
          }

          let fields: readonly string[] | undefined;
          let upstream: readonly string[] | undefined;

          if (listSchemaFieldsTool) {
            const schemaResult = await client.callTool(
              "list_schema_fields",
              buildEntityToolArguments(listSchemaFieldsTool, asset.id),
            );
            const collectedFields = new Set<string>();
            for (const payload of unwrapToolResult(schemaResult)) {
              collectSchemaFields(payload, collectedFields);
            }
            fields = [...collectedFields].filter(Boolean).slice(0, 20);
          }

          if (getLineageTool) {
            const lineageResult = await client.callTool(
              "get_lineage",
              buildEntityToolArguments(getLineageTool, asset.id),
            );
            const lineageEntities = new Map<string, CandidateEntity>();
            for (const payload of unwrapToolResult(lineageResult)) {
              collectEntities(payload, lineageEntities);
            }
            upstream = [...lineageEntities.keys()]
              .filter((urn) => urn !== asset.id)
              .slice(0, 20);
          }

          enrichedEvidence.push({
            ...asset,
            ...(fields?.length ? { fields } : {}),
            ...(upstream?.length ? { upstream } : {}),
          });
        }
        evidence = enrichedEvidence;

        return {
          source: "datahub",
          evidence,
          requiredEvidenceSatisfied:
            evidence.length >= 2 &&
            evidence.every((asset) => asset.owner !== "Unassigned"),
        };
      } catch (error) {
        if (error instanceof EvidenceSourceError) throw error;
        throw new EvidenceSourceError(
          "DataHub MCP could not be reached.",
          "connection",
          true,
        );
      } finally {
        await client?.close();
      }
    },
  };
}
