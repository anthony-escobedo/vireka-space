
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
      </body>
    </html>
  )
}

