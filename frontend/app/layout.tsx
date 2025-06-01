import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CookiesProvider } from "next-client-cookies/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReLearnAI",
  description: "智能錯題複習系統",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <CookiesProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </CookiesProvider>
      </body>
    </html>
  )
}
