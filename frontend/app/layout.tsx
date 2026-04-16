import "./globals.css";

3 export const metadata = {
4   title: "VIREKA Space",
5   description: "Clarity before decision. Clarity before prompting.",
6   themeColor: "#F5F5F2"
7 }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
