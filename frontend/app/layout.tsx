import "./globals.css"
import { LanguageProvider } from "../lib/i18n/LanguageProvider"

export const metadata = {
  title: "VIREKA Space — Clarity Before Decision",
  description:
    "VIREKA Space helps clarify how situations are being understood before decisions are made or AI prompts are written.",
  openGraph: {
    title: "VIREKA Space — Clarity Before Decision",
    description:
      "VIREKA Space helps clarify how situations are being understood before decisions are made or AI prompts are written.",
    url: "https://www.vireka.space",
    siteName: "VIREKA Space",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIREKA Space — Clarity Before Decision",
    description:
      "VIREKA Space helps clarify how situations are being understood before decisions are made or AI prompts are written.",
    images: ["/og-image.png"],
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
        </LanguageProvider>
      </body>
    </html>
  )
}