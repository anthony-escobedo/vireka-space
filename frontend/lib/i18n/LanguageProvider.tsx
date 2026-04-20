"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LanguageContextType } from './types';
import { DEFAULT_LANGUAGE, Language } from './config';
import { getStoredLanguage, setStoredLanguage } from './storage';
import { getDictionary } from './dictionaries';

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

LanguageContext.displayName = 'LanguageContext';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [dictionary, setDictionary] = useState(() => getDictionary(DEFAULT_LANGUAGE));

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage !== language) {
      setLanguageState(storedLanguage);
      setDictionary(getDictionary(storedLanguage));
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setDictionary(getDictionary(newLanguage));
    setStoredLanguage(newLanguage);
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: dictionary,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
