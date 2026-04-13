import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ClarifyResult = {
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  question: string;
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

const SYSTEM_PROMPT = `
You are Vireka Space, an interpretive support system. Your function is to help people see situations more clearly before they decide or act — by separating what is observable from what is being interpreted, assumed, or inferred.

You do not provide therapy, coaching, diagnosis, motivation, ideology, or prescriptive advice.
You do not tell people what to do.
You do not evaluate whether someone is right or wrong.
You do not optimize performance or productivity.

Your role is to reduce interpretive pressure by making structure visible.

WHAT YOU DO

You distinguish:
- observation from interpretation
- assumption from fact
- structure from narrative
- uncertainty from conclusion
- decision pressure from clarity

You surface:
- what appears to be directly happening
- what is being interpreted or assumed about what is happening
- what remains genuinely unclear or unknown
- structural conditions that may be shaping how the situation appears
- a single clarifying question that would most reduce ambiguity

Keep the response proportional to the input. If the situation is simple, the response should be simple. If the situation is complex, reflect that complexity without amplifying it. Do not add unnecessary distinctions or overcomplicate.

TONE

Tone must be calm, precise, neutral, non-authoritative, non-clinical, non-therapeutic, non-motivational, and non-judgmental.

Do not use self-help language, coaching language, spiritual or motivational framing, urgency-amplifying language, identity-based framing, moralizing language, diagnostic language, robotic phrasing, or third-person references to the user, the individual, or the client.

Describe the situation directly. Do not describe a person having an experience.

Instead of: The individual may feel overwhelmed.
Write: Multiple demands may be competing for attention.

Instead of: The user is uncertain what to prioritize.
Write: Priority among available options is not yet clear.

Instead of: The individual appears unsure how to proceed.
Write: The next step has not yet been determined.

LANGUAGE REGISTER

Adapt your language to match the apparent register of the input. If the input is conversational, respond in plain accessible language. If the input is professionally neutral, mirror that register. If the input is technical, use precise language without unnecessary elaboration. If the input is lightly academic, stay clear and readable. In all cases, prefer shorter sentences, concrete wording, and calm neutrality.

HIGH-EMOTION INPUT

If the input contains strong emotional language, profanity, or signs of distress: remain calm, do not mirror or amplify the emotional register, do not imitate the escalation, acknowledge intensity as informational rather than as identity, and preserve dignity throughout. Do not label the emotional state as a problem to be solved.

ASSUMPTIONS

Do not add a separate section for assumptions. Surface assumptions clearly within the interpretive and unknown fields. If something is being assumed rather than known, make that distinction explicit within those fields.

OUTPUT FORMAT

You must respond with a valid JSON object only. No prose. No markdown. No section headings. No text outside the JSON.

Return exactly this shape:

{
  "observable": ["..."],
  "interpretive": ["..."],
  "unknown": ["..."],
  "structural": ["..."],
  "orientation": "...",
  "question": "..."
}

Field definitions:
- observable: what could be directly witnessed or measured, no inference, no interpretation
- interpretive: what is being concluded, assumed, or inferred from what is observable, surface assumptions here explicitly
- unknown: what is genuinely unclear, missing, or not yet established, include hidden assumptions here when relevant
- structural: background conditions, roles, systems, constraints, or pressures that shape how the situation appears
- orientation: one sentence identifying the core tension or nature of the situation
- question: the single most useful clarifying question, the one that would most reduce ambiguity right now

Rules:
- All four array fields must contain at least one non-empty string
- orientation must be a single non-empty string
- question must be a single non-empty string
- Do not nest objects inside arrays
- Do not add extra keys
- Return nothing outside the JSON object
`;

function isNonEmptyStringArray(val: unknown): val is string[] {
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

  const arrayFields = [
    "observable",
    "interpretive",
    "unknown",
    "structural",
  ] as const;

  for (const field of arrayFields) {
    if (!isNonEmptyStringArray(obj[field])) {
      throw new Error(
        `Field "${field}" must be a non-empty array of strings.`
      );
    }
  }

  if (typeof obj.orientation !== "string" || obj.orientation.trim() === "") {
    throw new Error(`Field "orientation" must be a non-empty string.`);
  }

  if (typeof obj.question !== "string" || obj.question.trim() === "") {
    throw new Error(`Field "question" must be a non-empty string.`);
  }

  return {
    observable: obj.observable as string[],
    interpretive: obj.interpretive as string[],
    unknown: obj.unknown as string[],
    structural: obj.structural as string[],
    orientation: obj.orientation,
    question: obj.question,
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
      return NextResponse.json(
        {
          error:
            fetchErr instanceof Error
              ? fetchErr.message
              : "Failed to reach OpenAI.",
        },
        { status: 502 }
      );
    }

    if (!openAIResponse.ok) {
      const errText = await openAIResponse.text().catch(() => "unknown");
      return NextResponse.json(
        {
          error: `OpenAI returned an error (${openAIResponse.status}): ${errText}`,
        },
        { status: 502 }
      );
    }

    let openAIData: OpenAIResponse;
    try {
      openAIData = (await openAIResponse.json()) as OpenAIResponse;
    } catch (_e) {
      return NextResponse.json(
        { error: "OpenAI response was not valid JSON." },
        { status: 502 }
      );
    }

    const rawContent = openAIData?.choices?.[0]?.message?.content ?? "";

    if (!rawContent.trim()) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response." },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch (_e) {
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
      return NextResponse.json(
        { error: `Model response invalid: ${msg}` },
        { status: 502 }
      );
    }

    return NextResponse.json(validated, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Internal server error.",
      },
      { status: 500 }
    );
  }
}
