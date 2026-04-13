export default function AboutPage() {
  return (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#f7f7f2",
      color: "#111111",
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}
  >
    <main
      style={{
        width: "100%",
        maxWidth: "640px",
        margin: "0 auto",
        padding: "2.5rem 1.25rem",
        lineHeight: 1.65,
      }}
    >
      <h1
        style={{
          fontSize: "1.9rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
        }}
      >
        About VIREKA Space
      </h1>

      <p
        style={{
          color: "#444",
          fontSize: "0.98rem",
          marginBottom: "2.25rem",
        }}
      >
        A structured approach to clarifying interpretation before decisions and AI interaction.
      </p>

      {/* Function */}

      <section style={{ marginBottom: "2.25rem" }}>
        <h2
          style={{
            fontSize: "0.95rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            color: "#666",
          }}
        >
          Function
        </h2>

        <p style={{ marginBottom: "1rem" }}>
          VIREKA Space is designed to clarify how situations are understood before decisions are made or prompts are written.
        </p>

        <p style={{ marginBottom: "1rem" }}>
          Many tools focus on improving answers after interpretation has already formed. VIREKA Space focuses on an earlier step by helping distinguish what is directly happening from what may be assumed, so understanding becomes clearer before action is taken.
        </p>

        <p style={{ marginBottom: "1rem" }}>
          VIREKA Space helps create a more stable starting point by separating observation from interpretation and identifying what remains unknown. This supports decisions, conversations, and AI interactions that benefit from clearer structure before conclusions are drawn.
        </p>

        <p>
          The system does not provide advice or attempt to direct outcomes. It supports clearer understanding so responses can emerge with greater coherence and internal consistency.
        </p>
      </section>

      {/* Relevance */}

      <section style={{ marginBottom: "2.25rem" }}>
        <h2
          style={{
            fontSize: "0.95rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            color: "#666",
          }}
        >
          Relevance
        </h2>

        <p style={{ marginBottom: "1rem" }}>
          In environments shaped by rapid information, complex decisions, and increasingly capable AI systems, the quality of outcomes often depends on the clarity of the starting point. When interpretation forms too quickly, responses may appear confident while still resting on unstable assumptions.
        </p>

        <p style={{ marginBottom: "1rem" }}>
          Many situations feel unclear not because information is absent, but because observation, interpretation, and uncertainty have not yet been distinguished.
        </p>

        <p style={{ marginBottom: "1rem" }}>
          As AI systems increasingly participate in reasoning processes, the clarity of human interpretation becomes part of the design environment itself. The way situations are understood begins to influence not only individual decisions, but also how prompts are written, how systems are guided, and how outcomes are shaped.
        </p>

        <p>
          Although simple to use, the approach applies across domains including everyday decisions, research, policy, organizational environments, and AI development, anywhere interpretation influences action.
        </p>
      </section>

      {/* Origin */}

      <section>
        <h2
          style={{
            fontSize: "0.95rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            color: "#666",
          }}
        >
          Origin
        </h2>

        <p style={{ marginBottom: "1rem" }}>
          The ideas underlying VIREKA Space are introduced in <em>Beyond Thought: Awareness as Design Intelligence</em>, which explores how awareness influences reasoning, interpretation, and design. The work examines how perception shapes the structure of thought, and why that structure increasingly matters in human-AI interaction.
        </p>

        <p style={{ marginBottom: "1rem" }}>
          VIREKA Space is an initial exploration of how structured awareness can function as a practical support for clearer thinking in complex environments.
        </p>

        <p>
          Further writing explores how awareness influences interpretation, and how clearer interpretation shapes reasoning, decision environments, and interaction with AI systems.
        </p>
      </section>
        </main>
  </div>
  );
}
