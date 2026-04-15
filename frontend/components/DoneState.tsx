"use client";

import React from "react";

type DoneStateProps = {
  onCopy: () => void;
  onNew: () => void;
  onHome: () => void;
};

export default function DoneState({
  onCopy,
  onNew,
  onHome,
}: DoneStateProps) {
  return (
    <div
      style={{
        marginTop: "3rem",
        padding: "2.25rem",
        borderRadius: "18px",
        backgroundColor: "white",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        maxWidth: "640px",
      }}
    >
      <h2
        style={{
          fontSize: "1.35rem",
          fontWeight: 500,
          marginBottom: ".35rem",
        }}
      >
        Clarity established
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "1.6rem",
        }}
      >
        Structure supports clearer understanding.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: ".6rem",
        }}
      >
        <button
          onClick={onCopy}
          style={buttonStyle}
        >
          Copy result
        </button>

        <button
          onClick={onNew}
          style={buttonStyle}
        >
          Start new situation
        </button>

        <button
          onClick={onHome}
          style={buttonStyleSecondary}
        >
          Return home
        </button>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: ".55rem .9rem",
  borderRadius: "999px",
  border: "1px solid rgba(0,0,0,.08)",
  background: "white",
  cursor: "pointer",
  fontSize: ".85rem",
};

const buttonStyleSecondary: React.CSSProperties = {
  ...buttonStyle,
  color: "#777",
};
