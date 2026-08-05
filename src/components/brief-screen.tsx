"use client";

import { useState } from "react";
import { ArrowIcon, CheckIcon, DatabaseIcon } from "@/components/icons";
import { AlertConfigurator } from "@/components/alert-configurator";
import type { DemoUser } from "@/lib/access-control";
import type { AlertRule } from "@/lib/capabilities/types";
import type { ConversationTurn } from "@/lib/decision/conversation";
import type { DecisionCard } from "@/lib/decision/types";
import { copy, type Locale } from "@/lib/i18n";
import type { MemoryItemKind } from "@/lib/memory/types";

interface BriefScreenProps {
  decision: DecisionCard;
  conversation: readonly ConversationTurn[];
  loadingFollowUp: boolean;
  locale: Locale;
  user: DemoUser;
  onAskAgain: () => void;
  onFollowUp: (question: string) => Promise<void>;
  onSave: (
    kind: MemoryItemKind,
    alertRules: readonly AlertRule[],
  ) => Promise<void>;
}

export function BriefScreen({
  decision,
  conversation,
  loadingFollowUp,
  locale,
  user,
  onAskAgain,
  onFollowUp,
  onSave,
}: BriefScreenProps) {
  const t = copy[locale];
  const gate = decision.decisionGate;
  const defaultMemoryKind: MemoryItemKind = gate.canSaveDecision
    ? "decision"
    : gate.canSaveAlertPlan
      ? "alert-plan"
      : "knowledge";
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [memoryKind, setMemoryKind] =
    useState<MemoryItemKind>(defaultMemoryKind);
  const [configuredAlerts, setConfiguredAlerts] = useState<readonly AlertRule[]>(
    decision.readiness?.proposedAlerts ?? [],
  );
  const [showAllEvidence, setShowAllEvidence] = useState(false);
  const analysis = decision.analysis ?? null;
  const isAnalysis = decision.intent === "analysis" && analysis !== null;
  const visibleEvidence = decision.evidence;
  const analysisEvidenceIds = new Set(analysis?.sourceAssetIds ?? []);
  const relevantEvidence = isAnalysis
    ? visibleEvidence.filter((asset) => analysisEvidenceIds.has(asset.id))
    : visibleEvidence;
  const displayedEvidence =
    decision.intent === "readiness" && !showAllEvidence
      ? relevantEvidence.slice(0, 6)
      : relevantEvidence;
  const sufficient = decision.status === "recommendation";
  const isDataDiscovery = decision.intent === "data-discovery";
  const readiness = decision.readiness;
  const isReadiness = decision.intent === "readiness" && readiness !== null;
  const roleView = t.roleViews[user.role];
  const evidenceNames = new Map(
    visibleEvidence.map((asset) => [asset.id, asset.name]),
  );
  const analysisMax = isAnalysis
    ? Math.max(...(analysis?.bars ?? []).map((bar) => bar.value), 1)
    : 1;
  const scopeComplete = sufficient && analysis?.status !== "partial";
  const memoryKindOptions: readonly MemoryItemKind[] = gate.canSaveDecision
    ? ["decision", "action", "knowledge"]
    : gate.canSaveAlertPlan
      ? ["alert-plan", "action", "knowledge"]
      : gate.canSaveAction
        ? ["action", "knowledge"]
        : ["knowledge"];
  const stageLabels = {
    "data-discovery": locale === "es" ? "Descubrimiento" : "Discovery",
    analysis: locale === "es" ? "Análisis" : "Analysis",
    proposal: locale === "es" ? "Propuesta" : "Proposal",
    decision: locale === "es" ? "Decisión" : "Decision",
  } as const;
  const gateStageLabel = stageLabels[gate.stage];
  const responseEyebrow = {
    "data-discovery":
      locale === "es"
        ? "Descubrimiento de datos · evidencia autorizada"
        : "Data discovery · authorized evidence",
    analysis:
      locale === "es"
        ? "Resultado analítico · cálculo trazable"
        : "Analytical result · traceable calculation",
    proposal:
      locale === "es"
        ? "Propuesta operativa · requiere confirmación"
        : "Operational proposal · confirmation required",
    decision: t.briefEyebrow,
  }[gate.stage];
  const spanishCriteria: Readonly<Record<string, string>> = {
    "Authorized catalog filtered by role": "Catálogo autorizado filtrado por rol",
    "Owners, fields, and lineage are visible": "Responsables, campos y linaje visibles",
    "A business question, target metric, and decision owner":
      "Pregunta de negocio, métrica objetivo y responsable de decisión",
    "Metric definition selected": "Definición de métrica seleccionada",
    "Relevant sources identified": "Fuentes relevantes identificadas",
    "Result calculated from authorized data": "Resultado calculado con datos autorizados",
    "Closest authorized answer produced": "Respuesta autorizada más cercana obtenida",
    "Restricted source details were not disclosed": "Fuentes restringidas no reveladas",
    "Decision objective": "Objetivo de la decisión",
    Alternatives: "Alternativas comparables",
    "Decision owner and review date": "Responsable y fecha de revisión",
    "Authorized access to the missing metric inputs":
      "Acceso autorizado a los datos faltantes de la métrica",
    "A complete profitability definition for this role":
      "Definición completa de rentabilidad para este rol",
    "Business capability checked": "Capacidad de negocio verificada",
    "Required sources found": "Fuentes requeridas encontradas",
    "Operational alert rules drafted": "Reglas de alertas operativas preparadas",
    "Missing sources identified": "Fuentes faltantes identificadas",
    "Human approval and live notification routing":
      "Aprobación humana y envío real de notificaciones",
    "Business objective is explicit": "Objetivo de negocio explícito",
    "Authorized evidence is sufficient": "Evidencia autorizada suficiente",
    "Recommendation, outcome, and risks are present":
      "Recomendación, resultado y riesgos presentes",
    "Question interpreted": "Pregunta interpretada",
    "Authorized evidence retrieved": "Evidencia autorizada recuperada",
    "Risk review started": "Revisión de riesgos iniciada",
    "Warning review": "Revisión de advertencias",
    "Final approval criteria": "Criterios finales de aprobación",
    "Additional authorized evidence is required.":
      "Se requiere evidencia autorizada adicional",
  };
  const localizeCriterion = (criterion: string) =>
    locale === "es" ? spanishCriteria[criterion] ?? criterion : criterion;
  const gateStatusLabel =
    gate.status === "ready"
      ? locale === "es"
        ? "Lista para aprobar"
        : "Ready to approve"
      : locale === "es"
        ? "Aún no es una decisión"
        : "Not a decision yet";
  const gateNextActionLabel = {
    "ask-follow-up":
      locale === "es" ? "Hacer seguimiento" : "Ask follow-up",
    "convert-to-proposal":
      locale === "es" ? "Convertir en propuesta" : "Convert into proposal",
    "request-access":
      locale === "es" ? "Solicitar acceso o métrica" : "Request access or metric",
    "save-alert-plan":
      locale === "es" ? "Guardar plan de alertas" : "Save alert plan",
    "approve-decision":
      locale === "es" ? "Aprobar decisión" : "Approve decision",
  }[gate.nextAction];
  const primarySaveLabel = gate.canSaveDecision
    ? t.approveDecision
    : gate.canSaveAlertPlan
      ? t.saveOperationalPlan
      : gate.canSaveAction && !isAnalysis
        ? t.saveGapPlan
        : locale === "es"
          ? "Guardar insight"
          : "Save insight";

  return (
    <main className="page-shell brief-shell">
      <section className="brief-topline">
        <div>
          <p className="section-kicker">
            {responseEyebrow} · {decision.id}
          </p>
          <p className="decision-question">{decision.question}</p>
          <h1>{decision.recommendation}</h1>
        </div>
        <div className={`access-state ${scopeComplete ? "allowed" : "limited"}`}>
          <CheckIcon />
          <span>
            <strong>{scopeComplete ? t.scopeComplete : t.scopeLimited}</strong>
            <small>{t.scopeFor} {user.name}</small>
          </span>
        </div>
      </section>

      {decision.evidenceFallback && (
        <aside className="evidence-fallback-notice" role="status">
          <strong>
            {locale === "es"
              ? "DataHub en vivo tardó más de lo esperado"
              : "Live DataHub took longer than expected"}
          </strong>
          <span>
            {locale === "es"
              ? "Este resultado usa el snapshot gobernado y etiquetado para mantener la demo disponible. Volvé a intentar para consultar el MCP en vivo."
              : "This result uses the governed, labeled snapshot to keep the demo available. Retry to query the live MCP connection."}
          </span>
        </aside>
      )}

      {conversation.length > 0 && (
        <section
          className="conversation-thread"
          aria-label={locale === "es" ? "Hilo de conversación" : "Conversation thread"}
        >
          <header>
            <div>
              <p className="section-kicker">
                {locale === "es" ? "Contexto activo" : "Active context"}
              </p>
              <h2>{locale === "es" ? "Hilo de análisis" : "Analysis thread"}</h2>
            </div>
            <span>
              {conversation.length}{" "}
              {locale === "es"
                ? conversation.length === 1
                  ? "paso"
                  : "pasos"
                : conversation.length === 1
                  ? "step"
                  : "steps"}
            </span>
          </header>
          <div className="thread-list">
            {conversation.map((turn, index) => (
              <article
                className={index === conversation.length - 1 ? "current" : ""}
                key={turn.id}
              >
                <span>{index + 1}</span>
                <div>
                  <strong>{turn.question}</strong>
                  <p>{turn.title}</p>
                </div>
                <small>{stageLabels[turn.stage]}</small>
              </article>
            ))}
          </div>
        </section>
      )}

      {analysis && (
        <section className={`analysis-result ${analysis.status}`} aria-labelledby="analysis-title">
          <header>
            <div>
              <p className="section-kicker">
                {analysis.status === "answered"
                  ? locale === "es" ? "Análisis calculado" : "Calculated analysis"
                  : locale === "es" ? "Respuesta parcial" : "Partial answer"}
              </p>
              <h2 id="analysis-title">{analysis.title}</h2>
              <p>{analysis.answer}</p>
            </div>
            <div className="analysis-primary">
              <strong>{analysis.primaryValue}</strong>
              <span>{analysis.primaryLabel}</span>
              <small>{analysis.period}</small>
            </div>
          </header>

          <div className="analysis-chart" aria-label={analysis.title}>
            {analysis.bars.map((bar) => (
              <div className="analysis-bar-row" key={bar.label}>
                <span>{bar.label}</span>
                <div><i style={{ width: `${Math.max((bar.value / analysisMax) * 100, 4)}%` }} /></div>
                <strong>{bar.formattedValue}</strong>
              </div>
            ))}
          </div>

          <div className="analysis-method">
            <span>{locale === "es" ? "Cómo se calcula" : "How it is calculated"}</span>
            <strong>{analysis.metricDefinition}</strong>
          </div>

          <div className="follow-up-list" aria-label={locale === "es" ? "Preguntas de seguimiento" : "Follow-up questions"}>
            {analysis.suggestedFollowUps.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={loadingFollowUp}
                onClick={() => void onFollowUp(suggestion)}
              >
                {suggestion}
                <ArrowIcon />
              </button>
            ))}
          </div>
        </section>
      )}

      {isReadiness && (
        <section className="readiness-panel" aria-labelledby="readiness-title">
          <header>
            <div>
              <p className="section-kicker">{readiness.area}</p>
              <h2 id="readiness-title">{t.capabilityCoverage}</h2>
              <p>{t.capabilityCoverageDescription}</p>
            </div>
            <strong className={`readiness-score ${readiness.status}`}>
              {readiness.readyCount}/{readiness.totalCount} {t.ready}
            </strong>
          </header>

          <div className="requirement-grid">
            {readiness.requirements.map((requirement) => (
              <article
                className={`requirement-card ${requirement.status}`}
                key={requirement.id}
              >
                <span>
                  {requirement.status === "ready" ? "✓" : "!"}
                </span>
                <div>
                  <strong>{requirement.label}</strong>
                  <p>{requirement.description}</p>
                  <small>
                    {requirement.status === "ready"
                      ? requirement.evidenceIds
                          .map((id) => evidenceNames.get(id))
                          .filter(Boolean)
                          .join(" · ")
                      : t.missing}
                  </small>
                </div>
              </article>
            ))}
          </div>

          <div className="lineage-panel">
            <h3>{t.sourceConnections}</h3>
            {readiness.lineage.length === 0 ? (
              <p>{t.noVisibleConnections}</p>
            ) : (
              <div className="lineage-list">
                {readiness.lineage.map((connection) => (
                  <div
                    className="lineage-edge"
                    key={`${connection.fromId}-${connection.toId}`}
                  >
                    <span>{connection.fromName}</span>
                    <strong>→</strong>
                    <span>{connection.toName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isReadiness && (
        <AlertConfigurator
          alerts={configuredAlerts}
          locale={locale}
          onChange={setConfiguredAlerts}
        />
      )}

      <section className="decision-grid">
        <article className="structured-evidence">
          <header>
            <h2>{t.structuredEvidence}</h2>
            <div className="evidence-header-actions">
              <span>{relevantEvidence.length} {t.dataPoints}</span>
              {decision.intent === "readiness" &&
                relevantEvidence.length > displayedEvidence.length && (
                  <button
                    type="button"
                    onClick={() => setShowAllEvidence(true)}
                  >
                    {t.showAllData}
                  </button>
                )}
              {decision.intent === "readiness" &&
                showAllEvidence &&
                relevantEvidence.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllEvidence(false)}
                  >
                    {t.showLessData}
                  </button>
                )}
            </div>
          </header>
          <div className="evidence-rows">
            {displayedEvidence.map((asset) => (
              <article className="evidence-row" key={asset.id}>
                <span className={`asset-icon ${asset.tone}`}>
                  <DatabaseIcon />
                </span>
                <div className="evidence-copy">
                  <div className="evidence-title">
                    <h3>{asset.name}</h3>
                    <code>ID: {asset.id}</code>
                  </div>
                  <p>{asset.description}</p>
                  <div className="evidence-meta">
                    <span>{asset.type}</span>
                    <span>{asset.owner}</span>
                    <span>{asset.freshness}</span>
                    <span>{asset.quality}</span>
                    <span>{t.sensitivity[asset.sensitivity]}</span>
                  </div>
                  {isDataDiscovery && (asset.fields?.length ?? 0) > 0 && (
                    <p className="catalog-fields">
                      <strong>{t.fieldsAvailable}:</strong>{" "}
                      {asset.fields?.slice(0, 8).join(", ")}
                    </p>
                  )}
                  {isDataDiscovery && (asset.upstream?.length ?? 0) > 0 && (
                    <p className="catalog-fields">
                      <strong>{t.sourceConnections}:</strong>{" "}
                      {asset.upstream
                        ?.slice(0, 5)
                        .map((id) => evidenceNames.get(id) ?? id)
                        .join(" → ")}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!sufficient && (
            <div className="abstention" role="status">
              <CheckIcon />
              <div>
                <strong>{t.insufficientTitle}</strong>
                <p>{t.insufficientAuthorizedEvidence}</p>
              </div>
            </div>
          )}
        </article>

        <aside className="decision-aside">
          <article className="outcome-card">
            <span>
              {isReadiness
                ? t.readinessResult
                : isDataDiscovery
                  ? t.catalogResult
                  : isAnalysis
                    ? locale === "es" ? "Resultado analítico" : "Analytical result"
                  : t.projectedOutcome}
            </span>
            <div>
              <strong>{decision.outcome ?? "—"}</strong>
              <p>
                {sufficient
                  ? isDataDiscovery
                    ? t.authorizedEvidence
                    : isReadiness
                      ? t.capabilityCoverage
                      : isAnalysis
                        ? analysis?.primaryLabel
                      : t.pipelineGrowth
                  : t.outcomeUnavailable}
              </p>
            </div>
            <small>
              {sufficient
                ? isDataDiscovery
                  ? t.discoveryOutcomeDescription
                  : isReadiness
                    ? t.capabilityCoverageDescription
                    : isAnalysis
                      ? analysis?.status === "partial"
                        ? locale === "es"
                          ? "Es la respuesta válida más cercana; no sustituye la métrica solicitada."
                          : "This is the closest valid answer; it does not replace the requested metric."
                        : locale === "es"
                          ? "Calculado con una definición visible y fuentes trazables."
                          : "Calculated with a visible definition and traceable sources."
                    : t.outcomeDescription
                : t.outcomeLimited}
            </small>
          </article>

          <article className="risk-card">
            <h2>
              <span>◇</span>
              {isReadiness
                ? t.operationalConsiderations
                : isDataDiscovery
                  ? t.dataConsiderations
                  : isAnalysis
                    ? locale === "es" ? "Límites del análisis" : "Analysis limitations"
                  : t.riskAssessment}
            </h2>
            <ul>
              {decision.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <section className="role-view">
        <span>{t.personalizedFor} {t.roles[user.role]}</span>
        <strong>{roleView.title}</strong>
        <p>{decision.roleInsight || (sufficient ? roleView.complete : roleView.limited)}</p>
      </section>

      <section className={`decision-gate-panel ${gate.status}`}>
        <header>
          <div>
            <p className="section-kicker">{gateStageLabel}</p>
            <h2>{gateStatusLabel}</h2>
          </div>
          <strong>{gateNextActionLabel}</strong>
        </header>
        <div className="gate-columns">
          <div>
            <span>{locale === "es" ? "Completo" : "Complete"}</span>
            <ul>
              {gate.completed.map((item) => (
                <li key={item}>{localizeCriterion(item)}</li>
              ))}
            </ul>
          </div>
          <div>
            <span>{locale === "es" ? "Falta para decidir" : "Still needed"}</span>
            {gate.missing.length > 0 ? (
              <ul>
                {gate.missing.map((item) => (
                  <li key={item}>{localizeCriterion(item)}</li>
                ))}
              </ul>
            ) : (
              <p>
                {locale === "es"
                  ? "No faltan criterios críticos."
                  : "No critical criteria are missing."}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="approval-bar">
        <div>
          <CheckIcon />
          <span>
            {isDataDiscovery
              ? t.discoveryNextStep
              : isAnalysis
                ? locale === "es"
                  ? "Este resultado todavía no es una decisión. Podés seguir analizando o guardarlo como insight."
                  : "This result is not a decision yet. Continue the analysis or save it as an insight."
              : isReadiness
                ? readiness.status === "ready"
                  ? t.readinessNextStep
                  : t.readinessGapNextStep
              : sufficient
                ? t.readyToFinalize
                : t.reviewBeforeDecision}
          </span>
        </div>
        <div>
          <button className="secondary-button" type="button" onClick={onAskAgain}>
            {isDataDiscovery ? t.returnToCatalog : t.askAnother}
          </button>
          {!isDataDiscovery && (
            <button
              className="primary-button"
              type="button"
              disabled={
                !gate.canSaveDecision &&
                !gate.canSaveInsight &&
                !gate.canSaveAction &&
                !gate.canSaveAlertPlan
              }
              onClick={() => setShowConfirmation(true)}
            >
              {primarySaveLabel}
            </button>
          )}
        </div>
      </section>

      {!isDataDiscovery && !isReadiness && !isAnalysis && (
        <section className="anchor-section">
          <h2>{t.contextualAnchors}</h2>
          <div className="anchor-grid">
            {t.anchors.map((anchor, index) => (
              <article key={anchor.title}>
                {index === 1 ? <CheckIcon /> : <DatabaseIcon />}
                <div>
                  <strong>{anchor.title}</strong>
                  <small>{anchor.meta}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {showConfirmation && (
        <section className="confirmation-panel" aria-live="polite">
          <div className="confirmation-icon">
            <DatabaseIcon />
          </div>
          <div>
            <h2>{t.confirmationTitle}</h2>
            <p>{t.confirmationDescription}</p>
            <label className="memory-kind-picker">
              <span>{t.memoryKind}</span>
              <select
                value={memoryKind}
                onChange={(event) =>
                  setMemoryKind(event.target.value as MemoryItemKind)
                }
              >
                {memoryKindOptions.map((kind) => (
                  <option key={kind} value={kind}>
                    {t.memoryKinds[kind]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="confirmation-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setShowConfirmation(false)}
            >
              {t.cancel}
            </button>
            <button
              className="primary-button"
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                await onSave(memoryKind, configuredAlerts);
              }}
            >
              {saving
                ? locale === "es"
                  ? "Guardando..."
                  : "Saving..."
                : t.confirmSave}
              <ArrowIcon />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
