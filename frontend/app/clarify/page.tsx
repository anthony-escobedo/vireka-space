"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import CollapsibleLayer from "../../components/CollapsibleLayer";

import { usePathname, useRouter } from "next/navigation";
import DoneState from "../../components/DoneState";
import InterpretationInput from "../../components/InterpretationInput";
import IntegratedViewTtsButton from "../../components/IntegratedViewTtsButton";

import { getClarifyRequestHeaders } from "../../lib/clarifyRequestHeaders";
import type { PlanId } from "../../lib/plans";
import { getSupabaseClient } from "../../lib/supabaseClient";
import { getOrCreateAnonymousId } from "../../lib/anonymous";
import { normalizeMessageContentToPreviewSource } from "../../lib/historyReadHelpers";
import type { Language } from "../../lib/i18n/config";
import { useLanguage } from "../../lib/i18n/useLanguage";
import { parseStoredAssistantContent } from "../../lib/parseStoredClarifyAssistant";
import { saveMarkedClarityToConversation } from "../../lib/saveMarkedClarityToConversation";

/** Matches API body when daily free limit is exceeded (see app/api/clarify/route.ts). */
const FREE_USAGE_LIMIT_ERROR_EN =
  "You’ve reached your limit for today. You may continue tomorrow or upgrade for extended access.";

const ANONYMOUS_ID_KEY = "vireka_anonymous_id";

/** Free tier: first N loaded history entries can be opened; older rows are visible but locked. */
const FREE_HISTORY_VISIBLE_LIMIT = 5;

const RAIL_HISTORY_DISPLAY_LIMIT = 8;

/** Extra history fetches — persistence/read may lag slightly after clarify returns. */
const HISTORY_REFRESH_RETRY_DELAYS_MS = [750, 1500] as const;

const MENU_LINKS = [
  { labelKey: "about", href: "/about" },
  { labelKey: "faq", href: "/faq" },
  { labelKey: "plan", href: "/plan" },
  { labelKey: "privacy", href: "/privacy" },
  { labelKey: "terms", href: "/terms" },
  { labelKey: "contact", href: "/settings/contact" },
] as const;

const MENU_LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
];

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
  currentClarity?: string;
  question?: string;
};

type IntegratedViewResponse = {
  mode: "integrated_view";
  message: string;
  currentClarity?: string;
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

type HistoryConversation = {
  id: string;
  mode: string;
  created_at: string;
  preview: string;
};

type HistoryDetailMessage = {
  id: string;
  role: "user" | "assistant";
  content: unknown;
  created_at: string;
};

export default function ClarifyPage() {
  const [topInput, setTopInput] = useState<string>("");
  const [followupInput, setFollowupInput] = useState<string>("");
  const [result, setResult] = useState<VirekaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [initialSituation, setInitialSituation] = useState<string>("");
  const [iterations, setIterations] = useState<ClarificationIteration[]>([]);
  const [openPanelIds, setOpenPanelIds] = useState<string[]>([]);
  const [latestPanelId, setLatestPanelId] = useState<string | null>(null);
  const [historyConversations, setHistoryConversations] = useState<HistoryConversation[]>([]);
  const [historyHasFullAccess, setHistoryHasFullAccess] = useState(false);
  const [showDesktopHistoryPanel, setShowDesktopHistoryPanel] = useState(false);
  const [selectedHistoryConversationId, setSelectedHistoryConversationId] = useState<
    string | null
  >(null);
  const [historyDetailLoading, setHistoryDetailLoading] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [isReviewingHistorySession, setIsReviewingHistorySession] = useState(false);
  const [markedClarity, setMarkedClarity] = useState<string | null>(null);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [workspaceMenuAuth, setWorkspaceMenuAuth] = useState<{
    ready: boolean;
    email: string | null;
    plan: PlanId | null;
    planLoading: boolean;
  }>({
    ready: false,
    email: null,
    plan: null,
    planLoading: false,
  });
  const { t, language, setLanguage } = useLanguage();
  const [copyLabel, setCopyLabel] = useState(t.clarify.copyResult);
  const [hoveredHistoryEndAction, setHoveredHistoryEndAction] = useState<
    "use" | "new" | null
  >(null);
  const topInputRef = useRef<HTMLTextAreaElement | null>(null);
  const pathTopRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const leftMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuHoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const historyRefreshTimeoutsRef = useRef<number[]>([]);
  const anonymousIdRef = useRef<string | null>(null);
  const topInputValueRef = useRef("");
  const followupInputValueRef = useRef("");
  const historyRef = useRef<ConversationTurn[]>([]);
  const conversationIdRef = useRef<string | null>(null);
  const iterationsRef = useRef<ClarificationIteration[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const homeMode = pathname === "/";

  function getStableAnonymousId(): string {
    try {
      const storedAnonymousId = window.localStorage.getItem(ANONYMOUS_ID_KEY);
      if (storedAnonymousId && storedAnonymousId !== anonymousIdRef.current) {
        anonymousIdRef.current = storedAnonymousId;
        console.log("[clarify anonymous id]", anonymousIdRef.current);
      }
      if (!anonymousIdRef.current) {
        anonymousIdRef.current = getOrCreateAnonymousId();
        console.log("[clarify anonymous id]", anonymousIdRef.current);
      }
    } catch {
      if (!anonymousIdRef.current) {
        anonymousIdRef.current = getOrCreateAnonymousId();
      }
      console.log("[clarify anonymous id]", anonymousIdRef.current);
    }
    return anonymousIdRef.current;
  }

  useEffect(() => {
    topInputValueRef.current = topInput;
  }, [topInput]);

  useEffect(() => {
    followupInputValueRef.current = followupInput;
  }, [followupInput]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    iterationsRef.current = iterations;
  }, [iterations]);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
      for (const id of historyRefreshTimeoutsRef.current) {
        clearTimeout(id);
      }
      historyRefreshTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setWorkspaceMenuAuth({
        ready: true,
        email: null,
        plan: null,
        planLoading: false,
      });
      return;
    }
    const sync = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setWorkspaceMenuAuth({
          ready: true,
          email: null,
          plan: null,
          planLoading: false,
        });
        return;
      }
      const token = session.access_token;
      setWorkspaceMenuAuth({
        ready: true,
        email: session.user.email ?? null,
        plan: null,
        planLoading: true,
      });
      try {
        const res = await fetch("/api/plan/status", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.ok) {
          const j = (await res.json()) as { plan: PlanId };
          setWorkspaceMenuAuth((prev) => ({
            ...prev,
            plan: j.plan,
            planLoading: false,
          }));
        } else {
          setWorkspaceMenuAuth((prev) => ({
            ...prev,
            plan: "free",
            planLoading: false,
          }));
        }
      } catch {
        setWorkspaceMenuAuth((prev) => ({
          ...prev,
          plan: "free",
          planLoading: false,
        }));
      }
    };
    void sync();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void sync();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const anonymousId = getStableAnonymousId();
      const headers = await getClarifyRequestHeaders(anonymousId);
      const res = await fetch(
        `/api/history?anonymousId=${encodeURIComponent(anonymousId)}`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        }
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        conversations?: HistoryConversation[];
        hasFullHistory?: boolean;
      };
      const list = Array.isArray(data.conversations) ? data.conversations : [];
      const full = Boolean(data.hasFullHistory);
      setHistoryHasFullAccess(full);
      setHistoryConversations(
        full ? list : list.slice(0, RAIL_HISTORY_DISPLAY_LIMIT)
      );
      setSelectedHistoryConversationId((prev) => {
        if (!prev) return prev;
        return list.some((c) => c.id === prev) ? prev : null;
      });
    } catch {
      // fail silently
    }
  }, []);

  const scheduleHistoryRefresh = useCallback(() => {
    void loadHistory();
    if (typeof window === "undefined") return;
    for (const id of historyRefreshTimeoutsRef.current) {
      window.clearTimeout(id);
    }
    historyRefreshTimeoutsRef.current = HISTORY_REFRESH_RETRY_DELAYS_MS.map((delay) =>
      window.setTimeout(() => void loadHistory(), delay)
    );
  }, [loadHistory]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setShowDesktopHistoryPanel(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!mobileHistoryOpen || showDesktopHistoryPanel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileHistoryOpen, showDesktopHistoryPanel]);

  useEffect(() => {
    if (typeof document === "undefined" || !leftMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (leftMenuRef.current?.contains(target)) return;
      if (mobileMenuRef.current?.contains(target)) return;
      setLeftMenuOpen(false);
      setLanguageMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [leftMenuOpen]);

  const clearMenuHoverCloseTimer = useCallback(() => {
    if (menuHoverCloseTimerRef.current != null) {
      clearTimeout(menuHoverCloseTimerRef.current);
      menuHoverCloseTimerRef.current = null;
    }
  }, []);

  const handleWorkspaceMenuPointerEnter = useCallback(() => {
    clearMenuHoverCloseTimer();
  }, [clearMenuHoverCloseTimer]);

  const handleWorkspaceMenuPointerLeave = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    if (!leftMenuOpen) return;
    clearMenuHoverCloseTimer();
    menuHoverCloseTimerRef.current = setTimeout(() => {
      setLeftMenuOpen(false);
      setLanguageMenuOpen(false);
      menuHoverCloseTimerRef.current = null;
    }, 200);
  }, [leftMenuOpen, clearMenuHoverCloseTimer]);

  useEffect(() => {
    return () => {
      clearMenuHoverCloseTimer();
    };
  }, [clearMenuHoverCloseTimer]);

  useEffect(() => {
    if (typeof document === "undefined" || !leftMenuOpen) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLeftMenuOpen(false);
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [leftMenuOpen]);

  function truncateText(text: string, maxLength = 78): string {
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) return trimmed;
    return `${trimmed.slice(0, maxLength).trimEnd()}…`;
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
        title: t.clarify.initialReflection,
        summary: "",
        iteration: topIteration,
      });
    }

    for (const iteration of followupIterations) {
      panels.push({
        id: `panel-${iteration.id}`,
        kind: "refinement",
        title: `${t.clarify.refinement} ${iteration.step - 1}`,
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
      if (response.currentClarity?.trim()) {
        return `${response.message}\n\n${t.clarify.currentClarity}:\n${response.currentClarity.trim()}`;
      }
      return response.message;
    }

    const sections = [
      `${t.clarify.whatAppearsToBeHappening}:\n${response.observable.join("\n")}`,
      `${t.clarify.whatMayBeAssumed}:\n${response.interpretive.join("\n")}`,
      `${t.clarify.whatMayRemainUnclear}:\n${response.unknown.join("\n")}`,
      `${t.clarify.whatMayBeInfluencingTheSituation}:\n${response.structural.join("\n")}`,
    ];

    if (response.orientation.trim()) {
      sections.push(response.orientation.trim());
    }

    if (response.currentClarity?.trim()) {
      sections.push(
        `${t.clarify.currentClarity}:\n${response.currentClarity.trim()}`
      );
    }

    if (response.question?.trim()) {
      sections.push(`${t.clarify.clarifyingQuestion}:\n${response.question.trim()}`);
    }

    return sections.join("\n\n");
  }

  function userMessageContentToString(content: unknown): string {
    if (typeof content === "string") return content;
    return normalizeMessageContentToPreviewSource(content);
  }

  function applyConversationDetail(payload: {
    conversation: {
      id: string;
      mode: string;
      created_at: string;
      markedClarity?: string | null;
    };
    messages: HistoryDetailMessage[];
  }): void {
    const msgs = [...payload.messages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const nextIterations: ClarificationIteration[] = [];
    const nextChat: ConversationTurn[] = [];
    let firstUser: string | null = null;
    let lastResult: VirekaResponse | null = null;

    for (let i = 0; i < msgs.length; i++) {
      const u = msgs[i];
      if (u.role !== "user") continue;
      const a = msgs[i + 1];
      if (!a || a.role !== "assistant") break;

      const userText = userMessageContentToString(u.content);
      if (firstUser === null) firstUser = userText;

      const parsed = parseStoredAssistantContent(a.content);
      lastResult = parsed;

      nextChat.push(
        { role: "user", content: userText },
        { role: "assistant", content: formatResponseForHistory(parsed) }
      );

      if (parsed.mode === "clarify") {
        nextIterations.push({
          id: `hist-${a.id}`,
          step: nextIterations.length + 1,
          submittedInput: userText,
          source: nextIterations.length === 0 ? "top" : "followup",
          response: parsed,
        });
      }

      i++;
    }

    setConversationId(payload.conversation.id);
    setHistory(nextChat);
    setIterations(nextIterations);
    setInitialSituation(firstUser ?? "");
    setResult(lastResult);
    const restored =
      typeof payload.conversation.markedClarity === "string" &&
      payload.conversation.markedClarity.trim()
        ? payload.conversation.markedClarity.trim()
        : null;
    setMarkedClarity(restored);
    setTopInput("");
    setFollowupInput("");
    setError(null);
    setIsDone(false);
    // History replay: all reflection/refinement sections start collapsed; user expands manually.
    setOpenPanelIds([]);
    setLatestPanelId(null);
    conversationIdRef.current = payload.conversation.id;
    historyRef.current = nextChat;
    iterationsRef.current = nextIterations;
    topInputValueRef.current = "";
    followupInputValueRef.current = "";
  }

  async function openHistoryConversation(id: string): Promise<void> {
    const previousSelectedHistoryConversationId = selectedHistoryConversationId;
    setSelectedHistoryConversationId(id);
    setHistoryDetailLoading(true);
    setError(null);
    try {
      const anonymousId = getStableAnonymousId();
      const headers = await getClarifyRequestHeaders(anonymousId);
      const res = await fetch(`/api/history/${encodeURIComponent(id)}`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      if (!res.ok) {
        console.warn("[clarify] history detail request failed", res.status);
        setSelectedHistoryConversationId(previousSelectedHistoryConversationId);
        return;
      }
      let data: {
        conversation?: {
          id: string;
          mode: string;
          created_at: string;
          markedClarity?: string | null;
        };
        messages?: { id: string; role: string; content: unknown; created_at: string }[];
      };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        console.warn("[clarify] history detail response was not valid JSON");
        setSelectedHistoryConversationId(previousSelectedHistoryConversationId);
        return;
      }
      if (!data.conversation || !Array.isArray(data.messages)) {
        console.warn("[clarify] history detail payload missing conversation or messages");
        setSelectedHistoryConversationId(previousSelectedHistoryConversationId);
        return;
      }

      const messages: HistoryDetailMessage[] = data.messages.map((m) => ({
        id: String(m.id),
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
        created_at: String(m.created_at),
      }));

      applyConversationDetail({ conversation: data.conversation, messages });
      setIsReviewingHistorySession(true);
      setMobileHistoryOpen(false);
      setTimeout(() => {
        const target = pathTopRef.current ?? resultRef.current;
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (e) {
      console.warn("[clarify] history detail error", e);
      setSelectedHistoryConversationId(previousSelectedHistoryConversationId);
    } finally {
      setHistoryDetailLoading(false);
    }
  }

  async function submitToClarify(
    action: RequestAction,
    source: "top" | "followup",
    overrideInput?: string
  ): Promise<boolean> {
    if (isReviewingHistorySession) return false;

    const isFollowup = iterationsRef.current.length > 0;
    const effectiveSource: "top" | "followup" =
      isFollowup ? "followup" : "top";
    const sourceValue =
      effectiveSource === "top"
        ? topInputValueRef.current
        : followupInputValueRef.current;
    const effectiveInput =
      typeof overrideInput === "string" ? overrideInput : sourceValue;
    const trimmed = effectiveInput.trim();

    if (action === "clarify" && !trimmed) {
      setError(t.clarify.pleaseEnterASituationOrResponse);
      return false;
    }

    setLoading(true);
    setError(null);
    setIsDone(false);

    try {
  
    const anonymousId = getStableAnonymousId();
    const safeConversationId = isFollowup ? conversationIdRef.current : null;
    const requestHistory = isFollowup ? historyRef.current : [];
  
    const payload = {
    input: trimmed,
    action,
    history: requestHistory,
    context: "clarify",
    anonymousId,
    conversationId: safeConversationId,
    language,
  };

      console.log("[clarify submit FINAL]", {
        isFollowup,
        conversationId: safeConversationId,
      });
      console.log("[clarify submit anonymous id]", anonymousId);

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
        conversationIdRef.current = typedData.conversationId;
        setConversationId(typedData.conversationId);
      }

      if (action === "clarify") {
        const userTurn: ConversationTurn = { role: "user", content: trimmed };
        const assistantTurn: ConversationTurn = {
          role: "assistant",
          content: formatResponseForHistory(typedData),
        };

        setHistory((prev) => {
          const next = [...prev, userTurn, assistantTurn];
          historyRef.current = next;
          return next;
        });

        if (effectiveSource === "top") {
          setTopInput("");
          topInputValueRef.current = "";
        } else {
          setFollowupInput("");
          followupInputValueRef.current = "";
        }

        if (typedData.mode === "clarify") {
          const newIteration: ClarificationIteration = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            step: iterationsRef.current.length + 1,
            submittedInput: trimmed,
            source: effectiveSource,
            response: typedData,
          };

          const panelId = `panel-${newIteration.id}`;

          setIterations((prev) => {
            const next = [...prev, newIteration];
            iterationsRef.current = next;
            return next;
          });
          setLatestPanelId(panelId);
          setOpenPanelIds([]);

          if (effectiveSource === "top" && !initialSituation) {
            setInitialSituation(trimmed);
          }
        }
        if (typedData.conversationId) {
          setSelectedHistoryConversationId(typedData.conversationId);
        }
        scheduleHistoryRefresh();
      }

      setResult(typedData);
      setMarkedClarity(null);
      void saveMarkedClarityToConversation(
        typedData.conversationId ?? conversationIdRef.current,
        getStableAnonymousId(),
        null
      );

      if (typedData.mode === "close") {
        setIsDone(true);
      } else {
        setTimeout(() => {
          const target = pathTopRef.current ?? resultRef.current;
          target?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === FREE_USAGE_LIMIT_ERROR_EN) {
        setError(t.clarify.usageLimitBody);
      } else {
        setError(msg || t.clarify.anUnexpectedErrorOccurred);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

function handleCopyResult(): void {
  if (!result) return;

  const text =
    result.mode === "close"
      ? result.message
      : result.mode === "integrated_view"
        ? [
            result.message,
            ...(result.currentClarity?.trim()
              ? ["", t.clarify.currentClarity + ":", result.currentClarity.trim()]
              : []),
          ].join("\n")
        : [
          t.clarify.whatAppearsToBeHappening + ",",
          ...result.observable,
          "",
          t.clarify.whatMayBeAssumed + ",",
          ...result.interpretive,
          "",
          t.clarify.whatMayRemainUnclear + ",",
          ...result.unknown,
          "",
          t.clarify.whatMayBeInfluencingTheSituation + ",",
          ...result.structural,
          ...(result.orientation.trim()
              ? ["", t.clarify.integratedView + ":", result.orientation.trim()]
              : []),
          ...(result.currentClarity?.trim()
            ? ["", t.clarify.currentClarity + ":", result.currentClarity.trim()]
            : []),
          ...(result.question?.trim()
            ? ["", t.clarify.clarifyingQuestion + ":", result.question.trim()]
            : []),
        ].join("\n");

  const resetLabel = () => {
    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = setTimeout(() => {
      setCopyLabel(t.clarify.copyResult);
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
      setCopyLabel(t.clarify.copied);
    } else {
      setCopyLabel(t.clarify.couldNotCopy);
    }
    resetLabel();
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyLabel(t.clarify.copied);
        resetLabel();
      })
      .catch(() => {
        fallbackCopy();
      });
  } else {
    fallbackCopy();
  }
}

function buildAIReadyContext(): string | undefined {
  if (!result || result.mode === "close" || result.mode !== "clarify") {
    return undefined;
  }

  const sections: string[] = [
    "Use the following clarified context as the basis for your response.",
    "",
    "Do not assume unresolved points are facts. Where uncertainty remains, preserve it or ask for clarification before proceeding.",
    "",
    "Context:",
  ];

  const appendListSection = (label: string, items: string[]) => {
    const lines = items.map((item) => item.trim()).filter(Boolean);
    if (!lines.length) return;
    sections.push("", `${label}:`, ...lines.map((item) => `- ${item}`));
  };

  const appendTextSection = (label: string, text: string | undefined) => {
    const value = text?.trim();
    if (!value) return;
    sections.push("", `${label}:`, value);
  };

  appendListSection("What appears to be happening", result.observable);
  appendListSection("What may be assumed", result.interpretive);
  appendListSection("What remains unclear", result.unknown);
  appendListSection("What may be influencing the situation", result.structural);
  appendTextSection("Integrated view", result.orientation);
  if (markedClarity != null && markedClarity.trim() !== "") {
    sections.push(
      "",
      `${t.clarify.markedClarity}:`,
      t.clarify.theUserMarkedTheFollowing,
      `"${markedClarity}"`
    );
  } else {
    appendTextSection(t.clarify.currentClarity, result.currentClarity);
  }

  sections.push(
    "",
    "Task:",
    "",
    "Respond in a way that remains consistent with the clarified context.",
    "",
    "Where appropriate, allow a next step to emerge from what is clear.",
    "",
    "Do not introduce direction that is not supported by the context.",
    "",
    "If needed, ask clarifying questions before proceeding."
  );

  return sections.join("\n");
}

function getHistoryEndActionStyle(action: "use" | "new"): CSSProperties {
  const isActive = hoveredHistoryEndAction === action;
  const hasActivePeer = hoveredHistoryEndAction !== null && !isActive;

  return {
    appearance: "none",
    WebkitAppearance: "none",
    margin: 0,
    padding: "9px 10px",
    border: "none",
    borderBottom: isActive
      ? "1px solid rgba(0,0,0,0.38)"
      : "1px solid rgba(17,17,17,0.2)",
    borderRadius: 0,
    backgroundColor: "transparent",
    color: isActive ? "#0d0d0d" : "#1a1a1a",
    fontSize: "0.95rem",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: 1.35,
    cursor: loading ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
    textAlign: "center",
    minWidth: "200px",
    boxSizing: "border-box",
    opacity: loading ? 0.45 : hasActivePeer ? 0.93 : 1,
    transition: "opacity 0.2s ease, border-color 0.2s ease, color 0.2s ease",
  };
}

  /** History replay: use / start-new. Continuation uses `result` and `iterations` (latest = last item) from `applyConversationDetail`. */
  function renderHistoryEndActionButtons() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.85rem",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={handleUseClarificationFromHistory}
          disabled={loading}
          style={getHistoryEndActionStyle("use")}
          onMouseEnter={() => setHoveredHistoryEndAction("use")}
          onMouseLeave={() => setHoveredHistoryEndAction(null)}
          onFocus={() => setHoveredHistoryEndAction("use")}
          onBlur={() => setHoveredHistoryEndAction(null)}
        >
          {t.history.useThisClarification}
        </button>
        <button
          type="button"
          onClick={handleStartNew}
          disabled={loading}
          style={getHistoryEndActionStyle("new")}
          onMouseEnter={() => setHoveredHistoryEndAction("new")}
          onMouseLeave={() => setHoveredHistoryEndAction(null)}
          onFocus={() => setHoveredHistoryEndAction("new")}
          onBlur={() => setHoveredHistoryEndAction("new")}
        >
          {t.history.startNewSituation}
        </button>
        <button
          type="button"
          onClick={() => {
            void handleDeleteThisHistoryConversation();
          }}
          disabled={loading || historyDetailLoading}
          style={{
            marginTop: "0.35rem",
            background: "none",
            border: "none",
            padding: "0.2rem 0.1rem",
            fontSize: "0.78rem",
            fontWeight: 500,
            color: "rgba(100, 95, 90, 0.92)",
            cursor:
              loading || historyDetailLoading ? "not-allowed" : "pointer",
            opacity: loading || historyDetailLoading ? 0.45 : 1,
            textDecoration: "underline",
            textDecorationColor: "rgba(0,0,0,0.18)",
            textUnderlineOffset: "0.2em",
          }}
        >
          {t.history.deleteFromHistory}
        </button>
      </div>
    );
  }

  async function handleDeleteThisHistoryConversation(): Promise<void> {
    const id = conversationIdRef.current ?? selectedHistoryConversationId;
    if (!id) return;
    if (typeof window !== "undefined") {
      const message = `${t.history.deleteSituationConfirmTitle}\n\n${t.history.deleteSituationConfirmDetail}`;
      if (!window.confirm(message)) {
        return;
      }
    }
    setHistoryDetailLoading(true);
    setError(null);
    try {
      const anonymousId = getStableAnonymousId();
      const headers = await getClarifyRequestHeaders(anonymousId);
      const res = await fetch(`/api/history/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
      });
      if (!res.ok) {
        const errJson = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        console.warn("[clarify] delete history failed", res.status, errJson);
        setError(t.clarify.anUnexpectedErrorOccurred);
        return;
      }
      setHistoryConversations((prev) => prev.filter((c) => c.id !== id));
      if (isReviewingHistorySession) {
        resetSession();
      } else {
        setSelectedHistoryConversationId((prev) =>
          prev === id ? null : prev
        );
        scheduleHistoryRefresh();
      }
    } catch (e) {
      console.warn("[clarify] delete history error", e);
      setError(t.clarify.anUnexpectedErrorOccurred);
    } finally {
      setHistoryDetailLoading(false);
    }
  }

function handleUseClarificationFromHistory(): void {
  if (copyResetTimeoutRef.current) {
    clearTimeout(copyResetTimeoutRef.current);
  }
  setCopyLabel(t.clarify.copyResult);
  setIsReviewingHistorySession(false);
  setIsDone(true);
}

function handleStartNew(): void {
  if (copyResetTimeoutRef.current) {
    clearTimeout(copyResetTimeoutRef.current);
  }
  setCopyLabel(t.clarify.copyResult);
  resetSession();
}
  
  const panels = getPanels();
  const historyReplay = isReviewingHistorySession;
  const archivedPanels = historyReplay ? panels : panels.slice(0, -1);
  const activePanel = historyReplay
    ? null
    : panels.length > 0
      ? panels[panels.length - 1]
      : null;
  const hasClarificationHistory = iterations.length > 0;
  const hasInitialClarifyResponse = iterations.some((it) => it.source === "top");
  const canShowDoneButton =
    hasInitialClarifyResponse &&
    result !== null &&
    result.mode === "clarify" &&
    !loading;
  const composerValue = hasClarificationHistory ? followupInput : topInput;
  const composerPlaceholder = hasClarificationHistory
    ? t.clarify.followupPlaceholder
    : t.clarify.inputPlaceholder;
  const composerSource: "top" | "followup" = hasClarificationHistory
    ? "followup"
    : "top";
  const railHistoryRows = historyHasFullAccess
    ? historyConversations
    : historyConversations.slice(0, RAIL_HISTORY_DISPLAY_LIMIT);
  const hasLockedHistoryRows =
    !historyHasFullAccess && railHistoryRows.length > FREE_HISTORY_VISIBLE_LIMIT;
  const hideInitialHero = hasClarificationHistory || history.length > 0;
  const workspaceTitle = t.clarify.heroTitle;
  const workspaceOrientation = homeMode ? t.clarify.descriptionParagraph : "";

  function renderList(
    items: string[] | undefined,
    label:
      | "whatAppearsToBeHappening"
      | "whatMayBeAssumed"
      | "whatMayRemainUnclear"
      | "whatMayBeInfluencingTheSituation"
  ) {
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
          {t.clarify[label]}
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
          {t.clarify.initialSituation}
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
    const isLatestPanel = panel.id === latestPanelId;
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
              {t.clarify.yourInput}
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

        {renderList(response.observable, "whatAppearsToBeHappening")}
        {renderList(response.interpretive, "whatMayBeAssumed")}
        {renderList(response.unknown, "whatMayRemainUnclear")}
        {renderList(response.structural, "whatMayBeInfluencingTheSituation")}

        {response.orientation.trim().length > 0 && (
  <div
    style={{
      marginBottom: 0,
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
          {t.clarify.integratedView}
        </h3>
        <IntegratedViewTtsButton
          key={`${panel.id}-integrated-tts`}
          text={response.orientation.trim()}
          listenLabel={t.clarify.integratedViewListen}
          stopLabel={t.clarify.integratedViewStopAudio}
          errorMessage={t.clarify.ttsCouldNotPlay}
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
        {t.clarify.howTheSituationReadsAsAWhole}
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

      {response.currentClarity?.trim() ? (
        <div
          style={{
            marginTop: "1.05rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {isLatestPanel && markedClarity !== null ? (
            <>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8e8a84",
                  margin: "0 0 0.4rem 0",
                }}
              >
                {t.clarify.clarityMarked}
              </div>
              <p
                style={{
                  margin: "0 0 0.4rem 0",
                  color: "rgba(90, 85, 80, 0.95)",
                  fontSize: "0.82rem",
                  lineHeight: 1.55,
                }}
              >
                {t.clarify.youMarkedThisAsClearEnough}
              </p>
              <p
                style={{
                  color: "#333",
                  margin: 0,
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {`"${markedClarity}"`}
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8e8a84",
                  margin: "0 0 0.45rem 0",
                }}
              >
                {t.clarify.currentClarity}
              </div>
              <p
                style={{
                  color: "#333",
                  margin: 0,
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {response.currentClarity.trim()}
              </p>
              {isLatestPanel ? (
                <button
                  type="button"
                  onClick={() => {
                    const text = response.currentClarity?.trim() ?? "";
                    setMarkedClarity(text);
                    void saveMarkedClarityToConversation(
                      conversationIdRef.current,
                      getStableAnonymousId(),
                      text || null
                    );
                  }}
                  disabled={loading}
                  style={{
                    marginTop: "0.75rem",
                    padding: 0,
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.2)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: "rgba(90, 85, 80, 0.95)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {t.clarify.clearEnoughForNow}
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      {response.question?.trim() ? (
        <div
          style={{
            marginTop: "1.05rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "0.35rem 0.5rem",
              margin: "0 0 0.45rem 0",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8e8a84",
              }}
            >
              {t.clarify.clarifyingQuestion}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                textTransform: "none",
                color: "rgba(142, 138, 132, 0.88)",
              }}
            >
              {t.clarify.optional}
            </span>
          </div>
          <p
            style={{
              color: "#333",
              margin: 0,
              fontSize: "0.92rem",
              lineHeight: 1.65,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {response.question.trim()}
          </p>
        </div>
      ) : null}
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
          {t.clarify.clarificationPath}
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
          {t.clarify.clarificationPathDescription}
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

        {isReviewingHistorySession ? (
          <div
            style={{
              marginTop: "2.25rem",
              marginBottom: "0.25rem",
              width: "100%",
            }}
          >
            {renderHistoryEndActionButtons()}
          </div>
        ) : null}
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
            {t.clarify.response}
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
          {response.mode === "integrated_view" && response.currentClarity?.trim() ? (
            <div
              style={{
                marginTop: "1.15rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8e8a84",
                  margin: "0 0 0.45rem 0",
                }}
              >
                {t.clarify.currentClarity}
              </div>
              <p
                style={{
                  color: "#333",
                  margin: 0,
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {response.currentClarity.trim()}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function formatHistoryPreview(text: string): string {
    return text.replace(/^What appears to be happening:\s*/i, "").trimStart();
  }

  function renderWorkspaceMenuAccount() {
    const wm = t.clarify.workspaceMenu;
    if (!workspaceMenuAuth.ready) {
      return null;
    }
    if (!workspaceMenuAuth.email) {
      return (
        <div
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            marginBottom: "0.3rem",
            paddingBottom: "0.4rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setLeftMenuOpen(false);
              setLanguageMenuOpen(false);
              router.push(
                "/sign-in?redirect=" + encodeURIComponent("/clarify")
              );
            }}
            style={{
              display: "block",
              width: "100%",
              margin: 0,
              padding: "0.5rem 0.55rem",
              border: "none",
              borderRadius: "8px",
              background: "transparent",
              color: "rgba(0,0,0,0.5)",
              cursor: "pointer",
              font: "inherit",
              fontSize: "0.86rem",
              lineHeight: 1.35,
              textAlign: "left",
              transition: "background-color 150ms ease, color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
              e.currentTarget.style.color = "rgba(0,0,0,0.75)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "rgba(0,0,0,0.5)";
            }}
          >
            {wm.signIn}
          </button>
        </div>
      );
    }
    const plan = workspaceMenuAuth.plan;
    const showGreenDot =
      !workspaceMenuAuth.planLoading &&
      (plan === "pro" || plan === "pro_plus");
    const showNeutralDot =
      !workspaceMenuAuth.planLoading && plan === "free";
    const accessLabel = workspaceMenuAuth.planLoading
      ? "…"
      : plan === "pro"
        ? wm.pro
        : plan === "pro_plus"
          ? wm.proPlus
          : wm.free;

    return (
      <div
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          marginBottom: "0.3rem",
          padding: "0.3rem 0.4rem 0.5rem",
        }}
      >
        <div
          style={{
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.38)",
            marginBottom: "0.25rem",
          }}
        >
          {wm.accountHeader}
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "rgba(0,0,0,0.78)",
            lineHeight: 1.4,
            minWidth: 0,
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={workspaceMenuAuth.email}
        >
          {workspaceMenuAuth.email}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.35rem",
          }}
        >
          {workspaceMenuAuth.planLoading ? null : showGreenDot ? (
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "#2e7d4a",
                flexShrink: 0,
              }}
            />
          ) : showNeutralDot ? (
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.2)",
                flexShrink: 0,
              }}
            />
          ) : null}
          <span
            style={{
              fontSize: "0.75rem",
              color: "rgba(0,0,0,0.48)",
              lineHeight: 1.3,
            }}
          >
            {accessLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={async () => {
            setLeftMenuOpen(false);
            setLanguageMenuOpen(false);
            const supabase = getSupabaseClient();
            await supabase?.auth.signOut();
            window.location.assign("/");
          }}
          style={{
            display: "block",
            width: "100%",
            margin: "0.7rem 0 0",
            padding: "0.4rem 0.4rem",
            border: "none",
            borderRadius: "8px",
            background: "transparent",
            color: "#3f3b36",
            cursor: "pointer",
            font: "inherit",
            fontSize: "0.86rem",
            lineHeight: 1.35,
            textAlign: "left",
            transition: "background-color 150ms ease, color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
            e.currentTarget.style.color = "rgba(0,0,0,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#3f3b36";
          }}
        >
          {wm.signOut}
        </button>
      </div>
    );
  }

  function renderMenuLink(item: (typeof MENU_LINKS)[number]) {
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setLeftMenuOpen(false)}
        style={{
          display: "block",
          padding: "0.5rem 0.55rem",
          borderRadius: "8px",
          color: "#3f3b36",
          fontSize: "0.88rem",
          lineHeight: 1.35,
          textDecoration: "none",
          transition: "background-color 150ms ease, color 150ms ease, transform 150ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
          e.currentTarget.style.color = "rgba(0,0,0,0.9)";
          e.currentTarget.style.transform = "translateY(-0.5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#3f3b36";
          e.currentTarget.style.transform = "none";
        }}
      >
        {t.header[item.labelKey]}
      </Link>
    );
  }

  function renderHamburgerButton() {
    return (
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={leftMenuOpen}
        onClick={() => {
          setLeftMenuOpen((open) => !open);
          setLanguageMenuOpen(false);
        }}
        style={{
          margin: 0,
          padding: 0,
          border: "none",
          background: "transparent",
          color: "rgba(0,0,0,0.65)",
          cursor: "pointer",
          width: "18px",
          height: "14px",
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "color 150ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(0,0,0,0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(0,0,0,0.65)";
        }}
      >
        {[0, 1, 2].map((line) => (
          <span
            key={line}
            aria-hidden
            style={{
              display: "block",
              width: "18px",
              height: "2px",
              borderRadius: "999px",
              backgroundColor: "currentColor",
            }}
          />
        ))}
      </button>
    );
  }

  function renderFloatingMenu(isMobile = false) {
    const languageOptions = (
      <div
        style={{
          padding: "0.35rem",
          borderRadius: "10px",
          border: isMobile ? "none" : "1px solid rgba(0,0,0,0.05)",
          backgroundColor: isMobile ? "transparent" : "rgba(250,248,244,0.95)",
          boxShadow: isMobile ? "none" : "0 8px 24px rgba(0,0,0,0.08)",
          minWidth: isMobile ? "auto" : "132px",
        }}
      >
        {MENU_LANGUAGES.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => {
              setLanguage(option.code);
              setLeftMenuOpen(false);
              setLanguageMenuOpen(false);
            }}
            style={{
              display: "block",
              width: "100%",
              margin: 0,
              padding: "0.45rem 0.5rem",
              border: "none",
              borderRadius: "8px",
              background: "transparent",
              color: language === option.code ? "rgba(0,0,0,0.9)" : "#3f3b36",
              cursor: "pointer",
              font: "inherit",
              fontSize: "0.86rem",
              fontWeight: language === option.code ? 600 : 400,
              lineHeight: 1.35,
              textAlign: "left",
              transition: "background-color 150ms ease, color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
              e.currentTarget.style.color = "rgba(0,0,0,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color =
                language === option.code ? "rgba(0,0,0,0.9)" : "#3f3b36";
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    );

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          left: 0,
          width: isMobile ? "220px" : "230px",
          padding: "0.45rem",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.05)",
          backgroundColor: "rgba(250,248,244,0.94)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
          zIndex: 45,
        }}
      >
        {renderWorkspaceMenuAccount()}
        {MENU_LINKS.slice(0, 3).map((item) => renderMenuLink(item))}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setLanguageMenuOpen(true)}
          onMouseLeave={() => {
            if (!isMobile) setLanguageMenuOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setLanguageMenuOpen((open) => !open)}
            onFocus={() => setLanguageMenuOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              margin: 0,
              padding: "0.5rem 0.55rem",
              border: "none",
              borderRadius: "8px",
              background: "transparent",
              color: "#3f3b36",
              cursor: "pointer",
              font: "inherit",
              fontSize: "0.88rem",
              lineHeight: 1.35,
              textAlign: "left",
              transition: "background-color 150ms ease, color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
              e.currentTarget.style.color = "rgba(0,0,0,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#3f3b36";
            }}
          >
            <span>Language</span>
            <span aria-hidden>›</span>
          </button>
          {languageMenuOpen ? (
            <div
              style={
                isMobile
                  ? { marginTop: "0.2rem" }
                  : {
                      position: "absolute",
                      top: 0,
                      left: "calc(100% + 0.35rem)",
                    }
              }
            >
              {languageOptions}
            </div>
          ) : null}
        </div>
        {MENU_LINKS.slice(3).map((item) => renderMenuLink(item))}
      </div>
    );
  }

  function renderHamburgerWithFloatingMenu(isMobile: boolean) {
    return (
      <div
        onPointerEnter={handleWorkspaceMenuPointerEnter}
        onPointerLeave={handleWorkspaceMenuPointerLeave}
        style={{
          position: "relative",
          alignSelf: "flex-start",
          minWidth: isMobile ? 220 : 230,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            alignSelf: "flex-start",
            padding: "2px 10px 10px 2px",
          }}
        >
          {renderHamburgerButton()}
        </div>
        {leftMenuOpen ? renderFloatingMenu(isMobile) : null}
      </div>
    );
  }

  function resetSession(): void {
  topInputValueRef.current = "";
  followupInputValueRef.current = "";
  historyRef.current = [];
  conversationIdRef.current = null;
  iterationsRef.current = [];
  setTopInput("");
  setFollowupInput("");
  setResult(null);
  setHistory([]);
  setConversationId(null);
  setError(null);
  setIsDone(false);
  setMarkedClarity(null);
  setInitialSituation("");
  setIterations([]);
  setOpenPanelIds([]);
  setLatestPanelId(null);
  setSelectedHistoryConversationId(null);
  setHistoryDetailLoading(false);
  setMobileHistoryOpen(false);
  setIsReviewingHistorySession(false);
  scheduleHistoryRefresh();
}
  
  return (
  <div>
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
          aiReadyText={buildAIReadyContext()}
          completionMessage={
            result?.mode === "close" && result.message?.trim()
              ? result.message
              : undefined
          }
        />
      ) : (
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: isReviewingHistorySession
              ? "1.5rem 1.25rem max(3rem, calc(env(safe-area-inset-bottom) + 2.5rem))"
              : "1.5rem 1.25rem 240px",
            overflowX: "hidden",
            minWidth: 0,
          }}
        >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: showDesktopHistoryPanel ? "1.6rem" : 0,
          }}
        >
          {showDesktopHistoryPanel ? (
            <aside
              style={{
                width: "260px",
                flexShrink: 0,
                borderRight: "1px solid rgba(0,0,0,0.035)",
                backgroundColor: leftMenuOpen
                  ? "rgba(248, 245, 238, 0.58)"
                  : "rgba(250, 248, 244, 0.45)",
                padding: "0.55rem 1rem 0.55rem 0",
                minHeight: "calc(100svh - 3rem)",
                position: "sticky",
                top: "1.5rem",
                alignSelf: "stretch",
                zIndex: 2,
                pointerEvents: "auto",
                display: "flex",
                flexDirection: "column",
                transition: "background-color 200ms ease",
              }}
            >
              <div
                ref={leftMenuRef}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: railHistoryRows.length > 0 ? "2.4rem" : 0,
                  zIndex: 2,
                }}
              >
                <Link
                  href="/"
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.25,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#2f2b27",
                    textDecoration: "none",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                >
                  VIREKA Space
                </Link>
                {renderHamburgerWithFloatingMenu(false)}
              </div>
              {railHistoryRows.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    opacity: historyDetailLoading
                      ? 0.55
                      : leftMenuOpen
                        ? 0.9
                        : 1,
                    transition: "opacity 200ms ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      lineHeight: "16px",
                      color: "#8f8a84",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      marginBottom: "0.1rem",
                    }}
                  >
                    {t.history.recents}
                  </div>
                  {railHistoryRows.map((item, index) => {
                    const dt = new Date(item.created_at);
                    const dateLabel = Number.isNaN(dt.getTime())
                      ? ""
                      : dt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        });
                    const preview = formatHistoryPreview(
                      item.preview?.trim() ||
                        (item.mode === "ai-interaction" ? "AI Interaction" : "Session")
                    );
                    const active = item.id === selectedHistoryConversationId;
                    const unlocked =
                      historyHasFullAccess || index < FREE_HISTORY_VISIBLE_LIMIT;
                    const rowInner = (
                      <>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            lineHeight: 1.4,
                            color: "#4a4642",
                            fontWeight: active ? 550 : 450,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {preview}
                        </div>
                        {dateLabel ? (
                          <div
                            style={{
                              fontSize: 12,
                              lineHeight: "16px",
                              color: "#9c9690",
                              marginTop: "0.2rem",
                            }}
                          >
                            {dateLabel}
                          </div>
                        ) : null}
                      </>
                    );
                    if (!unlocked) {
                      return (
                        <div
                          key={item.id}
                          style={{
                            display: "block",
                            width: "100%",
                            margin: 0,
                            padding: "0.45rem 0.5rem",
                            textAlign: "left",
                            cursor: "default",
                            border: "1px solid transparent",
                            borderRadius: "8px",
                            backgroundColor: "transparent",
                            boxSizing: "border-box",
                            opacity: 0.4,
                          }}
                          aria-disabled
                        >
                          {rowInner}
                        </div>
                      );
                    }
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={historyDetailLoading}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          void openHistoryConversation(item.id);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          margin: 0,
                          padding: "0.45rem 0.5rem",
                          textAlign: "left",
                          cursor: historyDetailLoading ? "wait" : "pointer",
                          border: active
                            ? "1px solid rgba(0,0,0,0.12)"
                            : "1px solid transparent",
                          borderRadius: "8px",
                          backgroundColor: active ? "rgba(255,255,255,0.58)" : "transparent",
                          boxSizing: "border-box",
                          transition:
                            "background-color 140ms ease, border-color 140ms ease, opacity 140ms ease",
                        }}
                        onMouseEnter={(e) => {
                          if (historyDetailLoading || active) return;
                          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                          e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          if (active) {
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.58)";
                            e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                          } else {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.borderColor = "transparent";
                          }
                        }}
                      >
                        {rowInner}
                      </button>
                    );
                  })}
                  {hasLockedHistoryRows ? (
                    <Link
                      href="/plan"
                      style={{
                        display: "inline-block",
                        fontSize: 11,
                        lineHeight: 1.45,
                        color: "#a8a29e",
                        margin: "0.5rem 0 0 0",
                        letterSpacing: "0.01em",
                        textDecoration: "none",
                      }}
                    >
                      {t.plan.fullHistoryAvailableWithSubscription}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </aside>
          ) : null}

          <div
            style={{
              flex: 1,
              minWidth: 0,
              position: "relative",
            }}
          >
            <div style={{ minWidth: 0, width: "100%", maxWidth: "780px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: showDesktopHistoryPanel ? "1.35rem" : "2rem",
          }}
        >
          {!showDesktopHistoryPanel ? (
            <div
              ref={mobileMenuRef}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "14px",
                zIndex: 2,
              }}
            >
              <Link
                href="/"
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.25,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "#2f2b27",
                  textDecoration: "none",
                  display: "inline-block",
                  cursor: "pointer",
                }}
              >
                VIREKA Space
              </Link>
              {renderHamburgerWithFloatingMenu(true)}
            </div>
          ) : (
            <div />
          )}
        </div>
        <div
          style={{
            opacity: leftMenuOpen ? 0.96 : 1,
            transition: "opacity 200ms ease",
          }}
        >
        {!hideInitialHero && (
          <>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 2.85rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#111",
                margin: "2.5rem 0 1.25rem 0",
              }}
            >
              {workspaceTitle}
            </h1>
            {homeMode ? (
              <p
                style={{
                  margin: "8px 0 18px 0",
                  color: "rgba(0,0,0,0.58)",
                  fontSize: "1.05rem",
                  fontWeight: 450,
                  lineHeight: 1.5,
                  maxWidth: "44rem",
                }}
              >
                {workspaceOrientation}
              </p>
            ) : (
              <p
                style={{
                  margin: "0 0 18px 0",
                  color: "rgba(0,0,0,0.58)",
                  fontSize: "1.05rem",
                  fontWeight: 450,
                  lineHeight: 1.5,
                  maxWidth: "44rem",
                }}
              >
                {t.clarify.workingPageSubtitle}
              </p>
            )}

            {!showDesktopHistoryPanel && railHistoryRows.length > 0 ? (
              <button
                type="button"
                onClick={() => setMobileHistoryOpen(true)}
                style={{
                  margin: "0 0 0 0",
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  font: "inherit",
                  fontSize: "0.9rem",
                  lineHeight: 1.45,
                  color: "#6f6962",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(111, 105, 98, 0.35)",
                  textUnderlineOffset: "0.2em",
                }}
              >
                {t.history.recents}
              </button>
            ) : null}

            <div
              style={{
                borderTop: "1px solid #e7e5e4",
                marginTop:
                  !showDesktopHistoryPanel && railHistoryRows.length > 0
                    ? "1.15rem"
                    : "2.25rem",
                marginBottom: "2.25rem",
              }}
            />
            <div style={{ minHeight: "clamp(180px, 30vh, 320px)" }} />
          </>
        )}

        {hideInitialHero &&
        !showDesktopHistoryPanel &&
        railHistoryRows.length > 0 ? (
          <button
            type="button"
            onClick={() => setMobileHistoryOpen(true)}
            style={{
              margin: "0 0 1rem 0",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              font: "inherit",
              fontSize: "0.88rem",
              lineHeight: 1.45,
              color: "#6f6962",
              textDecoration: "underline",
              textDecorationColor: "rgba(111, 105, 98, 0.35)",
              textUnderlineOffset: "0.2em",
            }}
          >
            {t.history.recents}
          </button>
        ) : null}

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
      {error === t.clarify.speechRecognitionNotSupported ||
      error.startsWith(t.clarify.microphoneError)
        ? t.clarify.microphoneUnavailableTitle
        : error === t.clarify.usageLimitBody ||
            error === FREE_USAGE_LIMIT_ERROR_EN ||
            error.toLowerCase().includes("limit")
        ? t.clarify.usageLimitNoticeTitle
        : t.clarify.genericNoticeTitle}
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
      {error === t.clarify.usageLimitBody || error === FREE_USAGE_LIMIT_ERROR_EN
        ? t.clarify.usageLimitBody
        : error}
    </div>

  </div>
)}
          
        {!isDone && renderClarificationPath()}
        {!isDone && result && renderSupplementaryResult(result)}
        {showDesktopHistoryPanel ? (
          <div
            style={{
              position: "fixed",
              right: "1.5rem",
              bottom: "max(24px, env(safe-area-inset-bottom))",
              fontSize: 11,
              lineHeight: 1.4,
              color: "#aaa39c",
              pointerEvents: "none",
            }}
          >
            © 2026 Vireka Space
          </div>
        ) : null}
        </div>
            </div>
          </div>
        </div>
        </div>
      )}
      {!isDone && mobileHistoryOpen && !showDesktopHistoryPanel ? (
        <>
          <button
            type="button"
            aria-label="Close recent conversations"
            onClick={() => setMobileHistoryOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              margin: 0,
              padding: 0,
              border: "none",
              backgroundColor: "rgba(0,0,0,0.22)",
              zIndex: 40,
              cursor: "pointer",
            }}
          />
          <div
            role="dialog"
            aria-modal
            aria-labelledby="mobile-history-title"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(100%, 300px)",
              maxWidth: "100%",
              backgroundColor: "#f5f3ef",
              zIndex: 41,
              boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
              boxSizing: "border-box",
              padding: "1.1rem 1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                marginBottom: "0.85rem",
                flexShrink: 0,
              }}
            >
              <div
                id="mobile-history-title"
                style={{
                  fontSize: 12,
                  lineHeight: "16px",
                  color: "#8b857e",
                  letterSpacing: "0.02em",
                }}
              >
                {t.history.recents}
              </div>
              <button
                type="button"
                onClick={() => setMobileHistoryOpen(false)}
                style={{
                  margin: 0,
                  padding: "0.2rem 0.35rem",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  font: "inherit",
                  fontSize: "0.82rem",
                  color: "#8a8580",
                }}
              >
                Close
              </button>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                opacity: historyDetailLoading ? 0.55 : 1,
                transition: "opacity 160ms ease",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {railHistoryRows.map((item, index) => {
                const dt = new Date(item.created_at);
                const dateLabel = Number.isNaN(dt.getTime())
                  ? ""
                  : dt.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    });
                const preview = formatHistoryPreview(
                  item.preview?.trim() ||
                    (item.mode === "ai-interaction" ? "AI Interaction" : "Session")
                );
                const active = item.id === selectedHistoryConversationId;
                const unlocked =
                  historyHasFullAccess || index < FREE_HISTORY_VISIBLE_LIMIT;
                const rowInner = (
                  <>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: 1.4,
                        color: "#4a4642",
                        fontWeight: active ? 550 : 450,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {preview}
                    </div>
                    {dateLabel ? (
                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: "16px",
                          color: "#9c9690",
                          marginTop: "0.2rem",
                        }}
                      >
                        {dateLabel}
                      </div>
                    ) : null}
                  </>
                );
                if (!unlocked) {
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: "0.45rem 0.5rem",
                        borderRadius: "8px",
                        border: "1px solid transparent",
                        opacity: 0.4,
                        cursor: "default",
                      }}
                      aria-disabled
                    >
                      {rowInner}
                    </div>
                  );
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={historyDetailLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void openHistoryConversation(item.id);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      margin: 0,
                      padding: "0.45rem 0.5rem",
                      textAlign: "left",
                      cursor: historyDetailLoading ? "wait" : "pointer",
                      border: active
                        ? "1px solid rgba(0,0,0,0.12)"
                        : "1px solid transparent",
                      borderRadius: "8px",
                      backgroundColor: active ? "rgba(255,255,255,0.58)" : "transparent",
                      boxSizing: "border-box",
                      transition:
                        "background-color 140ms ease, border-color 140ms ease, opacity 140ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (historyDetailLoading || active) return;
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      if (active) {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.58)";
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                      } else {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                      }
                    }}
                  >
                    {rowInner}
                  </button>
                );
              })}
              {hasLockedHistoryRows ? (
                <Link
                  href="/plan"
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    lineHeight: 1.45,
                    color: "#a8a29e",
                    margin: "0.35rem 0 0 0",
                    letterSpacing: "0.01em",
                    textDecoration: "none",
                  }}
                >
                  {t.plan.fullHistoryAvailableWithSubscription}
                </Link>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
      {!isDone && !isReviewingHistorySession && (
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
            <>
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
                  onClick={() => {
                    setSelectedHistoryConversationId(null);
                    setIsDone(true);
                    scheduleHistoryRefresh();
                  }}
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
                  {t.clarify.doneButton}
                </button>
              </div>
            ) : null}
            <InterpretationInput
              textareaRef={topInputRef}
              id="clarify-input-composer"
              transcribeLanguage={language}
              transcribingLabel={t.clarify.transcribing}
              helperText=""
              placeholder={composerPlaceholder}
              value={composerValue}
              onChange={(e) => {
                if (hasClarificationHistory) {
                  followupInputValueRef.current = e.target.value;
                  setFollowupInput(e.target.value);
                } else {
                  topInputValueRef.current = e.target.value;
                  setTopInput(e.target.value);
                }
              }}
              disabled={loading}
              voiceEnabled
              clarifyLoading={loading}
              clarifyLoadingLabel={t.clarify.loadingText}
              onSend={() => submitToClarify("clarify", composerSource)}
              surfaceVariant="composer"
              cardStyle={{
                borderColor: "#dfdcd6",
              }}
            />
            </>
          </div>
        </div>
      )}
    </main>
  </div>
);
}
