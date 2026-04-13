"use client";

import { useState } from "react";

type ClarifyResult = {
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  question?: string;
};

export default function ClarifyPage() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<ClarifyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClarify(): Promise<void> {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const errData = data as { error?: string } | null;
        throw new Error(
          errData?.error ?? `Request failed with status ${res.status}
        );
      }

      setResult(data as ClarifyResult);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = loading || !input.trim();

  function renderList(items: string[] | undefined, label: string) {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "#c9d1d9",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </h3>
        <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: "0.35rem", color: "#8b949e" }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d1117",
        color: "#c9d1d9",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "720px" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "#e6edf3",
            letterSpacing: "-0.02em",
          }}
        >
          VIREKA Space — Clarify
        </h1>
        <p
          style={{
            color: "#8b949e",
            marginBottom: "2rem",
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          Describe a situation, decision, or dilemma. Clarify will separate
          observation from interpretation.
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what is happening..."
          rows={6}
          style={{
            display: "block",
            width: "100%",
            backgroundColor: "#161b22",
            color: "#c9d1d9",
            border: "1px solid #30363d",
            borderRadius: "8px",
            padding: "0.875rem 1rem",
            fontSize: "0.95rem",
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleClarify}
          disabled={isDisabled}
          style={{
            marginTop: "1rem",
            padding: "0.65rem 1.5rem",
            backgroundColor: isDisabled ? "#21262d" : "#238636",
            color: isDisabled ? "#484f58" : "#ffffff",
            border: "1px solid #30363d",
            borderRadius: "6px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: isDisabled ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {loading ? "Clarifying..." : "Clarify"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "0.875rem 1rem",
              backgroundColor: "#1c1010",
              border: "1px solid #6e2d2d",
              borderRadius: "8px",
              color: "#f85149",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "1.5rem",
            }}
          >
            {renderList(result.observable, "What can be observed")}
            {renderList(result.interpretive, "What may be interpreted")}
            {renderList(result.unknown, "What remains unknown")}
            {renderList(result.structural, "Structural conditions")}

            {result.orientation && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#c9d1d9",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Orientation
                </h3>
                <p style={{ color: "#8b949e", margin: 0, lineHeight: 1.6 }}>
                  {result.orientation}
                </p>
              </div>
            )}

            {result.question && (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#0d1117",
                  border: "1px solid rgba(56, 139, 253, 0.27)",
                  borderLeft: "3px solid #388bfd",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                <h3
                  style={{
                    fontWeight: 600,
                    color: "#c9d1d9",
                    margin: "0 0 0.4rem 0",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Clarifying question
                </h3>
                <p style={{ color: "#8b949e", margin: 0, lineHeight: 1.6 }}>
                  {result.question}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
