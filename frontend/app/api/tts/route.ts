import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.OPENAI_TTS_VOICE || "aria";
const MAX_TTS_CHARS = 4096;
const OPENAI_SPEECH_URL = "https://api.openai.com/v1/audio/speech";

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

  try {
    const upstream = await fetch(OPENAI_SPEECH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: TTS_VOICE,
        input: text,
        response_format: "mp3",
      }),
    });

    if (!upstream.ok) {
      let detail = upstream.statusText;
      try {
        const errJson = (await upstream.json()) as { error?: { message?: string } };
        if (errJson?.error?.message) detail = errJson.error.message;
      } catch {
        /* ignore */
      }
      console.error("[tts] OpenAI error", upstream.status, detail);
      return NextResponse.json(
        { error: "Text-to-speech request failed" },
        { status: upstream.status >= 500 ? 502 : 502 }
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
