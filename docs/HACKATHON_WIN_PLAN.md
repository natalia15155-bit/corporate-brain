# Corporate Brain — hackathon win plan

Updated: August 5, 2026

The goal is not to promise a win. The goal is to maximize the score with a
product that is useful, demonstrably powered by DataHub, safe under public use,
and easy for a judge to understand in under three minutes.

## Winning story

Corporate Brain turns governed metadata into an operational decision loop:

1. A role discovers only the data it is authorized to use.
2. DataHub supplies assets, owners, schema and lineage.
3. A reusable capability pack checks whether the evidence is sufficient.
4. The user configures an action and explicitly approves it.
5. The approved plan is written back to DataHub and preserved in Corporate
   Memory.

The primary persona is Maya Chen, an Ecommerce Data Analyst. Her outcome is a
control dashboard with stockout alerts for star products and critical complaint
alerts routed to CX and Product.

## Phase 1 — Functional credibility

Status: complete and verified in production.

- [x] Live, authenticated DataHub MCP connection.
- [x] Role-scoped catalog with default-deny filtering.
- [x] Separate discovery, readiness and decision intents.
- [x] Schema fields, accountable owners and upstream lineage in discovery.
- [x] Seven-capability Ecommerce readiness assessment.
- [x] Two configurable operational alerts.
- [x] Explicit human confirmation before write-back.
- [x] Corporate Memory entry marked as synchronized with DataHub.
- [x] English and Spanish interface.

Acceptance evidence:

- Production status returns `live-datahub`, write-back enabled and synthetic
  classification.
- The Data Analyst readiness path returns 7/7 with two enabled alerts.
- The saved alert plan shows seven evidence links and DataHub synchronization.

## Phase 2 — Reliability and security

Status: strong baseline; performance work remains.

- [x] Request-size limits and structured validation.
- [x] Prompt-override rejection and untrusted metadata normalization.
- [x] Per-origin rate limiting and hardened response headers.
- [x] No paid model fallback can be enabled accidentally.
- [x] Synthetic-only public catalog and persona disclosure.
- [x] Automated coverage for access control, intent routing, DataHub retrieval,
  readiness, write-back and malicious input.
- [ ] Reduce cold live-query latency to a consistent target below 20 seconds.
- [ ] Add an explicit timeout message with a safe retry/fallback choice instead
  of making a judge wait without context.
- [ ] Run the public URL through a final private-window abuse and rate-limit test.

The current principal risk is variable latency from the free VM plus live MCP
round trips. It does not affect correctness, but it can weaken the live demo.

## Phase 3 — Judge experience

Status: in progress.

- [x] Show the product purpose, role purpose and authorized scope before asking.
- [x] Provide role-specific starter questions.
- [x] Explain the difference between the curated baseline and live DataHub
  results.
- [x] Display fields, owners, lineage, capability coverage and alert routing.
- [ ] Add a compact progress indicator for DataHub search, metadata and lineage.
- [ ] Perform responsive visual QA at desktop and mobile sizes.
- [ ] Capture final screenshots with no personal information or cloud consoles.
- [ ] Rehearse the exact path three times without manual recovery.

## Phase 4 — Three-minute demo

Status: script ready; recording pending.

The video must show one continuous story:

1. Select Maya, Data Analyst.
2. Show authorized scope and hidden Finance domain.
3. Ask the dashboard-and-alert readiness starter.
4. Show 7/7 capabilities and source lineage.
5. Show both critical alert rules and their recipient teams.
6. Confirm the save.
7. Show the synchronized alert plan in Corporate Memory.
8. End with the distinction: this is not chat over data; governance determines
   what the agent can recommend and remember.

Before recording, warm the public application with the same synthetic query,
then start a fresh browser session. Do not expose tokens, email, Vercel or GCP
consoles in the video.

## Phase 5 — Submission package

Status: content drafted; final assets pending.

- [x] Public application URL.
- [x] Public repository URL and Apache 2.0 license.
- [x] Architecture, setup, security decisions and judge instructions.
- [x] Devpost narrative draft.
- [ ] Record and upload the final video under three minutes.
- [ ] Add three screenshots: role-scoped catalog, 7/7 readiness, synchronized
  Corporate Memory.
- [ ] Verify every public link in an incognito window.
- [ ] Confirm eligibility details and submit the feedback form.
- [ ] Submit before August 10, 2026 at 17:00 EDT with buffer for Devpost issues.

## Final go/no-go gate

Submit only when all of these pass in the same session:

- Production reports live DataHub and synthetic data.
- Maya receives 7/7 and both alerts.
- Sofia cannot access Ecommerce or Growth assets outside her allowlist.
- A malicious prompt is rejected without leaking data.
- Write-back reaches DataHub and Corporate Memory reports synchronization.
- The video and repository open without authentication.
- No secret, personal email or paid dependency is visible.

