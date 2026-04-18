import Link from "next/link";
import type { CSSProperties } from "react";

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

const cardStyle: CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  backgroundColor: "rgba(255,255,255,0.65)",
  borderRadius: "24px",
  padding: "24px 24px",
};

const bodyStyle: CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.85,
  color: "#444",
  margin: 0,
};

export default function PlanPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/" style={backLinkStyle}>
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <div style={capsuleStyle}>PLAN</div>

        <h1 style={titleStyle}>Usage structure</h1>

        <p style={introStyle}>
          VIREKA Space is designed to remain accessible while allowing expanded
          usage when needed.
        </p>

        <section style={cardStyle}>
          <p style={bodyStyle}>
            Free access includes up to 20 interactions per day.
            <br />
            <br />
            When the daily limit is reached, usage becomes available again the
            following day.
            <br />
            <br />
            Users who require extended access may choose to subscribe.
            Subscription enables additional usage beyond the daily free limit.
            <br />
            <br />
            Plan structure may evolve as the service develops.
          </p>
        </section>
      </div>
    </main>
  );
}
