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

1. Select a synthetic role and review the DataHub assets that role may use.
2. Inspect each visible source's type, owner, freshness, quality, domain, and sensitivity.
3. Ask either a data-discovery question or a concrete business decision.
4. Retrieve only the evidence authorized for the selected role.
5. Generate a concise Decision Card or an explicit abstention.
6. Show evidence, limitations, and a role-appropriate next step.
7. Ask a human to confirm before saving a consequential decision.

Data-discovery questions do not create or approve decisions. They return the
authorized catalog and guide the user toward a concrete question.

## Recommended demo walkthrough

1. Start as Alex Morgan to see the organization-wide catalog.
2. Switch to Sofia Reyes, the Finance data steward.
3. Confirm that Growth-only assets disappear and that the visible quality warning remains.
4. Ask **What data is available to the Finance team?**
5. Review the five authorized assets and their ownership, freshness, quality,
   domain, and sensitivity signals.
6. Return to the catalog and ask a concrete question about the net revenue
   metric or the returns feed.

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
- [Devpost submission draft](./docs/DEVPOST_SUBMISSION.md)
- [Demo script](./docs/DEMO_SCRIPT.md)

## Current status

Phase 3 is in progress. The public demonstration is deployed and verified.

Implemented:

- Approved bilingual operational experience
- Synthetic role and team isolation demonstration
- Server-side decision request validation
- Streamed request-size limits, prompt-override rejection, and per-origin API
  throttling
- Content Security Policy, anti-clickjacking, MIME-sniffing, referrer, browser
  capability, and opener-isolation headers
- Deterministic evidence evaluation and abstention
- Provider-neutral Decision Card contract
- Zero-cost demonstration provider
- Safe provider configuration that rejects unverified or paid fallbacks
- OpenRouter adapter with strict structured-output validation
- DataHub MCP read adapter for search, entity metadata, schema fields, and
  upstream lineage
- Default-deny filtering for unknown or unauthorized domains
- Server-filtered data catalog tailored to each role
- Separate bilingual data-discovery and decision workflows
- Role-specific starter questions and next-step guidance
- Reusable business capability packs that compare required capabilities with
  authorized evidence
- Ecommerce Control Pack with products, inventory, sales velocity, complaints,
  alert routing and explicit lineage
- Configurable stockout and product-complaint alert plans
- Browser-persistent Corporate Memory for decisions, actions, knowledge and
  alert plans in the public demonstration
- Confirmation-gated DataHub `save_document` write-back adapter with
  server-side decision recomputation and related-asset links
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

The public API applies defense in depth, but the persona selector remains a
synthetic identity demonstration. Live DataHub must use a dedicated hackathon
catalog or an identity-bound DataHub view; it must never expose confidential
production data through the public persona switcher.

### Extending Corporate Brain to another area

Corporate Brain does not hardcode a separate workflow for every department.
Each new area contributes:

1. A role profile and domain allowlist.
2. DataHub assets with capabilities, fields, owners and lineage.
3. A capability pack describing the business requirements and optional actions.
4. Deterministic readiness rules that produce Ready, Missing or Blocked results.

The Ecommerce Control Pack is the first complete example of this extension
model. Finance, CX, Product or Operations packs can use the same API and UI.

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
