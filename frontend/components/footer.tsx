import Link from "next/link";
import type { CSSProperties } from "react";
import { useLanguage } from "../lib/i18n/useLanguage";

const footerStyle: CSSProperties = {
  marginTop: "24px",
  padding: "0 24px 24px",
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
  const { t } = useLanguage();
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        
        <nav style={navStyle}>
          <Link href="/privacy" style={linkStyle}>
            {t.footer.privacy}
          </Link>

          <Link href="/terms" style={linkStyle}>
            {t.footer.terms}
          </Link>

          <Link href="/settings/contact" style={linkStyle}>
            {t.footer.contact}
          </Link>
        </nav>

        <div style={copyrightStyle}>
          {t.footer.copyright}
        </div>

      </div>
    </footer>
  );
}
