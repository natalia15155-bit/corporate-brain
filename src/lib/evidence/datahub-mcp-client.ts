import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export interface McpToolDefinition {
  name: string;
  inputSchema?: {
    properties?: Record<string, unknown>;
  };
}

export interface McpToolClient {
  listTools(): Promise<readonly McpToolDefinition[]>;
  callTool(name: string, arguments_: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export interface DataHubMcpConnection {
  url?: string;
  token?: string;
  transport?: "http" | "stdio";
  command?: string;
  args?: string[];
  env?: Record<string, string>;
}

export async function connectDataHubMcp(
  connection: DataHubMcpConnection,
): Promise<McpToolClient> {
  const transport = connection.transport === "stdio"
    ? new StdioClientTransport({
        command: connection.command ?? "uvx",
        args: connection.args ?? ["mcp-server-datahub==0.6.0"],
        env: {
          ...process.env,
          ...connection.env,
          ...(connection.token ? { DATAHUB_GMS_TOKEN: connection.token } : {}),
        },
      })
    : (() => {
        if (!connection.url) throw new Error("DataHub MCP URL is required for HTTP transport");
        const headers = new Headers();
        if (connection.token) headers.set("Authorization", `Bearer ${connection.token}`);
        return new StreamableHTTPClientTransport(new URL(connection.url), {
          requestInit: { headers },
        });
      })();
  const client = new Client({
    name: "corporate-brain",
    version: "0.1.0",
  });

  await client.connect(transport);

  return {
    async listTools() {
      const result = await client.listTools();
      return result.tools.map((tool) => ({
        name: tool.name,
        inputSchema: tool.inputSchema,
      }));
    },
    async callTool(name, arguments_) {
      return client.callTool({ name, arguments: arguments_ });
    },
    async close() {
      if ("terminateSession" in transport) {
        try {
          await transport.terminateSession();
        } catch {
          // Stateless servers and some managed endpoints do not support DELETE.
        }
      }
      await client.close();
    },
  };
}
