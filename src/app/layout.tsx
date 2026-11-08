import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ApiKeysProvider } from "@/context/api-keys-context";
import { ApiKeysModal } from "@/components/auth/api-keys-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://freeyoutubetools.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "YouTube Creator Toolkit Pro — 40+ Free YouTube Tools",
    template: "%s | YouTube Creator Toolkit Pro",
  },
  description:
    "Free YouTube tools for creators — thumbnail downloader, channel analytics, monetization checker, AI title generator, earnings calculator and 40+ more tools.",
  keywords: [
    "youtube tools",
    "youtube thumbnail downloader",
    "youtube channel analytics",
    "youtube monetization checker",
    "youtube earnings calculator",
    "youtube tags extractor",
    "ai youtube tools",
  ],
  authors: [{ name: "YouTube Creator Toolkit Pro" }],
  creator: "YouTube Creator Toolkit Pro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    title: "YouTube Creator Toolkit Pro — 40+ Free YouTube Tools",
    description:
      "The ultimate free toolkit for YouTube creators. Analyze, optimize and grow your channel.",
    siteName: "YouTube Creator Toolkit Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Creator Toolkit Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Creator Toolkit Pro — 40+ Free YouTube Tools",
    description:
      "The ultimate free toolkit for YouTube creators. Analyze, optimize and grow your channel.",
    images: ["/og-image.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(r=>{for(let reg of r)reg.unregister()})}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ApiKeysProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
            <ApiKeysModal />
          </ApiKeysProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
