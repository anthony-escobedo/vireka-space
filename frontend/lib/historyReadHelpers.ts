/** Shared helpers for history list + detail APIs (read-only). */

export function normalizeMessageContentToPreviewSource(content: unknown): string {
  if (typeof content === "string") return content;
  if (content == null) return "";
  if (typeof content === "object") {
    const o = content as Record<string, unknown>;
    if (typeof o.text === "string") return o.text;
  }
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}

export function truncateHistoryPreview(text: string, maxChars = 60): string {
  const singleLine = text.trim().replace(/\s+/g, " ");
  if (singleLine.length <= maxChars) return singleLine;
  const slice = singleLine.slice(0, maxChars - 1).trimEnd();
  return `${slice}…`;
}
