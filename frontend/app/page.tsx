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
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
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
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid #d9d9d2",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            VIREKA Space
          </div>

          <h1
            style={{
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
              fontWeight: 700,
              margin: "0 0 24px 0",
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
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              lineHeight: 1.6,
              color: "#2d2d2d",
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
              marginTop: "36px",
            }}
          >
            <button
              style={{
                padding: "16px 24px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid #111111",
                backgroundColor: "#111111",
                color: "#ffffff",
                cursor: "pointer",
                minWidth: "190px",
              }}
            >
              Clarify a situation
            </button>

            <button
              style={{
                padding: "16px 24px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid #cfcfc8",
                backgroundColor: "#ffffff",
                color: "#111111",
                cursor: "pointer",
                minWidth: "190px",
              }}
            >
              AI interaction
            </button>
          </div>

          <div
            style={{
              marginTop: "32px",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#5a5a5a",
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
        style={{
          padding: "0 24px 96px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e4e4dc",
              borderRadius: "28px",
              padding: "40px 28px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
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
                lineHeight: 1.75,
                color: "#2d2d2d",
                margin: "0 0 22px 0",
              }}
            >
              VIREKA Space helps clarify how situations are being understood
              before conclusions form.
            </p>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.75,
                color: "#2d2d2d",
                margin: "0 0 14px 0",
              }}
            >
              The system helps distinguish between:
            </p>

            <ul
              style={{
                margin: "0 0 28px 0",
                paddingLeft: "22px",
                fontSize: "18px",
                lineHeight: 1.9,
                color: "#2d2d2d",
              }}
            >
              <li>what can be directly observed</li>
              <li>what may be interpreted</li>
              <li>what remains unknown</li>
            </ul>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.75,
                color: "#2d2d2d",
                margin: "0 0 28px 0",
              }}
            >
              When these are clearer, decisions, conversations, and AI prompts
              begin from a more stable starting point.
            </p>

            <h3
              style={{
                fontSize: "15px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#666666",
                margin: "0 0 12px 0",
              }}
            >
              Useful when
            </h3>

            <ul
              style={{
                margin: "0 0 28px 0",
                paddingLeft: "22px",
                fontSize: "18px",
                lineHeight: 1.9,
                color: "#2d2d2d",
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
                lineHeight: 1.75,
                color: "#2d2d2d",
                margin: "0 0 22px 0",
              }}
            >
              The system does not provide advice.
              <br />
              It helps clarify understanding before responding or deciding.
            </p>

            <div
              style={{
                borderTop: "1px solid #ecece6",
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
    </main>
  );
}
