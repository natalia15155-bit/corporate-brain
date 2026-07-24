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

## ADR-004 — Groq primary, Gemini disabled fallback

**Status:** Accepted

**Date:** 2026-07-23

The primary provider is Groq Free Tier using `openai/gpt-oss-120b`. Gemini API Free Tier is an optional disabled fallback.

### Why

- Zero additional cost
- Structured output support
- Suitable free rate limits
- Fast inference
- Provider can be replaced through a small contract

### Trade-off

Free tiers have no production SLA. The MVP needs safe failure and deterministic demonstration scenarios.

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
