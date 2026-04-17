import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f2",
        overflowX: "hidden",
        width: "100%",
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
            gap: "12px",
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

          <nav
            style={{
              display: "flex",
              gap: "10px",
              fontSize: "13px",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              width: "100%",
              maxWidth: "100%",
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
      
    </main>
  );
}
