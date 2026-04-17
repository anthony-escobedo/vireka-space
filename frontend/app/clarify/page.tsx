"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CollapsibleLayer from "../../components/CollapsibleLayer";

import OnboardingModal from "../../components/OnboardingModal";
import { useRouter } from "next/navigation";
import DoneState from "../../components/DoneState";

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

type RequestAction = "clarify";

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

type CloseResponse = {
  mode: "close";
  message: string;
};

type VirekaResponse = ClarifyResponse | CloseResponse;

type ClarificationIteration = {
  id: string;
  step: number;
  submittedInput: string;
  source: "top" | "followup";
  response: ClarifyResponse;
};

type PanelKind = "initial_response" | "refinement";

type ClarificationPanel = {
  id: string;
  kind: PanelKind;
  title: string;
  summary: string;
  iteration: ClarificationIteration;
};

export default function ClarifyPage() {
  const [topInput, setTopInput] = useState<string>("");
  const [followupInput, setFollowupInput] = useState<string>("");
  const [result, setResult] = useState<VirekaResponse | null>(null);
  const [lastClarifyResult, setLastClarifyResult] =
    useState<ClarifyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [listeningTarget, setListeningTarget] = useState<
    "top" | "followup" | null
  >(null);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [initialSituation, setInitialSituation] = useState<string>("");
  const [iterations, setIterations] = useState<ClarificationIteration[]>([]);
  const [openPanelIds, setOpenPanelIds] = useState<string[]>([]);
  const [latestPanelId, setLatestPanelId] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy result");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [checkedOnboarding, setCheckedOnboarding] = useState(false);
  const topInputRef = useRef<HTMLTextAreaElement | null>(null);
  const pathTopRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const copyResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
  const accepted =
    typeof window !== "undefined" &&
    window.localStorage.getItem("vireka_onboarding_accepted") === "true";

  setShowOnboarding(!accepted);
  setCheckedOnboarding(true);

    return () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
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

  function normalizeQuestion(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");
  }

  function truncateText(text: string, maxLength = 78): string {
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) return trimmed;
    return `${trimmed.slice(0, maxLength).trimEnd()}…`;
  }

  function getDistinctSuggestedQuestions(response: ClarifyResponse): string[] {
    const mainQuestionNormalized = response.question
      ? normalizeQuestion(response.question)
      : "";

    const seen = new Set<string>();
    const rawSuggestions = response.suggestedQuestions ?? [];
    const distinct: string[] = [];

    for (const item of rawSuggestions) {
      const trimmed = item.trim();
      if (!trimmed) continue;
      const normalized = normalizeQuestion(trimmed);
      if (!normalized) continue;
      if (mainQuestionNormalized && normalized === mainQuestionNormalized) continue;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      distinct.push(trimmed);
      if (distinct.length === 2) break;
    }

    return distinct;
  }

  function getRefinementPanelSummary(iteration: ClarificationIteration): string {
    const { response, submittedInput } = iteration;
    if (submittedInput.trim()) {
      return truncateText(submittedInput);
    }
    if (response.question?.trim()) {
      return truncateText(response.question);
    }
    const firstUnknown = response.unknown?.[0];
    if (firstUnknown) {
      return truncateText(firstUnknown);
    }
    return truncateText(response.orientation);
  }

  function getPanels(): ClarificationPanel[] {
    const topIteration = iterations.find((iteration) => iteration.source === "top");
    const followupIterations = iterations.filter(
      (iteration) => iteration.source === "followup"
    );

    const panels: ClarificationPanel[] = [];

    if (topIteration) {
      panels.push({
        id: `panel-${topIteration.id}`,
        kind: "initial_response",
        title: "Initial reflection",
        summary: "",
        iteration: topIteration,
      });
    }

    for (const iteration of followupIterations) {
      panels.push({
        id: `panel-${iteration.id}`,
        kind: "refinement",
        title: `Refinement ${iteration.step - 1}`,
        summary: getRefinementPanelSummary(iteration),
        iteration,
      });
    }

    return panels;
  }

  function isPanelOpen(panelId: string): boolean {
    return openPanelIds.includes(panelId);
  }

  function togglePanel(panelId: string): void {
    setOpenPanelIds((prev) =>
      prev.includes(panelId)
        ? prev.filter((id) => id !== panelId)
        : [...prev, panelId]
    );
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
        setTopInput((prev) =>
          prev.trim() ? `${prev.trim()} ${transcript}` : transcript
        );
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
    if (response.mode === "close") {
      return response.message;
    }

    const distinctSuggestedQuestions = getDistinctSuggestedQuestions(response);

    const sections = [
      `What appears to be happening:\n${response.observable.join("\n")}`,
      `What may be assumed:\n${response.interpretive.join("\n")}`,
      `What may remain unclear:\n${response.unknown.join("\n")}`,
      `What may be influencing the situation:\n${response.structural.join("\n")}`,
    ];

    if (response.orientation.trim()) {
      sections.push(response.orientation.trim());
    }

    if (response.question) {
      sections.push(`Clarifying question:\n${response.question}`);
    }

    if (distinctSuggestedQuestions.length) {
      sections.push(
        `Suggested questions:\n${distinctSuggestedQuestions.join("\n")}`
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
    const effectiveInput =
      typeof overrideInput === "string" ? overrideInput : sourceValue;
    const trimmed = effectiveInput.trim();

    if (action === "clarify" && !trimmed) {
      setError("Please enter a situation or response.");
      return;
    }

    setLoading(true);
    setError(null);
    setIsDone(false);

    try {
      const payload = { input: trimmed, action, history };

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

          const newIteration: ClarificationIteration = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            step: iterations.length + 1,
            submittedInput: trimmed,
            source,
            response: typedData,
          };

          const panelId = `panel-${newIteration.id}`;

          setIterations((prev) => [...prev, newIteration]);
          setLatestPanelId(panelId);
          setOpenPanelIds([]);

          if (source === "top" && !initialSituation) {
            setInitialSituation(trimmed);
          }
        } else {
          setLastClarifyResult(null);
        }
      }

      setResult(typedData);
      
      // auto-redirect when conversation is complete
      if (typedData.mode === "close") {
      if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

      redirectTimeoutRef.current = setTimeout(() => {
        router.push("/");
    }, 2000);
}  
      setTimeout(() => {
        const target = pathTopRef.current ?? resultRef.current;
        target?.scrollIntoView({
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

  function handleBeginOnboarding(): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("vireka_onboarding_accepted", "true");
  }
  setShowOnboarding(false);

  setTimeout(() => {
    topInputRef.current?.focus();
  }, 0);
}
  
  function handleDismissOnboarding(): void {
  router.push("/");
}

function handleCopyResult(): void {
  if (!result) return;

  const text =
    result.mode === "close"
      ? result.message
      : [
          "What appears to be happening:",
          ...result.observable,
          "",
          "What may be assumed:",
          ...result.interpretive,
          "",
          "What may remain unclear:",
          ...result.unknown,
          "",
          "What may be influencing the situation:",
          ...result.structural,
          ...(result.orientation.trim()
              ? ["", "Integrated view:", result.orientation.trim()]
              : []),
          ...(result.question ? ["", "Clarifying question:", result.question] : []),
          ...(
            result.suggestedQuestions?.length
              ? ["", "Suggested questions:", ...result.suggestedQuestions]
              : []
          ),
        ].join("\n");

  const resetLabel = () => {
    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = setTimeout(() => {
      setCopyLabel("Copy result");
    }, 1500);
  };

  const fallbackCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let successful = false;
    try {
      successful = document.execCommand("copy");
    } catch {
      successful = false;
    }

    document.body.removeChild(textarea);

    if (successful) {
      setCopyLabel("Copied");
    } else {
      setCopyLabel("Could not copy");
    }
    resetLabel();
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyLabel("Copied");
        resetLabel();
      })
      .catch(() => {
        fallbackCopy();
      });
  } else {
    fallbackCopy();
  }
}
  
function handleStartNew(): void {
  if (copyResetTimeoutRef.current) {
    clearTimeout(copyResetTimeoutRef.current);
  }
  setCopyLabel("Copy result");
  resetSession();
}
  
function handleReturnHome(): void {
  router.push("/");
}

function handleDone(): void {
  if (loading || !result) return;
  setIsDone(true);

  if (redirectTimeoutRef.current) {
    clearTimeout(redirectTimeoutRef.current);
  }

  setTimeout(() => {
    resultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}
  
  const panels = getPanels();
  const archivedPanels = panels.slice(0, -1);
  const activePanel = panels.length > 0 ? panels[panels.length - 1] : null;
  const isTopClarifyDisabled = loading || !topInput.trim();
  const isFollowupClarifyDisabled = loading || !followupInput.trim();
  const isTopMicDisabled =
    loading || listeningTarget === "top" || listeningTarget === "followup";
  const isFollowupMicDisabled =
    loading || listeningTarget === "top" || listeningTarget === "followup";
  const isDoneDisabled = loading || !result || isDone;

  function renderList(items: string[] | undefined, label: string) {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: "1.9rem" }}>
        <h3
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8e8a84",
            margin: "0 0 0.7rem 0",
          }}
        >
          {label}
        </h3>
        <ul style={{ paddingLeft: "1.125rem", margin: 0, listStyleType: "disc" }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                marginBottom: "0.55rem",
                color: "#333",
                fontSize: "0.95rem",
                lineHeight: 1.65,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderInitialSituationCard() {
    if (!initialSituation) return null;

    return (
      <div
        style={{
          backgroundColor: "#fcfbf8",
          border: "1px solid #e7e5e4",
          borderRadius: "16px",
          padding: "1.4rem 1.5rem",
          marginTop: "1rem",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8e8a84",
            margin: "0 0 0.7rem 0",
          }}
        >
          Initial situation
        </h3>
        <p
          style={{
            margin: 0,
            color: "#333",
            fontSize: "0.95rem",
            lineHeight: 1.65,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {initialSituation}
        </p>
      </div>
    );
  }

  function renderClarifyContent(
    panel: ClarificationPanel,
    showYourInput?: string
  ) {
    const response = panel.iteration.response;
    const refinementQuestions = getDistinctSuggestedQuestions(response);
    return (
      <div style={{ padding: "0 0 0.1rem 0", minWidth: 0, maxWidth: "100%" }}>
        {showYourInput && (
          <div
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #eceae7",
              borderRadius: "10px",
              padding: "0.9rem 1rem",
              marginBottom: "1.5rem",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8e8a84",
                margin: "0 0 0.55rem 0",
              }}
            >
              Your input
            </h3>
            <p
              style={{
                margin: 0,
                color: "#444",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {showYourInput}
            </p>
          </div>
        )}

        {renderList(response.observable, "What appears to be happening")}
        {renderList(response.interpretive, "What may be assumed")}
        {renderList(response.unknown, "What may remain unclear")}
        {renderList(response.structural, "What may be influencing the situation")}

        {response.orientation.trim().length > 0 && (
  <div
    style={{
      marginBottom: response.question
        ? "1.75rem"
        : refinementQuestions.length > 0
          ? "1.65rem"
          : 0,
      backgroundColor: "#f7f4ee",
      border: "1px solid #ebe5db",
      borderRadius: "14px",
      padding: "1rem 1.1rem 1.05rem",
      maxWidth: "100%",
      minWidth: 0,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        maxWidth: "41rem",
      }}
    >
      <h3
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8e8a84",
          margin: 0,
        }}
      >
        Integrated View
      </h3>

      <p
        style={{
          margin: "0.3rem 0 0 0",
          fontSize: "0.84rem",
          lineHeight: 1.55,
          color: "#7a756f",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        How the situation reads as a whole
      </p>

      <p
        style={{
          color: "#333",
          margin: "0.9rem 0 0 0",
          fontSize: "0.95rem",
          lineHeight: 1.8,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {response.orientation}
      </p>
    </div>
  </div>
)}

        {response.question && (
          <div
            style={{
              padding: "1.125rem 1.25rem",
              backgroundColor: "#f9f8f5",
              border: "1px solid #e7e5e4",
              borderLeft: "3px solid #111",
              borderRadius: "0 10px 10px 0",
              marginBottom: refinementQuestions.length > 0 ? "1.25rem" : 0,
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "0.75rem",
              margin: "0 0 0.55rem 0",
              flexWrap: "wrap",
          }}
          >
            <h3
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8e8a84",
              margin: 0,
          }}
            >
              Clarifying question
            </h3>

            <span
              style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#8e8a84",
              opacity: 0.80,
              margin: 0,
              whiteSpace: "nowrap",
          }}
        >
            Optional
          </span>
        </div>
            
            <p
              style={{
                color: "#111",
                margin: 0,
                fontSize: "0.95rem",
                lineHeight: 1.65,
                fontWeight: 500,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {response.question}
            </p>
          </div>
        )}

        {refinementQuestions.length > 0 && (
          <div style={{ marginTop: "1.65rem" }}>
            <h3
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8e8a84",
                margin: "0 0 0.85rem 0",
              }}
            >
              Suggested questions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {refinementQuestions.map((item, index) => (
                <div
                  key={`${panel.id}-${item}-${index}`}
                  style={{
                    padding: "0.9rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid #e7e5e4",
                    backgroundColor: "#fff",
                    maxWidth: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#333",
                      fontSize: "0.92rem",
                      lineHeight: 1.55,
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderCollapsiblePanel(
    panel: ClarificationPanel
  ) {
    const open = isPanelOpen(panel.id);
    const showYourInput =
      panel.kind === "refinement" ? panel.iteration.submittedInput : undefined;

    return (
      <div key={panel.id} style={{ marginTop: "1rem" }}>
        <CollapsibleLayer
          title={panel.title}
          summary={panel.summary}
          isOpen={open}
          onToggle={() => togglePanel(panel.id)}
          contentClassName=""
        >
          {open ? (
            <div style={{ paddingBottom: "0.1rem" }}>
              {renderClarifyContent(panel, showYourInput)}
            </div>
          ) : null}
        </CollapsibleLayer>
      </div>
    );
  }

  function renderActiveResponse(panel: ClarificationPanel) {
    const showYourInput =
      panel.kind === "refinement" ? panel.iteration.submittedInput : undefined;

    return (
      <div
        ref={panel.id === latestPanelId ? resultRef : null}
        style={{
          marginTop: "1rem",
          backgroundColor: "#ffffff",
          border: "1px solid #e7e5e4",
          borderRadius: "16px",
          padding: "1rem 1.25rem 0.35rem",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {renderClarifyContent(panel, showYourInput)}
      </div>
    );
  }

  function renderClarificationPath() {
    if (panels.length === 0) return null;

    return (
      <div ref={pathTopRef} style={{ marginTop: "2rem", minWidth: 0, maxWidth: "100%" }}>
        <h2
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#111",
            margin: "0 0 0.25rem 0",
          }}
        >
          Clarification path
        </h2>
        <p
          style={{
            fontSize: "0.84rem",
            color: "#7a756f",
            lineHeight: 1.55,
            margin: 0,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          Earlier reflections can be expanded when needed, while the latest response remains visible.
        </p>

        {renderInitialSituationCard()}

        {archivedPanels.length > 0 && (
          <div
            style={{
              marginTop: "1rem",
              backgroundColor: "#ffffff",
              border: "1px solid #e7e5e4",
              borderRadius: "16px",
              padding: "0.35rem 1.25rem 1rem",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            {archivedPanels.map((panel) => renderCollapsiblePanel(panel))}
          </div>
        )}

        {activePanel && renderActiveResponse(activePanel)}
      </div>
    );
  }

  function renderSupplementaryResult(response: VirekaResponse) {
    if (response.mode === "clarify") {
      return null;
    }

    return (
      <div
        ref={resultRef}
        style={{
          marginTop: "1.5rem",
          backgroundColor: "#ffffff",
          border: "1px solid #e7e5e4",
          borderRadius: "16px",
          padding: "1.6rem 1.25rem",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "0.25rem" }}>
          <h3
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8e8a84",
              margin: "0 0 0.7rem 0",
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
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {response.message}
          </p>
        </div>
      </div>
    );
  }

  function renderTopActionRow() {
    return (
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => startListening("top")}
          disabled={isTopMicDisabled}
          style={{
            padding: "0.7rem 1rem",
            backgroundColor: "#fff",
            color: "#111",
            border: "1px solid #d6d3d1",
            borderRadius: "999px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: isTopMicDisabled ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            opacity: isTopMicDisabled ? 0.6 : 1,
          }}
        >
          {listeningTarget === "top" ? "Listening…" : "Mic"}
        </button>

        <button
          type="button"
          onClick={() => handleClarify("top")}
          disabled={isTopClarifyDisabled}
          style={{
            flexShrink: 0,
            padding: "0.7rem 1.75rem",
            backgroundColor: isTopClarifyDisabled ? "#ccc" : "#111",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: isTopClarifyDisabled ? "not-allowed" : "pointer",
            transition: "background-color 0.15s",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!isTopClarifyDisabled)
              e.currentTarget.style.backgroundColor = "#333";
          }}
          onMouseLeave={(e) => {
            if (!isTopClarifyDisabled)
              e.currentTarget.style.backgroundColor = "#111";
          }}
        >
          {loading ? "Clarifying…" : "Clarify"}
        </button>
      </div>
    );
  }

  function renderFollowupBox() {
    if (!result || isDone || !lastClarifyResult) return null;

    return (
      <div
        style={{
          marginTop: "1.75rem",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e7e5e4",
          padding: "1.6rem 1.25rem 1.35rem",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <label
          htmlFor="clarify-followup-input"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#111",
            marginBottom: "0.875rem",
          }}
        >
          Refine further (optional)
        </label>

        <textarea
          id="clarify-followup-input"
          value={followupInput}
          onChange={(e) => setFollowupInput(e.target.value)}
          disabled={loading}
          placeholder="Add any detail that may help distinguish what appears to be happening, what may be assumed, or what may remain unclear."
          rows={6}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
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
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#aaa"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e7e5e4"; }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#888", lineHeight: 1.55, margin: 0 }}>
            Additional detail may help separate observation from interpretation.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: "0.35rem",
            }}
          >
            <button
              type="button"
              onClick={() => startListening("followup")}
              disabled={isFollowupMicDisabled}
              style={{
                padding: "0.7rem 1rem",
                backgroundColor: "#fff",
                color: "#111",
                border: "1px solid #d6d3d1",
                borderRadius: "999px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: isFollowupMicDisabled ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                opacity: isFollowupMicDisabled ? 0.6 : 1,
              }}
            >
              {listeningTarget === "followup" ? "Listening…" : "Mic"}
            </button>

            <button
              type="button"
              onClick={() => handleClarify("followup")}
              disabled={isFollowupClarifyDisabled}
              style={{
                flexShrink: 0,
                padding: "0.7rem 1.75rem",
                backgroundColor: isFollowupClarifyDisabled ? "#ccc" : "#111",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: isFollowupClarifyDisabled ? "not-allowed" : "pointer",
                transition: "background-color 0.15s",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isFollowupClarifyDisabled)
                  e.currentTarget.style.backgroundColor = "#333";
              }}
              onMouseLeave={(e) => {
                if (!isFollowupClarifyDisabled)
                  e.currentTarget.style.backgroundColor = "#111";
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
                border: "1px solid #b8b5b0",
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
    );
  }

  function resetSession(): void {
    setTopInput("");
    setFollowupInput("");
    setResult(null);
    setLastClarifyResult(null);
    setHistory([]);
    setError(null);
    setIsDone(false);
    setInitialSituation("");
    setIterations([]);
    setOpenPanelIds([]);
    setLatestPanelId(null);
  }

  return (
  <div>
    {checkedOnboarding && (
      <OnboardingModal
        isOpen={showOnboarding}
        onBegin={handleBeginOnboarding}
        onDismiss={handleDismissOnboarding}
      />
    )}

        <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f3ef",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        color: "#111",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {isDone ? (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.25rem",
            boxSizing: "border-box",
          }}
        >
                    <DoneState
            onCopy={handleCopyResult}
            onNew={handleStartNew}
            onHome={handleReturnHome}
            copyLabel={copyLabel}
          />
        </div>
      ) : (
        <div
          style={{
            maxWidth: "780px",
            width: "100%",
            boxSizing: "border-box",
            margin: "0 auto",
            padding: "1.5rem 1.25rem 4rem",
            overflowX: "hidden",
            minWidth: 0,
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

        <div style={{ maxWidth: "640px", minWidth: 0, width: "100%" }}>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.6, margin: "0 0 0.75rem 0" }}>
            Describe the situation as it currently appears.
          </p>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.65, margin: 0 }}>
            Vireka distinguishes what appears to be happening, what may be assumed, and
            what may remain unclear so response can begin from clearer structure.
          </p>
        </div>

        {iterations.length === 0 && (
  <div
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      border: "1px solid #e7e5e4",
      padding: "1.6rem 1.25rem 1.35rem",
      maxWidth: "100%",
      minWidth: 0,
      boxSizing: "border-box",
    }}
  >
    <label
      htmlFor="clarify-input"
      style={{
        display: "block",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#111",
        marginBottom: "0.875rem",
      }}
    >
      Situation
    </label>

    <textarea
      ref={topInputRef}
      id="clarify-input"
      value={topInput}
      onChange={(e) => setTopInput(e.target.value)}
      disabled={loading}
      placeholder="Example: The situation suggests a need for action, but the factors shaping the outcome are not yet clear."
      rows={8}
      style={{
        display: "block",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
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
        overflowWrap: "anywhere",
        wordBreak: "break-word",
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
        minWidth: 0,
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
          minWidth: 0,
        }}
      >
        Include the situation as it currently appears, even if interpretation or uncertainty are present.
      </p>

      {renderTopActionRow()}
    </div>
  </div>
)}

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
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {error}
          </div>
        )}

        {!isDone && renderClarificationPath()}
        {!isDone && result && renderSupplementaryResult(result)}
        {!isDone && renderFollowupBox()}

        </div>
      )}
    </main>
  </div>
);
}
