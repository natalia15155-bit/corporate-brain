# Corporate Brain

Corporate Brain is a decision-memory agent for organizations.

It helps a business user answer four questions:

1. What did we decide?
2. Why did we decide it?
3. Which evidence supported the decision?
4. Is that evidence still trustworthy today?

Corporate Brain uses DataHub as its evidence and context layer. It connects decisions to datasets, dashboards, metrics, owners, lineage, quality signals, and business documentation. When an underlying source changes, Corporate Brain can identify decisions that may need review.

## Hackathon

This project is being created for **Build with DataHub: The Agent Hackathon**.

- Submission deadline: August 10, 2026
- Intended category: Agents That Do Real Work
- Required foundation: DataHub Open Source and DataHub MCP
- License: Apache 2.0
- Public demo: https://corporate-brain-delta.vercel.app

## Product promise

> Understand, decide, and remember — using evidence you can verify.

## MVP experience

1. Ask a business question.
2. Retrieve relevant evidence from DataHub.
3. Generate a concise Decision Card.
4. Show evidence, limitations, and a trust level.
5. Ask a human to confirm before saving.
6. Write the approved context back to DataHub.
7. Flag the decision when its supporting evidence changes.

## Product principles

- **Useful:** every interaction should help complete a real decision workflow.
- **Simple:** users do not need to understand metadata, lineage, MCP, or LLMs.
- **Trustworthy:** every conclusion is supported by evidence or the system abstains.
- **Calm and visual:** the interface prioritizes clarity over dashboards and technical detail.
- **Human-controlled:** consequential writes require explicit confirmation.
- **Zero-cost MVP:** no paid API or infrastructure may be enabled for the hackathon.

## Planned technology

- Next.js
- TypeScript
- DataHub Open Source
- DataHub MCP Server
- OpenRouter with an explicitly free model
- Gemini API Free Tier as a disabled fallback
- Vercel Hobby for the experimental public demo

No paid OpenAI API and no Supabase database are planned for the hackathon MVP.

## Documentation

- [Product requirements](./PRD.md)
- [Architecture](./ARCHITECTURE.md)
- [Roadmap](./ROADMAP.md)
- [Architecture decisions](./docs/DECISIONS.md)
- [Design brief](./docs/DESIGN_BRIEF.md)
- [Stitch prompt](./docs/STITCH_PROMPT.md)
- [Submission checklist](./docs/SUBMISSION_CHECKLIST.md)

## Current status

Phase 3 is in progress. The public demonstration is deployed and verified.

Implemented:

- Approved bilingual operational experience
- Synthetic role and team isolation demonstration
- Server-side decision request validation
- Deterministic evidence evaluation and abstention
- Provider-neutral Decision Card contract
- Zero-cost demonstration provider
- Safe provider configuration that rejects unverified or paid fallbacks
- OpenRouter adapter with strict structured-output validation
- DataHub MCP read adapter for search and entity metadata
- Default-deny filtering for unknown or unauthorized domains
- Rich DataHub snapshot with datasets, dashboards, pipelines, ownership,
  freshness, quality, sensitivity, and realistic URNs
- GitHub Actions quality workflow
- Verified Vercel production deployment and decision API

The adapters are implemented and independently tested. Live OpenRouter can be
enabled with server-side environment variables. Live DataHub validation requires
an accessible DataHub MCP endpoint and a scope-limited token.

The public demo intentionally uses the checked-in DataHub snapshot and the
deterministic provider. The interface labels this state explicitly; it does not
claim a live connection.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The Ask screen now calls `POST /api/decisions`. This route validates the request,
resolves a server-known synthetic persona, filters evidence, evaluates trust,
and returns a structured Decision Card without shared caching.

See [DataHub and OpenRouter setup](./docs/DATAHUB_SETUP.md) to switch from the
deterministic demonstration to the live adapters.
