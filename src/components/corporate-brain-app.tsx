"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AskScreen } from "@/components/ask-screen";
import { BriefScreen } from "@/components/brief-screen";
import { MarkIcon } from "@/components/icons";
import { MemoryScreen } from "@/components/memory-screen";
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

function getServerLocaleSnapshot(): Locale {
  return "en";
}

function persistLocale(locale: Locale) {
  window.localStorage.setItem(localeStorageKey, locale);
  window.dispatchEvent(new Event(localeChangeEvent));
}

export function CorporateBrainApp() {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );
  const [screen, setScreen] = useState<Screen>("ask");
  const [saved, setSaved] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function saveDecision() {
    setSaved(true);
    setScreen("memory");
  }

  return (
    <div className="app-frame">
      <header className="app-header">
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

        <nav className="primary-nav" aria-label={t.navLabel}>
          <button
            type="button"
            className={screen === "ask" || screen === "brief" ? "active" : ""}
            onClick={() => setScreen("ask")}
          >
            {t.navAsk}
          </button>
          <button
            type="button"
            className={screen === "memory" ? "active" : ""}
            onClick={() => setScreen("memory")}
          >
            {t.navMemory}
            {saved && <span className="nav-notification" />}
          </button>
        </nav>

        <div className="header-tools">
          <span className="connection-status">
            <span className="status-dot" />
            {t.demoConnected}
          </span>
          <div className="language-switch" aria-label={t.languageLabel}>
            {(["en", "es"] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={locale === language}
                className={locale === language ? "active" : ""}
                onClick={() => persistLocale(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {screen === "ask" && (
        <AskScreen locale={locale} onGenerate={() => setScreen("brief")} />
      )}
      {screen === "brief" && (
        <BriefScreen
          locale={locale}
          onAskAgain={() => setScreen("ask")}
          onSave={saveDecision}
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
  );
}
