"use client";

import React from "react";

type OnboardingModalProps = {
  isOpen: boolean;
  title?: string;
  body?: React.ReactNode;
  onBegin: () => void;
  onDismiss: () => void;
};

export default function OnboardingModal({
  isOpen,
  title = "Understanding begins with structure",
  body,
  onBegin,
  onDismiss,
}: OnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vireka-onboarding-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(17, 17, 17, 0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          border: "1px solid #e7e5e4",
          borderRadius: "20px",
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.08)",
          padding: "1.6rem 1.35rem 1.2rem",
          boxSizing: "border-box",
        }}
      >
        <h2
          id="vireka-onboarding-title"
          style={{
            margin: "0 0 1rem 0",
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "#111",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>

        <div
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.65,
            color: "#444",
          }}
        >
          {body ?? (
            <>
              <p style={{ margin: "0 0 0.9rem 0" }}>
                Vireka Space clarifies how situations are interpreted before conclusions guide response.
              </p>

              <div style={{ margin: "0 0 0.9rem 0" }}>
                <p style={{ margin: "0 0 0.45rem 0" }}>Useful when:</p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.1rem",
                    listStyleType: "disc",
                  }}
                >
                  <li style={{ marginBottom: "0.35rem" }}>
                    meaning feels uncertain
                  </li>
                  <li style={{ marginBottom: "0.35rem" }}>
                    multiple interpretations seem possible
                  </li>
                  <li style={{ marginBottom: "0.35rem" }}>
                    a response is being considered
                  </li>
                  <li style={{ marginBottom: "0.35rem" }}>
                    assumptions may be influencing interpretation
                  </li>
                  <li>an AI prompt needs clearer structure</li>
                </ul>
              </div>

              <p style={{ margin: "0 0 0.35rem 0" }}>
                Begin with a simple description.
              </p>
              <p style={{ margin: 0 }}>The system does not search for answers. It helps clarify how situations are being understood.
              </p>
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            marginTop: "1.35rem",
          }}
        >
          <button
            type="button"
            onClick={onBegin}
            style={{
              padding: "0.72rem 1.2rem",
              backgroundColor: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.15s",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#111";
            }}
          >
            Begin
          </button>

          <button
            type="button"
            onClick={onDismiss}
            style={{
              padding: "0.72rem 1rem",
              backgroundColor: "#fff",
              color: "#111",
              border: "1px solid #d6d3d1",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
