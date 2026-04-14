"use client";

import { useEffect, useRef, useState } from "react";
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
  suggestedQuestions?: string[];
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

type ClarificationIteration = {
  id: string;
  step: number;
  submittedInput: string;
  source: "top" | "followup";
  response: ClarifyResponse;
};

export default function AIInteractionPage() {
  const [topInput, setTopInput] = useState<string>("");
  const [followupInput, setFollowupInput] = useState<string>("");
  const [result, setResult] = useState<VirekaResponse | null>(null);
  const [lastClarifyResult, setLastClarifyResult] = useState<ClarifyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [listeningTarget, setListeningTarget] = useState<"top" | "followup" | null>(null);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [initialSituation, setInitialSituation] = useState<string>("");
  const [iterations, setIterations] = useState<ClarificationIteration[]>([]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

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

  function startListening(target: "top" | "followup"): void {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListeningTarget(target);
      setError(null);
    };

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      transcript = cleanTranscript(transcript);
      if (target === "top") {
        setTopInput((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
      } else {
        setFollowupInput((prev) =>
          prev.trim() ? `${prev.trim()} ${transcript}` : transcript
        );
      }
    };

    recognition.onerror = (event) => {
      setError("Microphone error: " + event.error);
    };

    recognition.onend = () => {
      setListeningTarget(null);
      recognitionRef.current = null;
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

    if (response.suggestedQuestions?.length) {
      sections.push(
        `Possible clarifying questions:\n${response.suggestedQuestions.join("\n")}`
      );
    }

    return sections.join("\n\n");
  }

  async function submitToClarify(
    action: RequestAction,
    source: "top" | "followup",
    overrideInput?: string
  ): Promise<void> {
    const sourceValue = source === "top" ? topInput : followupInput;
    const effectiveInput = typeof overrideInput === "string" ? overrideInput : sourceValue;
    const trimmed = effectiveInput.trim();

    if (action === "clarify" && !trimmed) {
      setError("Please enter a situation or response.");
      return;
    }

    if (action === "simplify" && !lastClarifyResult) {
      setError("There is nothing to simplify yet.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload =
        action === "simplify"
          ? {
              action,
              history,
              latestResult: lastClarifyResult,
              context: "ai-interaction",
            }
          : {
              input: trimmed,
              action,
              history,
              context: "ai-interaction",
            };

      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (action === "clarify") {
        const userTurn: ConversationTurn = { role: "user", content: trimmed };
        const assistantTurn: ConversationTurn = {
          role: "assistant",
          content: formatResponseForHistory(typedData),
        };

        setHistory((prev) => [...prev, userTurn, assistantTurn]);

        if (source === "top") {
          setTopInput("");
        } else {
          setFollowupInput("");
        }

        if (typedData.mode === "clarify") {
          setLastClarifyResult(typedData);

          setIterations((prev) => {
            const isFirst = prev.length === 0;
            if (isFirst && source === "top") {
              setInitialSituation(trimmed);
            }
            const newIteration: ClarificationIteration = {
              id: `iter-${Date.now()}`,
              step: prev.length + 1,
              submittedInput: trimmed,
              source,
              response: typedData,
            };
            return [...prev, newIteration];
          });
        } else {
          setLastClarifyResult(null);
        }
      }

      if (action === "simplify") {
        const assistantTurn: ConversationTurn = {
          role: "assistant",
          content: formatResponseForHistory(typedData),
        };
        setHistory((prev) => [...prev, assistantTurn]);
      }

      setResult(typedData);

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

  function handleClarify(source: "top" | "followup"): void {
    void submitToClarify("clarify", source);
  }

  function handlePlainLanguage(): void {
    void submitToClarify("simplify", "followup");
  }

  function handleDone(source: "top" | "followup"): void {
    if (loading) return;
    void submitToClarify("clarify", source, "done");
  }

  function insertSuggestedQuestion(question: string): void {
    setFollowupInput(question);
    setTimeout(() => {
      const el = document.getElementById("ai-followup-input");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  function insertMainClarifyingQuestion(question: string): void {
    setFollowupInput(question);
    setTimeout(() => {
      const el = document.getElementById("ai-followup-input");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  const possibleClarifyingQuestions =
    lastClarifyResult?.suggestedQuestions?.length
      ? lastClarifyResult.suggestedQuestions
      : lastClarifyResult?.question
      ? [lastClarifyResult.question]
      : [];

  const isTopClarifyDisabled = loading || !topInput.trim();
  const isFollowupClarifyDisabled = loading || !followupInput.trim();
  const isPlainLanguageDisabled = loading || !lastClarifyResult;
  const isTopMicDisabled = loading || listeningTarget === "top" || listeningTarget === "followup";
  const isFollowupMicDisabled = loading || listeningTarget === "top" || listeningTarget === "followup";
  const isTopDoneDisabled = loading || !result;
  const isFollowupDoneDisabled = loading || !result;

  function renderList(items: string[] | undefined, heading: string) {
    if (!items?.length) return null;
    return (
      <div style={{ marginBottom: "1.75rem" }}>
        <h3
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#888",
            margin: "0 0 0.7rem 0",
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

  function renderActionRow(source: "top" | "followup") {
    const isTop = source === "top";
    const isClarifyDisabled = isTop ? isTopClarifyDisabled : isFollowupClarifyDisabled;
    const isMicDisabled = isTop ? isTopMicDisabled : isFollowupMicDisabled;
    const isDoneDisabled = isTop ? isTopDoneDisabled : isFollowupDoneDisabled;
    const listening = listeningTarget === source;

    return (
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
          onClick={() => startListening(source)}
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
          onClick={() => handleClarify(source)}
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
            if (!isClarifyDisabled) e.currentTarget.style.backgroundColor = "#333";
          }}
          onMouseLeave={(e) => {
            if (!isClarifyDisabled) e.currentTarget.style.backgroundColor = "#111";
          }}
        >
          {loading ? "Clarifying…" : "Clarify"}
        </button>

        <button
          type="button"
          onClick={() => handleDone(source)}
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
    );
  }

  function renderInitialSituationCard() {
    if (!initialSituation) return null;
    return (
      <div
        style={{
          marginBottom: "1.25rem",
          backgroundColor: "#f9f8f5",
          borderRadius: "14px",
          border: "1px solid #e7e5e4",
          padding: "1.5rem 1.75rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#aaa",
            margin: "0 0 0.75rem 0",
          }}
        >
          Initial AI issue
        </h3>
        <p
          style={{
            color: "#444",
            margin: 0,
            fontSize: "0.95rem",
            lineHeight: 1.65,
          }}
        >
          {initialSituation}
        </p>
      </div>
    );
  }

  function renderRefinementCard(
    iteration: ClarificationIteration,
    isLatest: boolean
  ) {
    const { step, submittedInput, source, response } = iteration;
    const clarifyingQuestion = response.question;

    const suggestedChips =
      isLatest && possibleClarifyingQuestions.length > 0
        ? possibleClarifyingQuestions
        : [];

    return (
      <div
        key={iteration.id}
        style={{
          marginBottom: "1.5rem",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e7e5e4",
          padding: "2rem 1.75rem",
        }}
      >
        {/* Step label */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#bbb",
            }}
          >
            Refinement {step}
          </span>
        </div>

        {/* Show follow-up input sub-card if from follow-up */}
        {source === "followup" && submittedInput && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "0.875rem 1.1rem",
              backgroundColor: "#f9f8f5",
              borderRadius: "10px",
              border: "1px solid #e7e5e4",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#aaa",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 0.4rem 0",
              }}
            >
              Your follow-up
            </p>
            <p
              style={{
                color: "#555",
                margin: 0,
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {submittedInput}
            </p>
          </div>
        )}

        {/* Plain Language — latest only */}
        {isLatest && (
          <button
            type="button"
            onClick={handlePlainLanguage}
            disabled={isPlainLanguageDisabled}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.7rem 1.4rem",
              backgroundColor: isPlainLanguageDisabled ? "#a8a29e" : "#78716c",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: isPlainLanguageDisabled ? "not-allowed" : "pointer",
              marginBottom: "1.5rem",
              opacity: isPlainLanguageDisabled ? 0.65 : 1,
            }}
          >
            Plain Language
          </button>
        )}

        {renderList(response.observable, "What appears to be happening")}
        {renderList(response.interpretive, "What may be assumed")}
        {renderList(response.unknown, "What may still be unclear")}
        {renderList(response.structural, "Structural considerations")}

        {/* Orientation */}
        <div style={{ marginBottom: clarifyingQuestion ? "1.75rem" : 0 }}>
          <h3
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#888",
              margin: "0 0 0.7rem 0",
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

        {/* Main clarifying question */}
        {clarifyingQuestion && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => insertMainClarifyingQuestion(clarifyingQuestion)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                insertMainClarifyingQuestion(clarifyingQuestion);
              }
            }}
            style={{
              padding: "1.125rem 1.25rem",
              backgroundColor: "#f9f8f5",
              border: "1px solid #e7e5e4",
              borderLeft: "3px solid #111",
              borderRadius: "0 10px 10px 0",
              marginTop: "1.75rem",
              marginBottom: suggestedChips.length > 0 ? "1.25rem" : 0,
              cursor: "pointer",
            }}
          >
            <h3
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#888",
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
              {clarifyingQuestion}
            </p>
          </div>
        )}

        {/* Suggested question chips — latest only */}
        {isLatest && suggestedChips.length > 0 && (
          <div style={{ marginTop: "1.25rem" }}>
            <h3
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#bbb",
                margin: "0 0 0.8rem 0",
              }}
            >
              Possible clarifying questions
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {suggestedChips.map((item, index) => (
                <button
                  key={`chip-${index}`}
                  type="button"
                  onClick={() => insertSuggestedQuestion(item)}
                  style={{
                    padding: "0.62rem 0.9rem",
                    borderRadius: "999px",
                    border: "1px solid #d6d3d1",
                    backgroundColor: "#fff",
                    color: "#555",
                    fontSize: "0.88rem",
                    lineHeight: 1.4,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderClarificationPath() {
    if (iterations.length === 0) return null;

    return (
      <div style={{ marginTop: "2.5rem" }} ref={resultRef}>
        {/* Section header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#999",
              margin: "0 0 0.4rem 0",
            }}
          >
            Clarification path
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#aaa",
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            View the initial issue and each refinement as assumptions,
            interpretations, and unknowns become clearer.
          </p>
        </div>

        {renderInitialSituationCard()}

        {iterations.map((iteration, index) =>
          renderRefinementCard(iteration, index === iterations.length - 1)
        )}
      </div>
    );
  }

  function renderSupplementaryResult(response: VirekaResponse) {
    if (response.mode === "clarify") return null;

    return (
      <div
        style={{
          marginTop: "1.5rem",
          backgroundColor: "#ffffff",
          border: "1px solid #e7e5e4",
          borderRadius: "16px",
          padding: "2rem 1.75rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#888",
            margin: "0 0 0.625rem 0",
          }}
        >
          {response.mode === "simplify" ? "Plain language" : "Response"}
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
    );
  }

  function renderFollowupBox() {
    if (iterations.length === 0 && !result) return null;

    return (
      <div
        style={{
          marginTop: "1.5rem",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e7e5e4",
          padding: "1.75rem 1.75rem 1.5rem",
        }}
      >
        <label
          htmlFor="ai-followup-input"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#111",
            marginBottom: "0.875rem",
          }}
        >
          Continue the AI interaction
        </label>

        <textarea
          id="ai-followup-input"
          value={followupInput}
          onChange={(e) => setFollowupInput(e.target.value)}
          disabled={loading}
          placeholder="Add any detail that may help clarify the prompt, the objective, or the output."
          rows={6}
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
            Continue the same AI issue, respond to a clarifying question, or
            add what may help distinguish the prompt, the objective, and the
            output.
          </p>

          {renderActionRow("followup")}
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
            AI Interaction
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
          SEE CLEARLY BEFORE DECIDING WHAT TO ASK AI TO DO.
        </h1>

        <div style={{ maxWidth: "680px" }}>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#444",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            VIREKA Space helps separate what is happening from what may be
            assumed, improving the quality of interaction with AI.
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid #e7e5e4",
            marginTop: "2.25rem",
            marginBottom: "2.25rem",
          }}
        />

        {/* Top input card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e7e5e4",
            padding: "1.75rem 1.75rem 1.5rem",
          }}
        >
          <label
            htmlFor="ai-input"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#111",
              marginBottom: "0.875rem",
            }}
          >
            Problem, prompt, or AI issue
          </label>

          <textarea
            id="ai-input"
            value={topInput}
            onChange={(e) => setTopInput(e.target.value)}
            disabled={loading}
            placeholder='Example: "The output looks reasonable, but something about the reasoning feels off. I am not sure whether the issue is the prompt, the model, or the objective."'
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

            {renderActionRow("top")}
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

        {/* Clarification path — renders all iterations */}
        {renderClarificationPath()}

        {/* Supplementary result for simplify/close responses */}
        {result && result.mode !== "clarify" && renderSupplementaryResult(result)}

        {/* Follow-up composer */}
        {renderFollowupBox()}
      </div>
    </main>
  );
}
