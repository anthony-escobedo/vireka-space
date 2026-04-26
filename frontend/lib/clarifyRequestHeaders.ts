import { getSupabaseBrowserClient } from "./supabase/client";

/**
 * JSON + `x-anonymous-id` for `/api/clarify`, plus `Authorization: Bearer` when a Supabase
 * session exists (so the API can apply subscription-based daily limits for signed-in users).
 */
export async function getClarifyRequestHeaders(
  anonymousId: string
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-anonymous-id": anonymousId,
  };
  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch {
    // Missing env or client: anonymous-only
  }
  return headers;
}
