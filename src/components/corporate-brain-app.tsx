"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AskScreen } from "@/components/ask-screen";
import { BriefScreen } from "@/components/brief-screen";
import {
  CheckIcon,
  DatabaseIcon,
  MarkIcon,
  SparkIcon,
} from "@/components/icons";
import { MemoryScreen } from "@/components/memory-screen";
import { demoUsers } from "@/lib/access-control";
import type { CatalogApiResult, RoleCatalog } from "@/lib/catalog/types";
import type {
  DecisionApiResult,
  DecisionCard,
} from "@/lib/decision/types";
import { copy, type Locale } from "@/lib/i18n";

type Screen = "ask" | "brief" | "memory";

const localeStorageKey = "corporate-brain-locale";
const localeChangeEvent = "corporate-brain-locale-change";

function subscribeToLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(localeChangeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(localeChangeEvent, onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  return window.localStorage.getItem(localeStorageKey) === "es" ? "es" : "en";
}

function persistLocale(locale: Locale) {
  window.localStorage.setItem(localeStorageKey, locale);
  window.dispatchEvent(new Event(localeChangeEvent));
}

function getServerLocaleSnapshot(): Locale {
  return "en";
}

export function CorporateBrainApp() {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );
  const [screen, setScreen] = useState<Screen>("ask");
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState(demoUsers[0].id);
  const [decision, setDecision] = useState<DecisionCard | null>(null);
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<RoleCatalog | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const t = copy[locale];
  const activeUser =
    demoUsers.find((candidate) => candidate.id === userId) ?? demoUsers[0];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError(null);

      try {
        const response = await fetch(
          `/api/catalog?userId=${encodeURIComponent(activeUser.id)}`,
          { cache: "no-store" },
        );
        const result = (await response.json()) as CatalogApiResult;

        if (!response.ok || !result.ok) {
          throw new Error(
            result.ok ? copy[locale].catalogError : result.error.message,
          );
        }

        if (!cancelled) setCatalog(result.catalog);
      } catch {
        if (!cancelled) {
          setCatalog(null);
          setCatalogError(copy[locale].catalogError);
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [activeUser.id, locale]);

  function saveDecision() {
    setSaved(true);
    setScreen("memory");
  }

  function changePersona(nextUserId: string) {
    setUserId(nextUserId);
    setDecision(null);
    setDecisionError(null);
    setScreen("ask");
  }

  function changeLocale(nextLocale: Locale) {
    persistLocale(nextLocale);
    setDecision(null);
    setDecisionError(null);
    setScreen("ask");
  }

  async function generateDecision(question: string) {
    setLoadingDecision(true);
    setDecisionError(null);

    try {
      const response = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, userId: activeUser.id, locale }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          response.status === 404
            ? "The decision service is not running. Restart Corporate Brain and try again."
            : "The decision service returned an unexpected response. Try again in a moment.",
        );
      }
      const result = (await response.json()) as DecisionApiResult;

      if (!response.ok || !result.ok) {
        throw new Error(
          result.ok ? t.decisionError : result.error.message,
        );
      }

      setDecision(result.decision);
      setScreen("brief");
    } catch (error) {
      setDecisionError(
        error instanceof Error ? error.message : t.decisionError,
      );
    } finally {
      setLoadingDecision(false);
    }
  }

  const navItems = [
    { id: "ask" as const, label: t.navAsk, icon: <SparkIcon /> },
    { id: "brief" as const, label: t.navBrief, icon: <CheckIcon /> },
    { id: "memory" as const, label: t.navMemory, icon: <DatabaseIcon /> },
  ];

  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <button
          className="brand"
          type="button"
          onClick={() => setScreen("ask")}
          aria-label="Corporate Brain"
        >
          <span className="brand-mark">
            <MarkIcon />
          </span>
          <span>
            <strong>Corporate Brain</strong>
            <small>{t.brandDescriptor}</small>
          </span>
        </button>

        <button
          className="new-inquiry"
          type="button"
          onClick={() => setScreen("ask")}
        >
          <span>+</span>
          {t.newInquiry}
        </button>

        <nav className="primary-nav" aria-label={t.navLabel}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={screen === item.id ? "active" : ""}
              onClick={() => setScreen(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === "memory" && saved && (
                <span className="nav-notification" />
              )}
            </button>
          ))}
        </nav>

        <section className="workspace-scope" aria-label={t.activeWorkspace}>
          <span className="scope-label">{t.activeWorkspace}</span>
          <strong>{activeUser.team}</strong>
          <small>
            {activeUser.allowedDomains.length} {t.authorizedDomains}
          </small>
        </section>

        <div className="sidebar-bottom">
          <div className="sidebar-link">
            <CheckIcon />
            <span>{t.security}</span>
            <small>{t.defaultDeny}</small>
          </div>

          <label className="persona-picker">
            <span className="scope-label">{t.demoPersona}</span>
            <span className="persona-control">
              <span className="avatar">{activeUser.initials}</span>
              <span className="persona-copy">
                <strong>{activeUser.name}</strong>
                <small>
                  {t.roles[activeUser.role]} · {activeUser.team}
                </small>
              </span>
              <select
                value={activeUser.id}
                onChange={(event) => changePersona(event.target.value)}
                aria-label={t.demoPersona}
              >
                {demoUsers.map((user) => (
                  <option value={user.id} key={user.id}>
                    {user.name} — {t.roles[user.role]}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <div className="language-switch" aria-label={t.languageLabel}>
            {(["en", "es"] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={locale === language}
                className={locale === language ? "active" : ""}
                onClick={() => changeLocale(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="app-workspace">
        <header className="workspace-header">
          <div>
            <span className="status-dot" />
            {t.demoConnected}
          </div>
          <span>{t.syntheticPersonaNotice}</span>
        </header>

        {screen === "ask" && (
          <AskScreen
            key={activeUser.id}
            locale={locale}
            user={activeUser}
            catalog={catalog}
            catalogLoading={catalogLoading}
            catalogError={catalogError}
            loading={loadingDecision}
            error={decisionError}
            onGenerate={generateDecision}
          />
        )}
        {screen === "brief" && decision && (
          <BriefScreen
            decision={decision}
            locale={locale}
            user={activeUser}
            onAskAgain={() => setScreen("ask")}
            onSave={saveDecision}
          />
        )}
        {screen === "brief" && !decision && (
          <AskScreen
            key={activeUser.id}
            locale={locale}
            user={activeUser}
            catalog={catalog}
            catalogLoading={catalogLoading}
            catalogError={catalogError}
            loading={loadingDecision}
            error={decisionError}
            onGenerate={generateDecision}
          />
        )}
        {screen === "memory" && (
          <MemoryScreen
            locale={locale}
            saved={saved}
            onOpen={() => setScreen("brief")}
          />
        )}

        <footer className="app-footer">
          <span>{t.footer}</span>
          <span>{t.demoMode}</span>
        </footer>
      </div>
    </div>
  );
}
