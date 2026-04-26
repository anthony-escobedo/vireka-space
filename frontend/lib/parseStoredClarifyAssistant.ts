import { normalizeMessageContentToPreviewSource } from "./historyReadHelpers";

export type ClarifyResponse = {
  mode: "clarify";
  observable: string[];
  interpretive: string[];
  unknown: string[];
  structural: string[];
  orientation: string;
  currentClarity?: string;
  question?: string;
};

export type CloseResponse = {
  mode: "close";
  message: string;
};

export type VirekaResponse =
  | (ClarifyResponse & { conversationId?: string | null })
  | (CloseResponse & { conversationId?: string | null });

function nonEmptyLines(body: string): string[] {
  return body
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0);
}

function splitHeaderBlock(block: string): { header: string; body: string } {
  const lines = block.split("\n");
  const header = (lines[0] ?? "").trim();
  const body = lines.slice(1).join("\n");
  return { header, body };
}

/**
 * Reconstructs a VirekaResponse from assistant message content persisted by
 * `formatResponseForStorage` in clarify/route.ts (English section headers).
 */
export function parseStoredAssistantContent(content: unknown): VirekaResponse {
  if (typeof content === "object" && content !== null) {
    const o = content as Record<string, unknown>;
    if (o.mode === "clarify" && Array.isArray(o.observable)) {
      return o as ClarifyResponse;
    }
    if (o.mode === "close" && typeof o.message === "string") {
      return { mode: "close", message: o.message };
    }
  }

  const raw = normalizeMessageContentToPreviewSource(content);
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) {
    return { mode: "close", message: "" };
  }

  if (!text.includes("What appears to be happening:")) {
    return { mode: "close", message: text };
  }

  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const base: ClarifyResponse = {
    mode: "clarify",
    observable: [],
    interpretive: [],
    unknown: [],
    structural: [],
    orientation: "",
  };

  for (const block of blocks) {
    const { header, body } = splitHeaderBlock(block);
    const h = header.toLowerCase();
    if (h.startsWith("what appears to be happening")) {
      base.observable = nonEmptyLines(body);
    } else if (h.startsWith("what may be assumed")) {
      base.interpretive = nonEmptyLines(body);
    } else if (h.startsWith("what may remain unclear")) {
      base.unknown = nonEmptyLines(body);
    } else if (h.startsWith("what may be influencing the situation")) {
      base.structural = nonEmptyLines(body);
    } else if (h.startsWith("integrated view")) {
      base.orientation = body.trim();
    } else if (h.startsWith("current clarity")) {
      base.currentClarity = body.trim() || undefined;
    } else if (h.startsWith("clarifying question")) {
      const lines = nonEmptyLines(body);
      base.question = lines.join("\n").trim() || undefined;
    }
  }

  return base;
}
