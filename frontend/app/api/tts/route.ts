import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE_RAW = process.env.OPENAI_TTS_VOICE || "sage";
const MAX_TTS_CHARS = 4096;
const OPENAI_SPEECH_URL = "https://api.openai.com/v1/audio/speech";

/** Built-in voices for `gpt-4o-mini-tts` per OpenAI docs (no "aria"). */
const VOICES_GPT4O_MINI_TTS = new Set([
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
]);

/** Subset for `tts-1` / `tts-1-hd` per OpenAI docs. */
const VOICES_TTS_1 = new Set([
  "alloy",
  "ash",
  "coral",
  "echo",
  "fable",
  "onyx",
  "nova",
  "sage",
  "shimmer",
]);

const TTS_FALLBACK_VOICE = "alloy";

function isLegacyTtsModel(model: string): boolean {
  return model === "tts-1" || model === "tts-1-hd";
}

/**
 * Maps requested env voice to a supported API voice.
 * "aria" and other unknown names fall back to alloy with server logs (no extra failed API call).
 */
function resolveOpenAiTtsVoice(
  model: string,
  requested: string
): { voice: string; usedFallback: boolean; requestedNormalized: string } {
  const requestedNormalized = (requested || "").trim().toLowerCase();
  const allow = isLegacyTtsModel(model) ? VOICES_TTS_1 : VOICES_GPT4O_MINI_TTS;

  if (requestedNormalized && allow.has(requestedNormalized)) {
    return {
      voice: requestedNormalized,
      usedFallback: false,
      requestedNormalized,
    };
  }

  if (requestedNormalized) {
    console.warn(
      "[tts] Unsupported OPENAI_TTS_VOICE for model",
      JSON.stringify(model),
      ":",
      JSON.stringify(requested.trim()),
      "— using fallback",
      TTS_FALLBACK_VOICE,
      "| Supported (gpt-4o-mini-tts):",
      Array.from(VOICES_GPT4O_MINI_TTS).sort().join(", ")
    );
  }

  return {
    voice: TTS_FALLBACK_VOICE,
    usedFallback: true,
    requestedNormalized: requestedNormalized || "(empty)",
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("text" in body)) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const textRaw = (body as { text?: unknown }).text;
  if (typeof textRaw !== "string") {
    return NextResponse.json({ error: "text must be a string" }, { status: 400 });
  }

  const text = textRaw.trim();
  if (text.length === 0) {
    return NextResponse.json({ error: "text is empty" }, { status: 400 });
  }
  if (text.length > MAX_TTS_CHARS) {
    return NextResponse.json(
      { error: `text exceeds ${MAX_TTS_CHARS} characters` },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Text-to-speech is not configured" },
      { status: 503 }
    );
  }

  const { voice: voiceUsed, usedFallback, requestedNormalized } = resolveOpenAiTtsVoice(
    TTS_MODEL,
    TTS_VOICE_RAW
  );
  if (usedFallback) {
    console.info(
      "[tts] Voice resolution:",
      "requested=",
      JSON.stringify(TTS_VOICE_RAW),
      "normalized=",
      JSON.stringify(requestedNormalized),
      "→ using",
      voiceUsed
    );
  }

  try {
    const upstream = await fetch(OPENAI_SPEECH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: voiceUsed,
        input: text,
        response_format: "mp3",
      }),
    });

    const contentType = upstream.headers.get("Content-Type") || "";

    if (!upstream.ok) {
      const errBody = await upstream.text();
      let detail = errBody;
      try {
        const errJson = JSON.parse(errBody) as { error?: { message?: string } };
        if (errJson?.error?.message) detail = errJson.error.message;
      } catch {
        /* plain text or empty */
      }
      console.error("[tts] OpenAI speech API error:", {
        status: upstream.status,
        model: TTS_MODEL,
        voiceRequestedEnv: TTS_VOICE_RAW,
        voiceSent: voiceUsed,
        contentType,
        detail: detail.slice(0, 2000),
      });

      /** Rare: valid allowlist but API rejected — try alloy once. */
      if (voiceUsed !== TTS_FALLBACK_VOICE && upstream.status >= 400) {
        console.warn("[tts] Retrying with fallback voice:", TTS_FALLBACK_VOICE);
        const retry = await fetch(OPENAI_SPEECH_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: TTS_MODEL,
            voice: TTS_FALLBACK_VOICE,
            input: text,
            response_format: "mp3",
          }),
        });
        if (retry.ok) {
          console.info("[tts] Fallback voice succeeded:", TTS_FALLBACK_VOICE);
          const buffer = Buffer.from(await retry.arrayBuffer());
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "no-store",
            },
          });
        }
        const retryBody = await retry.text();
        console.error("[tts] Fallback also failed:", retry.status, retryBody.slice(0, 1500));
      }

      return NextResponse.json(
        { error: "Text-to-speech request failed", detail: detail.slice(0, 500) },
        { status: 502 }
      );
    }

    if (!contentType.includes("audio") && !contentType.includes("octet-stream")) {
      const preview = (await upstream.text()).slice(0, 500);
      console.error("[tts] Unexpected success content-type:", contentType, preview);
      return NextResponse.json(
        { error: "Text-to-speech request failed" },
        { status: 502 }
      );
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[tts] fetch failed", err);
    return NextResponse.json(
      { error: "Text-to-speech request failed" },
      { status: 502 }
    );
  }
}
