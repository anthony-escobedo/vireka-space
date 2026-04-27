import { getClarifyRequestHeaders } from "./clarifyRequestHeaders";

/**
 * Persists marked clarity on the conversation (PATCH /api/history/:id). No-op on missing ids.
 * Failures are logged only; local UI should already reflect intent.
 */
export async function saveMarkedClarityToConversation(
  conversationId: string | null | undefined,
  anonymousId: string,
  markedClarity: string | null
): Promise<void> {
  if (!conversationId || !anonymousId) return;
  try {
    const headers = await getClarifyRequestHeaders(anonymousId);
    const res = await fetch(
      `/api/history/${encodeURIComponent(conversationId)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ markedClarity }),
      }
    );
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.warn("[vireka] save marked clarity failed", res.status, t);
    }
  } catch (e) {
    console.warn("[vireka] save marked clarity error", e);
  }
}
