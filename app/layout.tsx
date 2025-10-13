import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster as SonnerToaster } from "sonner"
import { AuthInitializer } from "@/components/auth/auth-initializer"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "ProjectHub - Gestion de Projets",
  description: "Application moderne de gestion de projets et tâches",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthInitializer />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <SonnerToaster 
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
            />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
