"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { AuthError } from "@supabase/supabase-js";
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

const RATE_LIMIT_OTP_MESSAGE =
  "Too many sign-in emails were requested. Please wait and try again.";

const OTP_COOLDOWN_MS = 90_000;
const OTP_COOLDOWN_STORAGE = "vireka_signin_otp_cooldown";
const OTP_COOLDOWN_WAIT =
  "Please wait before requesting another sign-in link.";

type OtpCooldownRecord = { email: string; until: number };

function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (t.length < 3) return false;
  if (!t.includes("@")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function readOtpCooldownRecord(): OtpCooldownRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(OTP_COOLDOWN_STORAGE);
    if (!raw) return null;
    const rec = JSON.parse(raw) as OtpCooldownRecord;
    if (typeof rec?.email === "string" && typeof rec?.until === "number") {
      return rec;
    }
    return null;
  } catch {
    return null;
  }
}

function getRemainingOtpCooldownMsForEmail(email: string): number {
  if (!isValidEmail(email)) return 0;
  const normalized = email.trim().toLowerCase();
  const rec = readOtpCooldownRecord();
  if (!rec || rec.email !== normalized) return 0;
  return Math.max(0, rec.until - Date.now());
}

function setOtpCooldownForEmail(email: string): void {
  if (typeof window === "undefined" || !isValidEmail(email)) return;
  const normalized = email.trim().toLowerCase();
  const rec: OtpCooldownRecord = {
    email: normalized,
    until: Date.now() + OTP_COOLDOWN_MS,
  };
  sessionStorage.setItem(OTP_COOLDOWN_STORAGE, JSON.stringify(rec));
}

function formatCountdownMs(ms: number): string {
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/**
 * Post–magic-link landing path. Use `?redirect=/...` (relative) when present; otherwise `/clarify`.
 * `emailRedirectTo` in signInWithOtp = `${window.location.origin}` + this path.
 */
function getSafeRedirectPath(): string {
  const redirectParam = new URLSearchParams(window.location.search).get(
    "redirect"
  );
  return redirectParam && redirectParam.startsWith("/") ? redirectParam : "/clarify";
}

function getAuthRedirectTo(): string {
  return `${window.location.origin}${getSafeRedirectPath()}`;
}

function emailDomainForLog(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.lastIndexOf("@");
  if (at < 1 || at === trimmed.length - 1) return "(invalid-or-missing)";
  return trimmed.slice(at + 1).toLowerCase();
}

function getAuthErrorFields(error: unknown): {
  message: string;
  name?: string;
  code?: string;
  status?: number;
} {
  const e = error as AuthError & { statusCode?: number };
  return {
    message: e?.message ?? String(error),
    name: e?.name,
    code: typeof (e as { code?: string }).code === "string"
      ? (e as { code: string }).code
      : undefined,
    status: (e as { status?: number }).status ?? e?.statusCode,
  };
}

function logSignInOtpFailure(
  error: unknown,
  emailForDomain: string,
  emailRedirectTo: string
): void {
  const f = getAuthErrorFields(error);
  console.error("[sign-in] signInWithOtp failed", {
    message: f.message,
    name: f.name,
    code: f.code,
    status: f.status,
    emailRedirectTo,
    emailDomain: emailDomainForLog(emailForDomain),
  });
}

/**
 * When safe, prefer specific or server-provided text over a single generic string.
 */
function userFacingOtpError(
  error: unknown,
  couldNotSendLink: string
): string {
  if (isOtpRateLimited(error as { status?: number; message?: string; code?: string })) {
    return RATE_LIMIT_OTP_MESSAGE;
  }
  const f = getAuthErrorFields(error);
  const msg = (f.message || "").toLowerCase();
  const code = (f.code || "").toLowerCase();

  if (f.status === 403 || msg.includes("forbidden") || code.includes("not_allowed") || code === "action_disabled") {
    return "This sign-in action is not allowed. Check the app’s Supabase email settings, or try again later.";
  }
  if (msg.includes("redirect") && (msg.includes("url") || msg.includes("invalid"))) {
    return "The sign-in redirect URL is not allowed. Ask the app operator to add this site’s URL in Supabase Auth redirect settings.";
  }
  if (msg.includes("signups not allowed") || code === "signup_disabled") {
    return "New sign-ups are disabled. Use an account that already exists, or contact support.";
  }
  if (msg.includes("email") && (msg.includes("invalid") || code.includes("invalid_email"))) {
    return "This email address could not be used. Check the address and try again.";
  }
  if (
    msg.includes("network") ||
    msg.includes("fetch") ||
    msg.includes("failed to fetch") ||
    msg.includes("load failed")
  ) {
    return "Could not reach the sign-in service. Check your network and try again.";
  }
  if (msg.length > 0 && msg.length < 280) {
    if (
      /https?:\/\//i.test(f.message) ||
      /[a-z0-9]{8}-[a-z0-9]{4}/i.test(f.message)
    ) {
      return couldNotSendLink;
    }
    return f.message;
  }
  return couldNotSendLink;
}

function isOtpRateLimited(
  error: { status?: number; message?: string; code?: string } | null
): boolean {
  if (!error) return false;
  if (error.status === 429) return true;
  const c = (error.code ?? "").toLowerCase();
  if (
    c === "over_email_send_rate_limit" ||
    c.startsWith("over_email")
  ) {
    return true;
  }
  const m = (error.message ?? "").toLowerCase();
  if (m.includes("rate limit")) return true;
  if (m.includes("too many")) return true;
  if (m.includes("email") && m.includes("send") && (m.includes("rate") || m.includes("over"))) {
    return true;
  }
  if (m.includes("over_email")) return true;
  return false;
}

export default function SignInPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);

  useEffect(() => {
    if (status === "success") return;
    const tick = () => {
      setCooldownMs(getRemainingOtpCooldownMsForEmail(email));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [email, status]);

  const handleSubmit = useCallback(async () => {
    if (status === "loading") return;
    if (isValidEmail(email) && getRemainingOtpCooldownMsForEmail(email) > 0) {
      setErrorMessage(OTP_COOLDOWN_WAIT);
      setStatus("error");
      return;
    }
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
    const emailRedirectTo = getAuthRedirectTo();
    const emailTrim = email.trim();

    const { error } = await supabase.auth.signInWithOtp({
      email: emailTrim,
      options: {
        emailRedirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      logSignInOtpFailure(error, emailTrim, emailRedirectTo);
      setErrorMessage(
        userFacingOtpError(error, t.signIn.couldNotSendLink)
      );
      setStatus("error");
      return;
    }
    setOtpCooldownForEmail(email);
    setStatus("success");
    setCooldownMs(getRemainingOtpCooldownMsForEmail(email));
  }, [email, status, t.signIn.couldNotSendLink, t.signIn.errorGeneric]);

  const remainingCooldown = cooldownMs;
  const canSubmit =
    isValidEmail(email) &&
    status !== "loading" &&
    status !== "success" &&
    remainingCooldown === 0;
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
              disabled={isLoading || remainingCooldown > 0}
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
              {isLoading
                ? t.signIn.sending
                : remainingCooldown > 0
                  ? "Wait to send again"
                  : t.signIn.continueWithEmail}
            </button>
            {remainingCooldown > 0 && !isLoading ? (
              <p
                style={{
                  margin: "0.4rem 0 0 0",
                  fontSize: "0.8rem",
                  lineHeight: 1.4,
                  color: "rgba(0,0,0,0.5)",
                }}
              >
                You can request another sign-in link in {formatCountdownMs(remainingCooldown)}.
              </p>
            ) : null}
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
