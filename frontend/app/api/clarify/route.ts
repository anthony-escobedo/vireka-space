import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResponseMode = "clarify" | "integrated_view" | "close";
type RequestAction = "clarify" | "integrated_view";
type RequestContext = "clarify" | "ai-interaction";

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

type IntegratedViewResponse = {
  mode: "integrated_view";
  message: string;
};

type CloseResponse = {
  mode: "close";
  message: string;
};

type VirekaResponse =
  | ClarifyResponse
  | IntegratedViewResponse
  | CloseResponse;

type VirekaRequest = {
  input?: string;
  action?: RequestAction;
  history?: ConversationTurn[];
  latestResult?: ClarifyResponse;
  context?: RequestContext;
  anonymousId?: string | null;
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
- In structural, identify contextual or situational influences such as incentives, timing, roles, expectations, constraints, institutional context, or environment.
- In orientation, provide an integrated view of the situation as a whole.
- Orientation should synthesize the relationship between observation, assumption, uncertainty, and conditions influencing interpretation.
- Orientation should express the structural pattern that becomes visible when these elements are considered together.
- Orientation should usually be 3–6 sentences unless the situation is extremely minimal.
- Orientation should remain neutral, observational, concise, and non-prescriptive.
- Orientation should support clearer interpretation without forcing resolution of uncertainty.
- Orientation should not restate each structural element individually.
- Orientation should not introduce new conceptual terminology.
- Orientation should express how the elements relate rather than compressing them into a generic statement.
- Distinguish observation from assumption.
- Distinguish assumption from fact.
- Distinguish uncertainty from conclusion.
- Clarify conditions influencing interpretation when relevant.
- Support decision clarity in clarify mode without prescribing action.
- Support prompt clarity in AI interaction mode without prescribing revisions.
- Ask at most one clarifying question, and only when another distinction would materially improve clarity.
- Do not ask a question when sufficient clarity is already present.

Necessity-language behavior:
- When necessity language appears in a way that proposes a solution, implies inevitability, implies required personal change, assumes a specific path forward, or frames one outcome as required without clarifying why that path or outcome is necessary, include one additional interpretive bullet that gently surfaces the embedded necessity as interpretive rather than observational.
- Use neutral wording such as:
  - "There may be an assumption that [stated necessity or proposed path] is required for the situation."
  - "There may be an assumption that [stated necessity or proposed path] is necessary to achieve the intended result."
- Apply this selectively and at most once per response.
- Do not add this additional bullet when the necessity is clearly an external operational requirement such as a deadline, legal obligation, explicit institutional requirement, or concrete logistical task.
- Do not make the system question everything.
- Only surface embedded necessity when doing so meaningfully expands clarity.

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

Integrated view behavior:
- When integrated-view mode is requested, synthesize the structural elements into a coherent description of how the situation currently appears when observations, assumptions, unknowns, and influences are considered together.
- The integrated view should express the structural pattern or relationship that becomes visible across these elements.
- The integrated view should usually be 2–4 sentences unless the situation is extremely minimal.
- The integrated view should make visible how meaning may be being interpreted, weighted, or organized within the interaction.
- The integrated view may acknowledge tensions, ambiguities, mismatches, or interpretive gaps that emerge from the structure of the situation.

- Do not simply restate or paraphrase bullet points.
- Do not repeat section labels.
- Do not list observations again in sentence form.
- Do not introduce completely new facts or scenarios not already present in the clarification.
- Do not provide advice, recommendations, directives, or next steps.
- Do not instruct the user what to do.
- Use neutral, observational language.
- Avoid second-person phrasing.
- The goal is structural synthesis, not compression.

Output modes:
1. clarify
2. integrated_view
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

For mode "integrated_view", use:
{
  "mode": "integrated_view",
  "message": "..."
}

Rules for mode "integrated_view":
- message should synthesize observable, interpretive, unknown, and structural elements into a coherent structural meaning
- message should express the pattern or relationship that becomes visible when the elements are considered together
- message should usually be 2 to 4 sentences unless the situation is extremely minimal
- message should express structural synthesis rather than compression
- message should remain grounded in the clarification that was already produced

- message should not restate bullet points individually
- message should not function as a summary of each section
- message should not introduce completely new facts or scenarios not already present in the clarification
- message should not provide advice, recommendations, or next steps
- message should not prescribe action
- avoid second-person phrasing
- avoid referring to "the user"
- the goal is structural synthesis, not simplification

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
          .filter(
            (q): q is string => typeof q === "string" && q.trim().length > 0
          )
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

  if (data.mode === "integrated_view") {
    if (!isNonEmptyString(data.message)) {
      throw new Error("Integrated view message required");
    }

    return {
      mode: "integrated_view",
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

function buildClarifyUserMessage(
  input: string,
  context: RequestContext
): string {
  const contextLine =
    context === "ai-interaction"
      ? `Context: This situation concerns an AI interaction. When relevant, distinguish among the prompt, the objective, the output, and any mismatch between them.`
      : `Context: This is a general clarification situation.`;

  return `Clarify the following situation using the required response structure.

Important:
- avoid second-person language such as "you" or "your"
- avoid referring to "the user"
- keep the wording neutral and structural
- focus on the situation rather than the person

${contextLine}

Situation:
${input}`;
}

function buildIntegratedViewUserMessage(
  latestResult: ClarifyResponse,
  context: RequestContext
): string {
  const sections = [
    `What can be observed:\n${latestResult.observable.join("\n")}`,
    `What may be interpreted:\n${latestResult.interpretive.join("\n")}`,
    `What remains unclear:\n${latestResult.unknown.join("\n")}`,
    `What may be influencing the situation:\n${latestResult.structural.join(
      "\n"
    )}`,
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

  const contextLine =
    context === "ai-interaction"
      ? `Context: This clarification concerns an AI interaction. Keep distinctions around the prompt, objective, output, and mismatch only if they were already present.`
      : `Context: This clarification concerns a general situation.`;

  return `Generate an integrated view of the following clarification.

Important:
- preserve the meaning and distinctions already present
- do not add new analysis
- do not remove important distinctions
- do not simplify this into a paraphrase of bullet points
- synthesize the structural elements into a fluid, coherent description
- avoid second-person language such as "you" or "your"
- avoid referring to "the user"
- keep the wording neutral and directed toward the situation

${contextLine}

Original clarification:
${sections.join("\n\n")}`;
}

type ClarifySection =
  | "observable"
  | "interpretive"
  | "unknown"
  | "structural"
  | "orientation"
  | "question"
  | "suggested_question"
  | "integrated_view"
  | "close";

function containsDisallowedFraming(text: string): boolean {
  return /\b(you|your|you're|youre|the user)\b/i.test(text);
}

function applyNeutralReplacements(text: string): string {
  let result = normalizeWhitespace(text);

  const replacements: Array<[RegExp, string]> = [
    [/\bthe user\b/gi, "the situation"],
    [/\bthe user feels\b/gi, "there appears to be a sense that"],
    [/\bthe user assumes\b/gi, "there may be an assumption that"],
    [/\bthe user interprets\b/gi, "there may be an interpretation that"],
    [/\bthe user believes\b/gi, "there may be a belief that"],
    [/\bthe user thinks\b/gi, "there may be a view that"],
    [/\byou are\b/gi, "there appears to be"],
    [/\byou(?:'re|re)\b/gi, "there appears to be"],
    [/\byou may be\b/gi, "there may be"],
    [/\byou might be\b/gi, "there may be"],
    [/\byou seem to\b/gi, "it may seem that"],
    [/\byou appear to\b/gi, "it appears that"],
    [/\byou have\b/gi, "there appears to be"],
    [/\byou need\b/gi, "further clarity may be needed around"],
    [/\byour prompt\b/gi, "the prompt"],
    [/\byour objective\b/gi, "the objective"],
    [/\byour output\b/gi, "the output"],
    [/\byour input\b/gi, "the input"],
    [/\byour message\b/gi, "the message"],
    [/\byour response\b/gi, "the response"],
    [/\byour request\b/gi, "the request"],
    [/\byour interaction\b/gi, "the interaction"],
    [/\byour situation\b/gi, "the situation"],
    [/\byour concern\b/gi, "the concern described"],
    [/\byour description\b/gi, "the description"],
    [/\byour context\b/gi, "the context"],
    [/\byour expectations\b/gi, "the expectations present"],
    [/\byour role\b/gi, "the role described"],
    [/\byour\b/gi, "the"],
    [/\byou\b/gi, "the situation"],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  result = result
    .replace(/\bthere appears to be a sense that there appears to be\b/gi, "there appears to be")
    .replace(/\bthere appears to be there appears to be\b/gi, "there appears to be")
    .replace(/\bthere may be there may be\b/gi, "there may be")
    .replace(/\bthe the\b/gi, "the")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");

  return normalizeWhitespace(result);
}

function fallbackForSection(section: ClarifySection): string {
  switch (section) {
    case "observable":
      return "A situation is described in which several elements may still need clearer separation.";
    case "interpretive":
      return "There may be assumptions present that have not yet been confirmed.";
    case "unknown":
      return "It is not yet clear which parts are established and which remain uncertain.";
    case "structural":
      return "Timing, expectations, roles, or constraints may be shaping the situation.";
    case "orientation":
      return "Further differentiation may help clarify what is established, what is assumed, and what remains uncertain.";
    case "question":
      return "Which specific part of the situation remains least established?";
    case "suggested_question":
      return "Which part of the situation is directly observable?";
    case "integrated_view":
      return "The situation may become easier to follow by seeing how observations, assumptions, unknowns, and influences fit together.";
    case "close":
      return "Acknowledged. A new situation can be started whenever needed.";
    default:
      return "Further clarification may still be helpful.";
  }
}

function neutralizeTextBySection(
  text: string,
  section: ClarifySection
): string {
  const cleaned = applyNeutralReplacements(text);

  if (!containsDisallowedFraming(cleaned)) {
    return cleaned;
  }

  return fallbackForSection(section);
}

function enforceNeutralResponse(response: VirekaResponse): VirekaResponse {
  if (response.mode === "clarify") {
    const observable = response.observable
      .map((item) => neutralizeTextBySection(item, "observable"))
      .filter(Boolean);

    const interpretive = response.interpretive
      .map((item) => neutralizeTextBySection(item, "interpretive"))
      .filter(Boolean);

    const unknown = response.unknown
      .map((item) => neutralizeTextBySection(item, "unknown"))
      .filter(Boolean);

    const structural = response.structural
      .map((item) => neutralizeTextBySection(item, "structural"))
      .filter(Boolean);

    const orientation = neutralizeTextBySection(
      response.orientation,
      "orientation"
    );

    const question = response.question
      ? neutralizeTextBySection(response.question, "question")
      : undefined;

    const suggestedQuestions = response.suggestedQuestions
      ?.map((item) => neutralizeTextBySection(item, "suggested_question"))
      .filter(Boolean)
      .slice(0, 2);

    return {
      mode: "clarify",
      observable:
        observable.length > 0
          ? observable
          : [fallbackForSection("observable")],
      interpretive:
        interpretive.length > 0
          ? interpretive
          : [fallbackForSection("interpretive")],
      unknown:
        unknown.length > 0 ? unknown : [fallbackForSection("unknown")],
      structural:
        structural.length > 0
          ? structural
          : [fallbackForSection("structural")],
      orientation,
      question,
      suggestedQuestions:
        suggestedQuestions && suggestedQuestions.length > 0
          ? suggestedQuestions
          : undefined,
    };
  }

  if (response.mode === "integrated_view") {
    return {
      mode: "integrated_view",
      message: neutralizeTextBySection(response.message, "integrated_view"),
    };
  }

  return {
    mode: "close",
    message: neutralizeTextBySection(response.message, "close"),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VirekaRequest;

    const action: RequestAction =
      body.action === "integrated_view" ? "integrated_view" : "clarify";

    const context: RequestContext =
      body.context === "ai-interaction" ? "ai-interaction" : "clarify";
    
    const anonymousId = body.anonymousId ?? null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
    { error: "Missing Supabase environment variables" },
    { status: 500 }
  );
}

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const today = new Date().toISOString().slice(0, 10);

    const history = sanitizeHistory(body.history);
    const input = normalizeWhitespace(body.input ?? "");
    const latestResult = sanitizeLatestResult(body.latestResult);

    if (!anonymousId) {
  return NextResponse.json({ error: "Missing anonymousId" }, { status: 400 });
}

    if (action === "clarify" && !input) {
      return NextResponse.json({ error: "Input required" }, { status: 400 });
    }

    const { data: existingUsage, error: usageReadError } = await supabase
  .from("usage_tracking")
  .select("id, interaction_count")
  .eq("anonymous_id", anonymousId)
  .eq("usage_date", today)
  .maybeSingle();

if (usageReadError) {
  return NextResponse.json(
    { error: `Failed to read usage tracking: ${usageReadError.message}` },
    { status: 500 }
  );
}

if (existingUsage && existingUsage.interaction_count >= 5) {
  return NextResponse.json(
    {
      error:
        "Daily limit reached. Free usage includes 20 interactions per day. Interaction can continue tomorrow or through subscription.",
      limitReached: true,
    },
    { status: 429 }
  );
}

if (existingUsage) {
  const { error: usageUpdateError } = await supabase
    .from("usage_tracking")
    .update({
      interaction_count: existingUsage.interaction_count + 1,
    })
    .eq("id", existingUsage.id);

  if (usageUpdateError) {
    return NextResponse.json(
      { error: `Failed to update usage tracking: ${usageUpdateError.message}` },
      { status: 500 }
    );
  }
} else {
  const { error: usageInsertError } = await supabase
    .from("usage_tracking")
    .insert({
      anonymous_id: anonymousId,
      usage_date: today,
      interaction_count: 1,
    });

  if (usageInsertError) {
    return NextResponse.json(
      { error: `Failed to insert usage tracking: ${usageInsertError.message}` },
      { status: 500 }
    );
  }
}
    
    if (action === "integrated_view" && !latestResult) {
      return NextResponse.json(
        { error: "A prior clarification result is required for integrated view." },
        { status: 400 }
      );
    }

    if (action === "clarify" && detectClosureSignal(input)) {
      return NextResponse.json({
        mode: "close",
        message: "Acknowledged. A new situation can be started whenever needed.",
      } satisfies CloseResponse);
    }

    const userMessage =
      action === "integrated_view"
        ? buildIntegratedViewUserMessage(
            latestResult as ClarifyResponse,
            context
          )
        : buildClarifyUserMessage(input, context);

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
        {
          error: `Upstream model request failed: ${
            errorText || response.status
          }`,
        },
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
    const neutralized = enforceNeutralResponse(validated);

    return NextResponse.json(neutralized);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
