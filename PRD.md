# Corporate Brain — Product Requirements Document

## 1. Product summary

Corporate Brain is a decision-memory agent that connects business decisions to verifiable organizational evidence.

Its primary unit is not a note or a chat. Its primary unit is a **business decision with evidence and a lifecycle**.

## 2. Problem

Important company decisions are fragmented across meetings, messages, documents, dashboards, and individual memory.

After time passes, teams struggle to answer:

- What was decided?
- Why was it decided?
- Which information was used?
- Who approved it?
- Are the underlying assumptions and data still valid?
- Which decisions are affected when a metric, dataset, or definition changes?

This creates institutional amnesia, repeated analysis, slow onboarding, conflicting decisions, and avoidable business risk.

## 3. Target users

### Primary user

A non-technical manager, team lead, analyst, or operator who needs to make or revisit a data-informed decision.

### Supporting user

A data owner, analyst, or steward who needs to verify evidence, resolve warnings, or correct business context.

### Role-aware experience

Corporate Brain presents the same authorized facts differently according to the user's role:

- Executives receive the recommendation, impact, and principal risks.
- Managers receive owners, dependencies, and next actions.
- Analysts receive lineage, freshness, quality, and source detail.
- Data stewards receive evidence gaps and remediation actions.

This personalization never expands access. Team membership and explicit domain permissions determine which evidence can be retrieved.

### Economic buyer

- COO
- Chief of Staff
- Head of Data
- Chief Data Officer
- Operations or strategy leader

## 4. Job to be done

> When I make or revisit an important business decision, help me find the relevant prior context and trustworthy evidence, understand its limitations, and preserve the reasoning so the organization does not need to start again.

## 5. Product principles

### Useful

The product must lead to a Decision Card, review request, or other concrete outcome. A generic conversation is not enough.

### Simple

The primary flow must be understandable without knowledge of DataHub, metadata catalogs, lineage, RAG, MCP, or prompt engineering.

### Trustworthy

The system must distinguish:

- Verified facts from DataHub
- Deterministic system assessments
- AI-generated summaries or inferences
- Missing or conflicting evidence

### Visually calm

The interface must feel focused, editorial, and executive. It must not resemble a dense BI dashboard or generic neon AI product.

### Human-controlled

Read operations may be automatic. Publishing, tagging, or modifying shared context requires explicit confirmation.

## 6. MVP scope

### Core workflow

1. The application resolves the authenticated organization, teams, role, and allowed domains.
2. Before asking, the user sees a server-filtered catalog of the assets available to that role.
3. The catalog explains source type, owner, freshness, quality, domain, and sensitivity.
4. The user enters a data-discovery question or a concrete business question.
5. Corporate Brain searches DataHub only within the resolved authorization scope.
6. The system gathers authorized ownership, definitions, lineage, quality, freshness, and related documentation.
7. A deterministic evidence evaluator classifies the available support.
8. The AI provider produces a concise, role-appropriate explanation using only the authorized evidence.
9. A data-discovery question returns the authorized inventory and a next step; it is never presented as an approvable decision.
10. A decision question returns a Decision Card or an abstention when authorized evidence is insufficient.
11. The user may confirm and save a supported decision.
12. Corporate Brain writes approved context back to DataHub after revalidating permission.
13. A later change to supporting evidence can flag the decision for review.

### Required screens

#### Ask

- Plain-language product objective
- Active role and permitted domains
- Authorized data catalog with ownership, freshness, quality, and sensitivity context
- One prominent question input
- Role-specific suggested questions
- Recent decisions
- Important review alerts

#### Decision Brief

- Recommendation or abstention
- Trust level: High, Medium, Low, or Insufficient Evidence
- Active user, team, and role context
- Short rationale
- Evidence list
- Risks and conflicts
- Owner
- Next recommended action
- Save and request-review actions

#### Corporate Memory

- Current decisions
- Decisions requiring review
- Related decisions
- Decision history
- Optional graph exploration

## 7. Decision Card schema

Each Decision Card must contain:

- ID
- Business question
- Decision or recommendation
- Status
- Trust level
- Rationale
- Evidence references
- Risks
- Assumptions
- Conflicts
- Alternatives considered
- Responsible owner
- Contributors
- Recommended next action
- Created date
- Review date
- Source update timestamps
- Owner team
- Visibility: private, team, or shared
- Sensitivity: internal, confidential, or restricted
- Authorized approvers

The UI must not display a false numerical precision such as `78% confidence`. It will use explainable trust bands instead.

## 8. Evidence requirements

Every recommendation must:

- Cite at least one DataHub asset or context document
- Show source freshness when available
- Show ownership when available
- Surface known quality warnings
- Identify contradictory definitions or evidence
- Clearly label AI inference

If the minimum evidence is not available, the system must abstain.

Approved abstention message:

> I cannot provide a trustworthy recommendation with the available evidence.

## 9. Functional requirements

### FR-1 — Ask a decision question

The user can submit a natural-language business question.

### FR-2 — Retrieve evidence

The system can retrieve relevant DataHub entities and context through MCP.

### FR-3 — Evaluate evidence

The system evaluates evidence through deterministic rules before asking an LLM to summarize it.

### FR-4 — Generate a Decision Card

The AI response must match a validated structured schema.

### FR-5 — Inspect sources

The user can expand each source and understand why it matters.

### FR-6 — Confirm a decision

The user must explicitly approve a Decision Card before a write operation.

### FR-7 — Write context back

The system can save approved decision context to DataHub.

### FR-8 — Detect affected decisions

The system can identify when a supporting asset has changed or received a warning and flag the linked decision.

### FR-9 — Demonstration mode

The application includes deterministic synthetic scenarios so the visual flow remains testable when a free AI provider is unavailable.

### FR-10 — Resolve access scope

Before retrieval, the server resolves the user's organization, teams, role, and explicitly allowed domains. Access is denied by default.

### FR-11 — Filter before AI

Unauthorized evidence must not be retrieved, placed in prompts, summarized, counted, named, or exposed through error messages.

### FR-12 — Adapt presentation by role

The system may change emphasis, terminology, and detail according to the user's role, but it must not change the underlying authorized facts, trust evaluation, or permissions.

### FR-13 — Revalidate consequential actions

Saving, sharing, approving, and writing context back must revalidate the user and target scope on the server.

## 10. Non-functional requirements

- No paid service can be enabled automatically.
- No secret can be exposed to the browser or committed to Git.
- No real corporate or personal data will be used in the hackathon.
- The primary flow should take less than two minutes.
- The interface must work on desktop and mobile.
- Keyboard navigation and readable contrast are required.
- AI output must be schema validated.
- Provider errors must fail clearly and safely.
- DataHub content must be treated as untrusted input.
- The application must not silently invent evidence.
- Authorization must be enforced before retrieval and again before every write.
- Restricted evidence must not be cached or logged in a cross-user scope.
- When authorized evidence is insufficient, the product must abstain without revealing hidden asset names or teams.

## 11. Out of scope

- Generic chat across all company content
- Autonomous SQL execution
- Multi-agent orchestration
- Production SSO, SCIM provisioning, and enterprise directory administration
- Billing and subscriptions
- Slack, Teams, or email integrations
- Arbitrary document upload
- Real customer data
- Supabase persistence
- Full graph editor
- Automated writes without human approval

## 12. Success criteria

### User success

- A first-time user understands the product without onboarding.
- A user can complete ask → inspect → confirm in under two minutes.
- The user can identify the evidence behind every conclusion.

### Reliability

- 100% of recommendations have evidence references or abstain.
- 100% of displayed and model-supplied evidence is within the active user's resolved scope.
- Switching to a restricted demo profile removes inaccessible evidence and recalculates the trust result.
- Structured output passes schema validation.
- A failed provider call does not lose the user question.
- No paid-provider fallback is possible.

### Hackathon

- DataHub usage is visible and meaningful.
- The project reads from and writes back to DataHub.
- The demo shows a real decision lifecycle.
- The public repository contains complete setup instructions and sample outputs.
- The demonstration video is under three minutes.

## 13. Open questions

- Which no-cost DataHub instance will remain available throughout judging?
- Which exact synthetic DataHub assets best support the final story?
- Which identity provider and provisioning model should a commercial edition support first?
- Will the judged DataHub environment support per-user OAuth and query-time access controls?
