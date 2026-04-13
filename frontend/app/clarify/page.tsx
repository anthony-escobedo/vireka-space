"use client";

import { useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
  }

  interface SpeechRecognitionEvent {
    results: {
      [key: number]: {
        [key: number]: {
          transcript: string;
        };
      };
      length: number;
    };
  }

  interface SpeechRecognitionErrorEvent {
    error: string;
  }
}

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

  const [listening, setListening] = useState(false);

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
          errData?.error ?? `Request failed with status ${res.status}`
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
function startListening(): void {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setError("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    setListening(true);
    setError(null);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    setInput((prev) =>
      prev ? prev + " " + transcript : transcript
    );
  };

  recognition.onerror = (event) => {
    setError("Microphone error: " + event.error);
  };

  recognition.onend = () => {
    setListening(false);
  };

  recognition.start();
}

const isDisabled = loading || !input.trim();

  function renderList(items: string[] | undefined, label: string) {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ marginBottom: "1.75rem" }}>
        <h3
          style={{
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#999",
            margin: "0 0 0.625rem 0",
          }}
        >
          {label}
        </h3>
        <ul style={{ paddingLeft: "1.125rem", margin: 0, listStyleType: "disc" }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                marginBottom: "0.4rem",
                color: "#333",
                fontSize: "0.95rem",
                lineHeight: 1.6,
              }}
            >
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
        backgroundColor: "#f5f3ef",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        color: "#111",
      }}
    >
      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "1.75rem 1.5rem 4rem",
        }}
      >
        {/* Back link */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.875rem",
              color: "#555",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            ← Back to home
          </Link>
        </div>

        {/* Pill label */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#555",
              border: "1.5px solid #d6d3d1",
              borderRadius: "999px",
              padding: "6px 12px",
            }}
          >
            Clarify
          </span>
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 2.85rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "#111",
            margin: "0 0 1.25rem 0",
          }}
        >
          Clarify a situation
        </h1>

        {/* Intro text */}
        <div style={{ maxWidth: "640px" }}>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#444",
              lineHeight: 1.6,
              margin: "0 0 0.75rem 0",
            }}
          >
            Describe a situation, decision, or AI-related question as it
            currently appears.
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#444",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            VIREKA helps distinguish what appears to be happening, what may be
            assumed, and what may still be unclear, so responses begin from
            clearer understanding.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #e7e5e4",
            marginTop: "2.25rem",
            marginBottom: "2.25rem",
          }}
        />

        {/* Form card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e7e5e4",
            padding: "1.75rem 1.75rem 1.5rem",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#111",
              marginBottom: "0.875rem",
            }}
          >
            Situation or question
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={`Example: "A coworker stopped replying after I sent a detailed message, and now I'm assuming they may be upset or avoiding me."`}
            rows={8}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: "#fafafa",
              color: "#111",
              border: "1px solid #e7e5e4",
              borderRadius: "10px",
              padding: "1rem 1.125rem",
              fontSize: "0.925rem",
              lineHeight: 1.65,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
              opacity: loading ? 0.6 : 1,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#aaa";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e7e5e4";
            }}
          />

          {/* Footer row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "1.5rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                color: "#888",
                lineHeight: 1.55,
                margin: 0,
                maxWidth: "480px",
                flex: "1 1 260px",
              }}
            >
              Include the situation as you currently see it, even if
              interpretation or uncertainty are present. The system helps
              separate these elements before a response or prompt is formed.
            </p>

            <div
  style={{
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    flexShrink: 0,
  }}
>
  <button
    type="button"
    onClick={startListening}
    disabled={loading || listening}
    style={{
      padding: "0.7rem 1rem",
      backgroundColor: "#fff",
      color: "#111",
      border: "1px solid #d6d3d1",
      borderRadius: "999px",
      fontSize: "0.9rem",
      fontWeight: 600,
      cursor: loading || listening ? "not-allowed" : "pointer",
      whiteSpace: "nowrap",
      opacity: loading || listening ? 0.6 : 1,
    }}
  >
    {listening ? "Listening…" : "Mic"}
  </button>

  <button
    onClick={handleClarify}
    disabled={isDisabled}
    style={{
      flexShrink: 0,
      padding: "0.7rem 1.75rem",
      backgroundColor: isDisabled ? "#ccc" : "#111",
      color: "#fff",
      border: "none",
      borderRadius: "999px",
      fontSize: "0.9rem",
      fontWeight: 600,
      cursor: isDisabled ? "not-allowed" : "pointer",
      transition: "background-color 0.15s",
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={(e) => {
      if (!isDisabled) e.currentTarget.style.backgroundColor = "#333";
    }}
    onMouseLeave={(e) => {
      if (!isDisabled) e.currentTarget.style.backgroundColor = "#111";
    }}
  >
    {loading ? "Clarifying…" : "Clarify"}
  </button>
</div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.25rem",
              backgroundColor: "#fff5f5",
              border: "1px solid #fcc",
              borderRadius: "12px",
              color: "#c00",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#ffffff",
              border: "1px solid #e7e5e4",
              borderRadius: "16px",
              padding: "2rem 1.75rem",
            }}
          >
            {renderList(result.observable, "What can be observed")}
            {renderList(result.interpretive, "What may be interpreted")}
            {renderList(result.unknown, "What remains unknown")}
            {renderList(result.structural, "Structural conditions")}

            {result.orientation && (
              <div style={{ marginBottom: "1.75rem" }}>
                <h3
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#999",
                    margin: "0 0 0.625rem 0",
                  }}
                >
                  Orientation
                </h3>
                <p
                  style={{
                    color: "#333",
                    margin: 0,
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                  }}
                >
                  {result.orientation}
                </p>
              </div>
            )}

            {result.question && (
              <div
                style={{
                  padding: "1.125rem 1.25rem",
                  backgroundColor: "#f9f8f5",
                  border: "1px solid #e7e5e4",
                  borderLeft: "3px solid #111",
                  borderRadius: "0 10px 10px 0",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#999",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Clarifying question
                </h3>
                <p
                  style={{
                    color: "#111",
                    margin: 0,
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    fontWeight: 500,
                  }}
                >
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
