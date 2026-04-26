"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";
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
  margin: "0 0 1.25rem 0",
  fontSize: "0.95rem",
  lineHeight: 1.55,
  color: "rgba(0,0,0,0.55)",
  fontWeight: 450,
};

const inputStyle: CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  margin: "0 0 0.85rem 0",
  padding: "0.65rem 0.75rem",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "10px",
  backgroundColor: "rgba(255,255,255,0.95)",
  color: "#2f2b27",
  fontSize: "0.92rem",
  fontFamily: "inherit",
  outline: "none",
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
  cursor: "pointer",
  fontFamily: "inherit",
};

const primaryButtonDisabledStyle: CSSProperties = {
  ...primaryButtonStyle,
  cursor: "not-allowed",
  opacity: 0.6,
};

const errorTextStyle: CSSProperties = {
  margin: "0.65rem 0 0 0",
  fontSize: "0.85rem",
  lineHeight: 1.45,
  color: "#7a2e2e",
  fontWeight: 450,
};

const successTextStyle: CSSProperties = {
  margin: "0.75rem 0 0 0",
  fontSize: "0.95rem",
  lineHeight: 1.5,
  color: "rgba(0,0,0,0.6)",
  fontWeight: 450,
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

function getSafeInternalPath(raw: string | null | undefined): string {
  const fallback = "/plan";
  if (raw == null) return fallback;
  const trimmed = String(raw).trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  return trimmed;
}

function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (t.length < 3) return false;
  if (!t.includes("@")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

export default function SignInPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postAuthPath, setPostAuthPath] = useState("/plan");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setPostAuthPath(getSafeInternalPath(params.get("redirect")));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (status === "loading") return;
    setErrorMessage(null);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMessage(t.signIn.errorGeneric);
      setStatus("error");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage(t.signIn.errorGeneric);
      setStatus("error");
      return;
    }
    setStatus("loading");
    const origin = window.location.origin;
    const emailRedirectTo = `${origin}${postAuthPath}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setErrorMessage(t.signIn.errorGeneric);
      setStatus("error");
      return;
    }
    setStatus("success");
  }, [email, postAuthPath, status, t.signIn.errorGeneric]);

  const canSubmit = isValidEmail(email) && status !== "loading" && status !== "success";
  const isLoading = status === "loading";

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{t.header.signIn}</h1>
        <p style={introStyle}>{t.signIn.intro}</p>

        {status === "success" ? (
          <p style={successTextStyle} role="status">
            {t.signIn.success}
          </p>
        ) : (
          <>
            <label htmlFor="sign-in-email" style={{ display: "none" }}>
              {t.signIn.emailPlaceholder}
            </label>
            <input
              id="sign-in-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
                if (status === "error") setStatus("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
              disabled={isLoading}
              placeholder={t.signIn.emailPlaceholder}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => {
                void handleSubmit();
              }}
              disabled={!canSubmit}
              style={!canSubmit ? primaryButtonDisabledStyle : primaryButtonStyle}
            >
              {isLoading ? t.signIn.sending : t.signIn.continueWithEmail}
            </button>
            {errorMessage ? <p style={errorTextStyle}>{errorMessage}</p> : null}
            <p style={noteStyle}>{t.signIn.paidPlanNote}</p>
          </>
        )}

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
