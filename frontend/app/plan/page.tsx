"use client";

import type { CSSProperties } from "react";
import StaticPageShell from "../../components/StaticPageShell";
import { useLanguage } from "../../lib/i18n/useLanguage";

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

export default function PlanPage() {
  const { t } = useLanguage();
  const tiers = [t.plan.tiers.free, t.plan.tiers.pro, t.plan.tiers.proPlus];

  return (
    <StaticPageShell title={t.plan.pageTitle} intro={t.plan.pageIntro}>
      <section style={gridStyle}>
        {tiers.map((tier) => (
          <article key={tier.name} style={cardStyle}>
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
            <span style={actionStyle}>{tier.action}</span>
          </article>
        ))}
      </section>
    </StaticPageShell>
  );
}
