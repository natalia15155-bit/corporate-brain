import { copy, type Locale } from "@/lib/i18n";
import { ArrowIcon, CheckIcon, DatabaseIcon } from "@/components/icons";
import type { CorporateMemoryItem } from "@/lib/memory/types";

interface MemoryScreenProps {
  locale: Locale;
  items: readonly CorporateMemoryItem[];
  onOpen: () => void;
}

export function MemoryScreen({ locale, items, onOpen }: MemoryScreenProps) {
  const t = copy[locale];
  const sampleDecisions = [
    {
      id: "sample-retention",
      title: t.memoryDecisionOne,
      date: t.decisionOneDate,
      status: t.active,
      statusTone: "active",
      evidenceCount: 12,
      signal: t.stableEvidence,
      kind: t.memoryKinds.decision,
      summary: t.memorySampleSummary,
      alertRules: [],
    },
    {
      id: "sample-churn",
      title: t.memoryDecisionTwo,
      date: t.decisionTwoDate,
      status: t.reviewNeeded,
      statusTone: "review",
      evidenceCount: 8,
      signal: t.changedEvidence,
      kind: t.memoryKinds.decision,
      summary: t.memoryReviewSummary,
      alertRules: [],
    },
  ];
  const savedItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    date: t.decisionOneDate,
    status: t.saved,
    statusTone: "active",
    evidenceCount: item.evidenceIds.length,
    signal:
      item.alertRules.length > 0
        ? `${item.alertRules.filter((alert) => alert.enabled).length} ${t.alertRules}`
        : t.stableEvidence,
    kind: t.memoryKinds[item.kind],
    summary: item.summary,
    alertRules: item.alertRules,
  }));
  const entries = [...savedItems, ...sampleDecisions];

  return (
    <main className="page-shell memory-shell">
      <section className="memory-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-mark">
              <DatabaseIcon />
            </span>
            {t.memoryEyebrow}
          </p>
          <h1>{t.memoryTitle}</h1>
          <p>{t.memoryDescription}</p>
        </div>
        <aside className="integrity-card">
          <span className="integrity-number">{String(items.length).padStart(2, "0")}</span>
          <div>
            <h2>{t.memoryItems}</h2>
            <p>{t.memoryItemsDescription}</p>
          </div>
        </aside>
      </section>

      {items.length > 0 && (
        <div className="saved-notice" role="status">
          <span>
            <CheckIcon />
          </span>
          {t.savedNotice}
        </div>
      )}

      <section className="decision-list">
        {entries.map((entry, index) => (
          <article className="decision-row" key={entry.id}>
            <div className="decision-index">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="decision-summary">
              <div className="decision-meta">
                <span>{entry.date}</span>
                <span className={`decision-status ${entry.statusTone}`}>
                  {entry.status}
                </span>
                <span className="new-memory">{entry.kind}</span>
              </div>
              <h2>{entry.title}</h2>
              <p className="memory-summary">{entry.summary}</p>
              {entry.alertRules.length > 0 && (
                <div className="memory-alert-rules">
                  {entry.alertRules.map((alert) => (
                    <span key={alert.id}>
                      <strong>{alert.name}</strong>
                      <code>
                        {alert.metric} {alert.operator} {alert.threshold}
                        {alert.unit}
                      </code>
                      <small>{alert.recipients.join(" · ")}</small>
                    </span>
                  ))}
                </div>
              )}
              <div className="decision-signals">
                <span>
                  <DatabaseIcon />
                  {entry.evidenceCount} {t.evidence}
                </span>
                <span className={entry.statusTone === "review" ? "signal-warning" : ""}>
                  {entry.statusTone === "review" ? "↗" : "✓"} {entry.signal}
                </span>
              </div>
            </div>
            <button type="button" className="open-decision" onClick={onOpen}>
              <span>{t.openDecision}</span>
              <ArrowIcon />
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
