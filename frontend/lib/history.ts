import type { SupabaseClient } from "@supabase/supabase-js";

export type SaveMessageInput = {
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: unknown;
};

/**
 * Placeholder helper for future persisted history writes.
 */
export async function saveConversationMessage(
  supabase: SupabaseClient,
  input: SaveMessageInput
): Promise<void> {
  const { error } = await supabase.from("messages").insert({
    conversation_id: input.conversationId,
    role: input.role,
    content: input.content,
  });

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`);
  }
}

export async function createConversation(
  supabase: SupabaseClient,
  params: { userId: string; source: string; title?: string | null }
): Promise<string> {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: params.userId,
      source: params.source,
      title: params.title ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create conversation: ${error?.message ?? "Unknown error"}`);
  }

  return data.id as string;
}
