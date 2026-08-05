# Department Pack architecture

A Department Pack customizes Corporate Brain for a business area without
forking the product or duplicating application code.

## Contract

Each pack declares:

```ts
interface DepartmentPack {
  id: string;
  area: string;
  roles: RolePolicy[];
  vocabulary: BusinessTerm[];
  metrics: MetricDefinition[];
  sources: SourceRequirement[];
  questionTypes: QuestionCapability[];
  decisionTemplates: DecisionTemplate[];
  alerts: AlertPolicy[];
  actions: ActionPolicy[];
}
```

The declaration contains business configuration. Shared services implement
retrieval, analytics, conversation, decision gating, memory, audit and actions.

## Runtime flow

1. Resolve the authenticated user, role and department.
2. Load the applicable pack and deny capabilities not declared by it.
3. Classify the request as discovery, analysis, investigation or decision.
4. Query DataHub for authorized context and provenance.
5. Query an analytical adapter only when actual values are required.
6. Return a typed response with answer, evidence, assumptions and limitations.
7. Preserve follow-up context inside the same scoped thread.
8. Expose only stage-valid actions.
9. Require human confirmation for shared writes or operational changes.

## Response contract

Every result must identify what it is:

- **Discovery:** what information exists, where it lives and who owns it.
- **Analysis:** a calculated result with metric definition, period and source.
- **Investigation:** a hypothesis, supporting and conflicting signals, and gaps.
- **Proposal:** a recommended option that is not yet approved.
- **Decision:** an approved choice with owner, rationale, evidence and review date.

## Decision gate

A proposal becomes approvable only when it contains:

- objective;
- alternatives considered;
- recommendation;
- rationale;
- success metric;
- risks and assumptions;
- accountable owner;
- review date;
- evidence references;
- authorized human approver.

Before the gate is complete, valid actions are `Continue analysis`, `Save
insight`, `Request missing access`, `Create alert` or `Convert to proposal`.
`Approve decision` is intentionally unavailable.

## First implementation slice

The Ecommerce pack proves the architecture using governed metadata from
DataHub and a deterministic analytical adapter. It must answer or safely
abstain from:

- What sales data can my role use?
- Which product produces the most net sales?
- Which product is most profitable?
- What is missing to calculate profitability?
- Which star products risk a stockout?
- Which products require CX and Product review?

The demo dataset is synthetic and must remain visibly labelled as such. The
same adapter interface can later query PostgreSQL, Supabase, a warehouse or a
semantic BI layer without changing the response or decision contracts.
