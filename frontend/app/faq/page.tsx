import Link from "next/link";

export default function FAQPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f2",
        color: "#111111",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: "640px",
          margin: "0 auto",
          padding: "2rem 1.25rem 2.75rem",
          lineHeight: 1.65,
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            style={{
              color: "#444",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            ← Back to home
          </Link>
        </div>

        <h1
          style={{
            fontSize: "1.9rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          FAQ
        </h1>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#333",
            marginTop: "0.35rem",
            marginBottom: "3rem",
          }}
        >
          Questions about VIREKA Space
        </h2>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            Why clarify a situation before using AI?
          </h2>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            AI systems respond to how situations are framed. Even highly capable
            models depend on the clarity of the problem they are given.
          </p>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            Clarifying what is known, what may be assumed, and what remains
            unclear helps ensure the system is working on the right problem.
          </p>

          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            Small differences in framing can produce very different outputs.
            When interpretation becomes clearer, prompts often become simpler
            and outputs often require fewer revisions.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            If AI keeps improving, won’t it figure out what we mean anyway?
          </h2>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            As AI systems become more capable, they can generate more outputs
            across more domains, more quickly.
          </p>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            This increases the importance of clarity about what is being asked.
          </p>

          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            More capable systems amplify the framing conditions they receive. If
            the situation is misinterpreted, the system may confidently produce
            outputs that appear coherent while failing to address the underlying
            issue. As generation becomes easier, the value of clarifying what
            should be generated often increases rather than decreases.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            How is VIREKA Space different from prompt engineering?
          </h2>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            Prompt engineering focuses on optimizing instructions given to AI.
            VIREKA Space focuses earlier, on clarifying how the situation itself
            is being interpreted before instructions are written.
          </p>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            Instead of asking: <br />
            “How should this prompt be written?”
          </p>

          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            VIREKA helps explore: <br />
            “What is actually happening in this situation?” <br />
            “What assumptions may be influencing interpretation?” <br />
            “What may still be unclear?”
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            Where does VIREKA Space fit in workflows that include AI agents or
            automated systems?
          </h2>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            As AI systems increasingly operate through multi-step processes,
            small misunderstandings can propagate further before being detected.
          </p>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            For example, a team may ask an AI system to “improve performance,”
            assuming the issue is speed. The system produces optimized code,
            revised workflows, and new documentation. Later, it becomes clear
            that the underlying issue was unclear decision criteria rather than
            processing time.
          </p>

          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            Multiple outputs may be generated, reviewed, and implemented before
            the original problem is fully defined. Clarifying the situation
            earlier helps reduce downstream correction costs and improves the
            likelihood that automated systems are working toward relevant
            outcomes.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            Is VIREKA Space a decision-making tool?
          </h2>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            VIREKA Space does not make decisions.
          </p>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            It helps clarify interpretation so decisions can be made with
            greater visibility into:
            <br />• what is known
            <br />• what may be influencing interpretation
            <br />• what may still require attention
          </p>

          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            The goal is not to prescribe conclusions, but to support clearer
            understanding before conclusions are formed.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            How does VIREKA Space relate to AI alignment?
          </h2>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            Technical alignment research focuses on ensuring that AI systems
            behave according to specified objectives.
          </p>

          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            VIREKA Space operates earlier, supporting clarity about how
            situations and objectives are interpreted before they are translated
            into instructions. Clearer framing helps ensure technical systems
            are applied in ways that more accurately reflect the situation they
            are intended to address.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            Does VIREKA Space provide answers?
          </h2>

          <p style={{ marginBottom: "1rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            VIREKA Space does not attempt to provide answers to every
            situation.
          </p>

          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            It helps clarify interpretation so responses, decisions, and prompts
            develop with greater coherence. The goal is not to increase output
            volume, but to improve the conditions under which outputs are
            generated.
          </p>
        </section>
      </main>
    </div>
  );
}
