"use client";

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
  const [openPanelIds, setOpenPanelIds] = useState<string[]>([]);
  const [latestPanelId, setLatestPanelId] = useState<string | null>(null);
  const [plainLanguageByPanelId, setPlainLanguageByPanelId] = useState<
    Record<string, string>
  >({});

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
      if (mainQuestionNormalized && normalized === mainQuestionNormalized) {
        continue;
      }
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
    if (response.mode === "close" || response.mode === "plain_language") {
      return response.message;
    }

    const distinctSuggestedQuestions = getDistinctSuggestedQuestions(response);

    const sections = [
      `What appears to be happening:\n${response.observable.join("\n")}`,
      `What may be assumed:\n${response.interpretive.join("\n")}`,
      `What may remain unclear:\n${response.unknown.join("\n")}`,
      `What may be influencing the AI interaction:\n${response.structural.join(
        "\n"
      )}`,
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

      if (action === "clarify") {
        const userTurn: ConversationTurn = {
          role: "user",
          content: trimmed,
        };

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
          setOpenPanelIds([panelId]);

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

          setOpenPanelIds((prev) =>
            prev.includes(latestPanelId) ? prev : [...prev, latestPanelId]
          );
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
    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
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
            if (!isPlainLanguageDisabled) {
              e.currentTarget.style.backgroundColor = "#333";
            }
          }}
          onMouseLeave={(e) => {
            if (!isPlainLanguageDisabled) {
              e.currentTarget.style.backgroundColor = "#111";
            }
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
        <p
          style={{
            margin: 0,
            color: "#333",
            fontSize: "0.95rem",
            lineHeight: 1.65,
          }}
        >
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
        <p
          style={{
            margin: 0,
            color: "#6f6a64",
            fontSize: "0.86rem",
            lineHeight: 1.55,
          }}
        >
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
    <div style={{ padding: "0 0.25rem 0.1rem 1.7rem" }}>
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
          <p
            style={{
              margin: 0,
              color: "#444",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
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
          <p
            style={{
              color: "#333",
              margin: 0,
              fontSize: "0.95rem",
              lineHeight: 1.7,
            }}
          >
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.7rem",
            }}
          >
            {refinementQuestions.map((item, index) => (
              <div
                key={`${panel.id}-${item}-${index}`}
                style={{
                  padding: "0.9rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid #e7e5e4",
                  backgroundColor: "#fff",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#333",
                    fontSize: "0.92rem",
                    lineHeight: 1.55,
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
  panel: ClarificationPanel,
  isLastPanel: boolean
) {
  const open = isPanelOpen(panel.id);
  const isLatest = panel.id === latestPanelId;
  const showYourInput =
    panel.kind === "refinement" ? panel.iteration.submittedInput : undefined;

  return (
    <div
      key={panel.id}
      ref={isLatest ? resultRef : null}
      style={{
        marginTop: "1rem",
      }}
    >
      <CollapsibleLayer
        title={panel.title}
        summary={panel.summary}
        isOpen={open}
        onToggle={() => togglePanel(panel.id)}
        contentClassName=""
      >
        <div
          style={{
            paddingBottom: isLastPanel ? "0.25rem" : "0.1rem",
          }}
        >
          {renderClarifyContent(panel, showYourInput)}
        </div>
      </CollapsibleLayer>
    </div>
  );
}

  function renderClarificationPath() {
    if (panels.length === 0 && !initialSituation) return null;

    return (
      <div style={{ marginTop: "2rem" }}>
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
          }}
        >
          The initial AI issue remains visible. Each refinement can be expanded
          when needed.
        </p>

        {renderInitialSituationCard()}

        <div
          style={{
            marginTop: "1rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e7e5e4",
            borderRadius: "16px",
            padding: "0.35rem 1.25rem 1rem",
          }}
        >
          {panels.map((panel, index) =>
            renderCollapsiblePanel(panel, index === panels.length - 1)
          )}
        </div>
      </div>
    );
  }

  function renderSupplementaryResult(response: VirekaResponse) {
    if (response.mode === "clarify" || response.mode === "plain_language") {
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
          padding: "2rem 1.75rem",
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
            if (!isTopClarifyDisabled) {
              e.currentTarget.style.backgroundColor = "#333";
            }
          }}
          onMouseLeave={(e) => {
            if (!isTopClarifyDisabled) {
              e.currentTarget.style.backgroundColor = "#111";
            }
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
            Continue the same AI issue, respond to the clarifying question, or
            add what may help distinguish the prompt, the objective, and the
            output.
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
                if (!isFollowupClarifyDisabled) {
                  e.currentTarget.style.backgroundColor = "#333";
                }
              }}
              onMouseLeave={(e) => {
                if (!isFollowupClarifyDisabled) {
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
    setPlainLanguageByPanelId({});
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
          See clearly before deciding what to ask AI to do.
        </h1>

        <div style={{ maxWidth: "680px" }}>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#444",
              lineHeight: 1.65,
              margin: "0 0 0.75rem 0",
            }}
          >
            Describe the prompt, output issue, or AI-related situation as it
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
            What is happening in the AI interaction?
          </label>

          <textarea
            id="ai-input"
            value={topInput}
            onChange={(e) => setTopInput(e.target.value)}
            disabled={loading}
            placeholder="Describe the prompt, the output, what seems off, or what is making the interaction unclear."
            rows={7}
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
              Include the prompt, the objective, the output, or anything that
              may help clarify where the interaction feels off.
            </p>

            {renderTopActionRow()}
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.9rem 1rem",
              backgroundColor: "#fff4f4",
              border: "1px solid #f0caca",
              borderRadius: "10px",
              color: "#8a2d2d",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {renderClarificationPath()}

        {result && renderSupplementaryResult(result)}

        {renderFollowupBox()}

        {(result || initialSituation || iterations.length > 0 || isDone) && (
          <div style={{ marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={resetSession}
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
              Start over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
