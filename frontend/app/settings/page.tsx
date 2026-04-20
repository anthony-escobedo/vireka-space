"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useLanguage } from "../../lib/i18n/useLanguage";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f7f7f2",
  width: "100%",
  color: "#111111",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const containerStyle: CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  padding: "40px 24px 90px",
};

const backLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  textDecoration: "none",
  color: "#555",
  fontSize: "16px",
  marginBottom: "18px",
};

const capsuleStyle: CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid #dfdfd7",
  backgroundColor: "#ffffff",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.08em",
  color: "#555",
  marginBottom: "24px",
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
  lineHeight: 1.02,
  letterSpacing: "-0.05em",
  fontWeight: 700,
  margin: "0 0 20px",
  maxWidth: "760px",
};

const introStyle: CSSProperties = {
  fontSize: "18px",
  lineHeight: 1.7,
  color: "#3f3f3f",
  marginBottom: "40px",
  maxWidth: "760px",
};

const sectionStyle: CSSProperties = {
  marginBottom: "24px",
};

const cardStyle: CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  backgroundColor: "rgba(255,255,255,0.65)",
  borderRadius: "24px",
  padding: "24px 24px",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "24px",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  margin: "0 0 14px",
};

const listLinkStyle: CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "#222",
  fontSize: "16px",
  padding: "14px 16px",
  borderRadius: "14px",
  marginBottom: "6px",
  backgroundColor: "transparent",
  border: "1px solid transparent",
  transition: "background-color 0.2s ease, border-color 0.2s ease",
};

export default function SettingsPage() {
  const { t } = useLanguage();
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/" style={backLinkStyle}>
          <span aria-hidden="true">←</span>
          <span>{t.settings.backToHome}</span>
        </Link>

        <div style={capsuleStyle}>{t.settings.badge}</div>

        <h1 style={titleStyle}>{t.settings.title}</h1>

        <p style={introStyle}>
          {t.settings.subtitle}
        </p>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t.settings.access}</h2>
          <div style={cardStyle}>
            <Link href="/settings/account" style={listLinkStyle}>
              {t.settings.account}
            </Link>

            <Link href="/settings/plan" style={listLinkStyle}>
              {t.settings.plan}
            </Link>

            <Link href="/settings/contact" style={listLinkStyle}>
              {t.settings.contact}
            </Link>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t.settings.legal}</h2>
          <div style={cardStyle}>
            <Link href="/privacy" style={listLinkStyle}>
              {t.settings.privacy}
            </Link>

            <Link href="/terms" style={listLinkStyle}>
              {t.settings.terms}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
