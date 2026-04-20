import { Language, DEFAULT_LANGUAGE } from "./config";

const STORAGE_KEY = "vireka_language";

export const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (
      stored === "en" ||
      stored === "es" ||
      stored === "pt"
    ) {
      return stored as Language;
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }

  return DEFAULT_LANGUAGE;
};

export const setStoredLanguage = (language: Language): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    console.warn("Failed to save language to localStorage:", error);
  }
};