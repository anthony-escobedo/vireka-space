import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClarifyResult = {
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  question: string;
};

function isNonEmptyStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) => typeof item === "string" && item.trim().length > 0
    )
  );
}

function validateClarifyResult(data: unknown): ClarifyResult {
  if (typeof data !== "object" || data === null) {
    throw new Error("Model output is not an object.");
  }

  const obj = data as Record<string, unknown>;

  if (!isNonEmptyStringArray(obj.observable)) {
    throw new Error('Field "observable" must be a non-empty string array.');
  }

  if (!isNonEmptyStringArray(obj.interpretive)) {
    throw new Error('Field "interpretive" must be a non-empty string array.');
  }

  if (!isNonEmptyStringArray(obj.unknown)) {
    throw new Error('Field "unknown" must be a non-empty string array.');
  }

  if (!isNonEmptyStringArray(obj.structural)) {
    throw new Error('Field "structural" must be a non-empty string array.');
  }

  if (typeof obj.orientation !== "string" || obj.orientation.trim() === "") {
    throw new Error('Field "orientation" must be a non-empty string.');
  }

  if (typeof obj.question !== "string" || obj.question.trim() === "") {
    throw new Error('Field "question" must be a non-empty string.');
  }

  return {
    observable: obj.observable,
    interpretive: obj.interpretive,
    unknown: obj.unknown,
    structural: obj.structural,
    orientation: obj.orientation.trim(),
    question: obj.question.trim(),
  };
}

const SYSTEM_PROMPT = `
You are Vireka Space, an interpretive support AI.

Your function is to help people separate:
- what is observable
- what is being interpreted
- what remains unclear
- what structural conditions may be shaping the situation

You do not provide therapy, coaching, diagnosis, motivation, ideology, or prescriptive advice.
You do not tell people what to do.
You do not moralize.
You do not amplify urgency.
You do not present interpretation as fact.

Tone must be:
- calm
- precise
- neutral
- non-authoritative
- non-clinical
- non-therapeutic
- non-motivational
- non-judgmental

Adapt language to the user's register, but keep it clear and easy to understand.

Return ONLY valid JSON in exactly this shape:

{
  "observable": ["..."],
  "interpretive": ["..."],
  "unknown": ["..."],
  "structural": ["..."],
  "orientation": "...",
  "question": "..."
}

Rules:
- All four array fields must contain at least one non-empty string
- orientation must be one non-empty string
- question must be one non-empty string
- No markdown
- No prose outside the JSON object
- No extra keys
`;

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

    if (typeof body !== "object" || body === null) {
  return NextResponse.json(
    { error: "Request body must include a non-empty input string." },
    { status: 400 }
  );
}

const input = (body as Record<string, unknown>).input;

if (typeof input !== "string" || input.trim() === "") {
  return NextResponse.json(
    { error: "Request body must include a non-empty input string." },
    { status: 400 }
  );
}

const userInput = input.trim();

if (userInput.length < 8) {
  return NextResponse.json(
    { error: "Please include a brief description of the situation." },
    { status: 400 }
  );
}

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  return NextResponse.json(
    { error: "Missing OPENAI_API_KEY on server." },
    { status: 500 }
  );
}

    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userInput,
          },
        ],
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

    const data = (await openAIRes.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

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

    let validated: ClarifyResult;

    try {
      validated = validateClarifyResult(parsed);
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
    console.error("clarify error", err);
    return NextResponse.json(
      {
        error: "Internal server error.",
        details: err instanceof Error ? err.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
