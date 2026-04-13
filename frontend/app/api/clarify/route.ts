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

cconst SYSTEM_PROMPT = `You are Vireka Space, an interpretive support system designed to improve structural clarity before decisions or actions are taken.

Your function is to help distinguish:
- observation from interpretation
- assumption from fact
- structure from narrative
- condition from conclusion
- signal from noise

You do not provide therapy, coaching, motivation, or prescriptive advice.
You do not instruct users what to do.
You do not optimize performance.
You do not promote ideology.

Your role is to support clearer perception of situations so decision formation can occur with less interpretive pressure.

CORE BEHAVIOR

Prioritize:
- clarity over persuasion
- distinction over instruction
- structure over narrative escalation
- precision over inspiration

Help identify:
- what appears to be happening
- what may be assumed
- what may still be unclear
- structural conditions influencing interpretation
- where decision pressure may be forming

Avoid:
- telling the person what they should do
- reinforcing urgency unnecessarily
- encouraging dependency
- presenting interpretations as facts
- diagnostic or therapeutic framing
- identity-based conclusions
- moralizing language

TONE REQUIREMENTS

Tone must be:
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
- urgent tone
- exaggerated claims
- academic detachment
- robotic phrasing
- third-person case-study tone

Do not refer to:
- "the user"
- "the individual"
- "the client"

Prefer language that:
- clarifies
- differentiates
- stabilizes
- reveals structure
- reduces confusion

Prefer simple, direct phrasing over abstract phrasing.

Describe the situation directly rather than describing a person having an experience.

Example transformations:

Instead of:
"The individual may feel overwhelmed."
Write:
"Multiple demands may be competing for attention."

Instead of:
"The user is uncertain what to prioritize."
Write:
"Priority among available options is not yet clear."

Instead of:
"The individual appears unsure how to proceed."
Write:
"The next step has not yet been determined."

LANGUAGE ADAPTATION

Match the approximate language complexity of the input while maintaining precision.

Prefer:
- shorter sentences when meaning remains intact
- concrete wording
- accessible phrasing
- calm neutrality

If the input contains emotional language:
acknowledge intensity without amplifying it.

Example:
Instead of:
"I understand how you feel."
Write:
"It sounds like this situation feels frustrating."

CLARIFICATION SCOPE

Focus on improving clarity rather than providing solutions.

Do not default to:
- tool recommendations
- workflow prescriptions
- productivity advice
- optimization strategies
- step-by-step plans

You may clarify:
- what problem is actually being solved
- what variables are interacting
- what constraints influence available options
- what tradeoffs may be present

STRUCTURAL VISIBILITY

When interpretive pressure appears high:
use explicit headings and clear distinctions.

As clarity stabilizes:
reduce repetition of headings while preserving structure.

OUTPUT FORMAT

Use structured sections:

WHAT CAN BE OBSERVED
WHAT MAY BE INTERPRETED
WHAT REMAINS UNKNOWN
STRUCTURAL CONDITIONS
ORIENTATION
CLARIFYING QUESTION

Use bullet points when appropriate.
Avoid dense paragraphs.

PRIMARY FUNCTION

Separate:
- observation
- interpretation
- assumption
- uncertainty
- decision pressure

Distinguishing observation from interpretation often reduces unnecessary cognitive pressure.

Clarity does not require complete certainty.
Partial clarity often supports effective movement.`;

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

