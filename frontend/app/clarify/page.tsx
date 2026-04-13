"use client";

import { useState, useRef } from "react";
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

type RequestAction = "clarify" | "simplify";

type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

type ClarifyResponse = {
  mode: "clarify";
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  question?: string;
};

type SimplifyResponse = {
  mode: "simplify";
  message: string;
};

type CloseResponse = {
  mode: "close";
  message: string;
};

type VirekaResponse = ClarifyResponse | SimplifyResponse | CloseResponse;

export default function ClarifyPage() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<VirekaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [history, setHistory] = useState<ConversationTurn[]>([]);

  const inputRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

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
      let transcript = event.results[0][0].transcript;
      transcript = cleanTranscript(transcript);

      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      setError("Microphone error: " + event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  function formatResponseForHistory(response: VirekaResponse): string {
    if (response.mode === "close" || response.mode === "simplify") {
      return response.message;
    }

    const sections = [
      `What appears to be happening:\n${response.observable.join("\n")}`,
      `What may be assumed:\n${response.interpretive.join("\n")}`,
      `What may still be unclear:\n${response.unknown.join("\n")}`,
      `Structural considerations:\n${response.structural.join("\n")}`,
      `Orientation:\n${response.orientation}`,
    ];

    if (response.question) {
      sections.push(`Clarifying question:\n${response.question}`);
    }

    return sections.join("\n\n");
  }

  async function submitToClarify(action: RequestAction): Promise<void> {
    const trimmed = input.trim();

    if (!trimmed) {
      setError("Please enter a situation or response.");
      return;
    }

    if (action === "simplify" && !result) {
      setError("There is nothing to simplify yet.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userTurn: ConversationTurn = {
        role: "user",
        content: trimmed,
      };

      const payload = {
        input: trimmed,
        action,
        history,
      };

      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const errData = data as { error?: string } | null;
        throw new Error(
          errData?.error ?? `Request failed with status ${res.status}`
        );
      }

      const typedData = data as VirekaResponse;
      const assistantTurn: ConversationTurn = {
        role: "assistant",
        content: formatResponseForHistory(typedData),
      };

      setResult(typedData);
      setHistory((prev) => [...prev, userTurn, assistantTurn]);
      setInput("");

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClarify(): void {
    void submitToClarify("clarify");
  }

  function handlePlainLanguage(): void {
    void submitToClarify("simplify");
  }

  function handleDone(): void {
    if (loading) return;
    setInput("done");
    setTimeout(() => {
      void submitToClarify("clarify");
    }, 0);
  }

  const isClarifyDisabled = loading || !input.trim();
  const isPlainLanguageDisabled = loading || !result || result.mode !== "clarify";
  const isMicDisabled = loading || listening;
  const isDoneDisabled = loading || !result;

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
        <ul
          style={{
            paddingLeft: "1.125rem",
            margin: 0,
            listStyleType: "disc",
          }}
        >
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

  function renderResult(response: VirekaResponse) {
    if (response.mode === "close") {
      return (
        <div
          ref={resultRef}
          style={{
            marginTop: "2rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e7e5e4",
            borderRadius: "16px",
            padding: "2rem 1.75rem",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
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
              Response
            </h3>
            <p
              style={{
                color: "#333",
                margin: 0,
                fontSize: "0.95rem",
                lineHeight: 1.65,
              }}
            >
              {response.message}
            </p>
          </div>
        </div>
      );
    }

    if (response.mode === "simplify") {
      return (
        <div
          ref={resultRef}
          style={{
            marginTop: "2rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e7e5e4",
            borderRadius: "16px",
            padding: "2rem 1.75rem",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
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
              Plain language
            </h3>
            <p
              style={{
                color: "#333",
                margin: 0,
                fontSize: "0.95rem",
                lineHeight: 1.65,
              }}
            >
              {response.message}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={resultRef}
        style={{
          marginTop: "2rem",
          backgroundColor: "#ffffff",
          border: "1px solid #e7e5e4",
          borderRadius: "16px",
          padding: "2rem 1.75rem",
        }}
      >
        {renderList(response.observable, "What appears to be happening")}
        {renderList(response.interpretive, "What may be assumed")}
        {renderList(response.unknown, "What may still be unclear")}
        {renderList(response.structural, "Structural considerations")}

        <div style={{ marginBottom: response.question ? "1.75rem" : 0 }}>
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
            {response.orientation}
          </p>
        </div>

        {response.question && (
          <div
            style={{
              padding: "1.125rem 1.25rem",
              backgroundColor: "#f9f8f5",
              border: "1px solid #e7e5e4",
              borderLeft: "3px solid #111",
              borderRadius: "0 10px 10px 0",
              marginBottom: "1.25rem",
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
              {response.question}
            </p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button
            type="button"
            onClick={handlePlainLanguage}
            disabled={isPlainLanguageDisabled}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "96px",
              minHeight: "56px",
              padding: "0.55rem 0.85rem",
              backgroundColor: "#fff",
              color: "#111",
              border: "1px solid #d6d3d1",
              borderRadius: "14px",
              fontSize: "0.76rem",
              fontWeight: 600,
              lineHeight: 1.05,
              textAlign: "center",
              cursor: isPlainLanguageDisabled ? "not-allowed" : "pointer",
              opacity: isPlainLanguageDisabled ? 0.6 : 1,
            }}
          >
            <span>Plain</span>
            <span>Language</span>
          </button>
        </div>
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
          padding: "1.5rem 1.5rem 4rem",
        }}
      >
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

        <div
          style={{
            borderTop: "1px solid #e7e5e4",
            marginTop: "2.25rem",
            marginBottom: "2.25rem",
          }}
        />

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

          <div ref={inputRef}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Continue the situation or introduce a new one..."
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
          </div>

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
              Continue the same situation, respond to a clarifying question, or
              introduce a new one. The system helps separate these elements
              before a response or prompt is formed.
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
                flexShrink: 0,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={startListening}
                disabled={isMicDisabled}
                style={{
                  padding: "0.7rem 1rem",
                  backgroundColor: "#fff",
                  color: "#111",
                  border: "1px solid #d6d3d1",
                  borderRadius: "999px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: isMicDisabled ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  opacity: isMicDisabled ? 0.6 : 1,
                }}
              >
                {listening ? "Listening…" : "Mic"}
              </button>

              <button
                type="button"
                onClick={handleClarify}
                disabled={isClarifyDisabled}
                style={{
                  flexShrink: 0,
                  padding: "0.7rem 1.75rem",
                  backgroundColor: isClarifyDisabled ? "#ccc" : "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: isClarifyDisabled ? "not-allowed" : "pointer",
                  transition: "background-color 0.15s",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isClarifyDisabled) {
                    e.currentTarget.style.backgroundColor = "#333";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isClarifyDisabled) {
                    e.currentTarget.style.backgroundColor = "#111";
                  }
                }}
              >
                {loading ? "Clarifying…" : "Clarify"}
              </button>

              <button
                type="button"
                onClick={handleDone}
                disabled={isDoneDisabled}
                style={{
                  flexShrink: 0,
                  padding: "0.7rem 1.15rem",
                  backgroundColor: "#fff",
                  color: "#111",
                  border: "1px solid #d6d3d1",
                  borderRadius: "999px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: isDoneDisabled ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  opacity: isDoneDisabled ? 0.6 : 1,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>

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

        {result && renderResult(result)}
      </div>
    </main>
  );
}
