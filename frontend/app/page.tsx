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
          padding: "22px 24px",
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(247, 247, 242, 0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            VIREKA Space
          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#about"
              style={{
                textDecoration: "none",
                color: "#222222",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              About
            </a>
            <a
              href="#clarify"
              style={{
                textDecoration: "none",
                color: "#222222",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              Clarify
            </a>
            <a
              href="#ai-interaction"
              style={{
                textDecoration: "none",
                color: "#222222",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              AI Interaction
            </a>
          </nav>
        </div>
      </header>

      <section
        style={{
          minHeight: "calc(100vh - 82px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "56px 24px 72px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "920px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "999px",
              border: "1px solid #d8d8d1",
              backgroundColor: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.03em",
              marginBottom: "30px",
            }}
          >
            VIREKA SPACE
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.05em",
              fontWeight: 700,
              margin: "0 0 30px 0",
            }}
          >
            CLARITY BEFORE DECISION.
            <br />
            CLARITY BEFORE USING AI.
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              fontSize: "clamp(1.05rem, 1.8vw, 1.32rem)",
              lineHeight: 1.7,
              color: "#2b2b2b",
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
              marginTop: "38px",
            }}
          >
            <a
              href="#clarify"
              style={{
                textDecoration: "none",
                padding: "16px 26px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid #111111",
                backgroundColor: "#111111",
                color: "#ffffff",
                minWidth: "210px",
                textAlign: "center",
              }}
            >
              Clarify a situation
            </a>

            <a
              href="#ai-interaction"
              style={{
                textDecoration: "none",
                padding: "16px 26px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid #d1d1ca",
                backgroundColor: "#ffffff",
                color: "#111111",
                minWidth: "210px",
                textAlign: "center",
              }}
            >
              AI interaction
            </a>
          </div>

          <div
            style={{
              marginTop: "34px",
              fontSize: "14px",
              lineHeight: 1.75,
              color: "#606060",
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
