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
  if (urn?.startsWith("urn:li:")) {
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
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("finance")) return "finance";
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

  return {
    id: entity.urn,
    name: entity.name ?? nameFromUrn(entity.urn),
    description:
      entity.description ??
      "DataHub returned this asset as relevant organizational evidence.",
    type: `DataHub · ${entity.platform ?? "Data asset"}`,
    owner: entity.owner ?? "Unassigned",
    freshness: "From DataHub",
    quality: entity.owner ? "Metadata available" : "Owner warning",
    tone: entity.owner ? "verified" : "warning",
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

      if (!url) {
        throw new EvidenceSourceError(
          "DataHub MCP is not configured on the server.",
          "configuration",
        );
      }

      let client: McpToolClient | null = null;
      try {
        client = await connect({ url, token });
        const tools = await client.listTools();
        const searchTool = tools.find((tool) => tool.name === "search");
        const getEntitiesTool = tools.find(
          (tool) => tool.name === "get_entities",
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
        const evidence = [...sourceEntities.values()]
          .map(normalizeEvidence)
          .filter(
            (asset): asset is EvidenceAsset =>
              asset !== null &&
              input.user.allowedDomains.includes(asset.domain),
          )
          .slice(0, 8);

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
