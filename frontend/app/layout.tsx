import "./globals.css"
import Link from "next/link"

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

        {/* HEADER */}
        <header className="w-full border-b border-black/10 bg-[#f7f4ee]">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

            <div className="text-[14px] tracking-[0.08em] text-black/80">
              VIREKA Space
            </div>

            <nav className="flex items-center gap-6 text-[14px] text-black/70">

              <Link
                href="/about"
                className="hover:text-black transition"
              >
                About
              </Link>

              <Link
                href="/faq"
                className="hover:text-black transition"
              >
                FAQ
              </Link>

              <Link
                href="/settings"
                className="hover:text-black transition"
              >
                Settings
              </Link>

            </nav>

          </div>
        </header>


        {/* PAGE CONTENT */}
        {children}


        {/* FOOTER */}
        <footer className="mt-24 border-t border-black/10 bg-[#f7f4ee]">
          <div className="mx-auto max-w-5xl px-6 py-10 text-center text-[13px] text-black/50">

            © 2026 VIREKA Space. All rights reserved.

          </div>
        </footer>

      </body>

    </html>
  )
}
