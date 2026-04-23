"use client";

import React from "react";
import { useLanguage } from "../lib/i18n/useLanguage";

type DoneStateProps = {
  onCopy: () => void;
  onNew: () => void;
  onHome: () => void;
  copyLabel?: string;
};

export default function DoneState({
  onCopy,
  onNew,
  onHome,
  copyLabel = "Copy result",
}: DoneStateProps) {
  const { t } = useLanguage();
  const [isDesktopInteractive, setIsDesktopInteractive] = React.useState(false);
  const [isCompactViewport, setIsCompactViewport] = React.useState(false);
  const [hoveredButton, setHoveredButton] = React.useState<"copy" | "new" | "home" | null>(null);
  const [cursorNorm, setCursorNorm] = React.useState({ x: 0, y: 0 });
  const [cursorPx, setCursorPx] = React.useState({ x: 50, y: 50 });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const evaluateInteractive = () => {
      const hasTouch = navigator.maxTouchPoints > 0;
      setIsDesktopInteractive(mediaQuery.matches && !hasTouch);
    };

    evaluateInteractive();
    mediaQuery.addEventListener("change", evaluateInteractive);

    return () => {
      mediaQuery.removeEventListener("change", evaluateInteractive);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 640px)");
    const evaluateCompact = () => setIsCompactViewport(mq.matches);

    evaluateCompact();
    mq.addEventListener("change", evaluateCompact);

    return () => {
      mq.removeEventListener("change", evaluateCompact);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  React.useEffect(() => {
    if (!isDesktopInteractive || typeof window === "undefined") {
      setCursorNorm({ x: 0, y: 0 });
      setCursorPx({ x: 50, y: 50 });
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;

      setCursorNorm({
        x: Math.max(-0.5, Math.min(0.5, normalizedX)),
        y: Math.max(-0.5, Math.min(0.5, normalizedY)),
      });
      setCursorPx({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDesktopInteractive]);

  const getActionStyle = (button: "copy" | "new" | "home"): React.CSSProperties => {
    const isActive = hoveredButton === button;
    const hasActivePeer = hoveredButton !== null && !isActive;
    const baseColor = button === "home" ? "#726c66" : "#1a1a1a";

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
      color: isActive ? (button === "home" ? "#141210" : "#0d0d0d") : baseColor,
      fontSize: "0.95rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
      lineHeight: 1.35,
      cursor: "pointer",
      whiteSpace: "nowrap",
      textAlign: "center",
      minWidth: "200px",
      boxSizing: "border-box",
      opacity: hasActivePeer ? 0.93 : 1,
      transform: isActive ? "scale(1.01)" : "scale(1)",
      transition: "transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease, color 0.2s ease",
    };
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: isCompactViewport ? "100dvh" : "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: isCompactViewport ? "flex-start" : "center",
        boxSizing: "border-box",
        overflowX: "hidden",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
        paddingTop: isCompactViewport
          ? "max(1rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))"
          : "clamp(72px, 12vh, 140px)",
        paddingBottom: isCompactViewport ? "max(1.5rem, env(safe-area-inset-bottom, 0px))" : "40px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundColor: "#f5f3ef",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            pointerEvents: "none",
          }}
        >
          <source src="/vireka-breath-loop.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(245, 243, 239, 0.84)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "620px",
          backgroundColor: "#ffffff",
          border: "1px solid #e7e5e4",
          borderRadius: "20px",
          padding: "2.75rem 2.5rem",
          boxSizing: "border-box",
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle at ${cursorPx.x}% ${cursorPx.y}%, rgba(255,255,255,${
              isDesktopInteractive ? "0.03" : "0"
            }), transparent 42%)`,
            transition: "background 120ms linear",
          }}
        />
        <h2
          style={{
            position: "relative",
            zIndex: 1,
            margin: "0 0 0.8rem 0",
            fontSize: "clamp(1.8rem, 4vw, 2.2rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontWeight: 600,
            color: "#111",
          }}
        >
          {t.doneState.clarityEstablished}
        </h2>

        <p
          style={{
            position: "relative",
            zIndex: 1,
            margin: "0 0 2rem 0",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "#66615b",
          }}
        >
          {t.doneState.structureSupportsClarity}
        </p>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.85rem",
            transform: isDesktopInteractive
              ? `translate3d(${(cursorNorm.x * 3.5).toFixed(2)}px, ${(cursorNorm.y * 3.5).toFixed(2)}px, 0)`
              : "translate3d(0px, 0px, 0)",
            transition: "transform 0.2s ease",
            willChange: "transform",
          }}
        >
          <button
            type="button"
            onClick={onCopy}
            style={getActionStyle("copy")}
            onMouseEnter={() => setHoveredButton("copy")}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setHoveredButton("copy")}
            onBlur={() => setHoveredButton(null)}
          >
            {copyLabel}
          </button>

          <button
            type="button"
            onClick={onNew}
            style={getActionStyle("new")}
            onMouseEnter={() => setHoveredButton("new")}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setHoveredButton("new")}
            onBlur={() => setHoveredButton(null)}
          >
            {t.doneState.startNewSituation}
          </button>

          <button
            type="button"
            onClick={onHome}
            style={getActionStyle("home")}
            onMouseEnter={() => setHoveredButton("home")}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setHoveredButton("home")}
            onBlur={() => setHoveredButton(null)}
          >
            {t.doneState.returnHome}
          </button>
        </div>
      </div>
    </div>
  );
}
