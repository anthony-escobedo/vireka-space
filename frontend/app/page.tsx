"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f5f3ef",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  color: "#111",
  boxSizing: "border-box",
};

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 1.5rem",
  maxWidth: "900px",
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
};

const brandStyle: CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: "#2f2b27",
};

const navLinksStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1.25rem",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const navLinkStyle: CSSProperties = {
  fontSize: "0.88rem",
  color: "#5c5650",
  textDecoration: "none",
  padding: "0.2rem 0",
  borderBottom: "1px solid transparent",
};

const mainStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(80px, 12vh, 120px) 1.25rem 3rem",
  width: "100%",
  boxSizing: "border-box",
};

const innerStyle: CSSProperties = {
  maxWidth: "720px",
  width: "100%",
  textAlign: "center",
  margin: "0 auto",
};

const labelPillStyle: CSSProperties = {
  display: "inline-block",
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#6f6962",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "999px",
  padding: "6px 14px",
  marginBottom: "1.5rem",
};

const headlineStyle: CSSProperties = {
  fontSize: "clamp(32px, 6vw, 64px)",
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  textTransform: "uppercase",
  color: "#1a1a1a",
  margin: 0,
};

const sublineStyle: CSSProperties = {
  fontSize: "clamp(16px, 2.2vw, 18px)",
  lineHeight: 1.5,
  color: "rgba(0,0,0,0.6)",
  margin: "16px 0 0 0",
  maxWidth: "32rem",
  marginLeft: "auto",
  marginRight: "auto",
};

const buttonsWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  marginTop: "40px",
};

const primaryBtnStyle: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  margin: 0,
  border: "none",
  borderRadius: "999px",
  backgroundColor: "#111",
  color: "#fff",
  fontSize: "0.95rem",
  fontWeight: 600,
  letterSpacing: "0.01em",
  padding: "0.85rem 1.75rem",
  cursor: "pointer",
  minWidth: "min(100%, 280px)",
  boxSizing: "border-box",
};

const secondaryBtnStyle: CSSProperties = {
  ...primaryBtnStyle,
  backgroundColor: "transparent",
  color: "#111",
  border: "1px solid rgba(0,0,0,0.2)",
};

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={pageStyle}>
      <header style={navStyle}>
        <span style={brandStyle}>VIREKA Space</span>
        <nav style={navLinksStyle} aria-label="Site">
          <Link href="/about" style={navLinkStyle}>
            About
          </Link>
          <Link href="/faq" style={navLinkStyle}>
            FAQ
          </Link>
          <Link href="/sign-in" style={navLinkStyle}>
            Sign in
          </Link>
        </nav>
      </header>

      <main style={mainStyle}>
        <div style={innerStyle}>
          <div style={labelPillStyle}>VIREKA SPACE</div>
          <h1 style={headlineStyle}>
            CLARITY BEFORE DECISION
            <br />
            CLARITY BEFORE AI
          </h1>
          <p style={sublineStyle}>What is clear carries forward</p>
          <div style={buttonsWrapStyle}>
            <button
              type="button"
              style={primaryBtnStyle}
              onClick={() => router.push("/clarify")}
            >
              Try VIREKA Space
            </button>
            <button
              type="button"
              style={secondaryBtnStyle}
              onClick={() => router.push("/sign-in")}
            >
              Sign in
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
