"use client";

import { useState } from "react";
import Link from "next/link";

type ClarifyResult = {
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  question?: string;
};

type SpeechRecognitionEvent = {
  results: { [key: number]: { [key: number]: { transcript: string } } };
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

export default function AIInteractionPage() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<ClarifyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState<boolean>(false);

  async function handleClarify(): Promise<void> {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          mode: "ai_interaction",
        }),
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

  function cleanTranscript(text: string): string {
    let t = text.trim();
    if (!t) return "";
    t = t.charAt(0).toUpperCase() + t.slice(1);
    t = t.replace(/\b(and|but|so|because)\b/gi, ", $1");
    t = t.replace(/,\s*,/g, ",");
    t = t.replace(/^,\s*/, "");
    t = t.replace(/\s+/g, " ");
    if (!/[.!?]$/.test(t)) {
      t += ".";
    }
    return t;
  }

  function startListening(): void {
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;

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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = event.results[0][0].transcript;
      transcript = cleanTranscript(transcript);
      setInput((prev) =>
        prev.trim() ? `${prev.trim()} ${transcript}` : transcript
      );
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError("Microphone error: " + event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  function renderList(items: string[], heading: string) {
    if (!items?.length) return null;
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
          {heading}
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: "1.1rem",
            color: "#333",
            fontSize: "0.95rem",
            lineHeight: 1.65,
          }}
        >
          {items.map((item, index) => (
            <li key={`${heading}-${index}`} style={{ marginBottom: "0.45rem" }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f2",
        color: "#111111",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: "960px",
          margin: "0 auto",
          padding: "1.75rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <Link
              href="/"
              style={{
                color: "#444",
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              ← Back to home
            </Link>
          </div>

          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid #e1e1da",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.03em",
              marginBottom: "22px",
              color: "#444",
            }}
          >
            AI INTERACTION
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 2.85rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: "0 0 1.25rem 0",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            SEE CLEARLY BEFORE DECIDING WHAT TO ASK AI TO DO.
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
              lineHeight: 1.75,
              color: "#2e2e2e",
              margin: "0 0 2rem 0",
              maxWidth: "720px",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            VIREKA Space helps separate what is happening from what may be
            assumed, improving the quality of interaction with AI.
          </p>

          {/* White form card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e7e5e4",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <label
              htmlFor="ai-input"
              style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.9rem",
              }}
            >
              Problem, prompt, or AI issue
            </label>

            <textarea
              id="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={`Example: "The output looks reasonable, but something about the reasoning feels off. I am not sure whether the issue is the prompt, the model, or the objective."`}
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
                marginBottom: "1rem",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#aaa";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e7e5e4";
              }}
            />

            <p
              style={{
                fontSize: "0.9rem",
                color: "#666",
                margin: "0 0 1rem 0",
                lineHeight: 1.7,
              }}
            >
              Describe the issue as it currently appears. This can include an
              unclear prompt, an output that feels off, or uncertainty about
              what the actual problem is.
            </p>

            {/* Footer row: helper text + buttons */}
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
                Clarifies what is known, assumed, and still unclear before
                prompting AI.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={startListening}
                  disabled={loading || listening}
                  style={{
                  padding: "0.7rem 1rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "999px",
                  border: "1px solid #d6d3d1",
                  whiteSpace: "nowrap",
                  opacity: loading ? 0.6 : 1,
                  }}
                >
                  {listening ? "Listening..." : "Mic"}
                </button>

                <button
                  type="button"
                  onClick={handleClarify}
                  disabled={loading || !input.trim()}
                  style={{
                  padding: "0.7rem 1.75rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "999px",
                  border: "1px solid #111",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  transition: "background-color 0.15s",
                  opacity: loading || !input.trim() ? 0.85 : 1,
                  }}
                >
                  {loading ? "Clarifying..." : "Clarify"}
                </button>
              </div>
            </div>
            {/* END footer row */}

            {error && (
              <div
                style={{
                  marginTop: "1.25rem",
                  padding: "1rem 1.1rem",
                  borderRadius: "14px",
                  backgroundColor: "#fff1f1",
                  border: "1px solid #f2caca",
                  color: "#c62828",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </div>
            )}
          </div>
          {/* END white form card */}

          {result && (
            <div
              style={{
                marginTop: "2rem",
                backgroundColor: "#ffffff",
                border: "1px solid #e7e5e4",
                borderRadius: "16px",
                padding: "2rem 1.75rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              {renderList(result.observable, "What appears to be happening")}
              {renderList(result.interpretive, "What may be assumed")}
              {renderList(result.unknown, "What may still be unclear")}
              {renderList(result.structural, "Structural considerations")}

              <div style={{ marginBottom: result.question ? "1.75rem" : 0 }}>
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
                    Question
                  </h3>
                  <p
                    style={{
                      color: "#333",
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {result.question}
                  </p>
                </div>
              )}
            </div>
          )}
          {/* END result card */}

        </div>
        {/* END maxWidth 760px centering div */}
      </main>
    </div>
  );
}
