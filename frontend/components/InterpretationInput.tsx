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
  surfaceVariant?: "card" | "composer";
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

function fitTextareaHeight(el: HTMLTextAreaElement | null): void {
  if (!el) return;
  el.style.height = "auto";
  const next = Math.min(
    Math.max(el.scrollHeight, TEXTAREA_MIN_PX),
    TEXTAREA_MAX_PX
  );
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
  if (normalized.includes("mp4")) return "mp4";
  if (normalized.includes("m4a") || normalized.includes("aac")) return "m4a";
  if (normalized.includes("mpeg") || normalized.includes("mp3")) return "mp3";
  if (normalized.includes("ogg")) return "ogg";
  if (normalized.includes("wav")) return "wav";
  return "audio";
}

function getTranscriptFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const candidate = payload as { text?: unknown; transcript?: unknown };
  if (typeof candidate.text === "string") return candidate.text.trim();
  if (typeof candidate.transcript === "string") return candidate.transcript.trim();
  return "";
}

function buildUploadCandidates(mimeType: string): Array<{ fieldName: string; filename: string }> {
  const normalized = mimeType.toLowerCase();
  const ext = extensionForAudioMime(normalized);
  const filenames = new Set<string>([`recording.${ext}`]);

  if (normalized.includes("mp4") || normalized.includes("m4a")) {
    filenames.add("recording.mp4");
    filenames.add("recording.m4a");
  } else if (normalized.includes("webm")) {
    filenames.add("recording.webm");
  }

  const candidates: Array<{ fieldName: string; filename: string }> = [];
  for (const filename of Array.from(filenames)) {
    candidates.push({ fieldName: "file", filename });
  }
  // Compatibility fallback for servers expecting `audio` instead of `file`.
  for (const filename of Array.from(filenames)) {
    candidates.push({ fieldName: "audio", filename });
  }

  return candidates;
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

function SubtleWaveform() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((p) => (p + 1) % 100);
    }, 110);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
        height: 28,
        flex: 1,
        minWidth: 148,
        maxWidth: 268,
        justifyContent: "flex-start",
        padding: "0 2px 2px",
      }}
      aria-hidden
    >
      {Array.from({ length: 15 }, (_, i) => i).map((i, totalBars) => {
        const center = (totalBars - 1) / 2;
        const distanceFromCenter = Math.abs(i - center) / center;
        const envelope = 1 - distanceFromCenter * 0.5;
        const waveA = Math.sin((phase / 100) * Math.PI * 2 + i * 0.5);
        const waveB = Math.sin((phase / 100) * Math.PI * 2 * 1.8 + i * 0.23);
        const motion = (waveA * 0.65 + waveB * 0.35 + 1) / 2;
        const h = 6 + envelope * (6 + motion * 11);
        return (
          <div
            key={i}
            style={{
              width: 5,
              height: Math.max(4, h),
              borderRadius: 999,
              backgroundColor: "#969089",
              opacity: i % 2 === 0 ? 0.76 : 0.62,
            }}
          />
        );
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
    surfaceVariant = "card",
  },
  ref
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const setRefs = mergeRefs(innerRef, textareaRef);

  const [micState, setMicState] = useState<MicState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioObjectUrlRef = useRef<string | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const discardRecordingRef = useRef(false);
  const activeRecorderRef = useRef<MediaRecorder | null>(null);
  const mimeTypeRef = useRef("");
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const syncHeight = useCallback(() => {
    fitTextareaHeight(innerRef.current);
  }, []);

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
    requestAnimationFrame(() => fitTextareaHeight(e.currentTarget));
  };

  const startRecording = useCallback(async () => {
    setVoiceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = pickRecorderMime();
      mimeTypeRef.current = mimeType;
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
      mediaChunksRef.current = [];
      discardRecordingRef.current = false;
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) mediaChunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        if (activeRecorderRef.current !== recorder) return;
        activeRecorderRef.current = null;
        mediaRecorderRef.current = null;
        releaseStream();

        if (discardRecordingRef.current) {
          discardRecordingRef.current = false;
          mediaChunksRef.current = [];
          setMicState("idle");
          return;
        }

        const chunks = mediaChunksRef.current;
        mediaChunksRef.current = [];
        const blobType = recorder.mimeType || mimeTypeRef.current || "audio/webm";
        const blob = new Blob(chunks, { type: blobType });

        if (blob.size === 0) {
          setVoiceError("No audio captured");
          setMicState("error");
          return;
        }

        revokeAudioUrl();
        audioBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        audioObjectUrlRef.current = url;
        setAudioUrl(url);
        setMicState("transcribing");

        void (async () => {
          try {
            const uploadMimeType = blob.type || blobType || "audio/webm";
            const candidates = buildUploadCandidates(uploadMimeType);
            const urlDebug = getTranscribeUrlDebugInfo(transcribeUrl);

            console.info("[transcribe] upload start", {
              transcribeUrl,
              resolvedTranscribeUrl: urlDebug.resolvedUrl,
              transcribeUrlIsValid: urlDebug.isValid,
              transcribeUrlInvalidReason: urlDebug.reason ?? null,
              blobType: blob.type,
              recorderMimeType: recorder.mimeType,
              preferredMimeType: mimeTypeRef.current,
              bytes: blob.size,
              attempts: candidates.map((c) => `${c.fieldName}:${c.filename}`),
            });

            if (!urlDebug.isValid) {
              throw new Error(`Invalid transcribe URL: ${urlDebug.reason ?? "unknown"}`);
            }

            let transcript = "";
            let lastFailureDetail = "";

            for (let attemptIndex = 0; attemptIndex < candidates.length; attemptIndex += 1) {
              const candidate = candidates[attemptIndex];
              const formData = new FormData();
              formData.append("file", blob, candidate.filename);

              const response = await fetch(urlDebug.resolvedUrl, {
                method: "POST",
                body: formData,
              });

              const raw = await response.text().catch(() => "");
              const snippet = raw.slice(0, 300);
              let parsedJson: unknown = null;
              try {
                parsedJson = raw ? JSON.parse(raw) : null;
              } catch {
                parsedJson = null;
              }
              const parsedError =
                parsedJson &&
                typeof parsedJson === "object" &&
                "error" in parsedJson
                  ? (parsedJson as { error?: unknown }).error
                  : undefined;

              console.info(`[transcribe attempt ${attemptIndex + 1}]`, {
                endpoint: urlDebug.resolvedUrl,
                fieldName: "file",
                filename: candidate.filename,
                blobType: blob.type,
                recorderMimeType: recorder.mimeType,
                fileSize: blob.size,
                status: response.status,
                ok: response.ok,
                responseSnippet: snippet,
                parsedJson,
                parsedError,
              });

              if (!response.ok) {
                lastFailureDetail = `status=${response.status} field=${candidate.fieldName} filename=${candidate.filename} body=${snippet}`;
                continue;
              }

              if (parsedJson) {
                transcript = getTranscriptFromPayload(parsedJson);
              } else {
                transcript = raw.trim();
              }

              if (transcript) {
                break;
              }

              lastFailureDetail = `empty transcript field=${candidate.fieldName} filename=${candidate.filename} body=${snippet}`;
            }

            if (!transcript) {
              throw new Error(lastFailureDetail || "No transcript returned");
            }

            appendTranscript(transcript);
            setMicState("ready");
            setVoiceError(null);
          } catch (err) {
            console.error("[transcribe] failed", {
              error: err,
              transcribeUrl,
              blobType: blob.type,
              recorderMimeType: recorder.mimeType,
              preferredMimeType: mimeTypeRef.current,
              bytes: blob.size,
            });
            setVoiceError("Couldn't transcribe audio");
            setMicState("error");
            revokeAudioUrl();
          }
        })();
      };

      mediaRecorderRef.current = recorder;
      activeRecorderRef.current = recorder;
      recorder.start();
      setMicState("recording");
    } catch {
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
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
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
          minHeight: 36,
          minWidth: 0,
        }}
      >
        {micState === "recording" ? (
          <>
            <SubtleWaveform />
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
            <span>Transcribing...</span>
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

  const isComposer = surfaceVariant === "composer";

  return (
    <div
      style={{
        backgroundColor: isComposer ? "#fbfaf7" : "#ffffff",
        borderRadius: isComposer ? "18px" : "16px",
        border: "1px solid #e7e5e4",
        boxShadow: isComposer ? "0 2px 10px rgba(0, 0, 0, 0.06)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
        padding: isComposer ? "0.95rem 1rem 0.9rem" : "1.5rem 1.25rem 1.25rem",
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
          minHeight: TEXTAREA_MIN_PX,
          maxHeight: TEXTAREA_MAX_PX,
          height: isComposer ? "56px" : TEXTAREA_MIN_PX,
          backgroundColor: isComposer ? "transparent" : "#fafaf8",
          color: "#111",
          border: isComposer ? "1px solid transparent" : "1px solid #e7e5e4",
          borderRadius: isComposer ? "10px" : "12px",
          padding: isComposer ? "0.45rem 0.2rem 0.4rem 0.2rem" : "0.75rem 1rem",
          fontSize: "0.925rem",
          lineHeight: 1.65,
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
