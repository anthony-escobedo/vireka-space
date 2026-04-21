"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useLanguage } from "../lib/i18n/useLanguage";

type StaticPageShellProps = {
  pill?: string;
  title: string;
  intro: string;
  children: ReactNode;
};

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f5f3ef",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  color: "#111",
  width: "100%",
  maxWidth: "100%",
  overflowX: "hidden",
  boxSizing: "border-box",
  position: "relative",
};

const containerStyle: CSSProperties = {
  maxWidth: "780px",
  width: "100%",
  boxSizing: "border-box",
  margin: "0 auto",
  padding: "1.5rem 1.25rem 4rem",
  overflowX: "hidden",
  minWidth: 0,
};

const backLinkWrapperStyle: CSSProperties = {
  marginBottom: "2rem",
};

const backLinkStyle: CSSProperties = {
  fontSize: "0.875rem",
  color: "#555",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
};

const capsuleWrapperStyle: CSSProperties = {
  marginBottom: "1.25rem",
};

const capsuleStyle: CSSProperties = {
  display: "inline-block",
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#555",
  border: "1.5px solid #d6d3d1",
  borderRadius: "999px",
  padding: "6px 12px",
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(2rem, 5vw, 2.85rem)",
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.03em",
  color: "#111",
  margin: "0 0 1.25rem 0",
};

const introStyle: CSSProperties = {
  fontSize: "0.95rem",
  color: "#444",
  lineHeight: 1.65,
  margin: 0,
  maxWidth: "640px",
};

const dividerStyle: CSSProperties = {
  borderTop: "1px solid #e7e5e4",
  marginTop: "2.25rem",
  marginBottom: "2.25rem",
};

export const staticCardStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e7e5e4",
  padding: "1.6rem 1.25rem 1.35rem",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

export const staticBodyStyle: CSSProperties = {
  fontSize: "0.95rem",
  lineHeight: 1.75,
  color: "#333",
  margin: 0,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

export const staticSectionTitleStyle: CSSProperties = {
  fontSize: "1.35rem",
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  color: "#111",
  margin: "0 0 0.9rem 0",
};

export const staticSectionWrapperStyle: CSSProperties = {
  marginBottom: "1.5rem",
};

export const staticLinkStyle: CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "#222",
  fontSize: "0.95rem",
  padding: "0.9rem 1rem",
  borderRadius: "10px",
  marginBottom: "0.4rem",
  backgroundColor: "transparent",
  border: "1px solid transparent",
};

export const staticEmailStyle: CSSProperties = {
  fontSize: "0.95rem",
  lineHeight: 1.75,
  color: "#222",
  textDecoration: "underline",
  textUnderlineOffset: "4px",
};

export default function StaticPageShell({
  pill,
  title,
  intro,
  children,
}: StaticPageShellProps) {
  const { t } = useLanguage();
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={backLinkWrapperStyle}>
          <Link href="/" style={backLinkStyle}>
            <span aria-hidden="true">←</span>
            <span>{t.staticPage.backToHome}</span>
          </Link>
        </div>

        {pill ? (
          <div style={capsuleWrapperStyle}>
            <span style={capsuleStyle}>{pill}</span>
          </div>
        ) : null}

        <h1 style={titleStyle}>{title}</h1>

        <p style={introStyle}>{intro}</p>

        <div style={dividerStyle} />

        {children}
      </div>
    </main>
  );
}
