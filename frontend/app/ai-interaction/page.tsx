"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import CollapsibleLayer from "../../components/CollapsibleLayer";
import OnboardingModal from "../../components/OnboardingModal";
import DoneState from "../../components/DoneState";
import InterpretationInput from "../../components/InterpretationInput";
import IntegratedViewTtsButton from "../../components/IntegratedViewTtsButton";

import { getClarifyRequestHeaders } from "../../lib/clarifyRequestHeaders";
import { getOrCreateAnonymousId } from "../../lib/anonymous";
import { useLanguage } from "../../lib/i18n/useLanguage";

/** Matches API body when daily free limit is exceeded (see app/api/clarify/route.ts). */
const FREE_USAGE_LIMIT_ERROR_EN =
  "You’ve reached your limit for today. You may continue tomorrow or upgrade for extended access.";

type RequestAction = "clarify" | "integrated_view";

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
type IntegratedViewResponse = {
  mode: "integrated_view";
  message: string;
};

type CloseResponse = {
  mode: "close";
  message: string;
};

type VirekaResponse =
  | (ClarifyResponse & { conversationId?: string | null })
  | (IntegratedViewResponse & { conversationId?: string | null })
  | (CloseResponse & { conversationId?: string | null });

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
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [initialSituation, setInitialSituation] = useState<string>("");
  const [iterations, setIterations] = useState<ClarificationIteration[]>([]);
  const [openPanelIds, setOpenPanelIds] = useState<string[]>([]);
  const [latestPanelId, setLatestPanelId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [checkedOnboarding, setCheckedOnboarding] = useState(false);
  const { t, language } = useLanguage();
  const [copyLabel, setCopyLabel] = useState(t.aiInteraction.copyResult);
  const topInputRef = useRef<HTMLTextAreaElement | null>(null);
  const pathTopRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const copyResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  getOrCreateAnonymousId();
}, []);
  
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
  };
}, []);

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
        title: t.aiInteraction.initialReflection,
        summary: "",
        iteration: topIteration,
      });
    }

    for (const iteration of followupIterations) {
      panels.push({
        id: `panel-${iteration.id}`,
        kind: "refinement",
        title: `${t.aiInteraction.refinement} ${iteration.step - 1}`,
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

  function formatResponseForHistory(response: VirekaResponse): string {
  if (response.mode === "close") {
    return response.message;
  }

  if (response.mode === "integrated_view") {
    return response.message;
  }

  const distinctSuggestedQuestions = getDistinctSuggestedQuestions(response);

  const sections = [
    `${t.aiInteraction.whatAppearsToBeHappening}:\n${response.observable.join("\n")}`,
    `${t.aiInteraction.whatMayBeAssumed}:\n${response.interpretive.join("\n")}`,
    `${t.aiInteraction.whatMayRemainUnclear}:\n${response.unknown.join("\n")}`,
    `${t.aiInteraction.whatMayBeInfluencingTheAIInteraction}:\n${response.structural.join("\n")}`,
  ];

  if (response.orientation.trim()) {
    sections.push(response.orientation.trim());
  }

  if (response.question) {
    sections.push(`${t.aiInteraction.clarifyingQuestion}:\n${response.question}`);
  }

  if (distinctSuggestedQuestions.length) {
    sections.push(
      `${t.aiInteraction.suggestedQuestions}:\n${distinctSuggestedQuestions.join("\n")}`
    );
  }

  return sections.join("\n\n");
}
  
  async function submitToClarify(
    action: RequestAction,
    source: "top" | "followup",
    overrideInput?: string
  ): Promise<boolean> {
    const sourceValue = source === "top" ? topInput : followupInput;
    const effectiveInput =
      typeof overrideInput === "string" ? overrideInput : sourceValue;
    const trimmed = effectiveInput.trim();

    if (action === "clarify" && !trimmed) {
      setError(t.aiInteraction.pleaseEnterASituationOrResponse);
      return false;
    }

    setLoading(true);
    setError(null);
    setIsDone(false);

    try {
      const anonymousId = getOrCreateAnonymousId();
      const payload = {
      input: trimmed,
      action,
      history,
      context: "ai-interaction",
      anonymousId,
      conversationId,
      language,
    };

      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: await getClarifyRequestHeaders(anonymousId),
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
      
      if (typedData.conversationId) {
      setConversationId(typedData.conversationId);
      }

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
    },  2000);
}
      
      setTimeout(() => {
        const target = pathTopRef.current ?? resultRef.current;
        target?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === FREE_USAGE_LIMIT_ERROR_EN) {
        setError(t.aiInteraction.usageLimitBody);
      } else {
        setError(msg || t.aiInteraction.anUnexpectedErrorOccurred);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  function handleIntegratedView(): void {
  if (!lastClarifyResult) return;

  void submitToClarify(
    "integrated_view",
    "followup",
    ""
  );
}
  
  function handleCopyResult(): void {
  if (!result) return;

  let text = "";

  if (result.mode === "close") {
    text = result.message;
  } else if (result.mode === "integrated_view") {
    text = result.message;
  } else {
    text = [
      t.aiInteraction.whatAppearsToBeHappening + ",",
      ...result.observable,
      "",
      t.aiInteraction.whatMayBeAssumed + ",",
      ...result.interpretive,
      "",
      t.aiInteraction.whatMayRemainUnclear + ",",
      ...result.unknown,
      "",
      t.aiInteraction.whatMayBeInfluencingTheAIInteraction + ",",
      ...result.structural,
      ...(result.orientation.trim()
        ? ["", t.aiInteraction.integratedView + ":", result.orientation.trim()]
        : []),
      ...(result.question ? ["", t.aiInteraction.clarifyingQuestion + ":", result.question] : []),
      ...(
        result.suggestedQuestions?.length
          ? ["", t.aiInteraction.suggestedQuestions + ":", ...result.suggestedQuestions]
          : []
      ),
    ].join("\n");
  }

  const resetLabel = () => {
    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = setTimeout(() => {
      setCopyLabel(t.aiInteraction.copyResult);
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
      setCopyLabel(t.aiInteraction.copied);
    } else {
      setCopyLabel(t.aiInteraction.couldNotCopy);
    }
    resetLabel();
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyLabel(t.aiInteraction.copied);
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
  setCopyLabel(t.aiInteraction.copyResult);
  resetSession();
}

  function handleBeginOnboarding(): void {
  window.localStorage.setItem("vireka_onboarding_accepted", "true");
  setShowOnboarding(false);
  topInputRef.current?.focus();
}

function handleDismissOnboarding(): void {
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
  const hasClarificationHistory = iterations.length > 0;
  const hasInitialClarifyResponse = iterations.some((it) => it.source === "top");
  const canShowDoneButton =
    hasInitialClarifyResponse &&
    result !== null &&
    result.mode === "clarify" &&
    !loading;
  const composerValue = hasClarificationHistory ? followupInput : topInput;
  const composerPlaceholder = hasClarificationHistory
    ? t.aiInteraction.followupPlaceholder
    : t.aiInteraction.inputPlaceholder;
  const composerSource: "top" | "followup" = hasClarificationHistory
    ? "followup"
    : "top";

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
          {t.aiInteraction.initialAIIssue}
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
              {t.aiInteraction.yourInput}
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

        {renderList(response.observable, t.aiInteraction.whatAppearsToBeHappening)}
        {renderList(response.interpretive, t.aiInteraction.whatMayBeAssumed)}
        {renderList(response.unknown, t.aiInteraction.whatMayRemainUnclear)}
        {renderList(response.structural, t.aiInteraction.whatMayBeInfluencingTheAIInteraction)}

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
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
            flex: 1,
            minWidth: 0,
          }}
        >
          {t.aiInteraction.integratedView}
        </h3>
        <IntegratedViewTtsButton
          key={`${panel.id}-integrated-tts`}
          text={response.orientation.trim()}
          listenLabel={t.aiInteraction.integratedViewListen}
          stopLabel={t.aiInteraction.integratedViewStopAudio}
          errorMessage={t.aiInteraction.ttsCouldNotPlay}
        />
      </div>

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
        {t.aiInteraction.howTheSituationReadsAsAWhole}
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
            {t.aiInteraction.clarifyingQuestion}
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
              {t.aiInteraction.optional}
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
              {t.aiInteraction.suggestedQuestions}
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
          {t.aiInteraction.clarificationPath}
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

  function resetSession(): void {
  setTopInput("");
  setFollowupInput("");
  setResult(null);
  setLastClarifyResult(null);
  setHistory([]);
  setConversationId(null);
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
        minHeight: "100svh",
        backgroundColor: "#f5f3ef",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        color: "#111",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {isDone ? (
        <DoneState
          onCopy={handleCopyResult}
          onNew={handleStartNew}
          copyLabel={copyLabel}
        />
      ) : (
        <div
          style={{
            maxWidth: "780px",
            width: "100%",
            boxSizing: "border-box",
            margin: "0 auto",
            padding: "1.5rem 1.25rem 240px",
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
            ← {t.aiInteraction.backLink}
          </Link>
        </div>

        {!hasClarificationHistory && (
          <>
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
          {t.aiInteraction.heroTitle}
        </h1>

        <div
          style={{
            borderTop: "1px solid #e7e5e4",
            marginTop: "2.25rem",
            marginBottom: "2.25rem",
          }}
        />
        <div style={{ minHeight: "clamp(180px, 30vh, 320px)" }} />
          </>
        )}

       {error && (
  <div style={{ marginTop: "1rem" }}>

    <div
      style={{
        fontSize: "0.68rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#8e8a84",
        marginBottom: "0.35rem",
        fontWeight: 600
      }}
    >
      {error === t.aiInteraction.speechRecognitionNotSupported ||
      error.startsWith(t.aiInteraction.microphoneError)
        ? t.aiInteraction.microphoneUnavailableTitle
        : error === t.aiInteraction.usageLimitBody ||
            error === FREE_USAGE_LIMIT_ERROR_EN ||
            error.toLowerCase().includes("limit")
        ? t.aiInteraction.usageLimitNoticeTitle
        : t.aiInteraction.genericNoticeTitle}
    </div>

    <div
      style={{
        padding: "0.9rem 1rem",
        backgroundColor: "#f8f7f4",
        border: "1px solid #e3e0da",
        borderRadius: "10px",
        color: "#333",
        fontSize: "0.9rem",
      }}
    >
      {error === t.aiInteraction.usageLimitBody ||
      error === FREE_USAGE_LIMIT_ERROR_EN
        ? t.aiInteraction.usageLimitBody
        : error}
    </div>

  </div>
)}

        {renderClarificationPath()}
        {result && renderSupplementaryResult(result)}

          </div>
        )}
      {!isDone && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "max(24px, env(safe-area-inset-bottom))",
            width: "100%",
            maxWidth: "780px",
            paddingLeft: "1.25rem",
            paddingRight: "1.25rem",
            boxSizing: "border-box",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            {canShowDoneButton ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "0.4rem",
                }}
              >
                <button
                  type="button"
                  onClick={handleDone}
                  disabled={loading}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: "#8a8580",
                    background: "transparent",
                    border: "none",
                    padding: "0.15rem 0.1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(138, 133, 128, 0.4)",
                    textUnderlineOffset: "0.2em",
                    opacity: loading ? 0.45 : 1,
                  }}
                >
                  {t.aiInteraction.doneButton}
                </button>
              </div>
            ) : null}
            <InterpretationInput
              textareaRef={topInputRef}
              id="ai-input-composer"
              transcribingLabel={t.aiInteraction.transcribing}
              helperText=""
              placeholder={composerPlaceholder}
              value={composerValue}
              onChange={(e) => {
                if (hasClarificationHistory) {
                  setFollowupInput(e.target.value);
                } else {
                  setTopInput(e.target.value);
                }
              }}
              disabled={loading}
              voiceEnabled
              clarifyLoading={loading}
              clarifyLoadingLabel={t.aiInteraction.loadingText}
              onSend={() => submitToClarify("clarify", composerSource)}
              surfaceVariant="composer"
              cardStyle={{
                borderColor: "#dfdcd6",
              }}
            />
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
