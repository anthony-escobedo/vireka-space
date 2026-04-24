"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  endIntegratedViewTtsSession,
  replaceIntegratedViewTtsSession,
} from "../lib/integratedViewTtsCoordinator";
import { getOrCreateAnonymousId } from "../lib/anonymous";

type IntegratedViewTtsButtonProps = {
  text: string;
  listenLabel: string;
  stopLabel: string;
  errorMessage: string;
};

function SmallPlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}

function SmallStopIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 6h12v12H6V6Z" />
    </svg>
  );
}

export default function IntegratedViewTtsButton({
  text,
  listenLabel,
  stopLabel,
  errorMessage,
}: IntegratedViewTtsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.onended = null;
      a.onerror = null;
      audioRef.current = null;
    }
    const u = objectUrlRef.current;
    if (u) {
      URL.revokeObjectURL(u);
      objectUrlRef.current = null;
    }
    setLoading(false);
    setPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      endIntegratedViewTtsSession(cleanup);
      cleanup();
    };
  }, [cleanup]);

  const handleClick = useCallback(async () => {
    if (loading) {
      abortRef.current?.abort();
      abortRef.current = null;
      setLoading(false);
      endIntegratedViewTtsSession(cleanup);
      return;
    }
    if (playing) {
      cleanup();
      endIntegratedViewTtsSession(cleanup);
      return;
    }

    replaceIntegratedViewTtsSession(cleanup);

    setLoading(true);
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-anonymous-id": getOrCreateAnonymousId(),
        },
        body: JSON.stringify({ text }),
        signal: ac.signal,
      });

      if (!res.ok) {
        let errPayload = "";
        try {
          errPayload = await res.text();
        } catch {
          /* ignore */
        }
        console.error("TTS error:", res.status, errPayload || "(empty body)");
        cleanup();
        endIntegratedViewTtsSession(cleanup);
        alert(errorMessage);
        return;
      }

      const ct = res.headers.get("Content-Type") || "";
      if (!ct.includes("audio")) {
        let errPayload = "";
        try {
          errPayload = (await res.text()).slice(0, 800);
        } catch {
          /* ignore */
        }
        console.error("TTS error: unexpected Content-Type:", ct, errPayload);
        cleanup();
        endIntegratedViewTtsSession(cleanup);
        alert(errorMessage);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio();
      audioRef.current = audio;
      audio.src = url;

      audio.onended = () => {
        cleanup();
        endIntegratedViewTtsSession(cleanup);
      };
      audio.onerror = () => {
        cleanup();
        endIntegratedViewTtsSession(cleanup);
        alert(errorMessage);
      };

      setLoading(false);
      setPlaying(true);
      try {
        await audio.play();
      } catch {
        cleanup();
        endIntegratedViewTtsSession(cleanup);
        alert(errorMessage);
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        cleanup();
        endIntegratedViewTtsSession(cleanup);
        return;
      }
      cleanup();
      endIntegratedViewTtsSession(cleanup);
      alert(errorMessage);
    }
  }, [cleanup, errorMessage, loading, playing, text]);

  const baseButtonStyle: CSSProperties = {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    padding: 0,
    borderRadius: 8,
    border: "1px solid #dcd7d0",
    backgroundColor: "#faf9f7",
    color: "#7a756f",
    cursor: "pointer",
    transition: "background-color 140ms ease, border-color 140ms ease, color 140ms ease",
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={!text.trim()}
      aria-label={playing ? stopLabel : listenLabel}
      title={playing ? stopLabel : listenLabel}
      style={{
        ...baseButtonStyle,
        opacity: !text.trim() ? 0.45 : 1,
        cursor: !text.trim() ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!text.trim()) return;
        e.currentTarget.style.backgroundColor = "#f3f1ec";
        e.currentTarget.style.borderColor = "#cfc9c2";
        e.currentTarget.style.color = "#5c5852";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#faf9f7";
        e.currentTarget.style.borderColor = "#dcd7d0";
        e.currentTarget.style.color = "#7a756f";
      }}
    >
      {loading ? (
        <span
          aria-hidden
          style={{
            width: 12,
            height: 12,
            border: "2px solid #e7e5e4",
            borderTopColor: "#8e8a84",
            borderRadius: "50%",
            display: "inline-block",
            animation: "iv-tts-spin 0.65s linear infinite",
          }}
        />
      ) : playing ? (
        <SmallStopIcon />
      ) : (
        <SmallPlayIcon />
      )}
      <style>{`
        @keyframes iv-tts-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
