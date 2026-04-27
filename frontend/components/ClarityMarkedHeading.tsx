"use client";

import type { ReactNode } from "react";

type ClarityMarkedHeadingProps = {
  children: ReactNode;
};

/** Uppercase section label + subtle outline light bulb, only for marked-clarity state. */
export function ClarityMarkedHeading({ children }: ClarityMarkedHeadingProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#8e8a84",
        margin: "0 0 0.4rem 0",
      }}
    >
      <span>{children}</span>
      <svg
        aria-hidden="true"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: 0.62,
          flexShrink: 0,
          transform: "translateY(-0.5px)",
        }}
      >
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.75c.65.45 1 1.1 1 1.75V17h6v-.5c0-.65.35-1.3 1-1.75A7 7 0 0 0 12 2Z" />
      </svg>
    </div>
  );
}
