# DataHub MCP edge

This folder makes the official DataHub MCP server reproducible on the demo VM.
It deliberately keeps DataHub GMS and the DataHub UI private. Only `/mcp` is
published, behind HTTPS and a bearer token.

## Safety properties

- The official `mcp-server-datahub` package is pinned to `0.6.0`.
- Supergateway is pinned to `3.4.3` and only bridges stdio to Streamable HTTP.
- General DataHub mutation tools are disabled.
- The bounded `save_document` tool remains available for explicit Decision Card write-back.
- Requests without the configured bearer token receive `401`.
- No token or credential is stored in Git.

## VM runbook

1. Copy `.env.example` to `.env` on the VM.
2. Set `MCP_HOST` to the VM hostname and generate a unique `MCP_ACCESS_TOKEN`.
3. Keep Google Cloud firewall rules for ports `8080`, `9002`, and `8000` closed.
4. Allow public TCP `443` (and `80` for the initial TLS certificate only).
5. Seed the synthetic metadata with `docker compose --profile seed run --build --rm seed`.
6. Start the bridge with `docker compose up --build -d datahub-mcp edge`.
7. Confirm an unauthenticated request to `https://<host>/mcp` returns `401`.
8. Configure Vercel with `DATAHUB_MCP_URL=https://<host>/mcp` and the same token.

The seed is idempotent. It creates eight documented assets, five domains,
ownership, schemas, and lineage for the ecommerce analyst story. It contains no
real customer rows and can be run repeatedly without duplicating entities.

The endpoint depends on the VM. Stop the VM after validation and recordings;
start it again for the judging availability window only after confirming the
cost guardrails and hostname are still valid.
