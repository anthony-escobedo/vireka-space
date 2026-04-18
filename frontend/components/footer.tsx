import Link from "next/link";
import type { CSSProperties } from "react";

const footerStyle: CSSProperties = {
  marginTop: "80px",
  padding: "0 24px 40px",
};

const innerStyle: CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  borderTop: "1px solid #e7e5e4",
  paddingTop: "14px",
  flexWrap: "wrap",
};

const navStyle: CSSProperties = {
  display: "flex",
  gap: "18px",
};

const linkStyle: CSSProperties = {
  fontSize: "13px",
  color: "#6f6a64",
  textDecoration: "none",
};

const copyrightStyle: CSSProperties = {
  fontSize: "13px",
  color: "#9b948a",
};

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        
        <nav style={navStyle}>
          <Link href="/privacy" style={linkStyle}>
            Privacy
          </Link>

          <Link href="/terms" style={linkStyle}>
            Terms
          </Link>

          <Link href="/settings/contact" style={linkStyle}>
            Contact
          </Link>
        </nav>

        <div style={copyrightStyle}>
          © VIREKA Space
        </div>

      </div>
    </footer>
  );
}
