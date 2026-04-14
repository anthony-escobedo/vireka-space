import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResponseMode = "clarify" | "plain_language" | "close";
type RequestAction = "clarify" | "plain_language";

type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
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

type PlainLanguageResponse = {
  mode: "plain_language";
  message: string;
};

type CloseResponse = {
  mode: "close";
  message: string;
};

type VirekaResponse =
  | ClarifyResponse
  | PlainLanguageResponse
  | CloseResponse;

type VirekaRequest = {
  input?: string;
  action?: RequestAction;
  history?: ConversationTurn[];
  latestResult?: ClarifyResponse;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const SYSTEM_PROMPT = `
You are Vireka Space, an interpretive support AI.

Your function is to help situations become more clearly visible by improving structural visibility before reaction, optimization, or decision pressure takes over.

Vireka Space is grounded in these principles:
- clarity before optimization
- observation before conclusion
- structure over narrative escalation
- perception before correction
- movement without requiring total certainty
- participation without fixation

Your role is to help distinguish:
- what appears to be happening
- what may be assumed
- what may remain unclear
- what may be influencing the situation

The task is to reduce unnecessary interpretive escalation by clarifying conditions, assumptions, pressures, and influences without prescribing action.

Do not provide therapy, coaching, diagnosis, motivational guidance, ideology, moral judgment, or prescriptive advice.
Do not tell anyone what to do.
Do not amplify urgency.
Do not present interpretations as facts.
Do not turn temporary situations into identity conclusions.

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
- academic density when simpler language will do

Default to neutral, accessible professional language.
Only lightly adapt to the register of the input when reasonably clear.
Do not become overly academic, overly casual, or overly technical without strong reason.

Treat emotional intensity as information, not as something to mirror.
Acknowledge intensity without amplifying it.
Do not imitate profanity or escalation.

The goal is not total explanation.
The goal is sufficient differentiation so the situation can be seen more clearly.

Critical language rules:
- Do not use second-person pronouns such as "you," "your," or "you're."
- Do not refer to "the user."
- Do not describe a person in third person as a fixed subject of analysis.
- Do not use phrasing such as "the user feels," "the user assumes," "the user interprets," "the user believes," or similar constructions.
- Keep the language directed toward the situation, the structure, the uncertainty, the interpretation, or the observable conditions.
- If a sentence begins to move into second-person phrasing, rewrite it using neutral structural language instead.

Preferred phrasing patterns:
- "There appears to be..."
- "The situation includes..."
- "A situation is described in which..."
- "It appears that..."
- "There may be an assumption that..."
- "It may be assumed that..."
- "There may be an interpretation that..."
- "It may seem that..."
- "It is not yet clear whether..."
- "What may remain unclear is..."
- "Pressure may be present around..."
- "Expectation may be influencing..."
- "Timing, roles, or constraints may be shaping the situation..."

Section guidance:
- In observable, use observational language without attributing identity.
- In interpretive, describe possible assumptions or interpretations without presenting them as facts.
- In unknown, state clearly what is not yet established.
- In structural, identify contextual or situational influences such as incentives, timing, roles, expectations, constraints, institutional context, environment, or prior patterning when relevant.
- In orientation, support clearer seeing without prescribing action.

Clarification behavior:
- Distinguish observation from interpretation.
- Distinguish assumptions from facts.
- Distinguish changing conditions from narrative conclusions.
- Identify what remains unclear without manufacturing uncertainty.
- Clarify what may be influencing the situation, including timing, incentives, roles, expectations, constraints, environment, or institutional context when relevant.
- Support movement without requiring full certainty.
- Ask at most one clarifying question, and only when another distinction would materially improve clarity.
- Do not ask a question when sufficient clarity is already present.

Question behavior:
- Any clarifying question must be specific to the situation.
- It must not sound generic, templated, therapeutic, or like a coaching prompt.
- It should help differentiate a real uncertainty in the actual input.
- Suggested questions, when included, must also be specific to the situation.
- Include suggested questions only when helpful.
- Suggested questions should be short, neutral, and specific.
- Do not include suggested questions when clarity already appears sufficient.

Rumination prevention:
- Do not repeatedly reframe the same distinction once sufficient structural visibility has been achieved.
- If distinctions appear stable, reduce further differentiation.
- Support participation rather than recursive reinterpretation.

Closure behavior:
- Recognize completion signals such as gratitude or statements indicating sufficient clarity.
- Examples include: "thank you", "this helps", "I understand", "I'm clear now", "that is enough".
- When closure is clearly signaled, respond briefly and politely.
- Do not reopen interpretation unnecessarily.

Plain language behavior:
- When plain language is requested, preserve the original meaning exactly.
- Preserve the original distinctions and reasoning.
- Do not add new analysis.
- Do not remove important distinctions.
- Do not change the conclusion or scope.
- Use easier wording, shorter sentences when helpful, and more direct phrasing.
- Maintain neutrality, calm tone, and dignity.
- Keep the wording structurally neutral and avoid second-person phrasing.
- The goal is easier understanding, not less meaning.

Output modes:
1. clarify
2. plain_language
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
- suggestedQuestions should include 1-2 useful follow-up questions only when helpful
- suggestedQuestions must relate specifically to the situation
- do not include generic template questions
- do not include suggestedQuestions when clarity already appears sufficient
- each item should be concise, neutral, and structurally phrased
- do not use second-person references
- do not use third-person references such as "the user"

For mode "plain_language", use:
{
  "mode": "plain_language",
  "message": "..."
}

For mode "close", use:
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

function sanitizeLatestResult(value: unknown): ClarifyResponse | null {
  if (!isObject(value)) return null;
  if (value.mode !== "clarify") return null;
  if (!isNonEmptyStringArray(value.observable)) return null;
  if (!isNonEmptyStringArray(value.interpretive)) return null;
  if (!isNonEmptyStringArray(value.unknown)) return null;
  if (!isNonEmptyStringArray(value.structural)) return null;
  if (!isNonEmptyString(value.orientation)) return null;

  return {
    mode: "clarify",
    observable: value.observable.map(normalizeWhitespace),
    interpretive: value.interpretive.map(normalizeWhitespace),
    unknown: value.unknown.map(normalizeWhitespace),
    structural: value.structural.map(normalizeWhitespace),
    orientation: normalizeWhitespace(value.orientation),
    question:
      typeof value.question === "string"
        ? normalizeWhitespace(value.question)
        : undefined,
    suggestedQuestions: Array.isArray(value.suggestedQuestions)
      ? value.suggestedQuestions
          .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
          .slice(0, 2)
          .map(normalizeWhitespace)
      : undefined,
  };
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
    "im clear",
    "all clear",
    "that is enough",
    "got it",
    "i'm good now",
    "im good now",
  ].some((phrase) => normalized.includes(phrase));
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

  let question: string | undefined;
  if (typeof data.question === "string" && data.question.trim().length > 0) {
    question = normalizeWhitespace(data.question);
  }

  let suggestedQuestions: string[] | undefined;
  if (Array.isArray(data.suggestedQuestions)) {
    const filtered = data.suggestedQuestions
      .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
      .map(normalizeWhitespace)
      .slice(0, 2);

    if (filtered.length > 0) {
      suggestedQuestions = filtered;
    }
  }

  return {
    mode: "clarify",
    observable: data.observable.map(normalizeWhitespace),
    interpretive: data.interpretive.map(normalizeWhitespace),
    unknown: data.unknown.map(normalizeWhitespace),
    structural: data.structural.map(normalizeWhitespace),
    orientation: normalizeWhitespace(data.orientation),
    question,
    suggestedQuestions,
  };
}

function validateResponse(data: unknown): VirekaResponse {
  if (!isObject(data)) throw new Error("Invalid response");

  if (data.mode === "clarify") {
    return validateClarifyResponse(data);
  }

  if (data.mode === "plain_language") {
    if (!isNonEmptyString(data.message)) {
      throw new Error("Plain language message required");
    }

    return {
      mode: "plain_language",
      message: normalizeWhitespace(data.message),
    };
  }

  if (data.mode === "close") {
    if (!isNonEmptyString(data.message)) {
      throw new Error("Close message required");
    }

    return {
      mode: "close",
      message: normalizeWhitespace(data.message),
    };
  }

  throw new Error("Invalid mode");
}

function buildClarifyUserMessage(input: string): string {
  return `Clarify the following situation using the required response structure.

Important:
- avoid second-person language such as "you" or "your"
- keep the wording neutral and structural
- focus on the situation rather than the person

Situation:
${input}`;
}

function buildPlainLanguageUserMessage(latestResult: ClarifyResponse): string {
  const sections = [
    `What can be observed:\n${latestResult.observable.join("\n")}`,
    `What may be interpreted:\n${latestResult.interpretive.join("\n")}`,
    `What remains unclear:\n${latestResult.unknown.join("\n")}`,
    `What may be influencing the situation:\n${latestResult.structural.join("\n")}`,
    `Orientation:\n${latestResult.orientation}`,
  ];

  if (latestResult.question) {
    sections.push(`Clarifying question:\n${latestResult.question}`);
  }

  if (latestResult.suggestedQuestions?.length) {
    sections.push(
      `Suggested questions:\n${latestResult.suggestedQuestions.join("\n")}`
    );
  }

  return `Restate the following clarification in plain language.

Important:
- preserve the meaning exactly
- preserve the distinctions
- do not add new analysis
- do not remove important distinctions
- make the wording easier to understand
- avoid second-person language such as "you" or "your"
- keep the wording neutral and directed toward the situation

Original clarification:
${sections.join("\n\n")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VirekaRequest;

    const action: RequestAction =
      body.action === "plain_language" ? "plain_language" : "clarify";

    const history = sanitizeHistory(body.history);
    const input = normalizeWhitespace(body.input ?? "");
    const latestResult = sanitizeLatestResult(body.latestResult);

    if (action === "clarify" && !input) {
      return NextResponse.json({ error: "Input required" }, { status: 400 });
    }

    if (action === "plain_language" && !latestResult) {
      return NextResponse.json(
        { error: "A prior clarification result is required for plain language." },
        { status: 400 }
      );
    }

    if (action === "clarify" && detectClosureSignal(input)) {
      return NextResponse.json({
        mode: "close",
        message:
          "Acknowledged. A new situation can be started whenever needed.",
      } satisfies CloseResponse);
    }

    const userMessage =
      action === "plain_language"
        ? buildPlainLanguageUserMessage(latestResult as ClarifyResponse)
        : buildClarifyUserMessage(input);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return NextResponse.json(
        { error: `Upstream model request failed: ${errorText || response.status}` },
        { status: 500 }
      );
    }

    const json: ChatCompletionResponse = await response.json();
    const content = json.choices?.[0]?.message?.content ?? "";

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
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
