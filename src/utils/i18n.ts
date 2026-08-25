export type Language = 'ar' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'hi' | 'tr' | 'nl' | 'pl';

export interface PromptTemplate {
  label: string;
  text: string;
}

export interface Translation {
  title: string;
  subtitle: string;
  initVector: string;
  purge: string;
  placeholder: string;
  optStrategy: string;
  fastEnhance: string;
  aiEnhance: string;
  advancedParams: string;
  targetArch: string;
  personality: string;
  antiPrompt: string;
  excludePlaceholder: string;
  recentHistory: string;
  clearAll: string;
  inspiration: string;
  copyright: string;
  synthsizing: string;
  successFast: string;
  successAi: string;
  successRestore: string;
  copyPrompt: string;
  copied: string;
  edit: string;
  outputLog: string;
  optSeq: string;
  templates: PromptTemplate[];
  simple: string;
  advanced: string;
  expert: string;
  minimalist: string;
  balanced: string;
  surgical: string;
  simpleDesc: string;
  advancedDesc: string;
  expertDesc: string;
  minimalistDesc: string;
  balancedDesc: string;
  surgicalDesc: string;
  professional: string;
  creative: string;
  academic: string;
  concise: string;
  empathetic: string;
  humorous: string;
  direct: string;
  motivational: string;
  skeptical: string;
  teacher: string;
  technical: string;
  standard: string;
  markdown: string;
  xml: string;
  standardDesc: string;
  markdownDesc: string;
  xmlDesc: string;
  langName: string;
  important: string;
  respondIn: string;
  startEnhance: string;
  more: string;
  analysis: string;
  analysisGreat: string;
  settings: string;
  apiKey: string;
  apiKeyPlaceholder: string;
  apiKeyHint: string;
  apiKeyDesc: string;
  getKey: string;
  edgeErrorHint: string;
  save: string;
  clear: string;
  saveSuccess: string;
  clearSuccess: string;
  emptyKeyError: string;
  searchHistory: string;
  noResults: string;
  historyDeleted: string;
  detected: string;
  regenerate: string;
  download: string;
  less: string;
  chars: string;
  longPrompt: string;
}

import ar from "./translations/ar";
import en from "./translations/en";
import de from "./translations/de";
import es from "./translations/es";
import fr from "./translations/fr";
import it from "./translations/it";
import pt from "./translations/pt";
import ru from "./translations/ru";
import zh from "./translations/zh";
import ja from "./translations/ja";
import ko from "./translations/ko";
import hi from "./translations/hi";
import tr from "./translations/tr";
import nl from "./translations/nl";
import pl from "./translations/pl";

export const translations: Record<Language, Translation> = {
  ar, en, de, es, fr, it, pt, ru, zh, ja, ko, hi, tr, nl, pl,
};

export const isRTL = (lang: Language) => lang === 'ar';
