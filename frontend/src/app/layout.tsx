import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CSR Monitoring System",
  description:
    "Sistem Monitoring Corporate Social Responsibility - Platform manajemen dan monitoring kegiatan CSR perusahaan",
  keywords: ["CSR", "Corporate Social Responsibility", "Monitoring", "Dashboard", "Management"],
  authors: [{ name: "CSR Team" }],
  creator: "CSR Monitoring System",
  publisher: "CSR Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://csr-monitoring.vercel.app"),
  openGraph: {
    title: "CSR Monitoring System",
    description: "Platform manajemen dan monitoring kegiatan Corporate Social Responsibility",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
