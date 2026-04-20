"use client";

import React from 'react';
import { useLanguage } from '../lib/i18n/useLanguage';
import { SUPPORTED_LANGUAGES, Language } from '../lib/i18n/config';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        style={{
          appearance: 'none',
          border: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: '#ffffff',
          color: '#222',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 160ms ease, border-color 160ms ease',
          minWidth: '100px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
        }}
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
