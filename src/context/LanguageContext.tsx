import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLang, LanguageOption } from '../types';
import { LANGUAGES, UI_TRANSLATIONS, TranslationKey, t as translateFn } from '../i18n/translations';

interface LanguageContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  languages: LanguageOption[];
}

const STORAGE_LANG_KEY = 'nichinan_selected_lang';

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ja',
  setLang: () => {},
  t: (key, params) => translateFn('ja', key, params),
  languages: LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as SupportedLang | null;
      if (saved && ['ja', 'en', 'zh', 'ko'].includes(saved)) {
        return saved;
      }
      // If no saved preference, try detecting browser language
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('zh')) return 'zh';
      if (navLang.startsWith('ko')) return 'ko';
      if (navLang.startsWith('en')) return 'en';
      return 'ja';
    } catch {
      return 'ja';
    }
  });

  const setLang = (newLang: SupportedLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return translateFn(lang, key, params);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  return useContext(LanguageContext);
}
