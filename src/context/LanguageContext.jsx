import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, languageCodes, translations } from '../translations';

const STORAGE_KEY = 'al-thamaniya:lang';

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && languageCodes.includes(stored)) return stored;
    const browser = (window.navigator.language || '').slice(0, 2).toLowerCase();
    if (languageCodes.includes(browser)) return browser;
  } catch {
    /* localStorage indisponivel (modo privado, por exemplo) */
  }
  return DEFAULT_LANGUAGE;
}

/** Le uma chave aninhada: t('nav.home'). Devolve a propria chave se nao existir. */
function resolve(dictionary, path) {
  const value = path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), dictionary);
  return value === undefined || value === null ? path : value;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() =>
    typeof window === 'undefined' ? DEFAULT_LANGUAGE : readStoredLanguage(),
  );

  const dictionary = translations[language] ?? translations[DEFAULT_LANGUAGE];
  const dir = dictionary.meta.dir;

  useEffect(() => {
    const root = document.documentElement;
    root.lang = dictionary.meta.htmlLang;
    root.dir = dir;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignorado */
    }
  }, [language, dir, dictionary.meta.htmlLang]);

  const setLanguage = useCallback((code) => {
    setLanguageState(languageCodes.includes(code) ? code : DEFAULT_LANGUAGE);
  }, []);

  const t = useCallback((path) => resolve(dictionary, path), [dictionary]);

  /**
   * Campos dos integrantes aceitam string simples ou objeto { pt, en, ar }.
   * Isso mantem a estrutura de members.js legivel e ainda assim multilingue.
   */
  const localize = useCallback(
    (field) => {
      if (field == null) return '';
      if (typeof field === 'string') return field;
      if (Array.isArray(field)) return field;
      return field[language] ?? field[DEFAULT_LANGUAGE] ?? field.en ?? '';
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, localize, dir, isRTL: dir === 'rtl', languageCodes, translations }),
    [language, setLanguage, t, localize, dir],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage precisa estar dentro de <LanguageProvider>.');
  return ctx;
}

export default LanguageContext;
