
import "./globals.css"

export const metadata = {
  title: "VIREKA Space",
  description: "Clarity before decision. Clarity before prompting.",
  themeColor: "#F5F5F2"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#f7f4ee] text-black">
        {children}

        <footer className="mt-24 border-t border-black/10 bg-[#f7f4ee]">
          <div className="mx-auto max-w-5xl px-6 py-10 text-center text-[13px] text-black/50">
            © 2026 VIREKA Space. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
