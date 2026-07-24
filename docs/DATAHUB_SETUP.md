# DataHub and OpenRouter setup

Corporate Brain has three independently selectable modes:

| Evidence | Synthesis | Purpose |
| --- | --- | --- |
| `demo` | `demo` | Fully offline and deterministic |
| `demo` | `openrouter` | Validate live AI without requiring DataHub |
| `snapshot` | `demo` | Fast local development with a small projection of real DataHub metadata |
| `datahub` | `openrouter` | Full read flow with live metadata and AI synthesis |

## OpenRouter

Set these server-side variables without committing their values:

```dotenv
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=
OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free
ALLOW_PAID_MODELS=false
```

`OPENROUTER_MODEL` must be `openrouter/free` or end in `:free`. The application
rejects other model IDs and also rejects `ALLOW_PAID_MODELS=true`.

Only normalized, authorized evidence is sent to the model. Secrets are never
sent to the browser or returned by the API.

## DataHub MCP

### Fast local development

Use the checked-in snapshot mode when Docker is not available or the machine is
resource constrained:

```dotenv
EVIDENCE_SOURCE=snapshot
AI_PROVIDER=demo
```

The snapshot is a small, read-only projection of the official
`showcase-ecommerce` DataHub pack. It is explicitly a development aid; the
hackathon demo must use the live MCP path so judges can verify DataHub usage.

Corporate Brain connects to a DataHub MCP server over Streamable HTTP or the
official local stdio server and uses the official read tools:

- `search`
- `get_entities`

Set:

```dotenv
EVIDENCE_SOURCE=datahub
DATAHUB_MCP_URL=
DATAHUB_TOKEN=
```

The URL must point to the MCP endpoint, not to the normal DataHub web interface.
The token is optional only when the endpoint itself does not require
authentication.

For the local DataHub Core quickstart, use the official stdio server:

```dotenv
EVIDENCE_SOURCE=datahub
DATAHUB_MCP_TRANSPORT=stdio
DATAHUB_GMS_URL=http://localhost:8080
DATAHUB_MCP_COMMAND=uvx
DATAHUB_MCP_ARGS=mcp-server-datahub@latest
```

The first run may download the MCP server through `uvx`. This path keeps the
integration local and read-only; no DataHub write tools are enabled.

## Access isolation

For a production-like test, use a DataHub service account whose default view is
already restricted to the domains that Corporate Brain may search. The adapter
also sends the resolved domain allowlist when the MCP tool schema supports it and
filters every normalized result again.

Unknown domains are denied by default. Application filtering is defense in
depth; it is not a substitute for restrictions enforced by DataHub or the
identity layer.

## Current local prerequisite

The local runtime can be created with the official DataHub Core quickstart. A
full live validation needs either:

1. an organizer-provided or managed DataHub MCP endpoint, or
2. DataHub Core plus the official DataHub MCP server installed separately.

Until one is available, use `EVIDENCE_SOURCE=snapshot` for local UX work. It
keeps the evidence contract and authorization behavior realistic without
running the full DataHub Core stack on a resource-constrained machine.

## Write-back

This phase is read-only. DataHub mutation tools remain disabled. Saving an
approved decision will be implemented separately with explicit user
confirmation and server-side revalidation.
