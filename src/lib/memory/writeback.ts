import type { DemoUser } from "../access-control.ts";
import type { AlertRule } from "../capabilities/types.ts";
import type { DecisionCard } from "../decision/types.ts";
import {
  connectDataHubMcp,
  type McpToolClient,
} from "../evidence/datahub-mcp-client.ts";
import { normalizeUntrustedText } from "../http/request-security.ts";
import type { MemoryItemKind } from "./types.ts";

interface WritebackOptions {
  connect?: typeof connectDataHubMcp;
  environment?: Record<string, string | undefined>;
}

export interface DataHubWritebackInput {
  decision: DecisionCard;
  user: DemoUser;
  kind: MemoryItemKind;
  alertRules: readonly AlertRule[];
}

export interface DataHubWritebackResult {
  destination: "datahub";
  status: "saved";
  documentUrn: string | null;
  tool: "save_document";
}

export class DataHubWritebackError extends Error {
  public readonly code:
    | "disabled"
    | "configuration"
    | "tool_unavailable"
    | "write_failed";

  constructor(
    message: string,
    code:
      | "disabled"
      | "configuration"
      | "tool_unavailable"
      | "write_failed",
  ) {
    super(message);
    this.name = "DataHubWritebackError";
    this.code = code;
  }
}

function buildDocumentContent(input: DataHubWritebackInput): string {
  const { decision, user, alertRules } = input;
  const evidence = decision.evidence
    .map(
      (asset) =>
        `- **${asset.name}** (${asset.id}) — owner: ${asset.owner}; quality: ${asset.quality}`,
    )
    .join("\n");
  const alerts = alertRules.length
    ? alertRules
        .map(
          (alert) =>
            `- ${alert.name}: ${alert.enabled ? "enabled" : "disabled"}; ${alert.metric} ${alert.operator} ${alert.threshold}${alert.unit}; recipients: ${alert.recipients.join(", ")}`,
        )
        .join("\n")
    : "- No operational alerts were attached.";

  return [
    `# ${decision.readiness?.title ?? "Corporate Brain decision"}`,
    "",
    "## Question",
    decision.question,
    "",
    "## Recommendation",
    decision.recommendation,
    "",
    "## Role and scope",
    `Confirmed by ${user.name} for the ${user.team} workspace using the ${user.role} demonstration role.`,
    "",
    "## Evidence",
    evidence || "- No authorized evidence was available.",
    "",
    "## Alert plan",
    alerts,
    "",
    "## Audit",
    `Decision ID: ${decision.id}`,
    `Evidence source: ${decision.evidenceSource}`,
    `Generated at: ${decision.generatedAt}`,
    "Saved only after explicit user confirmation in Corporate Brain.",
  ].join("\n");
}

function findWriteResult(
  value: unknown,
  depth = 0,
): { success?: boolean; urn?: string; message?: string } | null {
  if (depth > 6 || !value) return null;
  if (typeof value === "string") {
    try {
      return findWriteResult(JSON.parse(value) as unknown, depth + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 20)) {
      const found = findWriteResult(item, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (
    typeof record.success === "boolean" ||
    typeof record.urn === "string"
  ) {
    return {
      success:
        typeof record.success === "boolean" ? record.success : undefined,
      urn: typeof record.urn === "string" ? record.urn : undefined,
      message:
        typeof record.message === "string" ? record.message : undefined,
    };
  }

  for (const nested of Object.values(record).slice(0, 30)) {
    const found = findWriteResult(nested, depth + 1);
    if (found) return found;
  }
  return null;
}

export async function saveDecisionToDataHub(
  input: DataHubWritebackInput,
  options: WritebackOptions = {},
): Promise<DataHubWritebackResult> {
  const environment = options.environment ?? process.env;
  if (
    environment.DATAHUB_WRITEBACK_ENABLED?.trim().toLowerCase() !== "true"
  ) {
    throw new DataHubWritebackError(
      "DataHub write-back is disabled.",
      "disabled",
    );
  }

  const transport =
    environment.DATAHUB_MCP_TRANSPORT === "stdio" ? "stdio" : "http";
  const url =
    environment.DATAHUB_MCP_URL ?? environment.DATAHUB_MCP_ENDPOINT;
  if (transport === "http" && !url) {
    throw new DataHubWritebackError(
      "The DataHub MCP endpoint is not configured.",
      "configuration",
    );
  }

  const connect = options.connect ?? connectDataHubMcp;
  let client: McpToolClient | null = null;
  try {
    client = await connect({
      url,
      token:
        environment.DATAHUB_TOKEN ?? environment.DATAHUB_MCP_TOKEN,
      transport,
      command: environment.DATAHUB_MCP_COMMAND,
      args: environment.DATAHUB_MCP_ARGS
        ? environment.DATAHUB_MCP_ARGS.split(" ").filter(Boolean)
        : undefined,
      env: {
        DATAHUB_GMS_URL:
          environment.DATAHUB_GMS_URL ?? "http://localhost:8080",
        TOOLS_IS_MUTATION_ENABLED: "true",
        SAVE_DOCUMENT_TOOL_ENABLED: "true",
      },
    });

    const tools = await client.listTools();
    if (!tools.some((tool) => tool.name === "save_document")) {
      throw new DataHubWritebackError(
        "The DataHub MCP server does not expose save_document.",
        "tool_unavailable",
      );
    }

    const documentType =
      input.kind === "action"
        ? "Recommendation"
        : input.kind === "knowledge"
          ? "Insight"
          : "Decision";
    const relatedAssets = input.decision.evidence
      .map((asset) => asset.id)
      .filter((id) => id.startsWith("urn:li:"))
      .slice(0, 20);
    const title = normalizeUntrustedText(
      `${input.decision.readiness?.title ?? "Corporate Brain"} · ${input.decision.id}`,
      200,
    );

    const result = await client.callTool("save_document", {
      document_type: documentType,
      title,
      content: buildDocumentContent(input),
      topics: [
        "corporate-brain",
        "human-confirmed",
        input.user.team.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        input.kind,
      ],
      related_assets: relatedAssets,
    });
    const parsed = findWriteResult(result);
    if (parsed?.success === false) {
      throw new DataHubWritebackError(
        parsed.message ?? "DataHub rejected the document.",
        "write_failed",
      );
    }

    return {
      destination: "datahub",
      status: "saved",
      documentUrn: parsed?.urn ?? null,
      tool: "save_document",
    };
  } catch (error) {
    if (error instanceof DataHubWritebackError) throw error;
    throw new DataHubWritebackError(
      "Corporate Brain could not save the document to DataHub.",
      "write_failed",
    );
  } finally {
    await client?.close();
  }
}
