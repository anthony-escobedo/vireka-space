import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ClarifyResult = {
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  question?: string;
};

type OpenAIMessage = {
  role: string;
  content: string;
};

type OpenAIChoice = {
  message: OpenAIMessage;
};

type OpenAIResponse = {
  choices: OpenAIChoice[];
};

const SYSTEM_PROMPT = `You are a structured clarity engine. Given a description of a situation, separate what can be observed from what may be interpreted, identify what remains unknown, name relevant structural conditions, provide a brief orientation, and offer one clarifying question.

Respond ONLY with a valid JSON object matching this exact shape:
{
  "observable": ["..."],
  "interpretive": ["..."],
  "unknown": ["..."],
  "structural": ["..."],
  "orientation": "...",
  "question": "..."
}

Rules:
- observable: only things directly stated or directly observable from the account; no inference
- interpretive: possible meanings, implications, or readings that may be present, clearly distinguished from fact
- unknown: what is missing, unclear, unverified, or assumed
- structural: background conditions, systems, roles, constraints, timing pressures, or competing demands shaping the situation
- orientation: one sentence naming the core situation or tension in neutral language
- question: the single most useful clarifying question to ask next
- Do not refer to "the user"
- Do not use therapeutic, diagnostic, or coaching language
- Do not speculate about emotions unless explicitly stated
- Prefer neutral, structural phrasing over personal characterization
- Describe the situation, not the person
- Keep the tone calm, precise, and non-prescriptive
- All array values must be non-empty strings
- Return nothing outside the JSON object. No markdown. No preamble. No trailing text.`;

function isStringArray(val: unknown): val is string[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    val.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function validateClarifyResult(raw: unknown): ClarifyResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Response is not a JSON object.");
  }

  const obj = raw as Record<string, unknown>;

  const requiredArrayFields = [
    "observable",
    "interpretive",
    "unknown",
    "structural",
  ] as const;

  for (const field of requiredArrayFields) {
    if (!isStringArray(obj[field])) {
      throw new Error(
        `Field "${field}" is missing or not a non-empty string array.`
      );
    }
  }

  if (typeof obj.orientation !== "string" || obj.orientation.trim() === "") {
    throw new Error(`Field "orientation" is missing or empty.`);
  }

  return {
    observable: obj.observable as string[],
    interpretive: obj.interpretive as string[],
    unknown: obj.unknown as string[],
    structural: obj.structural as string[],
    orientation: obj.orientation as string,
    question:
      typeof obj.question === "string" && obj.question.trim().length > 0
        ? obj.question
        : undefined,
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch (_e) {
      return NextResponse.json(
        { error: "Request body is not valid JSON." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as Record<string, unknown>).input !== "string" ||
      ((body as Record<string, unknown>).input as string).trim() === ""
    ) {
      return NextResponse.json(
        { error: "Request body must include a non-empty 'input' string." },
        { status: 400 }
      );
    }

    const userInput = (
      (body as Record<string, unknown>).input as string
    ).trim();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set.");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    let openAIResponse: Response;
    try {
      openAIResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.4,
            max_tokens: 900,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userInput },
            ],
          }),
        }
      );
    } catch (fetchErr: unknown) {
      console.error("Network error reaching OpenAI:", fetchErr);
      return NextResponse.json(
        { error: "Failed to reach OpenAI. Check your network or try again." },
        { status: 502 }
      );
    }

    if (!openAIResponse.ok) {
      const errText = await openAIResponse.text().catch(() => "unknown");
      console.error(`OpenAI error ${openAIResponse.status}:`, errText);
      return NextResponse.json(
        { error: `OpenAI returned an error (${openAIResponse.status}).` },
        { status: 502 }
      );
    }

    let openAIData: OpenAIResponse;
    try {
      openAIData = (await openAIResponse.json()) as OpenAIResponse;
    } catch (_e) {
      console.error("Failed to parse OpenAI response body as JSON.");
      return NextResponse.json(
        { error: "OpenAI response was not valid JSON." },
        { status: 502 }
      );
    }

    const rawContent: string =
      openAIData?.choices?.[0]?.message?.content ?? "";

    if (!rawContent.trim()) {
      console.error("OpenAI returned an empty content string.");
      return NextResponse.json(
        { error: "OpenAI returned an empty response." },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch (_e) {
      console.error("Failed to parse model content as JSON:", rawContent);
      return NextResponse.json(
        { error: "Model returned malformed JSON." },
        { status: 502 }
      );
    }

    let validated: ClarifyResult;
    try {
      validated = validateClarifyResult(parsed);
    } catch (validationErr: unknown) {
      const msg =
        validationErr instanceof Error
          ? validationErr.message
          : "Validation failed.";
      console.error("Model response failed validation:", msg, parsed);
      return NextResponse.json(
        { error: `Model response invalid: ${msg}` },
        { status: 502 }
      );
    }

    return NextResponse.json(validated, { status: 200 });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/clarify:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

