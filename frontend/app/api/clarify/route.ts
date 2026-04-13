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
- Recognize completion signals such as gratitude, acknowledgment, or statements indicating sufficient clarity.
- Examples include: "thank you", "thanks", "this helps", "that helps", "I understand", "that is enough", "I'm clear now", "all clear", "I'm good now", "got it".
- When closure is clearly signaled, respond briefly and politely.
- Do not reopen interpretation unnecessarily.
- Do not ask another question after clear completion.

Simplification behavior:
- When simplification is requested, preserve the original reasoning and distinctions.
- Reduce conceptual density.
- Use simpler and more direct phrasing.
- Maintain neutrality.
- Do not add new analysis.

Output modes:
1. clarify
2. simplify
3. close

Return ONLY valid JSON matching one of the allowed response shapes.

If the user is asking for clarification or continuing a situation, return mode "clarify".
If the user is asking for a simpler explanation, return mode "simplify".
If the user is signaling completion or enough clarity, return mode "close".

For mode "clarify", use:
{
  "mode": "clarify",
  "observable": ["..."],
  "interpretive": ["..."],
  "unknown": ["..."],
  "structural": ["..."],
  "orientation": "...",
  "question": "..."
}

Rules for mode "clarify":
- observable, interpretive, unknown, structural must each contain at least one non-empty string
- orientation must be one non-empty string
- question is optional; include it only when useful
- keep each bullet concise and readable
- maintain structural distinctions

For mode "simplify", use:
{
  "mode": "simplify",
  "message": "..."
}

Rules for mode "simplify":
- message must be one non-empty string
- preserve the core meaning of the current explanation
- do not add new analysis

For mode "close", use:
{
  "mode": "close",
  "message": "..."
}

Rules for mode "close":
- message must be one non-empty string
- keep it brief
- polite
- calm
- do not continue the analysis
- do not ask another question

No markdown.
No prose outside the JSON object.
No extra keys.
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
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item): item is ConversationTurn => {
      if (!isObject(item)) return false;
      const role = item.role;
      const content = item.content;

      const validRole = role === "user" || role === "assistant";
      const validContent = typeof content === "string" && content.trim().length > 0;

      return validRole && validContent;
    })
    .map((item) => ({
      role: item.role,
      content: normalizeWhitespace(item.content),
    }))
    .slice(-8);
}

function detectClosureSignal(input: string): boolean {
  const normalized = input.toLowerCase().trim();

  const closurePatterns = [
    "thank you",
    "thanks",
    "this helps",
    "that helps",
    "i understand",
    "i'm clear now",
    "im clear now",
    "all clear",
    "that is enough",
    "that's enough",
    "got it",
    "i'm good now",
    "im good now",
    "okay, i'm clear",
    "ok i'm clear",
    "okay im clear",
    "ok im clear",
  ];

  const hasClosurePhrase = closurePatterns.some((phrase) =>
    normalized.includes(phrase)
  );

  const likelyOnlyClosure =
    normalized.length <= 80 &&
    !/[?.]/.test(normalized.replace(/thank(s| you)?/g, ""));

  return hasClosurePhrase && likelyOnlyClosure;
}

function getLatestAssistantMessage(history: ConversationTurn[]): string {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const turn = history[i];
    if (turn.role === "assistant" && turn.content.trim()) {
      return turn.content.trim();
    }
  }
  return "";
}

function buildUserInstruction(params: {
  input: string;
  action: RequestAction;
  history: ConversationTurn[];
  closureHint: boolean;
}): string {
  const { input, action, history, closureHint } = params;
  const latestAssistant = getLatestAssistantMessage(history);

  if (action === "simplify") {
    return [
      "Action: simplify",
      "Simplify the current explanation while preserving the same reasoning and distinctions.",
      "Use simpler, more direct language.",
      latestAssistant
        ? `Most recent assistant response to simplify:\n${latestAssistant}`
        : "No assistant response is available in history. Simplify the latest context as best as possible.",
      `Latest user input:\n${input}`,
    ].join("\n\n");
  }

  if (closureHint) {
    return [
      "Action: clarify",
      "The latest user message may signal completion or sufficient clarity.",
      'If closure is clearly appropriate, return mode "close".',
      'If the user is also introducing a new situation, return mode "clarify" instead.',
      `Latest user input:\n${input}`,
    ].join("\n\n");
  }

  return [
    "Action: clarify",
    'Return mode "clarify" unless mode "close" is clearly more appropriate.',
    "The user may be continuing the same situation or introducing a new one.",
    "Do not force the user to answer a prior question if they are moving in a different direction.",
    `Latest user input:\n${input}`,
  ].join("\n\n");
}

function validateClarifyResponse(data: unknown): ClarifyResponse {
  if (!isObject(data)) {
    throw new Error("Model output is not an object.");
  }

  if (data.mode !== "clarify") {
    throw new Error('Clarify response must have mode "clarify".');
  }

  if (!isNonEmptyStringArray(data.observable)) {
    throw new Error('Field "observable" must be a non-empty string array.');
  }

  if (!isNonEmptyStringArray(data.interpretive)) {
    throw new Error('Field "interpretive" must be a non-empty string array.');
  }

  if (!isNonEmptyStringArray(data.unknown)) {
    throw new Error('Field "unknown" must be a non-empty string array.');
  }

  if (!isNonEmptyStringArray(data.structural)) {
    throw new Error('Field "structural" must be a non-empty string array.');
  }

  if (!isNonEmptyString(data.orientation)) {
    throw new Error('Field "orientation" must be a non-empty string.');
  }

  if (
    data.question !== undefined &&
    typeof data.question !== "string"
  ) {
    throw new Error('Field "question" must be a string when present.');
  }

  const question =
    typeof data.question === "string" && data.question.trim().length > 0
      ? data.question.trim()
      : undefined;

  return {
    mode: "clarify",
    observable: data.observable.map((item) => item.trim()),
    interpretive: data.interpretive.map((item) => item.trim()),
    unknown: data.unknown.map((item) => item.trim()),
    structural: data.structural.map((item) => item.trim()),
    orientation: data.orientation.trim(),
    ...(question ? { question } : {}),
  };
}

function validateMessageResponse(
  data: unknown,
  expectedMode: "simplify" | "close"
): SimplifyResponse | CloseResponse {
  if (!isObject(data)) {
    throw new Error("Model output is not an object.");
  }

  if (data.mode !== expectedMode) {
    throw new Error(`Response must have mode "${expectedMode}".`);
  }

  if (!isNonEmptyString(data.message)) {
    throw new Error('Field "message" must be a non-empty string.');
  }

  if (expectedMode === "simplify") {
    return {
      mode: "simplify",
      message: data.message.trim(),
    };
  }

  return {
    mode: "close",
    message: data.message.trim(),
  };
}

function validateVirekaResponse(data: unknown): VirekaResponse {
  if (!isObject(data)) {
    throw new Error("Model output is not an object.");
  }

  if (data.mode === "clarify") {
    return validateClarifyResponse(data);
  }

  if (data.mode === "simplify") {
    return validateMessageResponse(data, "simplify");
  }

  if (data.mode === "close") {
    return validateMessageResponse(data, "close");
  }

  throw new Error('Field "mode" must be one of: clarify, simplify, close.');
}

function parseAction(value: unknown): RequestAction {
  return value === "simplify" ? "simplify" : "clarify";
}

function buildMessages(params: {
  action: RequestAction;
  input: string;
  history: ConversationTurn[];
  closureHint: boolean;
}) {
  const { action, input, history, closureHint } = params;

  return [
    {
      role: "system" as const,
      content: SYSTEM_PROMPT,
    },
    ...history.map((turn) => ({
      role: turn.role,
      content: turn.content,
    })),
    {
      role: "user" as const,
      content: buildUserInstruction({
        input,
        action,
        history,
        closureHint,
      }),
    },
  ];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    if (!isObject(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 }
      );
    }

    const inputValue = body.input;
    if (typeof inputValue !== "string" || inputValue.trim() === "") {
      return NextResponse.json(
        { error: "Request body must include a non-empty input string." },
        { status: 400 }
      );
    }

    const input = normalizeWhitespace(inputValue);
    if (input.length < 2) {
      return NextResponse.json(
        { error: "Please include a little more text so the situation can be understood." },
        { status: 400 }
      );
    }

    const action = parseAction(body.action);
    const history = sanitizeHistory(body.history);
    const closureHint = action === "clarify" ? detectClosureSignal(input) : false;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on server." },
        { status: 500 }
      );
    }

    const messages = buildMessages({
      action,
      input,
      history,
      closureHint,
    });

    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();
      return NextResponse.json(
        {
          error: "OpenAI request failed.",
          status: openAIRes.status,
          details: errorText,
        },
        { status: 502 }
      );
    }

    const data = (await openAIRes.json()) as ChatCompletionResponse;
    const rawContent = data?.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      return NextResponse.json(
        { error: "OpenAI returned empty content." },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return NextResponse.json(
        {
          error: "OpenAI returned invalid JSON.",
          raw: rawContent,
        },
        { status: 502 }
      );
    }

    let validated: VirekaResponse;
    try {
      validated = validateVirekaResponse(parsed);
    } catch (err) {
      return NextResponse.json(
        {
          error: "Model output failed validation.",
          details: err instanceof Error ? err.message : "Unknown validation error.",
          raw: parsed,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(validated, { status: 200 });
  } catch (err) {
    console.error("clarify route error", err);
    return NextResponse.json(
      {
        error: "Internal server error.",
        details: err instanceof Error ? err.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
