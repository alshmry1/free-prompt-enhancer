import { useEffect, useState } from "react";
import { Language } from "@/utils/i18n";

const STORAGE_KEY = "ui_lang";
const LANG_EVENT = "ui-language-change";

export const getStoredLanguage = (): Language => {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Language) || "ar";
  } catch {
    return "ar";
  }
};

export const setStoredLanguage = (lang: Language) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage unavailable — still notify listeners
  }
  window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: lang }));
};

/**
 * Reactive UI language shared across the app (page, dialogs, toasts).
 * Persists the choice to localStorage and stays in sync via a custom event,
 * so portaled components like Sonner can react to language switches.
 */
export const useUiLanguage = (): [Language, (lang: Language) => void] => {
  const [lang, setLang] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    const handler = (e: Event) => setLang((e as CustomEvent).detail);
    window.addEventListener(LANG_EVENT, handler);
    return () => window.removeEventListener(LANG_EVENT, handler);
  }, []);

  return [lang, setStoredLanguage];
};