"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  type Ref,
} from "react";
import { WHISPER_TRANSCRIBE_URL } from "../lib/whisperTranscribeUrl";

const TEXTAREA_MIN_PX = 72;
const TEXTAREA_MAX_PX = 160;
/** Single-line feel for bottom composer; grows with `fitTextareaHeight` up to max. */
const COMPOSER_TEXT_MIN_PX = 28;
const COMPOSER_TEXT_MAX_PX = 120;

export type MicState = "idle" | "recording" | "transcribing" | "ready" | "error";

export type InterpretationInputHandle = {
  resetVoice: () => void;
};

export type InterpretationInputProps = {
  id: string;
  label?: string;
  placeholder: string;
  helperText: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  /** Used only when `voiceEnabled` is false. */
  footer?: ReactNode;
  cardStyle?: CSSProperties;
  textareaRef?: Ref<HTMLTextAreaElement>;
  voiceEnabled?: boolean;
  /** Return `true` when clarify (or send) succeeded so voice UI resets to idle. */
  onSend?: () => Promise<boolean>;
  transcribeUrl?: string;
  /** Parent loading (e.g. POST /api/clarify) - disables send control. */
  clarifyLoading?: boolean;
  /** Shown while the text submit request is running. */
  clarifyLoadingLabel?: string;
  surfaceVariant?: "card" | "composer";
  /** Shown while audio is being transcribed (voice UI). */
  transcribingLabel: string;
};

function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): (instance: T | null) => void {
  return (instance) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(instance);
      } else {
        (ref as MutableRefObject<T | null>).current = instance;
      }
    }
  };
}

function fitTextareaHeight(
  el: HTMLTextAreaElement | null,
  bounds?: { min: number; max: number }
): void {
  if (!el) return;
  const min = bounds?.min ?? TEXTAREA_MIN_PX;
  const max = bounds?.max ?? TEXTAREA_MAX_PX;
  el.style.height = "auto";
  const next = Math.min(Math.max(el.scrollHeight, min), max);
  el.style.height = `${next}px`;
}

function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isSafari =
    /Safari/i.test(ua) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/i.test(ua);

  const candidates = isSafari
    ? ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"]
    : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return "";
}

function extensionForAudioMime(mimeType: string): string {
  const normalized = mimeType.toLowerCase();
  if (normalized.includes("webm")) return "webm";
  if (normalized.includes("m4a") || normalized.includes("aac")) return "m4a";
  if (normalized.includes("mp4")) return "m4a";
  if (normalized.includes("mp3")) return "mp3";
  if (normalized.includes("mpeg") || normalized.includes("mpga")) return "mpeg";
  if (normalized.includes("ogg") || normalized.includes("oga")) return "ogg";
  if (normalized.includes("wav")) return "wav";
  if (normalized.includes("flac")) return "flac";
  return "webm";
}

function getTranscriptFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const candidate = payload as { text?: unknown; transcript?: unknown };
  if (typeof candidate.text === "string") return candidate.text.trim();
  if (typeof candidate.transcript === "string") return candidate.transcript.trim();
  return "";
}

/** One filename for multipart "file" — extension follows `extensionForAudioMime(blob MIME)`. */
function getTranscribeUploadFilename(mimeType: string): string {
  return `recording.${extensionForAudioMime(mimeType)}`;
}

function getTranscribeUrlDebugInfo(url: string): {
  isValid: boolean;
  resolvedUrl: string;
  reason?: string;
} {
  const trimmed = url.trim();
  if (!trimmed) {
    return {
      isValid: false,
      resolvedUrl: "",
      reason: "empty URL",
    };
  }

  try {
    const resolved = new URL(trimmed, window.location.origin);
    return {
      isValid: true,
      resolvedUrl: resolved.toString(),
    };
  } catch (err) {
    return {
      isValid: false,
      resolvedUrl: trimmed,
      reason: err instanceof Error ? err.message : "invalid URL",
    };
  }
}

/** One shared context: created + resumed in `startRecording` (user gesture) for iOS/Safari; not closed on waveform unmount. */
let sharedWaveformAudioContext: AudioContext | null = null;

function getSharedWaveformAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("no window");
  }
  if (sharedWaveformAudioContext && sharedWaveformAudioContext.state === "closed") {
    sharedWaveformAudioContext = null;
  }
  if (sharedWaveformAudioContext) {
    return sharedWaveformAudioContext;
  }
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) {
    throw new Error("no AudioContext");
  }
  sharedWaveformAudioContext = new Ctor();
  return sharedWaveformAudioContext;
}

function prewarmWaveformAudioContextForGesture(): void {
  if (typeof window === "undefined") return;
  try {
    const ctx = getSharedWaveformAudioContext();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
  } catch {
    /* visualizer only */
  }
}

/**
 * Calm, baseline + rising rounded bars; AnalyserNode + rAF; fallback matches same look.
 */
const WAVE_BAR_WIDTH_PX = 1.5;
const WAVE_GAIN = 1.55;
const WAVE_SMOOTH_EXP = 0.82;
const WAVE_SMOOTH_FRAME = 0.74;
/** Alpha range ~0.65–0.75 on black */
const WAVE_ALPHA_QUIET = 0.66;
const WAVE_ALPHA_LOUD = 0.74;

type WaveformLayout = {
  bars: number;
  rowH: number;
  baselinePx: number;
  peakMaxPx: number;
  gap: number;
};

const WAVEFORM_LAYOUT_NARROW: WaveformLayout = {
  bars: 28,
  rowH: 24,
  baselinePx: 2,
  peakMaxPx: 20,
  gap: 0.45,
};

const WAVEFORM_LAYOUT_WIDE: WaveformLayout = {
  bars: 44,
  rowH: 30,
  baselinePx: 2,
  peakMaxPx: 26,
  gap: 0.5,
};

function useCompactWaveformLayout(): WaveformLayout {
  const [useNarrow, setUseNarrow] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setUseNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return useNarrow ? WAVEFORM_LAYOUT_NARROW : WAVEFORM_LAYOUT_WIDE;
}

/** Center-weighted wave envelope; edges stay partly visible (clustered middle, not hollow sides). */
function centerBell(barIndex: number, barCount: number): number {
  if (barCount <= 1) return 1;
  const u = barIndex / (barCount - 1);
  return 0.38 + 0.62 * Math.sin(u * Math.PI);
}

function smoothBarNeighbors(values: number[]): number[] {
  const n = values.length;
  if (n <= 0) return values;
  return values.map((v, i) => {
    const v0 = values[Math.max(0, i - 1)] ?? v;
    const v2 = values[Math.min(n - 1, i + 1)] ?? v;
    return 0.22 * v0 + 0.56 * v + 0.22 * v2;
  });
}

/** Thin rounded bar rising from bottom; height includes quiet baseline dot/dash. */
function WaveformBarSlot({
  heightPx,
  alpha,
}: {
  heightPx: number;
  alpha: number;
}) {
  const a = Math.min(0.75, Math.max(0.55, alpha));
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div
        style={{
          width: WAVE_BAR_WIDTH_PX,
          minWidth: WAVE_BAR_WIDTH_PX,
          maxWidth: WAVE_BAR_WIDTH_PX,
          height: heightPx,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: `rgba(0, 0, 0, ${a})`,
        }}
      />
    </div>
  );
}

function FallbackSineWaveform({ layout }: { layout: WaveformLayout }) {
  const { bars, rowH, baselinePx, peakMaxPx, gap } = layout;
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((p) => (p + 1) % 100);
    }, 110);
    return () => window.clearInterval(id);
  }, []);

  const raw = Array.from({ length: bars }, (_, i) => {
    const waveA = Math.sin((phase / 100) * Math.PI * 2 + i * 0.5);
    const waveB = Math.sin((phase / 100) * Math.PI * 2 * 1.75 + i * 0.22);
    const motion = (waveA * 0.62 + waveB * 0.38 + 1) / 2;
    return motion * 0.38 * centerBell(i, bars);
  });
  const smoothed = smoothBarNeighbors(raw);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap,
        height: rowH,
        minHeight: rowH,
        maxHeight: rowH,
        flex: 1,
        minWidth: 0,
        maxWidth: "100%",
        width: "100%",
        alignSelf: "stretch",
        justifyContent: "flex-start",
        padding: 0,
      }}
      aria-hidden
    >
      {smoothed.map((t, i) => {
        const gain = Math.min(1, Math.pow(t, 0.78));
        const h = baselinePx + (peakMaxPx - baselinePx) * gain;
        const alpha = WAVE_ALPHA_QUIET + (WAVE_ALPHA_LOUD - WAVE_ALPHA_QUIET) * gain;
        return <WaveformBarSlot key={i} heightPx={h} alpha={alpha} />;
      })}
    </div>
  );
}

function RecordingLiveWaveform({
  stream,
  isActive,
}: {
  stream: MediaStream | null;
  isActive: boolean;
}) {
  const layout = useCompactWaveformLayout();
  const { bars, rowH, baselinePx, peakMaxPx, gap } = layout;
  const [levels, setLevels] = useState(() => Array.from({ length: bars }, () => 0));
  const [useFallback, setUseFallback] = useState(false);
  const smoothRef = useRef<number[]>(Array.from({ length: bars }, () => 0));

  useEffect(() => {
    smoothRef.current = Array.from({ length: bars }, () => 0);
    setLevels(Array.from({ length: bars }, () => 0));
  }, [bars]);

  useEffect(() => {
    if (useFallback) return;
    if (!isActive) {
      smoothRef.current = Array.from({ length: bars }, () => 0);
      setLevels(() => Array.from({ length: bars }, () => 0));
      return;
    }
    if (!stream || !stream.active || !stream.getAudioTracks().length) {
      return;
    }

    const barCount = bars;
    let cancelled = false;
    let raf = 0;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let freqData = new Uint8Array(256);

    const tick = () => {
      if (cancelled) return;
      if (!analyser) {
        return;
      }
      analyser.getByteFrequencyData(freqData);
      const s = smoothRef.current;
      if (s.length !== barCount) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const nBins = Math.min(freqData.length, 240);
      const w = Math.max(1, Math.floor(nBins / barCount));
      const raw: number[] = [];
      for (let b = 0; b < barCount; b += 1) {
        const start = 1 + b * w;
        let m = 0;
        for (let k = 0; k < w; k += 1) {
          m += (freqData[start + k] ?? 0) / 255;
        }
        m /= w;
        const tIn = Math.min(
          1,
          Math.pow(Math.min(1, m * WAVE_GAIN), WAVE_SMOOTH_EXP)
        );
        s[b] = s[b] * WAVE_SMOOTH_FRAME + tIn * (1 - WAVE_SMOOTH_FRAME);
        const v = Math.min(1, s[b] * 0.92);
        raw.push(v);
      }
      const blended = smoothBarNeighbors(raw);
      const next: number[] = [];
      for (let b = 0; b < barCount; b += 1) {
        const bell = centerBell(b, barCount);
        next.push(Math.min(1, Math.max(0, blended[b] * bell)));
      }
      setLevels([...next]);
      raf = requestAnimationFrame(tick);
    };

    void (async () => {
      try {
        const ctx = getSharedWaveformAudioContext();
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        if (cancelled) {
          return;
        }
        source = ctx.createMediaStreamSource(stream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.88;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -32;
        freqData = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        raf = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) setUseFallback(true);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      try {
        if (source) {
          try {
            source.disconnect();
          } catch {
            /* ignore */
          }
        }
        source = null;
        if (analyser) {
          try {
            analyser.disconnect();
          } catch {
            /* ignore */
          }
        }
        analyser = null;
      } catch {
        /* ignore */
      }
    };
  }, [stream, isActive, useFallback, bars]);

  if (useFallback) {
    return <FallbackSineWaveform layout={layout} />;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap,
        height: rowH,
        minHeight: rowH,
        maxHeight: rowH,
        flex: 1,
        minWidth: 0,
        maxWidth: "100%",
        width: "100%",
        alignSelf: "stretch",
        justifyContent: "flex-start",
        padding: 0,
      }}
      aria-hidden
    >
      {levels.map((t, i) => {
        const gain = Math.min(1, Math.pow(t, 0.74));
        const h = baselinePx + (peakMaxPx - baselinePx) * gain;
        const alpha = WAVE_ALPHA_QUIET + (WAVE_ALPHA_LOUD - WAVE_ALPHA_QUIET) * gain;
        return <WaveformBarSlot key={i} heightPx={h} alpha={alpha} />;
      })}
    </div>
  );
}

function MicIcon({ muted }: { muted?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity={muted ? 0.35 : 1}
      />
      <path
        d="M19 11v1a7 7 0 0 1-14 0v-1M12 18v3M8 21h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity={muted ? 0.35 : 1}
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ConfirmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5 10 17l9-10"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h12M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        border: "2px solid #e7e5e4",
        borderTopColor: "#8e8a84",
        borderRadius: "50%",
        animation: "interpretation-spin 0.7s linear infinite",
      }}
    />
  );
}

const InterpretationInput = forwardRef<
  InterpretationInputHandle,
  InterpretationInputProps
>(function InterpretationInput(
  {
    id,
    label,
    placeholder,
    helperText,
    value,
    onChange,
    disabled = false,
    footer,
    cardStyle,
    textareaRef,
    voiceEnabled = false,
    onSend,
    transcribeUrl = WHISPER_TRANSCRIBE_URL,
    clarifyLoading = false,
    clarifyLoadingLabel,
    surfaceVariant = "card",
    transcribingLabel,
  },
  ref
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const setRefs = mergeRefs(innerRef, textareaRef);

  const [micState, setMicState] = useState<MicState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysisStream, setAnalysisStream] = useState<MediaStream | null>(null);

  const audioObjectUrlRef = useRef<string | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const discardRecordingRef = useRef(false);
  const activeRecorderRef = useRef<MediaRecorder | null>(null);
  const mimeTypeRef = useRef("");
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const isComposer = surfaceVariant === "composer";
  const syncHeight = useCallback(() => {
    fitTextareaHeight(
      innerRef.current,
      isComposer
        ? { min: COMPOSER_TEXT_MIN_PX, max: COMPOSER_TEXT_MAX_PX }
        : undefined
    );
  }, [isComposer]);

  useLayoutEffect(() => {
    syncHeight();
  }, [value, syncHeight]);

  const revokeAudioUrl = useCallback(() => {
    if (audioObjectUrlRef.current) {
      URL.revokeObjectURL(audioObjectUrlRef.current);
      audioObjectUrlRef.current = null;
    }
    setAudioUrl(null);
    audioBlobRef.current = null;
  }, []);

  const releaseStream = useCallback(() => {
    setAnalysisStream(null);
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  }, []);

  const cleanupRecorder = useCallback(() => {
    mediaRecorderRef.current = null;
    activeRecorderRef.current = null;
    mediaChunksRef.current = [];
    releaseStream();
  }, [releaseStream]);

  const resetVoice = useCallback(() => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        discardRecordingRef.current = true;
        mediaRecorderRef.current.stop();
      }
    } catch {
      /* ignore */
    }
    mediaRecorderRef.current = null;
    activeRecorderRef.current = null;
    mediaChunksRef.current = [];
    releaseStream();
    revokeAudioUrl();
    setMicState("idle");
    setVoiceError(null);
    setIsPlaying(false);
    discardRecordingRef.current = false;
    const a = audioElRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
    }
  }, [releaseStream, revokeAudioUrl]);

  useImperativeHandle(ref, () => ({ resetVoice }), [resetVoice]);

  useEffect(() => {
    if (!voiceEnabled) return;
    if (value.trim() !== "") return;
    if (micState === "recording" || micState === "transcribing") return;
    if (micState === "idle" && !audioUrl) return;
    resetVoice();
  }, [value, voiceEnabled, micState, audioUrl, resetVoice]);

  useEffect(() => {
    return () => {
      discardRecordingRef.current = true;
      try {
        mediaRecorderRef.current?.stop();
      } catch {
        /* ignore */
      }
      releaseStream();
      if (audioObjectUrlRef.current) {
        URL.revokeObjectURL(audioObjectUrlRef.current);
      }
    };
  }, [releaseStream]);

  useEffect(() => {
    const el = audioElRef.current;
    if (!el || !audioUrl) return;
    el.src = audioUrl;
    el.onended = () => setIsPlaying(false);
    el.onpause = () => setIsPlaying(false);
  }, [audioUrl]);

  const appendTranscript = useCallback(
    (transcript: string) => {
      const next = value.trim() ? `${value.trim()} ${transcript}` : transcript;
      onChange({
        target: { value: next },
        currentTarget: { value: next },
      } as ChangeEvent<HTMLTextAreaElement>);
    },
    [onChange, value]
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    requestAnimationFrame(() =>
      fitTextareaHeight(
        e.currentTarget,
        isComposer
          ? { min: COMPOSER_TEXT_MIN_PX, max: COMPOSER_TEXT_MAX_PX }
          : undefined
      )
    );
  };

  const startRecording = useCallback(async () => {
    console.log("[mic] start requested");
    setVoiceError(null);
    prewarmWaveformAudioContextForGesture();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("[mic] stream acquired", stream);
      console.log("[mic] audio tracks", stream?.getAudioTracks?.());
      mediaStreamRef.current = stream;
      setAnalysisStream(stream);
      const mimeType = pickRecorderMime();
      mimeTypeRef.current = mimeType;
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
      console.log("[mic] recorder created", {
        mimeType: recorder?.mimeType,
        state: recorder?.state,
      });
      mediaChunksRef.current = [];
      discardRecordingRef.current = false;
      recorder.ondataavailable = (ev) => {
        const data = ev.data;
        if (data && data.size > 0) {
          mediaChunksRef.current.push(data);
        }
        const size = data?.size ?? 0;
        const totalChunkCount = mediaChunksRef.current.length;
        console.log("[mic] dataavailable", {
          size,
          type: data?.type,
          totalChunkCount,
        });
      };

      recorder.onstop = () => {
        console.log("[mic] ONSTOP FIRED");
        console.log("[mic] onstop fired", {
          mediaRecorderState: recorder.state,
          activeRecorderIs: activeRecorderRef.current
            ? "set"
            : "null",
          isStaleDifferentRecorder:
            activeRecorderRef.current != null &&
            activeRecorderRef.current !== recorder,
        });
        if (
          activeRecorderRef.current != null &&
          activeRecorderRef.current !== recorder
        ) {
          console.log(
            "[mic] onstop ignored: activeRecorderRef is a different MediaRecorder (new session started)"
          );
          return;
        }
        console.log("[mic] recorder stopped (handler running)");
        activeRecorderRef.current = null;
        mediaRecorderRef.current = null;
        releaseStream();

        if (discardRecordingRef.current) {
          console.log("[mic] onstop: discarding (discard flag)");
          discardRecordingRef.current = false;
          mediaChunksRef.current = [];
          setMicState("idle");
          return;
        }

        const chunkSnapshot = Array.from(mediaChunksRef.current);
        const chunks = chunkSnapshot;
        mediaChunksRef.current = [];
        console.log("[mic] CHUNKS SNAPSHOT", {
          count: chunkSnapshot.length,
          sizes: chunkSnapshot.map((c) => (c instanceof Blob ? c.size : 0)),
        });
        const blobType = recorder.mimeType || mimeTypeRef.current || "audio/webm";
        console.log("[mic] building blob from chunks", {
          chunkCount: chunks?.length,
        });
        const blob = new Blob(chunks, { type: blobType });
        console.log("[mic] blob created", {
          size: blob?.size,
          type: blob?.type,
        });

        if (blob.size === 0) {
          console.log("[mic] upload skipped: empty blob (size 0)");
          setVoiceError("No audio captured");
          setMicState("error");
          return;
        }

        const transcribe = (audioBlob: Blob) => {
          console.log("[mic] transcribe(blob) starting upload path", {
            size: audioBlob.size,
            type: audioBlob.type,
          });
          revokeAudioUrl();
          audioBlobRef.current = audioBlob;
          const url = URL.createObjectURL(audioBlob);
          audioObjectUrlRef.current = url;
          setAudioUrl(url);
          setMicState("transcribing");

          void (async () => {
            try {
              const uploadMimeType = audioBlob.type || blobType || "audio/webm";
              const filename = getTranscribeUploadFilename(uploadMimeType);
              const urlDebug = getTranscribeUrlDebugInfo(transcribeUrl);

              console.info("[transcribe] upload start", {
                transcribeUrl,
                resolvedTranscribeUrl: urlDebug.resolvedUrl,
                transcribeUrlIsValid: urlDebug.isValid,
                transcribeUrlInvalidReason: urlDebug.reason ?? null,
                blobType: audioBlob.type,
                recorderMimeType: recorder.mimeType,
                preferredMimeType: mimeTypeRef.current,
                bytes: audioBlob.size,
                fieldName: "file",
                filename,
              });

              if (!urlDebug.isValid) {
                throw new Error(
                  `Invalid transcribe URL: ${urlDebug.reason ?? "unknown"}`
                );
              }

              const formData = new FormData();
              formData.append("file", audioBlob, filename);

              console.log("[mic] before fetch to /transcribe", {
                url: urlDebug.resolvedUrl,
                fieldName: "file",
                filename,
                size: audioBlob?.size,
                type: audioBlob?.type,
              });

              const response = await fetch(urlDebug.resolvedUrl, {
                method: "POST",
                body: formData,
              });

              console.log("[mic] upload response", {
                status: response?.status,
                ok: response?.ok,
              });

              const responseText = await response.text().catch(() => "");
              console.log("[mic] upload response body", responseText);
              const snippet = responseText.slice(0, 300);
              let parsedJson: unknown = null;
              try {
                parsedJson = responseText ? JSON.parse(responseText) : null;
              } catch {
                parsedJson = null;
              }
              const parsedError =
                parsedJson &&
                typeof parsedJson === "object" &&
                "error" in parsedJson
                  ? (parsedJson as { error?: unknown }).error
                  : undefined;

              console.info("[transcribe] upload result", {
                endpoint: urlDebug.resolvedUrl,
                fieldName: "file",
                filename,
                blobType: audioBlob.type,
                recorderMimeType: recorder.mimeType,
                fileSize: audioBlob.size,
                status: response.status,
                ok: response.ok,
                responseSnippet: snippet,
                parsedJson,
                parsedError,
              });

              if (!response.ok) {
                throw new Error(
                  `status=${response.status} field=file filename=${filename} body=${snippet}`
                );
              }

              let transcript = "";
              if (parsedJson) {
                transcript = getTranscriptFromPayload(parsedJson);
              } else {
                transcript = responseText.trim();
              }
              if (!transcript) {
                throw new Error(
                  `empty transcript field=file filename=${filename} body=${snippet}`
                );
              }

              appendTranscript(transcript);
              setMicState("ready");
              setVoiceError(null);
            } catch (err) {
              console.error("[mic] error", err);
              console.error("[transcribe] failed", {
                error: err,
                transcribeUrl,
                blobType: audioBlob.type,
                recorderMimeType: recorder.mimeType,
                preferredMimeType: mimeTypeRef.current,
                bytes: audioBlob.size,
              });
              setVoiceError("Couldn't transcribe audio");
              setMicState("error");
              revokeAudioUrl();
            }
          })();
        };
        transcribe(blob);
      };

      mediaRecorderRef.current = recorder;
      activeRecorderRef.current = recorder;
      const startTimesliceMs = 200;
      console.log("[mic] recorder.start", { startTimesliceMs });
      recorder.start(startTimesliceMs);
      setMicState("recording");
    } catch (err) {
      console.error("[mic] error", err);
      console.error("Microphone access denied or unavailable");
      setVoiceError("Mic unavailable");
      setMicState("error");
      cleanupRecorder();
    }
  }, [
    appendTranscript,
    cleanupRecorder,
    releaseStream,
    revokeAudioUrl,
    transcribeUrl,
  ]);

  const cancelRecording = useCallback(() => {
    discardRecordingRef.current = true;
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      } else {
        cleanupRecorder();
        setMicState("idle");
      }
    } catch {
      cleanupRecorder();
      setMicState("idle");
    }
    setVoiceError(null);
  }, [cleanupRecorder]);

  const confirmRecording = useCallback(() => {
    try {
      const r = mediaRecorderRef.current;
      console.log("[mic] CONFIRM CLICKED");
      console.log("[mic] confirm recorder", {
        hasRecorder: r != null,
        state: r?.state,
        chunkCount: mediaChunksRef.current.length,
      });
      if (r && r.state === "recording") {
        try {
          r.requestData?.();
          console.log("[mic] requestData called");
        } catch (e) {
          console.log("[mic] requestData failed", e);
        }
        console.log("[mic] calling stop()");
        r.stop();
      }
    } catch {
      setMicState("idle");
      cleanupRecorder();
    }
  }, [cleanupRecorder]);

  const togglePlayback = useCallback(() => {
    const el = audioElRef.current;
    if (!el || !audioUrl) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      void el.play().then(
        () => setIsPlaying(true),
        () => console.error("Playback failed")
      );
    }
  }, [audioUrl, isPlaying]);

  const onMicAreaClick = useCallback(() => {
    if (!voiceEnabled || disabled || clarifyLoading || micState === "transcribing") {
      return;
    }
    if (micState === "error") {
      setVoiceError(null);
      void startRecording();
      return;
    }
    if (micState === "idle") {
      void startRecording();
    }
  }, [clarifyLoading, disabled, micState, startRecording, voiceEnabled]);

  const handleSend = useCallback(async () => {
    if (!onSend || !value.trim() || clarifyLoading || micState === "recording") {
      return;
    }
    const ok = await onSend();
    if (ok) {
      resetVoice();
    }
  }, [clarifyLoading, micState, onSend, resetVoice, value]);

  const sendVisible =
    voiceEnabled &&
    value.trim().length > 0 &&
    micState !== "recording" &&
    micState !== "transcribing";

  const sendDisabled =
    !value.trim() ||
    clarifyLoading ||
    micState === "recording" ||
    micState === "transcribing";

  const defaultFooter = (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "0.625rem",
        minHeight: "2rem",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: "1px solid #e4e1de",
          backgroundColor: "#f9f8f6",
          flexShrink: 0,
        }}
        aria-hidden
      />
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: "1px solid #e4e1de",
          backgroundColor: "#f9f8f6",
          flexShrink: 0,
        }}
        aria-hidden
      />
    </div>
  );

  const voiceFooter = voiceEnabled ? (
    <>
      <style>{`
        @keyframes interpretation-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <audio ref={audioElRef} preload="auto" style={{ display: "none" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.5rem",
          width: "100%",
          minHeight: 32,
          minWidth: 0,
        }}
      >
        {micState === "recording" ? (
          <>
            <RecordingLiveWaveform
              key={analysisStream?.id ?? "none"}
              stream={analysisStream}
              isActive={micState === "recording"}
            />
            <button
              type="button"
              onClick={cancelRecording}
              disabled={disabled}
              aria-label="Cancel recording"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #d6d3d1",
                background: "#fff",
                color: "#555",
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <CancelIcon />
            </button>
            <button
              type="button"
              onClick={confirmRecording}
              disabled={disabled}
              aria-label="Confirm recording"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <ConfirmIcon />
            </button>
          </>
        ) : micState === "transcribing" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#7a756f",
              fontSize: "0.8rem",
            }}
          >
            <Spinner />
            <span>{transcribingLabel}</span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: "0 0 auto",
            }}
          >
            {clarifyLoading && clarifyLoadingLabel ? (
              <span
                style={{
                  color: "#7a756f",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                }}
              >
                {clarifyLoadingLabel}
              </span>
            ) : null}
            {micState === "ready" && audioUrl ? (
              <button
                type="button"
                onClick={togglePlayback}
                disabled={disabled}
                aria-label={isPlaying ? "Pause playback" : "Play recording"}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: "1px solid #d6d3d1",
                  background: "#fafaf8",
                  color: "#111",
                  cursor: disabled ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: disabled ? 0.55 : 1,
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            ) : (
              <button
                type="button"
                onClick={onMicAreaClick}
                disabled={disabled || clarifyLoading}
                aria-label="Record voice"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: "1px solid #d6d3d1",
                  background: "#fff",
                  color: "#111",
                  cursor:
                    disabled || clarifyLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: disabled || clarifyLoading ? 0.55 : 1,
                }}
              >
                <MicIcon muted={micState === "error"} />
              </button>
            )}
          </div>
        )}

        {sendVisible ? (
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={sendDisabled}
            aria-label="Send"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: sendDisabled ? "1px solid #e0ddd9" : "1px solid #111",
              background: sendDisabled ? "#f0eeeb" : "#111",
              color: sendDisabled ? "#9c9893" : "#fff",
              cursor: sendDisabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: 4,
            }}
          >
            {clarifyLoading ? <Spinner /> : <SendArrowIcon />}
          </button>
        ) : null}
      </div>
      {voiceError ? (
        <p
          style={{
            margin: "0.4rem 0 0 0",
            fontSize: "0.75rem",
            color: "#9a6b6b",
            lineHeight: 1.45,
          }}
        >
          {voiceError}
        </p>
      ) : null}
    </>
  ) : null;

  return (
    <div
      style={{
        backgroundColor: isComposer ? "#fbfaf7" : "#ffffff",
        borderRadius: isComposer ? "18px" : "16px",
        border: "1px solid #e7e5e4",
        boxShadow: isComposer ? "0 2px 10px rgba(0, 0, 0, 0.06)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
        padding: isComposer ? "0.4rem 0.55rem 0.35rem" : "1.5rem 1.25rem 1.25rem",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        ...cardStyle,
      }}
    >
      {label ? (
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#111",
            marginBottom: "0.65rem",
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </label>
      ) : null}

      <textarea
        ref={setRefs}
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        style={{
          display: "block",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          minHeight: isComposer ? COMPOSER_TEXT_MIN_PX : TEXTAREA_MIN_PX,
          maxHeight: isComposer ? COMPOSER_TEXT_MAX_PX : TEXTAREA_MAX_PX,
          height: isComposer ? "auto" : TEXTAREA_MIN_PX,
          backgroundColor: isComposer ? "transparent" : "#fafaf8",
          color: "#111",
          border: isComposer ? "1px solid transparent" : "1px solid #e7e5e4",
          borderRadius: isComposer ? "10px" : "12px",
          padding: isComposer ? "0.22rem 0.2rem" : "0.75rem 1rem",
          fontSize: "0.925rem",
          lineHeight: isComposer ? 1.45 : 1.65,
          resize: "none",
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color 0.15s ease, height 0.12s ease-out",
          opacity: disabled ? 0.6 : 1,
          overflowY: "auto",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = isComposer ? "transparent" : "#c9c5c0";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = isComposer ? "transparent" : "#e7e5e4";
        }}
      />

      {helperText.trim().length > 0 ? (
        <p
          style={{
            fontSize: "0.8rem",
            color: "#888",
            lineHeight: 1.55,
            margin: isComposer ? "0.2rem 0 0 0" : "0.75rem 0 0 0",
            minWidth: 0,
          }}
        >
          {helperText}
        </p>
      ) : null}

      <div
        style={{
          marginTop: "0.85rem",
          width: "100%",
          minWidth: 0,
        }}
      >
        {voiceEnabled ? voiceFooter : footer ?? defaultFooter}
      </div>
    </div>
  );
});

export { InterpretationInput };
export default InterpretationInput;
