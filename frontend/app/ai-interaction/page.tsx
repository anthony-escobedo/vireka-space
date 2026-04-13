import Link from "next/link";

export default function AIInteractionPage() {
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
        {/* back link */}
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

        {/* title */}
        <h1
          style={{
            fontSize: "1.9rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          AI Interaction
        </h1>

        {/* lead */}
        <p
          style={{
            color: "#444",
            fontSize: "0.98rem",
            marginBottom: "2rem",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          Shape prompts from clearer structure before interacting with AI systems.
        </p>

        {/* placeholder explanation */}
        <section>
          <p
            style={{
              marginBottom: "1rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            This path will help clarify what you want to ask AI before writing a prompt.
          </p>

          <p
            style={{
              marginBottom: "1rem",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            By distinguishing what is known, what is assumed, and what remains undefined, prompts can begin from clearer structure.
          </p>

          <p
            style={{
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            A structured starting point often leads to more useful and more reliable AI responses.
          </p>
        </section>
      </main>
    </div>
  );
}
