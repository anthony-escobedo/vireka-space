"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StaticPageShell from "../../components/StaticPageShell";
import type { PlanId } from "../../lib/plans";
import { getSupabaseClient } from "../../lib/supabaseClient";
import { useLanguage } from "../../lib/i18n/useLanguage";

const signInToPlan = () =>
  "/sign-in?redirect=" + encodeURIComponent("/plan");

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "1rem",
};

const cardStyle: CSSProperties = {
  display: "flex",
  minHeight: "260px",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "1.5rem",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: "16px",
  backgroundColor: "rgba(255,255,255,0.58)",
  padding: "1.35rem 1.2rem",
  boxSizing: "border-box",
};

const tierNameStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  fontWeight: 650,
  color: "#24201c",
};

const featureListStyle: CSSProperties = {
  display: "grid",
  gap: "0.7rem",
  margin: "1.1rem 0 0 0",
  padding: 0,
  listStyle: "none",
};

const featureStyle: CSSProperties = {
  fontSize: "0.92rem",
  lineHeight: 1.45,
  color: "#4f4942",
};

const actionStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "flex-start",
  minHeight: "2rem",
  borderRadius: "999px",
  border: "1px solid rgba(0,0,0,0.08)",
  backgroundColor: "rgba(250,248,244,0.72)",
  padding: "0.35rem 0.75rem",
  color: "#312d28",
  fontSize: "0.86rem",
  lineHeight: 1.4,
  fontWeight: 500,
};

const proPlusInactiveStyle: CSSProperties = {
  ...actionStyle,
  opacity: 0.55,
  cursor: "not-allowed",
  pointerEvents: "none",
  userSelect: "none",
};

const proCurrentAccessDisabledStyle: CSSProperties = {
  ...actionStyle,
  cursor: "not-allowed",
  opacity: 0.8,
  border: "1px solid rgba(0,0,0,0.06)",
  backgroundColor: "rgba(250,248,244,0.5)",
  color: "rgba(55, 50, 45, 0.72)",
  pointerEvents: "none",
};

const freeTierInactiveActionStyle: CSSProperties = {
  ...actionStyle,
  opacity: 0.4,
  border: "1px solid rgba(0,0,0,0.05)",
  backgroundColor: "rgba(250,248,244,0.35)",
  color: "rgba(55, 50, 45, 0.45)",
  fontWeight: 500,
  pointerEvents: "none",
};

const planStatusWrapStyle: CSSProperties = {
  margin: "0 0 1.2rem 0",
  padding: "0.9rem 1.05rem",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.045)",
  backgroundColor: "rgba(255,255,255,0.36)",
  maxWidth: "100%",
  boxSizing: "border-box",
};

const planStatusRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(7rem, 9.5rem) 1fr",
  columnGap: "0.75rem",
  rowGap: "0.2rem",
  alignItems: "baseline",
  fontSize: "0.86rem",
  lineHeight: 1.45,
  color: "rgba(55, 50, 45, 0.88)",
  marginBottom: "0.55rem",
};

const planStatusRowLastStyle: CSSProperties = {
  ...planStatusRowStyle,
  marginBottom: 0,
};

const planStatusLabelStyle: CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.02em",
  color: "rgba(0,0,0,0.42)",
};

const planStatusValueStyle: CSSProperties = {
  fontWeight: 500,
  color: "rgba(32, 29, 26, 0.9)",
};

const planStatusSubscriptionValueWrap: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.2rem",
};

const planStatusRenewsHintStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  lineHeight: 1.4,
  fontWeight: 400,
  color: "rgba(0, 0, 0, 0.4)",
};

type RemotePlanStatus = {
  plan: PlanId;
  dailyLimit: number;
  hasFullHistory: boolean;
  status?: string;
  /** If present, renewal hint is hidden (e.g. when a specific renewal/period is shown). */
  currentPeriodEnd?: string;
};

function planDisplayName(
  plan: PlanId,
  tiers: { free: { name: string }; pro: { name: string }; proPlus: { name: string } }
): string {
  if (plan === "pro") return tiers.pro.name;
  if (plan === "pro_plus") return tiers.proPlus.name;
  return tiers.free.name;
}

function formatSubscriptionStatus(
  raw: string | undefined,
  noSubLabel: string
): string {
  if (raw === undefined || raw === "") return noSubLabel;
  const s = String(raw);
  if (s.length === 0) return noSubLabel;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isActiveOrTrialingStatus(raw: string | undefined): boolean {
  if (raw === undefined || raw === "") return false;
  const s = String(raw).trim().toLowerCase();
  return s === "active" || s === "trialing";
}

export default function PlanPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [statusLoading, setStatusLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [remoteStatus, setRemoteStatus] = useState<RemotePlanStatus | null>(
    null
  );

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setSignedIn(false);
      setRemoteStatus(null);
      return;
    }
    const loadStatus = () => {
      void (async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setSignedIn(false);
          setRemoteStatus(null);
          setStatusLoading(false);
          return;
        }
        setSignedIn(true);
        setStatusLoading(true);
        try {
          const res = await fetch("/api/plan/status", {
            method: "GET",
            headers: { Authorization: `Bearer ${session.access_token}` },
            cache: "no-store",
          });
          if (!res.ok) {
            setRemoteStatus(null);
            return;
          }
          const data = (await res.json()) as RemotePlanStatus;
          setRemoteStatus(data);
        } catch {
          setRemoteStatus(null);
        } finally {
          setStatusLoading(false);
        }
      })();
    };
    loadStatus();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadStatus();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const startProCheckout = useCallback(
    async (currentPlan: PlanId) => {
    if (currentPlan === "pro" || currentPlan === "pro_plus") {
      return;
    }
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        router.push(signInToPlan());
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push(signInToPlan());
        return;
      }
      const userEmail = session.user?.email;
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(userEmail ? { email: userEmail } : {}),
      });
      if (res.status === 401) {
        router.push(signInToPlan());
        return;
      }
      if (!res.ok) {
        window.alert(
          "Checkout could not be started. Please try again or check that billing is configured."
        );
        return;
      }
      const data = (await res.json()) as { url?: string | null };
      if (data?.url) {
        window.location.href = data.url;
      } else {
        window.alert("Checkout could not be started. Please try again.");
      }
    } catch {
      window.alert("Checkout could not be started. Please try again.");
    }
  },
  [router]
  );

  const tierCards: {
    key: string;
    tier: (typeof t.plan.tiers)["free"];
    variant: "free" | "pro" | "proPlus";
  }[] = [
    { key: "free", tier: t.plan.tiers.free, variant: "free" },
    { key: "pro", tier: t.plan.tiers.pro, variant: "pro" },
    { key: "proPlus", tier: t.plan.tiers.proPlus, variant: "proPlus" },
  ];

  const s = t.plan.statusSection;
  const accessForDisplay: RemotePlanStatus = remoteStatus ?? {
    plan: "free",
    dailyLimit: 10,
    hasFullHistory: false,
  };
  const planId = accessForDisplay.plan;
  const isFreePlan = planId === "free";
  const isProPlan = planId === "pro";
  const isProPlusPlan = planId === "pro_plus";
  const showRenewsHint =
    Boolean(accessForDisplay.status) &&
    isActiveOrTrialingStatus(accessForDisplay.status) &&
    !accessForDisplay.currentPeriodEnd;
  const historyLabelValue = accessForDisplay.hasFullHistory
    ? s.historyFull
    : s.historyLimited;

  return (
    <StaticPageShell title={t.plan.pageTitle} intro={t.plan.pageIntro}>
      <div style={planStatusWrapStyle} aria-live="polite">
        {statusLoading && signedIn ? (
          <p
            style={{
              ...planStatusValueStyle,
              margin: 0,
              fontSize: "0.86rem",
            }}
          >
            {s.loading}
          </p>
        ) : !signedIn ? (
          <>
            <div style={planStatusRowStyle}>
              <span style={planStatusLabelStyle}>{s.currentAccess}</span>
              <span style={planStatusValueStyle}>
                {planDisplayName("free", t.plan.tiers)}
              </span>
            </div>
            <div style={planStatusRowStyle}>
              <span style={planStatusLabelStyle}>{s.dailyInteractions}</span>
              <span style={planStatusValueStyle}>
                10 {s.perDay}
              </span>
            </div>
            <div style={planStatusRowLastStyle}>
              <span style={planStatusLabelStyle}>{s.history}</span>
              <span style={planStatusValueStyle}>{s.historyLimited}</span>
            </div>
          </>
        ) : (
          <>
            <div style={planStatusRowStyle}>
              <span style={planStatusLabelStyle}>{s.currentAccess}</span>
              <span style={planStatusValueStyle}>
                {planDisplayName(accessForDisplay.plan, t.plan.tiers)}
              </span>
            </div>
            <div style={planStatusRowStyle}>
              <span style={planStatusLabelStyle}>{s.subscription}</span>
              <div style={planStatusSubscriptionValueWrap}>
                <span style={planStatusValueStyle}>
                  {formatSubscriptionStatus(
                    accessForDisplay.status,
                    s.noActiveSubscription
                  )}
                </span>
                {showRenewsHint ? (
                  <p style={planStatusRenewsHintStyle}>
                    {s.renewsAutomatically}
                  </p>
                ) : null}
              </div>
            </div>
            <div style={planStatusRowStyle}>
              <span style={planStatusLabelStyle}>{s.dailyInteractions}</span>
              <span style={planStatusValueStyle}>
                {accessForDisplay.dailyLimit} {s.perDay}
              </span>
            </div>
            <div style={planStatusRowLastStyle}>
              <span style={planStatusLabelStyle}>{s.history}</span>
              <span style={planStatusValueStyle}>{historyLabelValue}</span>
            </div>
          </>
        )}
      </div>
      <section style={gridStyle}>
        {tierCards.map(({ key, tier, variant }) => (
          <article key={key} style={cardStyle}>
            <div>
              <h2 style={tierNameStyle}>{tier.name}</h2>
              <ul style={featureListStyle}>
                {tier.features.map((feature) => (
                  <li key={feature} style={featureStyle}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {variant === "free" ? (
              isFreePlan ? (
                <span style={actionStyle}>{tier.action}</span>
              ) : (
                <span
                  style={freeTierInactiveActionStyle}
                  aria-hidden
                >
                  —
                </span>
              )
            ) : variant === "pro" ? (
              signedIn && statusLoading ? (
                <span style={actionStyle}>{s.loading}</span>
              ) : isProPlan ? (
                <button
                  type="button"
                  disabled
                  tabIndex={-1}
                  aria-disabled="true"
                  style={{
                    ...proCurrentAccessDisabledStyle,
                    font: "inherit",
                  }}
                >
                  {s.currentAccess}
                </button>
              ) : isProPlusPlan ? (
                <span
                  style={proPlusInactiveStyle}
                  aria-hidden
                >
                  {t.plan.notCurrentFreeTier}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void startProCheckout(planId);
                  }}
                  style={{
                    ...actionStyle,
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  {tier.action}
                </button>
              )
            ) : (
              <span
                style={proPlusInactiveStyle}
                aria-disabled
              >
                {tier.action}
              </span>
            )}
          </article>
        ))}
      </section>
    </StaticPageShell>
  );
}
