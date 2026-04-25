import { getSupabaseServerClient } from "./supabase/server";

export type SaveMessageInput = {
  conversationId: string;
  role: "user" | "assistant";
  content: unknown;
};

export async function saveMessage(input: SaveMessageInput): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("messages").insert({
    conversation_id: input.conversationId,
    role: input.role,
    content: input.content,
  });

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`);
  }
}

export type ConversationSourceMode = "clarify" | "ai-interaction";

export async function createConversation(
  anonymousId: string,
  context: ConversationSourceMode = "clarify"
): Promise<string> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      anonymous_id: anonymousId,
      source: context,
      mode: context,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create conversation: ${error?.message ?? "Unknown error"}`);
  }

  return data.id as string;
}
