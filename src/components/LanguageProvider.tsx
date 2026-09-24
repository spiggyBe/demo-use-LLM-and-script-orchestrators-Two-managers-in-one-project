"use client";

import { useEffect, useState } from "react";
import { LocaleContext, type Locale } from "@/lib/i18n";

const LOCALE_STORAGE_KEY = "test-orchestrator.locale.v1";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pl");

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "pl" || stored === "en") {
      // The locale is read once after hydration to avoid an SSR/client mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <div data-locale={locale}>{children}</div>
    </LocaleContext.Provider>
  );
}
