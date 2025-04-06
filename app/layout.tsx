import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { I18nProvider } from "@/context/i18n-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TOSCA AI - Assistant IA Futuriste",
  description: "Assistant IA avec interface glassmorphique et futuriste",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <I18nProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'