import Link from "next/link";

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f3ef",
        color: "#111",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "4rem 1.5rem 4rem",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.875rem",
              color: "#555",
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#555",
              border: "1.5px solid #d6d3d1",
              borderRadius: "999px",
              padding: "6px 12px",
            }}
          >
            About
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: "0 0 1.5rem 0",
          }}
        >
          About VIREKA Space
        </h1>

        <div
          style={{
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "#333",
          }}
        >
          <p>
            VIREKA Space is designed to clarify how situations are understood
            before decisions are made or prompts are written.
          </p>

          <p>
            Many tools focus on improving answers after interpretation has
            already formed. VIREKA Space focuses on an earlier step: helping
            distinguish what is directly happening from what may be assumed, so
            understanding becomes clearer before action is taken.
          </p>

          <p>This applies both to:</p>

          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              real-life situations involving uncertainty, communication, or
              decision-making
            </li>
            <li>
              interactions with AI systems where the quality of a prompt
              influences the quality of the response
            </li>
          </ul>

          <p style={{ marginTop: "1.5rem" }}>
            VIREKA Space helps users examine:
          </p>

          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>what can be observed</li>
            <li style={{ marginBottom: "0.5rem" }}>
              what may be interpreted
            </li>
            <li>what remains uncertain</li>
          </ul>

          <p style={{ marginTop: "1.5rem" }}>
            By clarifying understanding before conclusions form, the system
            helps produce more coherent decisions, conversations, and AI
            interactions.
          </p>

          <p>
            VIREKA Space does not provide advice or attempt to direct outcomes.
            It supports clearer understanding so responses emerge from a more
            stable starting point.
          </p>

          <p>
            The ideas underlying VIREKA Space are introduced in{" "}
            <em>Beyond Thought: Awareness as Design Intelligence</em>, which
            explores how awareness influences reasoning, interpretation, and
            design.
          </p>
        </div>
      </div>
    </main>
  );
}
