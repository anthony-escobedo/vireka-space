"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StaticPageShell from "../../components/StaticPageShell";
import { getSupabaseClient } from "../../lib/supabaseClient";
import { useLanguage } from "../../lib/i18n/useLanguage";

const signInToPlan = () => "/sign-in?redirect=" + encodeURIComponent("/plan");

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
};

const sessionHintStyle: CSSProperties = {
  fontSize: "0.82rem",
  color: "rgba(0,0,0,0.42)",
  lineHeight: 1.45,
  margin: "0 0 1.15rem 0",
};

export default function PlanPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [sessionEmailHint, setSessionEmailHint] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const email = session?.user?.email;
        if (email) setSessionEmailHint(email);
      });
  }, []);

  const startProCheckout = useCallback(async () => {
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
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
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
  }, [router]);

  const tierCards: {
    key: string;
    tier: (typeof t.plan.tiers)["free"];
    variant: "free" | "pro" | "proPlus";
  }[] = [
    { key: "free", tier: t.plan.tiers.free, variant: "free" },
    { key: "pro", tier: t.plan.tiers.pro, variant: "pro" },
    { key: "proPlus", tier: t.plan.tiers.proPlus, variant: "proPlus" },
  ];

  return (
    <StaticPageShell title={t.plan.pageTitle} intro={t.plan.pageIntro}>
      {sessionEmailHint ? (
        <p style={sessionHintStyle}>{sessionEmailHint}</p>
      ) : null}
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
              <span style={actionStyle}>{tier.action}</span>
            ) : variant === "pro" ? (
              <button
                type="button"
                onClick={() => {
                  void startProCheckout();
                }}
                style={{
                  ...actionStyle,
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                {tier.action}
              </button>
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
