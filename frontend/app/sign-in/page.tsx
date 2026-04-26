"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useLanguage } from "../../lib/i18n/useLanguage";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  backgroundColor: "#f5f3ef",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  color: "#111",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.5rem 1.25rem",
  paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: "18px",
  padding: "2rem 1.75rem 1.75rem",
  boxSizing: "border-box",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const titleStyle: CSSProperties = {
  margin: "0 0 0.65rem 0",
  fontSize: "clamp(1.35rem, 3.5vw, 1.6rem)",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#1f1d1a",
  lineHeight: 1.2,
};

const introStyle: CSSProperties = {
  margin: "0 0 1.5rem 0",
  fontSize: "0.95rem",
  lineHeight: 1.55,
  color: "rgba(0,0,0,0.55)",
  fontWeight: 450,
};

const primaryButtonStyle: CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  margin: 0,
  padding: "0.7rem 1rem",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.9)",
  color: "#2f2b27",
  fontSize: "0.9rem",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  cursor: "not-allowed",
  opacity: 0.9,
  fontFamily: "inherit",
};

const noteStyle: CSSProperties = {
  margin: "1.1rem 0 0 0",
  fontSize: "0.75rem",
  lineHeight: 1.5,
  color: "rgba(0,0,0,0.4)",
  fontWeight: 400,
};

const backButtonStyle: CSSProperties = {
  display: "inline",
  margin: 0,
  padding: 0,
  border: "none",
  background: "none",
  color: "rgba(0,0,0,0.45)",
  fontSize: "0.86rem",
  fontWeight: 450,
  cursor: "pointer",
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  textDecorationColor: "rgba(0,0,0,0.2)",
  fontFamily: "inherit",
};

const backWrapStyle: CSSProperties = {
  marginTop: "1.5rem",
  textAlign: "center" as const,
};

export default function SignInPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{t.header.signIn}</h1>
        <p style={introStyle}>{t.signIn.intro}</p>
        <button type="button" style={primaryButtonStyle} disabled>
          {t.signIn.continueWithEmail}
        </button>
        <p style={noteStyle}>{t.signIn.paidPlanNote}</p>
        <div style={backWrapStyle}>
          <button
            type="button"
            style={backButtonStyle}
            onClick={() => {
              router.push("/");
            }}
          >
            {t.settings.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
}
