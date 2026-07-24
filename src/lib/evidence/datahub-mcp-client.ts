import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

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
  url: string;
  token?: string;
}

export async function connectDataHubMcp(
  connection: DataHubMcpConnection,
): Promise<McpToolClient> {
  const headers = new Headers();
  if (connection.token) {
    headers.set("Authorization", `Bearer ${connection.token}`);
  }

  const transport = new StreamableHTTPClientTransport(
    new URL(connection.url),
    {
      requestInit: { headers },
    },
  );
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
      try {
        await transport.terminateSession();
      } catch {
        // Stateless servers and some managed endpoints do not support DELETE.
      }
      await client.close();
    },
  };
}

