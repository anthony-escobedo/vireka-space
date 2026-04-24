import { getSupabaseServerClient } from "./supabase/server";

export type UsageEventInput = {
  type: "clarify" | "tts";
  anonymousId: string;
  metadata?: Record<string, unknown>;
};

export async function recordUsageEvent({
  type,
  anonymousId,
  metadata,
}: UsageEventInput): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("usage_events").insert({
    event_type: type,
    anonymous_id: anonymousId,
    metadata: metadata ?? {},
  });
  if (error) {
    throw new Error(`Failed to record usage event: ${error.message}`);
  }
}
