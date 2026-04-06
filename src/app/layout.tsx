import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { ConsentProvider } from "@/components/privacy/consent-provider"
import { buildRootMetadata } from "@/lib/seo/metadata"
import { cn } from "@/lib/utils"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = buildRootMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="hu"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <ConsentProvider>
          {children}
          <AnalyticsProvider />
        </ConsentProvider>
      </body>
    </html>
  )
}
