"use client";

import React from 'react';
import { useLanguage } from '../lib/i18n/useLanguage';
import { Language } from '../lib/i18n/config';

const FLAG_URLS: Record<Language, string> = {
  en: 'https://flagcdn.com/w40/gb.png',
  pt: 'https://flagcdn.com/w40/br.png',
  es: 'https://flagcdn.com/w40/es.png',
};

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  pt: 'Portuguese',
  es: 'Spanish',
};

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [hoveredLanguage, setHoveredLanguage] = React.useState<Language | null>(null);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {(['en', 'pt', 'es'] as Language[]).map((code) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-label={`Switch language to ${LANGUAGE_LABELS[code]}`}
            title={LANGUAGE_LABELS[code]}
            style={{
              appearance: 'none',
              border: isActive ? '1px solid rgba(0,0,0,0.22)' : '1px solid rgba(0,0,0,0.1)',
              backgroundColor: isActive ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.7)',
              borderRadius: '6px',
              width: '28px',
              height: '20px',
              padding: '2px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
              opacity: hoveredLanguage && hoveredLanguage !== code ? 0.82 : isActive ? 1 : 0.92,
              transform: hoveredLanguage === code ? 'translateY(-0.5px)' : 'none',
            }}
            onMouseEnter={() => {
              setHoveredLanguage(code);
            }}
            onMouseLeave={() => {
              setHoveredLanguage(null);
            }}
            onFocus={() => setHoveredLanguage(code)}
            onBlur={() => setHoveredLanguage(null)}
          >
            <img
              aria-hidden
              src={FLAG_URLS[code]}
              alt=""
              loading="lazy"
              decoding="async"
              style={{
                width: '22px',
                height: '14px',
                borderRadius: '2.5px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
