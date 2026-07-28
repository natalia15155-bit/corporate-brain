"use client";

import type { AlertRule } from "@/lib/capabilities/types";
import { copy, type Locale } from "@/lib/i18n";

interface AlertConfiguratorProps {
  alerts: readonly AlertRule[];
  locale: Locale;
  onChange: (alerts: readonly AlertRule[]) => void;
}

export function AlertConfigurator({
  alerts,
  locale,
  onChange,
}: AlertConfiguratorProps) {
  const t = copy[locale];

  function updateAlert(id: string, patch: Partial<AlertRule>) {
    onChange(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, ...patch } : alert,
      ),
    );
  }

  return (
    <section className="alert-configurator" aria-labelledby="alert-config-title">
      <header>
        <div>
          <p className="section-kicker">{t.operationalPlan}</p>
          <h2 id="alert-config-title">{t.configureAlerts}</h2>
          <p>{t.configureAlertsDescription}</p>
        </div>
        <span>{alerts.filter((alert) => alert.enabled).length} {t.enabled}</span>
      </header>

      <div className="alert-rule-grid">
        {alerts.map((alert) => (
          <article className="alert-rule-card" key={alert.id}>
            <div className="alert-rule-title">
              <div>
                <span className={`severity-badge ${alert.severity}`}>
                  {alert.severity === "critical" ? t.critical : t.warning}
                </span>
                <h3>{alert.name}</h3>
              </div>
              <label className="alert-toggle">
                <input
                  type="checkbox"
                  aria-label={`${alert.name}: ${alert.enabled ? t.enabled : t.disabled}`}
                  checked={alert.enabled}
                  onChange={(event) =>
                    updateAlert(alert.id, { enabled: event.target.checked })
                  }
                />
                <span>{alert.enabled ? t.enabled : t.disabled}</span>
              </label>
            </div>
            <p>{alert.description}</p>
            <div className="threshold-editor">
              <code>{alert.metric}</code>
              <strong>{alert.operator}</strong>
              <label>
                <span>{t.threshold}</span>
                <input
                  type="number"
                  aria-label={`${t.threshold}: ${alert.name}`}
                  min="0"
                  step="1"
                  value={alert.threshold}
                  disabled={!alert.enabled}
                  onChange={(event) =>
                    updateAlert(alert.id, {
                      threshold: Number(event.target.value),
                    })
                  }
                />
              </label>
              <span>{alert.unit}</span>
            </div>
            <footer>
              <span>{t.notify}</span>
              <strong>{alert.recipients.join(" · ")}</strong>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
