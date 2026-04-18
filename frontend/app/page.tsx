"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/footer";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <main
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f7f7f2",
      overflowX: "hidden",
      width: "100%",
      color: "#111111",
      fontFamily:
     'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
   }}
  >
      <div style={{ flex: "1 0 auto" }}>
      <header
        style={{
          width: "100%",
          padding: "14px 24px",
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
            gap: "18px",
            flexWrap: "wrap",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <nav
              style={{
                display: "flex",
                gap: "18px",
                fontSize: "14px",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Link
                href="/about"
                style={{ color: "#333", textDecoration: "none" }}
              >
                About
              </Link>

              <Link
                href="/faq"
                style={{ color: "#333", textDecoration: "none" }}
              >
                FAQ
              </Link>
            </nav>

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
                    right: -110,
                    minWidth: "220px",
                    padding: "6px",
                    borderRadius: "16px",
                    backgroundColor: "#f8f6f1",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                >
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
                    Account
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
                    Plan
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
                    Privacy
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
                    Terms
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
                    Contact
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "12px 24px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid #e1e1da",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.03em",
              marginBottom: "18px",
              color: "#444",
            }}
          >
            VIREKA SPACE
          </div>

          <h1
            style={{
              fontSize: "clamp(2.35rem, 5.6vw, 4.4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              fontWeight: 700,
              marginBottom: "36px",
            }}
          >
            CLARITY BEFORE DECISION.
            <br />
            CLARITY BEFORE USING AI.
          </h1>

          <p
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              fontSize: "clamp(1.05rem, 1.7vw, 1.28rem)",
              lineHeight: 1.75,
              color: "#2e2e2e",
              marginBottom: "42px",
            }}
          >
            VIREKA Space helps distinguish what is happening from what may be
            assumed, so responses begin from clearer understanding.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            <Link
              href="/clarify"
              style={{
                padding: "16px 26px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid #111",
                backgroundColor: "#111",
                color: "#fff",
                textDecoration: "none",
                minWidth: "210px",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              Clarify a situation
            </Link>
            <Link
              href="/ai-interaction"
              style={{
                padding: "16px 26px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid #d7d7cf",
                backgroundColor: "#fff",
                color: "#111",
                textDecoration: "none",
                minWidth: "210px",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              AI interaction
            </Link>
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: 1.7,
            }}
          >
            <div>Developed by Anthony Escobedo</div>

            <div>
              Based on <em>Beyond Thought: Awareness as Design Intelligence</em>
            </div>
          </div>
        </div>
      </section>
        </div>
      <Footer />
    </main>
  );
}

