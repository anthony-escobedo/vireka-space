"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/footer";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../lib/i18n/useLanguage";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusedPathway, setFocusedPathway] = useState<"clarify" | "ai" | null>(null);
  const [isDesktopInteractive, setIsDesktopInteractive] = useState(false);
  const [cursorNorm, setCursorNorm] = useState({ x: 0, y: 0 });
  const [cursorPx, setCursorPx] = useState({ x: 50, y: 50 });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { t} = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
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

  useEffect(() => {
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

  const menuLinkStyle: React.CSSProperties = {
    display: "block",
    padding: "10px 12px",
    borderRadius: "10px",
    color: "#222",
    textDecoration: "none",
    fontSize: "14px",
    lineHeight: 1.4,
    transition: "background-color 160ms ease, color 160ms ease",
  };
  const heroActionStyle: React.CSSProperties = {
    padding: "7px 2px",
    fontSize: "18px",
    fontWeight: 500,
    color: "#151515",
    textDecoration: "none",
    borderBottom: "1px solid rgba(17,17,17,0.2)",
    lineHeight: 1.35,
    letterSpacing: "-0.01em",
    transition: "color 160ms ease, border-color 160ms ease, opacity 120ms ease",
    minWidth: "210px",
    textAlign: "center",
  };
  const getHeroPathwayStyle = (
    pathway: "clarify" | "ai"
  ): React.CSSProperties => {
    const isFocused = focusedPathway === pathway;
    const isOtherFocused = focusedPathway !== null && !isFocused;

    return {
      ...heroActionStyle,
      color: isFocused ? "#0d0d0d" : "#1a1a1a",
      borderBottomColor: isFocused ? "rgba(0,0,0,0.46)" : "rgba(17,17,17,0.22)",
      opacity: isOtherFocused ? 0.7 : isFocused ? 1 : 0.9,
      transform: isFocused ? "scale(1.025)" : "scale(1)",
      transition: "transform 0.2s ease, opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease",
    };
  };

  return (
    <main
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f7f7f2",
      overflowX: "hidden",
      width: "100%",
      maxWidth: "100%",
      position: "relative",
      color: "#111111",
      fontFamily:
     'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
   }}
  >
      <div style={{ flex: "1 0 auto" }}>
      <header
        style={{
          width: "100%",
          padding: "10px 24px",
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(247,247,242,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
            }}
          >
            <div
              ref={menuRef}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                style={{
                  appearance: "none",
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "#ffffff",
                  color: "#222",
                  borderRadius: "999px",
                  width: "42px",
                  height: "42px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 160ms ease, border-color 160ms ease",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "1.5px",
                      backgroundColor: "#222",
                      display: "block",
                      borderRadius: "999px",
                    }}
                  />
                  <span
                    style={{
                      width: "16px",
                      height: "1.5px",
                      backgroundColor: "#222",
                      display: "block",
                      borderRadius: "999px",
                    }}
                  />
                  <span
                    style={{
                      width: "16px",
                      height: "1.5px",
                      backgroundColor: "#222",
                      display: "block",
                      borderRadius: "999px",
                    }}
                  />
                </span>
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "52px",
                    left: 0,
                    minWidth: "220px",
                    maxWidth: "min(280px, calc(100vw - 32px))",
                    padding: "6px",
                    borderRadius: "16px",
                    backgroundColor: "#f8f6f1",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  <Link
                    href="/about"
                    style={menuLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.065)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.header.about}
                  </Link>

                  <Link
                    href="/faq"
                    style={menuLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.065)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.header.faq}
                  </Link>

                  <div
                    aria-hidden
                    style={{
                      margin: "4px 8px",
                      borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                  />

                  <Link
                    href="/settings/account"
                    style={menuLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.065)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.settings.account}
                  </Link>

                  <Link
                    href="/settings/plan"
                    style={menuLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.settings.plan}
                  </Link>

                  <Link
                    href="/privacy"
                    style={menuLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.footer.privacy}
                  </Link>

                  <Link
                    href="/terms"
                    style={menuLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.footer.terms}
                  </Link>

                  <Link
                    href="/settings/contact"
                    style={menuLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.footer.contact}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/"
              style={{
                fontSize: "18px",
                fontWeight: 650,
                letterSpacing: "-0.015em",
                color: "#000",
                textDecoration: "none",
                display: "inline-block",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              VIREKA Space
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              marginLeft: "auto",
              minWidth: 0,
            }}
          >
            <LanguageSelector />
          </div>
        </div>
      </header>

      <section
  className="home-hero-section"
  style={{
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 120px)",
    backgroundColor: "#f7f7f2",
  }}
>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundColor: "#f7f7f2",
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
              backgroundColor: "rgba(247, 247, 242, 0.82)",
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background: `radial-gradient(circle at ${cursorPx.x}% ${cursorPx.y}%, rgba(255,255,255,${
              isDesktopInteractive ? "0.06" : "0"
            }), transparent 40%)`,
            transition: "background 120ms linear",
          }}
        />
        <div
          className="home-hero-inner"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "900px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 220px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginBottom: "72px",
              transform: isDesktopInteractive
                ? `translate3d(${(cursorNorm.x * 6).toFixed(2)}px, ${(cursorNorm.y * 6).toFixed(2)}px, 0)`
                : "translate3d(0px, 0px, 0)",
              transition: "transform 0.2s ease",
              willChange: "transform",
            }}
          >
            <Link
              href="/clarify"
              style={getHeroPathwayStyle("clarify")}
              onMouseEnter={() => setFocusedPathway("clarify")}
              onMouseLeave={() => setFocusedPathway(null)}
              onFocus={() => setFocusedPathway("clarify")}
              onBlur={() => setFocusedPathway(null)}
            >
              {t.hero.clarifyButton}
            </Link>
            <Link
              href="/ai-interaction"
              style={getHeroPathwayStyle("ai")}
              onMouseEnter={() => setFocusedPathway("ai")}
              onMouseLeave={() => setFocusedPathway(null)}
              onFocus={() => setFocusedPathway("ai")}
              onBlur={() => setFocusedPathway(null)}
            >
              {t.hero.aiButton}
            </Link>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#9b948a",
              lineHeight: 1.45,
              textAlign: "center",
              fontWeight: 400,
              marginTop: "auto",
            }}
          >
            Developed by Anthony Escobedo
            <br />
            Based on <em>Beyond Thought: Awareness as Design Intelligence</em>
          </div>
        </div>
      </section>
        </div>
      <Footer />
    </main>
  );
}

