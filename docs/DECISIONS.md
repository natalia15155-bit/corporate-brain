# Architecture Decision Log

## ADR-001 — Standalone repository

**Status:** Accepted

**Date:** 2026-07-23

Corporate Brain will be created as a standalone repository for the DataHub hackathon.

### Why

- Devpost requires a public, testable repository.
- The project must be newly created during the submission period.
- Other Venture Studio products should not be exposed or coupled to this submission.
- The product remains easy to transfer or commercialize independently.

### Trade-off

Shared studio packages will not be introduced until a component is proven reusable. Clear internal interfaces will make later extraction possible.

## ADR-002 — DataHub is the evidence source

**Status:** Accepted

**Date:** 2026-07-23

DataHub is the source for organizational evidence and approved decision context in the MVP.

### Why

- Meaningful DataHub usage is required.
- Ownership, lineage, quality, definitions, and context are central to the product promise.
- Writing approved context back allows knowledge to persist for later people and agents.

### Trade-off

DataHub is not a general-purpose transactional database. A commercial version may add a decision event store.

## ADR-003 — Deterministic assessment before AI synthesis

**Status:** Accepted

**Date:** 2026-07-23

Trust bands and evidence warnings are calculated by code. The LLM explains the result but cannot override it.

### Why

- Reliability must not depend on persuasive model wording.
- The UI needs explainable evidence and abstention.
- Free model variability must not change core safety behavior.

### Trade-off

Evidence rules require explicit design and tests instead of relying on a single prompt.

## ADR-004 — OpenRouter primary, Gemini disabled fallback

**Status:** Accepted

**Date:** 2026-07-23

The primary provider is OpenRouter using only `openrouter/free` or a model ID
explicitly marked with `:free`. Gemini API Free Tier remains an optional disabled
fallback.

### Why

- Zero additional cost
- Structured output support
- Reuses the already available project credential
- Can route only to explicitly free models
- Provider can be replaced through a small contract

### Trade-off

Free models have no production SLA and may change availability. The MVP therefore
has safe failure, a deterministic demonstration provider, and no automatic paid
fallback.

## ADR-005 — Zero additional spending

**Status:** Accepted

**Date:** 2026-07-23

No paid API, hosting plan, domain, or infrastructure may be activated without explicit approval.

### Consequences

- OpenAI API is disabled.
- Gemini must remain on a Free Tier project.
- DataHub development is local.
- Vercel Hobby may only be used while the project remains experimental and non-commercial.
- The application must never switch to a paid model automatically.

## ADR-006 — Human confirmation before shared writes

**Status:** Accepted

**Date:** 2026-07-23

Read operations may be automatic. Any write to shared DataHub context requires explicit confirmation.

### Why

- Prevent accidental or misleading organizational records.
- Make the product feel trustworthy.
- Keep demo actions easy to understand and audit.

## ADR-007 — Synthetic data only

**Status:** Accepted

**Date:** 2026-07-23

The hackathon application will use DataHub sample data and synthetic business decisions.

### Why

- Free AI services may have weaker privacy terms.
- Public repositories and demonstrations must not expose real company information.
- Synthetic scenarios improve reproducibility for judges.

## ADR-008 — Trust bands instead of confidence percentages

**Status:** Accepted

**Date:** 2026-07-23

The UI uses High, Medium, Low, and Insufficient Evidence instead of numerical confidence percentages.

### Why

A number such as 78% suggests a calibrated statistical probability that the MVP cannot honestly provide. Trust bands can be explained through visible evidence and warnings.

## ADR-009 — Default-deny team isolation

**Status:** Accepted

**Date:** 2026-07-23

Team and domain access is resolved before retrieval. Evidence outside the resolved scope is not retrieved, named, counted, cached across users, or sent to an AI provider.

### Why

- Confidential teams must remain isolated even when a prompt asks for broader context.
- Hiding data in the interface is not authorization.
- The safest insufficient-evidence response does not disclose that a hidden asset exists.

### Trade-off

The hackathon can demonstrate policy behavior with synthetic personas, but it cannot claim production-grade identity until a real identity provider and independently enforced DataHub access layer are connected.

## ADR-010 — Profile changes presentation, never permission

**Status:** Accepted

**Date:** 2026-07-23

The active role may change emphasis, vocabulary, and depth. It cannot change evidence scope, facts, trust evaluation, or write permissions.

### Why

The same decision should be useful to executives, managers, analysts, and stewards without creating different versions of organizational truth.

## ADR-011 — Synthetic persona demonstration

**Status:** Accepted

**Date:** 2026-07-23

The MVP includes three clearly labeled synthetic personas with explicit domain allowlists.

### Why

- Judges can see access-sensitive behavior without real employee or company data.
- The scenario remains deterministic and free to operate.
- The demo can distinguish a product security design from production authentication.

## ADR-012 — Capability packs instead of area-specific applications

**Status:** Accepted

**Date:** 2026-07-28

Corporate Brain models each business use case as a reusable capability pack.
The pack defines required capabilities and optional actions; DataHub assets
declare which capabilities they provide and how they connect.

### Why

- The product must work across company areas and positions.
- Asset count is not evidence that a specific business outcome is ready.
- New areas should extend configuration and evidence, not require a new app.
- Deterministic requirement checks prevent false “complete” answers.

### Trade-off

The public demonstration includes one complete Ecommerce pack. Additional areas
still require curated capability definitions and synthetic evidence before they
can be demonstrated responsibly.

## ADR-013 — Typed Corporate Memory items

**Status:** Accepted

**Date:** 2026-07-28

Corporate Memory accepts confirmed decisions, action plans, relevant knowledge,
and alert plans. Each item retains evidence references and any configured alert
rules.

### Why

The organizational brain must learn from more than final decisions while still
requiring the user to choose what becomes durable context.

### Public demo boundary

The public zero-cost demo persists these items in versioned browser memory.
Production storage and DataHub write-back require authenticated server-side
authorization and are not implied by browser persistence.

## ADR-014 — Defense in depth for the public hackathon demo

**Status:** Accepted

**Date:** 2026-07-28

The public application combines bounded request streaming, per-origin
application throttling, prompt-override rejection, strict LLM output, bounded
DataHub metadata, and browser security headers.

### Why

- A public judge URL must remain available when scanned or abused.
- Metadata and user questions are untrusted even when they originate in an
  enterprise context graph.
- Security controls must not require a paid service for the hackathon demo.

### Trade-off

The in-process limiter reduces simple abuse but is not globally consistent
across serverless instances. Vercel Firewall provides the network-level layer.

## ADR-015 — Confirmed decisions become DataHub documents

**Status:** Accepted

**Date:** 2026-07-28

Corporate Brain uses the official MCP `save_document` tool for live write-back.
The server recomputes the decision and supplies a fixed document structure,
topics, audit information, and links to authorized evidence assets.

### Why

- The agent should make the organizational context graph more useful after a
  human confirms a decision.
- Documents preserve rationale without mutating source datasets.
- Related asset links make the saved decision discoverable from its evidence.

### Safety boundary

Write-back is disabled by default and must target a dedicated hackathon catalog
while synthetic personas remain selectable.
