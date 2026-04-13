import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f2",
        color: "#111111",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <header
        style={{
          width: "100%",
          padding: "20px 24px",
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(247,247,242,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
  }}
>
  VIREKA Space
</Link>

          <nav
  style={{
    display: "flex",
    gap: "22px",
    fontSize: "15px",
  }}
>
  <Link
    href="/about"
    style={{ color: "#222", textDecoration: "none" }}
  >
    About
  </Link>

  <Link
    href="/clarify"
    style={{ color: "#222", textDecoration: "none" }}
  >
    Clarify
  </Link>

  <Link
    href="/ai-interaction"
    style={{ color: "#222", textDecoration: "none" }}
  >
    AI Interaction
  </Link>
</nav>
        </div>
      </header>

      <section
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "24px 24px 72px",
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
              marginBottom: "28px",
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
            VIREKA Space helps separate what is happening from what may be
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
            <a
              href="#clarify"
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
              }}
            >
              Clarify a situation
            </a>

            <a
              href="#ai-interaction"
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
              }}
            >
              AI interaction
            </a>
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

      
      <section
        id="about"
        style={{
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e5de",
              borderRadius: "28px",
              padding: "42px 30px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.7rem, 4vw, 2.4rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.035em",
                margin: "0 0 22px 0",
              }}
            >
              WHEN INTERPRETATION BECOMES CLEARER, DECISIONS BECOME SIMPLER.
            </h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.8,
                color: "#2c2c2c",
                margin: "0 0 22px 0",
              }}
            >
              VIREKA Space helps clarify how situations are being understood
              before conclusions form.
            </p>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.8,
                color: "#2c2c2c",
                margin: "0 0 14px 0",
              }}
            >
              The system helps distinguish between:
            </p>

            <ul
              style={{
                margin: "0 0 28px 0",
                paddingLeft: "24px",
                fontSize: "18px",
                lineHeight: 1.95,
                color: "#2c2c2c",
              }}
            >
              <li>what can be directly observed</li>
              <li>what may be interpreted</li>
              <li>what remains unknown</li>
            </ul>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.8,
                color: "#2c2c2c",
                margin: "0 0 28px 0",
              }}
            >
              When these are clearer, decisions, conversations, and AI prompts
              begin from a more stable starting point.
            </p>

            <h3
              style={{
                fontSize: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6a6a6a",
                margin: "0 0 12px 0",
              }}
            >
              Useful when
            </h3>

            <ul
              style={{
                margin: "0 0 28px 0",
                paddingLeft: "24px",
                fontSize: "18px",
                lineHeight: 1.95,
                color: "#2c2c2c",
              }}
            >
              <li>thinking through an important decision</li>
              <li>preparing a complex AI prompt</li>
              <li>navigating uncertainty</li>
              <li>separating what is known from what is assumed</li>
              <li>identifying what information may be missing</li>
            </ul>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.8,
                color: "#2c2c2c",
                margin: "0 0 22px 0",
              }}
            >
              The system does not provide advice.
              <br />
              It helps clarify understanding before responding or deciding.
            </p>

            <div
              style={{
                borderTop: "1px solid #ecece5",
                paddingTop: "22px",
                display: "grid",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Clarity before prompting.
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Structure before response.
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Understanding before decision.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="clarify"
        style={{
          padding: "0 24px 36px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              borderTop: "1px solid #e3e3db",
              paddingTop: "28px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                margin: "0 0 10px 0",
              }}
            >
              Clarify
            </h3>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.75,
                color: "#555555",
                margin: 0,
              }}
            >
              This path will help users examine a real situation by separating
              observable facts, interpretations, and unknowns before deciding
              how to respond.
            </p>
          </div>
        </div>
      </section>

      <section
        id="ai-interaction"
        style={{
          padding: "0 24px 96px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              borderTop: "1px solid #e3e3db",
              paddingTop: "28px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                margin: "0 0 10px 0",
              }}
            >
              AI Interaction
            </h3>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.75,
                color: "#555555",
                margin: 0,
              }}
            >
              This path will help users shape prompts from clearer structure, so
              interactions with AI begin from better framing rather than rushed
              interpretation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
