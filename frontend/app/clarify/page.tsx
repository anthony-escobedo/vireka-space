"use client";

import { useState } from "react";

type ClarifyResult = {
observable: string[];
interpretive: string[];
unknown: string[];
structural: string[];
orientation: string;
question?: string;
};

export default function ClarifyPage() {
const [input, setInput] = useState("");
const [result, setResult] = useState<ClarifyResult | null>(null);
const [loading, setLoading] = useState(false);

function handleClarify() {
if (!input.trim()) return;

```
setLoading(true);

// TEMPORARY MOCK RESPONSE
// this will be replaced by AI endpoint in next step

setTimeout(() => {
  setResult({
    observable: [
      "An interaction occurred",
      "Something was said or done",
      "A reaction followed"
    ],
    interpretive: [
      "Meaning may have been inferred",
      "Intent may have been assumed",
      "Emotional significance may have been assigned"
    ],
    unknown: [
      "Full context may not be visible",
      "Motivations are not directly observable",
      "Future implications remain undetermined"
    ],
    structural: [
      "Interpretation may be occurring rapidly",
      "Incomplete information may be influencing conclusions",
      "Cognitive closure may be occurring before sufficient observation"
    ],
    orientation:
      "Additional observation may reduce unnecessary interpretive pressure. Slowing conclusion formation may allow more accurate structural perception.",
    question:
      "What specifically was directly observable, separate from what was inferred?"
  });

  setLoading(false);
}, 600);
```

}

return ( <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6"> <div className="max-w-3xl mx-auto space-y-8">

```
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        Clarify
      </h1>

      <p className="text-neutral-400 text-sm">
        Distinguish observation from interpretation before deciding what matters.
      </p>
    </header>

    <section className="space-y-3">

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the situation you would like to clarify..."
        className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm outline-none focus:border-neutral-600"
      />

      <button
        onClick={handleClarify}
        disabled={loading}
        className="bg-neutral-100 text-neutral-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-white transition disabled:opacity-40"
      >
        {loading ? "Clarifying..." : "Clarify"}
      </button>

    </section>

    {result && (

      <section className="space-y-6 pt-6 border-t border-neutral-800">

        <Block
          title="What can be observed"
          items={result.observable}
        />

        <Block
          title="What may be interpreted"
          items={result.interpretive}
        />

        <Block
          title="What remains unknown"
          items={result.unknown}
        />

        <Block
          title="Structural conditions"
          items={result.structural}
        />

        <div className="space-y-2">

          <h3 className="text-sm font-medium text-neutral-400">
            Orientation
          </h3>

          <p className="text-sm leading-relaxed">
            {result.orientation}
          </p>

        </div>

        {result.question && (

          <div className="space-y-2">

            <h3 className="text-sm font-medium text-neutral-400">
              Clarifying question
            </h3>

            <p className="text-sm leading-relaxed italic">
              {result.question}
            </p>

          </div>

        )}

      </section>

    )}

  </div>
</main>
```

);
}

function Block({
title,
items
}: {
title: string;
items: string[];
}) {

return (

```
<div className="space-y-2">

  <h3 className="text-sm font-medium text-neutral-400">
    {title}
  </h3>

  <ul className="space-y-1 text-sm">

    {items.map((item, i) => (

      <li key={i} className="leading-relaxed">
        {item}
      </li>

    ))}

  </ul>

</div>
```

);
}
