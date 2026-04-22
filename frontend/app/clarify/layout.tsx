import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarify a Situation — VIREKA Space",
  description:
    "Describe a situation as it currently appears. VIREKA Space helps make interpretation visible before decisions or AI prompts are formed.",
};

export default function ClarifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
