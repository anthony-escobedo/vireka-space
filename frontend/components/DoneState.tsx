"use client";

import React from "react";
import { useLanguage } from "../lib/i18n/useLanguage";

type DoneStateProps = {
  onCopy: () => void;
  onNew: () => void;
  onHome: () => void;
  copyLabel?: string;
};

export default function DoneState({
  onCopy,
  onNew,
  onHome,
  copyLabel = "Copy result",
}: DoneStateProps) {
  const { t } = useLanguage();
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "620px",
        backgroundColor: "#ffffff",
        border: "1px solid #e7e5e4",
        borderRadius: "20px",
        padding: "2.75rem 2.5rem",
        boxSizing: "border-box",
        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <h2
        style={{
          margin: "0 0 0.8rem 0",
          fontSize: "clamp(1.8rem, 4vw, 2.2rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          fontWeight: 600,
          color: "#111",
        }}
      >
        {t.doneState.clarityEstablished}
      </h2>

      <p
        style={{
          margin: "0 0 2rem 0",
          fontSize: "1rem",
          lineHeight: 1.65,
          color: "#66615b",
        }}
      >
        {t.doneState.structureSupportsClarity}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.85rem",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={onCopy}
          style={{
            padding: "0.78rem 1.15rem",
            borderRadius: "999px",
            border: "1px solid #d6d3d1",
            backgroundColor: "#fff",
            color: "#111",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {copyLabel}
        </button>

        <button
          type="button"
          onClick={onNew}
          style={{
            padding: "0.78rem 1.15rem",
            borderRadius: "999px",
            border: "1px solid #d6d3d1",
            backgroundColor: "#fff",
            color: "#111",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {t.doneState.startNewSituation}
        </button>

        <button
          type="button"
          onClick={onHome}
          style={{
            padding: "0.78rem 1.15rem",
            borderRadius: "999px",
            border: "1px solid #d6d3d1",
            backgroundColor: "#fff",
            color: "#7a756f",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {t.doneState.returnHome}
        </button>
      </div>
    </div>
  );
}
