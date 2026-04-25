"use client";

import { useRouter } from "next/navigation";
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
  boxSizing: "border-box",
  paddingLeft: "1.25rem",
  paddingRight: "1.25rem",
  paddingBottom: "2.5rem",
  paddingTop: "clamp(72px, 12vh, 132px)",
};

const innerStyle: CSSProperties = {
  maxWidth: "980px",
  width: "100%",
  textAlign: "center",
  margin: "0 auto",
};

const headlineStyle: CSSProperties = {
  fontSize: "clamp(42px, 5.6vw, 76px)",
  fontWeight: 700,
  lineHeight: 0.98,
  letterSpacing: "-0.045em",
  textTransform: "uppercase",
  color: "#1a1a1a",
  margin: 0,
  maxWidth: "980px",
  marginLeft: "auto",
  marginRight: "auto",
};

const sublineStyle: CSSProperties = {
  fontSize: "clamp(16px, 2.2vw, 18px)",
  lineHeight: 1.5,
  color: "rgba(0,0,0,0.6)",
  margin: "1.1rem 0 0 0",
  maxWidth: "32rem",
  marginLeft: "auto",
  marginRight: "auto",
};

const buttonsWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "14px",
  marginTop: "2.25rem",
  width: "100%",
};

const ctaBase: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  margin: 0,
  width: "100%",
  maxWidth: "min(100%, 360px)",
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.1)",
  backgroundColor: "rgba(255,255,255,0.88)",
  color: "#1f1c18",
  fontSize: "0.95rem",
  fontWeight: 600,
  letterSpacing: "0.01em",
  padding: "1rem 1.5rem",
  cursor: "pointer",
  boxSizing: "border-box",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
};

const primaryCtaStyle: CSSProperties = {
  ...ctaBase,
  backgroundColor: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(0,0,0,0.12)",
  boxShadow: "0 4px 18px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
  fontWeight: 650,
};

const secondaryCtaStyle: CSSProperties = {
  ...ctaBase,
  backgroundColor: "rgba(252,250,248,0.9)",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  fontWeight: 580,
  color: "#2f2b27",
};

export default function HomePage() {
  const router = useRouter();

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
          opacity: 0.08,
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
            "linear-gradient(rgba(245,243,239,0.92), rgba(245,243,239,0.96))",
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
                  style={primaryCtaStyle}
                  onClick={() => router.push("/clarify")}
                >
                  Try VIREKA Space
                </button>
                <button
                  type="button"
                  style={secondaryCtaStyle}
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
