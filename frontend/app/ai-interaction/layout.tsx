import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interaction — VIREKA Space",
  description:
    "Structure prompts and AI interactions with clarity. Understand what a prompt is doing, what is assumed, and what remains unclear before generating output.",
};

export default function AIInteractionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
