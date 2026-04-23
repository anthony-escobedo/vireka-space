import { Analytics } from "@vercel/analytics/react";
import "./globals.css"
import { LanguageProvider } from "../lib/i18n/LanguageProvider"

export const metadata = {
  title: "VIREKA Space — Clarity Before Decision. Clarity Before AI.",
  description:
    "VIREKA Space helps clarify how situations are being understood before decisions are made or AI prompts are written. It supports clearer interpretation by separating what appears, what is inferred, and what remains uncertain.",
  openGraph: {
    title: "VIREKA Space — Clarity Before Decision. Clarity Before AI.",
    description:
      "VIREKA Space helps clarify how situations are being understood before decisions are made or AI prompts are written. It supports clearer interpretation by separating what appears, what is inferred, and what remains uncertain.",
    url: "https://vireka.space",
    siteName: "VIREKA Space",
    images: [
      {
        url: "https://vireka.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "VIREKA Space — Clarity Before Decision. Clarity Before AI.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIREKA Space — Clarity Before Decision. Clarity Before AI.",
    description:
      "VIREKA Space helps clarify how situations are being understood before decisions are made or AI prompts are written. It supports clearer interpretation by separating what appears, what is inferred, and what remains uncertain.",
    images: [
      {
        url: "https://vireka.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "VIREKA Space — Clarity Before Decision. Clarity Before AI.",
      },
    ],
  },
}

export const viewport = {
  themeColor: "#F5F5F2",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className="bg-[#f7f4ee] text-black"
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <LanguageProvider>
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}