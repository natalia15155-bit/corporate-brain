# Corporate Brain — Hackathon Roadmap

Deadline: **August 10, 2026 at 18:00 Argentina time**

## Phase 0 — Definition

**July 23**

- Create the standalone project structure
- Write README, PRD, architecture, decisions, and roadmap
- Define zero-cost and privacy constraints
- Define the Stitch design brief
- Confirm the primary demo story

Exit criteria:

- No unresolved product-scope question blocks design
- No functional code has been created prematurely

## Phase 1 — Experience design

**July 24–25**

**Status: Complete**

- Generate three comparable Stitch directions
- Select one visual direction
- Confirm Ask, Decision Brief, and Corporate Memory screens
- Export or document design tokens
- Validate basic accessibility and mobile behavior

Exit criteria:

- One approved user flow and design direction

## Phase 2 — Technical foundation

**July 26–27**

**Status: In progress**

- Bootstrap Next.js and TypeScript
- Configure linting, formatting, tests, and CI
- Create provider-neutral AI contract
- Add Groq Free Tier adapter
- Add deterministic demonstration mode
- Add safe configuration validation

Completed foundation:

- Next.js and TypeScript application shell
- Bilingual Ask, Decision Brief, and Corporate Memory screens
- Provider-neutral Decision Card contract
- Deterministic demonstration provider
- Server-side request validation, evidence filtering, and abstention
- Safe provider configuration with paid and unverified providers disabled
- Unit tests for access, validation, evaluation, and provider policy

Remaining:

- CI workflow
- Verified Groq Free Tier adapter
- Provider failure and rate-limit states

Exit criteria:

- Application shell builds and tests pass
- No paid provider can be selected

## Phase 3 — DataHub evidence

**July 28–31**

- Run DataHub Open Source locally
- Load `showcase-ecommerce`
- Connect through DataHub MCP
- Implement normalized evidence retrieval
- Implement ownership, lineage, quality, and definition views
- Create contract fixtures and tests

Exit criteria:

- A real question returns visible evidence from DataHub

## Phase 4 — Decision workflow

**August 1–4**

- Implement deterministic evidence evaluator
- Define and validate Decision Card schema
- Add Groq synthesis
- Add abstention and conflict behavior
- Add explicit confirmation
- Write approved context back to DataHub
- Link decisions to supporting evidence

Exit criteria:

- Ask → inspect → confirm → write-back works end to end

## Phase 5 — Revalidation and polish

**August 4–5**

- Detect or simulate a supporting evidence change
- Flag an affected decision
- Implement all approved screens
- Add responsive and accessible interactions
- Refine empty, loading, and failure states

Exit criteria:

- The complete differentiation story is demonstrable

## Phase 6 — Verification

**August 5–7**

- Unit tests
- Integration tests
- End-to-end tests
- Rate-limit and provider failure tests
- DataHub disconnection tests
- Prompt-injection resistance checks
- Secret scanning
- Cost verification

Exit criteria:

- Complete critical flow passes reliably
- Verified additional cost remains USD 0

## Phase 7 — Submission

**August 8–10**

- Deploy public application
- Finalize English README and setup instructions
- Include sample outputs
- Record and edit a public video under three minutes
- Prepare Devpost description and screenshots
- Complete feedback submission
- Submit before the deadline

August 9 is the preferred completion date. August 10 is contingency only.
