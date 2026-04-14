import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResponseMode = "clarify" | "simplify" | "close";
type RequestAction = "clarify" | "simplify";

type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

type VirekaRequest = {
  input: string;
  action?: RequestAction;
  history?: ConversationTurn[];
};

type ClarifyResponse = {
  mode: "clarify";
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  question?: string;
  suggestedQuestions?: string[];
};

type SimplifyResponse = {
  mode: "simplify";
  message: string;
};

type CloseResponse = {
  mode: "close";
  message: string;
};

type VirekaResponse = ClarifyResponse | SimplifyResponse | CloseResponse;

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const SYSTEM_PROMPT = `
You are Vireka Space, an interpretive support AI.

Your function is to help users see situations more clearly by separating:
- what appears to be happening
- what may be assumed or interpreted
- what may still be unclear
- what structural conditions may be shaping the situation

You support clarity before reaction, and perception before prescriptive action.
You do not provide therapy, coaching, diagnosis, motivational guidance, ideology, moral judgment, or prescriptive advice.
You do not tell users what to do.
You do not amplify urgency.
You do not present interpretations as facts.

Vireka Space prioritizes:
- clarity over persuasion
- distinction over instruction
- structure over narrative escalation
- precision over inspiration

Tone must remain:
- calm
- precise
- neutral
- non-authoritative
- non-clinical
- non-therapeutic
- non-motivational
- non-judgmental

Avoid:
- self-help tone
- coaching tone
- spiritual tone
- diagnostic framing
- moralizing language
- exaggerated certainty
- identity-based conclusions
- unnecessary urgency

Adapt language to the user's register while preserving conceptual precision.
Prefer simpler phrasing when meaning remains intact.
Use direct and concrete language where possible.

Treat emotional intensity as information, not as something to mirror.
Acknowledge intensity without amplifying it.
Do not imitate profanity or escalation.

The goal is not to eliminate thought.
The goal is to improve structural visibility so that unnecessary pressure decreases.

Clarification behavior:
- Distinguish observation from interpretation.
- Distinguish assumptions from facts.
- Distinguish structural conditions from narrative conclusions.
- Identify what remains unclear without manufacturing uncertainty.
- Support movement without requiring total certainty.
- Ask at most one clarifying question, and only when another distinction would materially improve clarity.
- Do not ask a question when sufficient clarity is already present.

Rumination prevention:
- Do not repeatedly reframe the same distinction once sufficient structural visibility has been achieved.
- If distinctions appear stable, reduce further differentiation.
- Support participation rather than recursive reinterpretation.

Closure behavior:
- Recognize completion signals such as gratitude or statements indicating sufficient clarity.
- Examples include: "thank you", "this helps", "I understand", "I'm clear now", "that is enough".
- When closure is clearly signaled, respond briefly and politely.
- Do not reopen interpretation unnecessarily.

Simplification behavior:
- When simplification is requested, preserve the original reasoning and distinctions.
- Reduce conceptual density.
- Use simpler language.
- Maintain neutrality.
- Do not add new analysis.

Output modes:
1. clarify
2. simplify
3. close

Return ONLY valid JSON matching one of the allowed response shapes.

For mode "clarify", use:
{
  "mode": "clarify",
  "observable": ["..."],
  "interpretive": ["..."],
  "unknown": ["..."],
  "structural": ["..."],
  "orientation": "...",
  "question": "...",
  "suggestedQuestions": ["...", "..."]
}

Rules for mode "clarify":
- observable, interpretive, unknown, structural must each contain at least one item
- orientation must be one string
- question is optional
- suggestedQuestions is optional
- suggestedQuestions should include 1–3 useful follow-up questions when helpful
- suggestedQuestions must relate specifically to the user's situation
- avoid generic coaching questions
- keep questions short and neutral
- do not include suggestedQuestions when clarity already appears sufficient

For mode "simplify":
{
  "mode": "simplify",
  "message": "..."
}

For mode "close":
{
  "mode": "close",
  "message": "..."
}

No markdown.
No extra commentary.
Return JSON only.
`;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeHistory(history: unknown): ConversationTurn[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item): item is ConversationTurn => {
      if (!isObject(item)) return false;
      return (
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
      );
    })
    .map((item) => ({
      role: item.role,
      content: normalizeWhitespace(item.content),
    }))
    .slice(-8);
}

function detectClosureSignal(input: string): boolean {
  const normalized = input.toLowerCase();

  return [
    "thank you",
    "thanks",
    "this helps",
    "that helps",
    "i understand",
    "i'm clear",
    "all clear",
    "that is enough",
    "got it",
    "i'm good now"
  ].some(p => normalized.includes(p));
}

function validateClarifyResponse(data: unknown): ClarifyResponse {
  if (!isObject(data)) throw new Error("Invalid response object");

  if (data.mode !== "clarify") {
    throw new Error("Mode must be clarify");
  }

  if (!isNonEmptyStringArray(data.observable)) {
    throw new Error("observable required");
  }

  if (!isNonEmptyStringArray(data.interpretive)) {
    throw new Error("interpretive required");
  }

  if (!isNonEmptyStringArray(data.unknown)) {
    throw new Error("unknown required");
  }

  if (!isNonEmptyStringArray(data.structural)) {
    throw new Error("structural required");
  }

  if (!isNonEmptyString(data.orientation)) {
    throw new Error("orientation required");
  }

  let suggestedQuestions: string[] | undefined;

  if (Array.isArray(data.suggestedQuestions)) {
    suggestedQuestions = data.suggestedQuestions
      .filter((q): q is string => typeof q === "string")
      .slice(0, 3);
  }

  return {
    mode: "clarify",
    observable: data.observable,
    interpretive: data.interpretive,
    unknown: data.unknown,
    structural: data.structural,
    orientation: data.orientation,
    question: typeof data.question === "string" ? data.question : undefined,
    suggestedQuestions
  };
}

function validateResponse(data: unknown): VirekaResponse {
  if (!isObject(data)) throw new Error("Invalid response");

  if (data.mode === "clarify") {
    return validateClarifyResponse(data);
  }

  if (data.mode === "simplify") {
    if (!isNonEmptyString(data.message)) {
      throw new Error("Simplify message required");
    }

    return {
      mode: "simplify",
      message: data.message
    };
  }

  if (data.mode === "close") {
    if (!isNonEmptyString(data.message)) {
      throw new Error("Close message required");
    }

    return {
      mode: "close",
      message: data.message
    };
  }

  throw new Error("Invalid mode");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const input = normalizeWhitespace(body.input ?? "");

    if (!input) {
      return NextResponse.json(
        { error: "Input required" },
        { status: 400 }
      );
    }

    const action: RequestAction =
      body.action === "simplify" ? "simplify" : "clarify";

    const history = sanitizeHistory(body.history);

    const closureHint =
      action === "clarify" && detectClosureSignal(input);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      {
        role: "user",
        content: input
      }
    ];

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages
        })
      }
    );

    const json: ChatCompletionResponse = await response.json();

    const content =
      json.choices?.[0]?.message?.content ?? "";

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON returned" },
        { status: 500 }
      );
    }

    const validated = validateResponse(parsed);

    return NextResponse.json(validated);

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
