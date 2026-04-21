import "./globals.css"
import { LanguageProvider } from "../lib/i18n/LanguageProvider"

export const metadata = {
  title: "VIREKA Space",
  description: "Clarity before decision. Clarity before prompting.",
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