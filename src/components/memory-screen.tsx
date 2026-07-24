import { copy, type Locale } from "@/lib/i18n";
import {
  ArrowIcon,
  CheckIcon,
  DatabaseIcon,
} from "@/components/icons";

interface MemoryScreenProps {
  locale: Locale;
  saved: boolean;
  onOpen: () => void;
}

export function MemoryScreen({ locale, saved, onOpen }: MemoryScreenProps) {
  const t = copy[locale];
  const decisions = [
    {
      title: t.memoryDecisionOne,
      date: t.decisionOneDate,
      status: t.active,
      statusTone: "active",
      evidenceCount: 12,
      signal: t.stableEvidence,
      saved,
    },
    {
      title: t.memoryDecisionTwo,
      date: t.decisionTwoDate,
      status: t.reviewNeeded,
      statusTone: "review",
      evidenceCount: 8,
      signal: t.changedEvidence,
      saved: false,
    },
    {
      title: t.memoryDecisionThree,
      date: t.decisionThreeDate,
      status: t.decided,
      statusTone: "decided",
      evidenceCount: 5,
      signal: t.stableEvidence,
      saved: false,
    },
  ];

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
          <span className="integrity-number">01</span>
          <div>
            <h2>{t.integrityTitle}</h2>
            <p>{t.integrityDescription}</p>
          </div>
        </aside>
      </section>

      {saved && (
        <div className="saved-notice" role="status">
          <span>
            <CheckIcon />
          </span>
          {t.savedNotice}
        </div>
      )}

      <section className="decision-list">
        {decisions.map((decision, index) => (
          <article className="decision-row" key={decision.title}>
            <div className="decision-index">0{index + 1}</div>
            <div className="decision-summary">
              <div className="decision-meta">
                <span>{decision.date}</span>
                <span className={`decision-status ${decision.statusTone}`}>
                  {decision.status}
                </span>
                {decision.saved && (
                  <span className="new-memory">{t.saved}</span>
                )}
              </div>
              <h2>{decision.title}</h2>
              <div className="decision-signals">
                <span>
                  <DatabaseIcon />
                  {decision.evidenceCount} {t.evidence}
                </span>
                <span
                  className={
                    decision.statusTone === "review" ? "signal-warning" : ""
                  }
                >
                  {decision.statusTone === "review" ? "↗" : "✓"}{" "}
                  {decision.signal}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="open-decision"
              onClick={index === 0 ? onOpen : undefined}
            >
              <span>{t.openDecision}</span>
              <ArrowIcon />
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
