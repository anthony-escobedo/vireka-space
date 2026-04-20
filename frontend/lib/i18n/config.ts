export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
} as const;

export type Language = keyof typeof SUPPORTED_LANGUAGES;
