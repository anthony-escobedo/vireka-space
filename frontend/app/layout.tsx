import { Analytics } from "@vercel/analytics/react";
import "./globals.css"
import { LanguageProvider } from "../lib/i18n/LanguageProvider"

const pageTitle = "VIREKA Space — Clarity Before Decisions and AI Prompts";
const pageDescription =
  "VIREKA Space is a structured environment for seeing how a situation is being understood before decisions are made or AI prompts are written. It makes visible what appears, what may be assumed, and what remains unclear.";

export const metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://vireka.space",
    siteName: "VIREKA Space",
    images: [
      {
        url: "https://vireka.space/og-image.png",
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: "https://vireka.space/og-image.png",
        width: 1200,
        height: 630,
        alt: pageTitle,
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