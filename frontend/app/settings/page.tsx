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

const sectionStyle: React.CSSProperties = {
  marginBottom: "24px",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  backgroundColor: "rgba(255,255,255,0.65)",
  borderRadius: "24px",
  padding: "24px 24px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  margin: "0 0 14px",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.8,
  color: "#444",
  margin: 0,
};

const listLinkStyle: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "#222",
  fontSize: "16px",
  padding: "14px 16px",
  borderRadius: "14px",
  marginBottom: "6px",
  backgroundColor: "transparent",
  border: "1px solid transparent",
};

export default function SettingsPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/" style={backLinkStyle}>
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <div style={capsuleStyle}>MENU</div>

        <h1 style={titleStyle}>Account, plan, and support</h1>

        <p style={introStyle}>
          Core account access, plan information, legal pages, and contact details.
        </p>

        <section id="account" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Account</h2>
          <div style={cardStyle}>
            <p style={bodyStyle}>
              Signed in with email.
              <br />
              Account details can remain minimal at this stage and expand only as
              needed.
            </p>
          </div>
        </section>

        <section id="plan" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Plan</h2>
          <div style={cardStyle}>
            <p style={bodyStyle}>
              Free plan currently active.
              <br />
              Extended usage becomes relevant only if the daily limit is reached.
            </p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Legal</h2>
          <div style={cardStyle}>
            <Link
              href="/privacy"
              style={listLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              style={listLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Terms
            </Link>
          </div>
        </section>

        <section id="contact" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Contact</h2>
          <div style={cardStyle}>
            <a
              href="mailto:admin@vireka.space"
              style={{
                ...bodyStyle,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                color: "#222",
              }}
            >
              admin@vireka.space
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
