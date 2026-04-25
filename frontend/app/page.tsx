"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "transparent",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  color: "#111",
  boxSizing: "border-box",
};

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "1rem 1.5rem",
  maxWidth: "980px",
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

const mainStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  minHeight: 0,
  boxSizing: "border-box",
  paddingLeft: "1.25rem",
  paddingRight: "1.25rem",
  paddingBottom: "1.5rem",
  paddingTop: "clamp(72px, 12vh, 132px)",
};

const footerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.65rem 1.5rem",
  fontSize: "0.78rem",
  color: "rgba(0,0,0,0.42)",
  padding: "0 2rem 1.25rem",
  boxSizing: "border-box",
};

const footerLinksRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.9rem 1.25rem",
};

const innerStyle: CSSProperties = {
  maxWidth: "980px",
  width: "100%",
  textAlign: "center",
  margin: "0 auto",
  paddingTop: "0.65rem",
};

const headlineStyle: CSSProperties = {
  fontSize: "clamp(36px, 4.7vw, 64px)",
  fontWeight: 600,
  lineHeight: 1.04,
  letterSpacing: "-0.025em",
  textTransform: "uppercase",
  color: "#1f1d1a",
  margin: 0,
  maxWidth: "980px",
  marginLeft: "auto",
  marginRight: "auto",
};

const sublineStyle: CSSProperties = {
  fontSize: "clamp(16px, 2.2vw, 18px)",
  lineHeight: 1.5,
  color: "rgba(0,0,0,0.6)",
  margin: "18px 0 0 0",
  maxWidth: "32rem",
  marginLeft: "auto",
  marginRight: "auto",
};

const buttonsWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.85rem",
  marginTop: "2.25rem",
  width: "100%",
};

function getHeroCtaStyle(active: boolean): CSSProperties {
  return {
    appearance: "none",
    WebkitAppearance: "none",
    margin: 0,
    border: "none",
    borderBottom: active
      ? "1px solid rgba(0,0,0,0.48)"
      : "1px solid rgba(0,0,0,0.28)",
    borderRadius: 0,
    backgroundColor: "transparent",
    color: active ? "rgba(0,0,0,0.94)" : "rgba(0,0,0,0.82)",
    fontSize: "1.05rem",
    fontWeight: 550,
    letterSpacing: "-0.01em",
    lineHeight: 1.35,
    padding: "12px 10px",
    minWidth: "clamp(240px, 85vw, 260px)",
    cursor: "pointer",
    textAlign: "center",
    boxSizing: "border-box",
    transform: active ? "scale(1.018)" : "scale(1)",
    textShadow: active ? "0 0.5px 0 rgba(0,0,0,0.1)" : "none",
    transition:
      "transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease, text-shadow 0.2s ease",
  };
}

function HeroFooterLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const [over, setOver] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      style={{
        color: over ? "rgba(0,0,0,0.58)" : "rgba(0,0,0,0.48)",
        textDecoration: "none",
        transition: "color 0.18s ease",
      }}
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<null | "try" | "signin">(null);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.13,
          pointerEvents: "none",
        }}
      >
        <source src="/vireka-breath-loop.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(245,243,239,0.86), rgba(245,243,239,0.91))",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={pageStyle}>
          <header style={navStyle}>
            <span style={brandStyle}>VIREKA Space</span>
          </header>

          <main style={mainStyle}>
            <div style={innerStyle}>
              <h1 style={headlineStyle}>
                CLARITY BEFORE DECISION
                <br />
                CLARITY BEFORE AI
              </h1>
              <p style={sublineStyle}>What is clear carries forward</p>
              <div style={buttonsWrapStyle}>
                <button
                  type="button"
                  style={getHeroCtaStyle(hovered === "try")}
                  onMouseEnter={() => setHovered("try")}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered("try")}
                  onBlur={() => setHovered(null)}
                  onClick={() => router.push("/clarify")}
                >
                  Try VIREKA Space
                </button>
                <button
                  type="button"
                  style={getHeroCtaStyle(hovered === "signin")}
                  onMouseEnter={() => setHovered("signin")}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered("signin")}
                  onBlur={() => setHovered(null)}
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </button>
              </div>
            </div>
          </main>

          <footer style={footerStyle}>
            <div style={footerLinksRowStyle}>
              <HeroFooterLink href="/privacy">Privacy</HeroFooterLink>
              <HeroFooterLink href="/terms">Terms</HeroFooterLink>
              <HeroFooterLink href="/settings/contact">Contact</HeroFooterLink>
            </div>
            <div style={{ flexShrink: 0 }}>© 2026 VIREKA Space</div>
          </footer>
        </div>
      </div>
    </div>
  );
}
