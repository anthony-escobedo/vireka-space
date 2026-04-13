"use client";

import { useState } from "react";

type ClarifyResult = {
  happening: string[];
  assumed: string[];
  unclear: string[];
  structural: string[];
  orientation: string;
  question?: string;
};

export default function ClarifyPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ClarifyResult | null>(null);

  function handleClarify() {
    if (!input.trim()) return;

    // Temporary mock response for interface development.
    // This will later be replaced by the actual AI clarification logic.
    setResult({
      happening: [
        "A message was sent.",
        "A reply has not yet been received.",
        "There is a pause in communication.",
      ],
      assumed: [
        "The other person may be upset.",
        "The silence may be being interpreted as avoidance.",
        "More meaning may be getting assigned to the delay than the current facts support.",
      ],
      unclear: [
        "Whether the message has been seen.",
        "Why there has not been a reply yet.",
        "Whether unrelated conditions may be affecting the other person’s availability.",
      ],
      structural: [
        "Timing may be influencing how urgent the situation feels.",
        "Silence in communication can create pressure to interpret quickly.",
        "Limited information increases the likelihood of assumption filling the gap.",
      ],
      orientation:
        "It may help to stay close to what is directly visible before concluding what the delay means. Clarity does not require immediate certainty. A more stable response can begin once what is observed, assumed, and unclear are more distinctly separated.",
      question:
        "What part of this situation feels most important to clarify before responding?",
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f2",
        color: "#111111",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: "32px 24px 88px",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "28px",
            color: "#4a4a4a",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to home
        </a>

        <div
          style={{
            maxWidth: "760px",
            marginBottom: "32px",
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
              color: "#444",
              marginBottom: "20px",
            }}
          >
            CLARIFY
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              fontWeight: 700,
              margin: "0 0 18px 0",
            }}
          >
            Clarify a situation
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.75,
              color: "#2d2d2d",
              margin: "0 0 14px 0",
            }}
          >
            Describe a situation as you currently understand it.
          </p>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.75,
              color: "#2d2d2d",
              margin: 0,
            }}
          >
            VIREKA will help distinguish what appears to be happening, what may
            be assumed, what may still be unclear, and what conditions may be
            shaping the situation before a response is formed.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e5de",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            marginBottom: "28px",
          }}
        >
          <label
            htmlFor="situation"
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "12px",
              color: "#333",
            }}
          >
            Situation
          </label>

          <textarea
            id="situation"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Example: "A coworker stopped replying after I sent a detailed message, and now I’m assuming they may be upset or avoiding me."'
            style={{
              width: "100%",
              minHeight: "220px",
              borderRadius: "18px",
              border: "1px solid #d9d9d2",
              padding: "18px",
              fontSize: "16px",
              lineHeight: 1.7,
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              backgroundColor: "#fcfcfa",
              color: "#111111",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: "18px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#666666",
                lineHeight: 1.6,
                maxWidth: "680px",
              }}
            >
              Include the situation as you currently see it, even if it contains
              interpretation, uncertainty, or pressure. The system will help
              separate those elements more clearly.
            </p>

            <button
              onClick={handleClarify}
              style={{
                padding: "14px 24px",
                fontSize: "15px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid #111111",
                backgroundColor: "#111111",
                color: "#ffffff",
                cursor: "pointer",
                minWidth: "140px",
              }}
            >
              Clarify
            </button>
          </div>
        </div>

        {result && (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <ResultCard
              title="What appears to be happening"
              items={result.happening}
            />

            <ResultCard
              title="What may be assumed"
              items={result.assumed}
            />

            <ResultCard
              title="What may still be unclear"
              items={result.unclear}
            />

            <ResultCard
              title="Structural considerations"
              items={result.structural}
            />

            <TextCard title="Orientation" text={result.orientation} />

            {result.question && (
              <TextCard
                title="One question that might help"
                text={result.question}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e5de",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          margin: "0 0 14px 0",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>

      <ul
        style={{
          margin: 0,
          paddingLeft: "22px",
          fontSize: "17px",
          lineHeight: 1.9,
          color: "#2d2d2d",
        }}
      >
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TextCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e5de",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          margin: "0 0 14px 0",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "17px",
          lineHeight: 1.8,
          color: "#2d2d2d",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
