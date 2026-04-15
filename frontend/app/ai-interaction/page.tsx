"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CollapsibleLayer from "../../components/CollapsibleLayer";

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

type RequestAction = "clarify" | "plain_language";

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

type PlainLanguageResponse = {
  mode: "plain_language";
  message: string;
};

type CloseResponse = {
  mode: "close";
  message: string;
};

type VirekaResponse = ClarifyResponse | PlainLanguageResponse | CloseResponse;

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

export default function AIInteractionPage() {
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
  const [panelOpenState, setPanelOpenState] = useState<Record<string, boolean>>({});
  const [latestPanelId, setLatestPanelId] = useState<string | null>(null);
  const [plainLanguageByPanelId, setPlainLanguageByPanelId] = useState<
    Record<string, string>
  >({});

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
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

  function truncateSentence(text: string, maxLength = 120): string {
    return truncateText(text, maxLength);
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

  function getPanelSummary(iteration: ClarificationIteration): string {
    const { response, source, submittedInput } = iteration;

    if (response.question?.trim()) {
      return truncateText(response.question);
    }

    if (source === "top") {
      const firstUnknown = response.unknown?.[0];
      if (firstUnknown) {
        return truncateText(firstUnknown);
      }
      return truncateText(response.orientation);
    }

    const firstSuggestion = getDistinctSuggestedQuestions(response)[0];
    if (firstSuggestion) {
      return truncateText(firstSuggestion);
    }

    if (submittedInput.trim()) {
      return truncateText(submittedInput);
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
        summary: getPanelSummary(topIteration),
        iteration: topIteration,
      });
    }

    for (const iteration of followupIterations) {
      panels.push({
        id: `panel-${iteration.id}`,
        kind: "refinement",
        title: `Refinement ${iteration.step - 1}`,
        summary: getPanelSummary(iteration),
        iteration,
      });
    }

    return panels;
  }

  function isPanelOpen(panelId: string): boolean {
    return !!panelOpenState[panelId];
  }

  function togglePanel(panelId: string): void {
    setPanelOpenState((prev) => ({
      ...prev,
      [panelId]: !prev[panelId],
    }));
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
    if (response.mode === "close" || response.mode === "plain_language") {
      return response.message;
    }

    const distinctSuggestedQuestions = getDistinctSuggestedQuestions(response);

    const sections = [
      `What appears to be happening:\n${response.observable.join("\n")}`,
      `What may be assumed:\n${response.interpretive.join("\n")}`,
      `What may remain unclear:\n${response.unknown.join("\n")}`,
      `What may be influencing the AI interaction:\n${response.structural.join("\n")}`,
      `Orientation:\n${response.orientation}`,
    ];

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

    if (action === "plain_language" && !lastClarifyResult) {
      setError("There is nothing to restate in plain language yet.");
      return;
    }

    setLoading(true);
    setError(null);
    setIsDone(false);

    try {
      const payload =
        action === "plain_language"
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

          setPanelOpenState((prev) => ({
            ...prev,
            [panelId]: true,
          }));

          if (source === "top" && !initialSituation) {
            setInitialSituation(trimmed);
          }
        } else {
          setLastClarifyResult(null);
        }
      }

      if (action === "plain_language") {
        const assistantTurn: ConversationTurn = {
          role: "assistant",
          content: formatResponseForHistory(typedData),
        };

        setHistory((prev) => [...prev, assistantTurn]);

        if (
          typedData.mode === "plain_language" &&
          latestPanelId &&
          latestPanelId.trim()
        ) {
          setPlainLanguageByPanelId((prev) => ({
            ...prev,
            [latestPanelId]: typedData.message,
          }));

          setPanelOpenState((prev) => ({
            ...prev,
            [latestPanelId]: true,
          }));
        }
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
    void submitToClarify("plain_language", "followup");
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

    redirectTimeoutRef.current = setTimeout(() => {
      router.push("/");
    }, 1800);
  }

  const panels = getPanels();

  const isTopClarifyDisabled = loading || !topInput.trim();
  const isFollowupClarifyDisabled = loading || !followupInput.trim();
  const isPlainLanguageDisabled = loading || !lastClarifyResult || isDone;
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
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderPlainLanguageButton(show: boolean) {
    if (!show) return null;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "1.65rem",
        }}
      >
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
            backgroundColor: isPlainLanguageDisabled ? "#ccc" : "#111",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontSize: "0.76rem",
            fontWeight: 600,
            lineHeight: 1.05,
            textAlign: "center",
            cursor: isPlainLanguageDisabled ? "not-allowed" : "pointer",
            opacity: isPlainLanguageDisabled ? 0.6 : 1,
            transition: "background-color 0.15s",
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            if (!isPlainLanguageDisabled)
              e.currentTarget.style.backgroundColor = "#333";
          }}
          onMouseLeave={(e) => {
            if (!isPlainLanguageDisabled)
              e.currentTarget.style.backgroundColor = "#111";
          }}
        >
          <span>Plain</span>
          <span>Language</span>
        </button>
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
          Initial AI issue
        </h3>
        <p style={{ margin: 0, color: "#333", fontSize: "0.95rem", lineHeight: 1.65 }}>
          {initialSituation}
        </p>
      </div>
    );
  }

  function renderInitialSituationReferenceBar(panel: ClarificationPanel) {
    const isRefinement = panel.kind === "refinement";
    const refinementNumber = panel.iteration.step - 1;

    if (!isRefinement || refinementNumber < 2 || !initialSituation) return null;

    return (
      <div
        style={{
          margin: "0 0 1.25rem 1.7rem",
          padding: "0.7rem 0 0.85rem 0",
          borderBottom: "1px solid #eeeae5",
        }}
      >
        <div
          style={{
            fontSize: "0.69rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9a948d",
            marginBottom: "0.35rem",
          }}
        >
          Initial AI issue
        </div>
        <p style={{ margin: 0, color: "#6f6a64", fontSize: "0.86rem", lineHeight: 1.55 }}>
          {truncateSentence(initialSituation, 150)}
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

    const shouldShowPlainLanguageButton =
      panel.id === latestPanelId &&
      response === lastClarifyResult &&
      !plainLanguageByPanelId[panel.id];

    const plainLanguageMessage = plainLanguageByPanelId[panel.id];

    return (
      <div style={{ padding: "0 0 0.1rem 0" }}>
        {renderInitialSituationReferenceBar(panel)}

        {showYourInput && (
          <div
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #eceae7",
              borderRadius: "10px",
              padding: "0.9rem 1rem",
              marginBottom: "1.5rem",
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
            <p style={{ margin: 0, color: "#444", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {showYourInput}
            </p>
          </div>
        )}

        {renderPlainLanguageButton(shouldShowPlainLanguageButton)}

        {plainLanguageMessage ? (
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
              Plain language
            </h3>
            <p style={{ color: "#333", margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }}>
              {plainLanguageMessage}
            </p>
          </div>
        ) : (
          <>
            {renderList(response.observable, "What appears to be happening")}
            {renderList(response.interpretive, "What may be assumed")}
            {renderList(response.unknown, "What may remain unclear")}
            {renderList(
              response.structural,
              "What may be influencing the AI interaction"
            )}
          </>
        )}

        <div style={{ marginBottom: response.question ? "1.75rem" : 0 }}>
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
            Orientation
          </h3>
          <p style={{ color: "#333", margin: 0, fontSize: "0.95rem", lineHeight: 1.65 }}>
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
              marginBottom: refinementQuestions.length > 0 ? "1.25rem" : 0,
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

        {refinementQuestions.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8e8a84",
                margin: "0 0 0.75rem 0",
              }}
            >
              Suggested refinements
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
            >
              {refinementQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFollowupInput(q);
                    void submitToClarify("clarify", "followup", q);
                  }}
                  disabled={loading}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.85rem 1rem",
                    backgroundColor: "#fff",
                    border: "1px solid #e7e5e4",
                    borderRadius: "10px",
                    color: "#333",
                    fontSize: "0.88rem",
                    lineHeight: 1.45,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor = "#111";
                      e.currentTarget.style.backgroundColor = "#fafafa";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor = "#e7e5e4";
                      e.currentTarget.style.backgroundColor = "#fff";
                    }
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderClarificationPath() {
    if (panels.length === 0) return null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {panels.map((panel, idx) => {
          const showYourInput =
            panel.kind === "refinement"
              ? panel.iteration.submittedInput
              : undefined;

          return (
            <CollapsibleLayer
              key={panel.id}
              isOpen={isPanelOpen(panel.id)}
              onToggle={() => togglePanel(panel.id)}
              title={panel.title}
              summary={panel.summary}
            >
              {renderClarifyContent(panel, showYourInput)}
            </CollapsibleLayer>
          );
        })}
      </div>
    );
  }

  function renderFollowupBox() {
    if (!lastClarifyResult || isDone) return null;

    return (
      <div
        style={{
          marginTop: panels.length > 0 ? "1.5rem" : "1.25rem",
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <textarea
            value={followupInput}
            onChange={(e) => setFollowupInput(e.target.value)}
            placeholder="Respond to a suggestion or share more detail…"
            style={{
              width: "100%",
              minHeight: "140px",
              padding: "1.25rem 3.5rem 1.25rem 1.25rem",
              borderRadius: "16px",
              border: "1px solid #d6d3d1",
              fontSize: "1rem",
              lineHeight: 1.6,
              outline: "none",
              resize: "none",
              backgroundColor: "#fff",
              color: "#111",
            }}
          />
          <button
            type="button"
            onClick={() => startListening("followup")}
            disabled={isFollowupMicDisabled}
            style={{
              position: "absolute",
              right: "1.1rem",
              top: "1.1rem",
              background: "none",
              border: "none",
              cursor: isFollowupMicDisabled ? "not-allowed" : "pointer",
              padding: "0.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isFollowupMicDisabled ? 0.3 : 0.7,
              transition: "opacity 0.15s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="19"
                x2="12"
                y2="23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            onClick={() => handleClarify("followup")}
            disabled={isFollowupClarifyDisabled}
            style={{
              padding: "0.72rem 1.4rem",
              backgroundColor: isFollowupClarifyDisabled ? "#ccc" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: isFollowupClarifyDisabled ? "not-allowed" : "pointer",
              opacity: isFollowupClarifyDisabled ? 0.6 : 1,
            }}
          >
            {loading ? "Refining…" : "Refine situation"}
          </button>

          <button
            type="button"
            onClick={handleDone}
            disabled={isDoneDisabled}
            style={{
              padding: "0.72rem 1.4rem",
              backgroundColor: "transparent",
              color: isDoneDisabled ? "#999" : "#111",
              border: "1px solid",
              borderColor: isDoneDisabled ? "#e5e7eb" : "#d6d3d1",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: isDoneDisabled ? "not-allowed" : "pointer",
            }}
          >
            I'm finished
          </button>
        </div>
      </div>
    );
  }

  function renderSupplementaryResult(res: VirekaResponse) {
    if (res.mode !== "close" && res.mode !== "plain_language") return null;

    return (
      <div
        style={{
          marginTop: "1.5rem",
          backgroundColor: "#fff",
          border: "1px solid #e7e5e4",
          borderRadius: "16px",
          padding: "1.4rem 1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8e8a84",
            margin: "0 0 0.8rem 0",
          }}
        >
          {res.mode === "close" ? "Final Response" : "Current restatement"}
        </h3>
        <p style={{ margin: 0, color: "#111", fontSize: "0.95rem", lineHeight: 1.7 }}>
          {res.message}
        </p>
      </div>
    );
  }

  function resetAll() {
    setTopInput("");
    setFollowupInput("");
    setResult(null);
    setLastClarifyResult(null);
    setError(null);
    setHistory([]);
    setIsDone(false);
    setInitialSituation("");
    setIterations([]);
    setPanelOpenState({});
    setLatestPanelId(null);
    setPlainLanguageByPanelId({});
  }

  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "2.5rem 1.25rem 6rem 1.25rem",
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.5rem",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          VIREKA
        </Link>
        <button
          onClick={resetAll}
          style={{
            fontSize: "0.85rem",
            color: "#666",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Clear
        </button>
      </header>

      <div style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#111",
            marginBottom: "0.75rem",
            letterSpacing: "-0.025em",
          }}
        >
          AI Interaction
        </h1>
        <p style={{ color: "#555", fontSize: "1.05rem", lineHeight: 1.5 }}>
          Understand why an AI model is responding in a certain way and refine
          your prompt.
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ position: "relative" }}>
          <textarea
            value={topInput}
            onChange={(e) => setTopInput(e.target.value)}
            disabled={!!lastClarifyResult}
            placeholder="Paste the prompt you used and describe the AI's response…"
            style={{
              width: "100%",
              minHeight: "160px",
              padding: "1.25rem 3.5rem 1.25rem 1.25rem",
              borderRadius: "16px",
              border: "1px solid #d6d3d1",
              fontSize: "1rem",
              lineHeight: 1.6,
              outline: "none",
              resize: "none",
              backgroundColor: lastClarifyResult ? "#fafafa" : "#fff",
              color: lastClarifyResult ? "#666" : "#111",
            }}
          />
          {!lastClarifyResult && (
            <button
              type="button"
              onClick={() => startListening("top")}
              disabled={isTopMicDisabled}
              style={{
                position: "absolute",
                right: "1.1rem",
                top: "1.1rem",
                background: "none",
                border: "none",
                cursor: isTopMicDisabled ? "not-allowed" : "pointer",
                padding: "0.4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isTopMicDisabled ? 0.3 : 0.7,
                transition: "opacity 0.15s",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="19"
                  x2="12"
                  y2="23"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {!lastClarifyResult && (
          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              onClick={() => handleClarify("top")}
              disabled={isTopClarifyDisabled}
              style={{
                padding: "0.72rem 1.4rem",
                backgroundColor: isTopClarifyDisabled ? "#ccc" : "#111",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: isTopClarifyDisabled ? "not-allowed" : "pointer",
                transition: "background-color 0.15s",
              }}
            >
              {loading ? "Analyzing…" : "Analyze interaction"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "1rem 1.25rem",
            backgroundColor: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "12px",
            color: "#e11d48",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {renderClarificationPath()}
        {result && renderSupplementaryResult(result)}
        {!isDone && renderFollowupBox()}

        {isDone && (
          <div
            ref={resultRef}
            style={{
              marginTop: "1.5rem",
              backgroundColor: "#ffffff",
              border: "1px solid #e7e5e4",
              borderRadius: "16px",
              padding: "1.6rem 1.25rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#111",
                margin: "0 0 0.5rem 0",
              }}
            >
              Clarity established
            </h3>
            <p style={{ color: "#555", margin: "0 0 1.25rem 0", fontSize: "0.95rem", lineHeight: 1.65 }}>
              Clear structure supports better interaction.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={loading}
              style={{
                padding: "0.72rem 1.1rem",
                backgroundColor: "#fff",
                color: "#111",
                border: "1px solid #d6d3d1",
                borderRadius: "999px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Start new situation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
