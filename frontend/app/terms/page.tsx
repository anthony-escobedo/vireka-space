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

export default function TermsPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/" style={backLinkStyle}>
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <div style={capsuleStyle}>TERMS</div>

        <h1 style={titleStyle}>Conditions of use for VIREKA Space</h1>

        <p style={introStyle}>
          These Terms govern the use of the service and clarify its role, limits,
          and user responsibility.
        </p>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Introduction</h2>
          <p style={bodyStyle}>
            These Terms govern the use of VIREKA Space.
            <br />
            <br />
            VIREKA Space provides a structured environment for clarifying how
            situations are being understood before decisions are made or AI
            prompts are written. By accessing or using the service, you agree to
            these Terms. If you do not agree, please do not use the service.
            <br />
            <br />
            These Terms are intended to establish clarity regarding the nature of
            the service, appropriate use, and the responsibilities of both the
            user and the service provider.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Use of the service</h2>
          <p style={bodyStyle}>
            VIREKA Space may be used to explore how situations are interpreted,
            including identifying what appears to be happening, what may be
            assumed, and what may remain unclear.
            <br />
            <br />
            The service is provided for informational and interpretive support
            purposes only.
            <br />
            <br />
            Use of the service does not create a professional relationship of any
            kind.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Nature of the service</h2>
          <p style={bodyStyle}>
            VIREKA Space does not provide medical, psychological, legal,
            financial, or other professional advice.
            <br />
            <br />
            The service does not diagnose, treat, or resolve personal, emotional,
            relational, or technical problems. It is designed only to help
            clarify how a situation is being understood.
            <br />
            <br />
            Any decision, action, interpretation, or reliance based on the use of
            the service remains the sole responsibility of the user.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>User responsibility</h2>
          <p style={bodyStyle}>
            Users are responsible for how they use the service and for any
            actions taken after using it.
            <br />
            <br />
            Users should exercise judgment and seek qualified professional
            guidance where needed.
            <br />
            <br />
            The service should not be used as a substitute for professional care,
            crisis support, emergency assistance, or expert evaluation.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Availability, warranties, and liability</h2>
          <p style={bodyStyle}>
            VIREKA Space may be updated, modified, suspended, or discontinued at
            any time, with or without notice.
            <br />
            <br />
            The service is provided on an “as is” and “as available” basis,
            without warranties of any kind, express or implied.
            <br />
            <br />
            To the fullest extent permitted by law, VIREKA Space and its operator
            shall not be liable for damages arising from or related to the use of,
            or inability to use, the service.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Intellectual property and updates</h2>
          <p style={bodyStyle}>
            The design, structure, branding, and original content of VIREKA Space
            are protected by applicable intellectual property laws.
            <br />
            <br />
            These Terms may be updated from time to time. Continued use of the
            service after changes are posted constitutes acceptance of the revised
            Terms.
          </p>
        </section>
      </div>
    </main>
  );
}
