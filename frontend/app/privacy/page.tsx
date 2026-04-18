import Link from "next/link";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f7f7f2",
  width: "100%",
  color: "#111111",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const containerStyle: React.CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  padding: "40px 24px 90px",
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  textDecoration: "none",
  color: "#555",
  fontSize: "16px",
  marginBottom: "36px",
};

const capsuleStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid #dfdfd7",
  backgroundColor: "#ffffff",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.03em",
  color: "#555",
  marginBottom: "24px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(2rem, 4vw, 3.2rem)",
  lineHeight: 1.08,
  letterSpacing: "-0.03em",
  fontWeight: 700,
  margin: "0 0 18px",
};

const introStyle: React.CSSProperties = {
  fontSize: "19px",
  lineHeight: 1.75,
  color: "#3f3f3f",
  marginBottom: "42px",
  maxWidth: "760px",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  backgroundColor: "rgba(255,255,255,0.65)",
  borderRadius: "24px",
  padding: "24px 24px",
  marginBottom: "18px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  margin: "0 0 14px",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.85,
  color: "#444",
  margin: 0,
};

export default function PrivacyPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/" style={backLinkStyle}>
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <div style={capsuleStyle}>PRIVACY</div>

        <h1 style={titleStyle}>How information is handled in VIREKA Space</h1>

        <p style={introStyle}>
          This page explains how information is handled when using the service.
        </p>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Introduction</h2>
          <p style={bodyStyle}>
            This page describes how information is handled when using VIREKA Space.
            <br />
            <br />
            VIREKA Space provides a structured environment for clarifying how
            situations are being understood before decisions are made or AI prompts
            are written. The service processes text provided by users in order to
            generate structured interpretive output.
            <br />
            <br />
            The goal of this policy is to explain what information is involved in
            that process and how it is handled.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Information provided by users</h2>
          <p style={bodyStyle}>
            Users may provide text describing situations, interpretations, or AI
            interactions.
            <br />
            <br />
            This information is processed for the purpose of generating structured
            clarification output.
            <br />
            <br />
            Users should avoid including sensitive personal information unless it
            is necessary for the situation being described.
            <br />
            <br />
            Information is used only to support the functioning of the service.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Technical information</h2>
          <p style={bodyStyle}>
            Basic technical information may be collected to maintain service
            reliability and performance.
            <br />
            <br />
            This may include information such as interaction timing, system logs,
            or usage counts necessary to operate and improve the service.
            <br />
            <br />
            This information is used in aggregated form where possible.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>How information is used</h2>
          <p style={bodyStyle}>
            Information provided through the service is used to generate structured
            interpretive responses, maintain system functionality, improve clarity
            and reliability, and understand general patterns of usage.
            <br />
            <br />
            Information is not sold to third parties.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>AI processing</h2>
          <p style={bodyStyle}>
            User input may be processed by AI systems in order to produce
            structured output.
            <br />
            <br />
            Processing is performed solely for the purpose of providing the
            VIREKA Space service.
            <br />
            <br />
            Inputs are not treated as public content.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Data storage and third-party services</h2>
          <p style={bodyStyle}>
            Information may be stored as required to operate the service, maintain
            stability, and improve performance.
            <br />
            <br />
            Storage practices may evolve as the system develops.
            <br />
            <br />
            VIREKA Space may rely on infrastructure and processing providers in
            order to operate. These providers may process information as necessary
            to support system functionality.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>User control and updates</h2>
          <p style={bodyStyle}>
            Users control what information they choose to provide and may avoid
            including identifying details where not necessary.
            <br />
            <br />
            Use of the service is voluntary, and users may discontinue use at any
            time.
            <br />
            <br />
            This Privacy Policy may be updated periodically to reflect improvements
            or changes to the service.
          </p>
        </section>
      </div>
    </main>
  );
}
