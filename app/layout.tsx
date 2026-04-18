import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neurotrade.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NeuroTrade | Trade Smarter with AI",
    template: "%s | NeuroTrade",
  },
  description:
    "Futuristic AI trading platform with adaptive strategies, live risk telemetry, and command-grade execution design.",
  keywords: [
    "AI trading platform",
    "algorithmic trading",
    "trading dashboard",
    "quant tools",
    "risk telemetry",
    "NeuroTrade",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "NeuroTrade",
    title: "NeuroTrade | Trade Smarter with AI",
    description:
      "Adaptive AI execution, live risk telemetry, and premium command-center UX for modern trading teams.",
    images: [
      {
        url: "/og-neurotrade.svg",
        width: 1200,
        height: 630,
        alt: "NeuroTrade futuristic trading platform preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroTrade | Trade Smarter with AI",
    description:
      "Adaptive AI execution and live risk telemetry in a premium futuristic trading interface.",
    images: ["/og-neurotrade.svg"],
  },
  icons: {
    icon: [{ url: "/icon.svg?v=2", type: "image/svg+xml" }],
    shortcut: "/icon.svg?v=2",
    apple: [{ url: "/apple-icon.svg?v=2", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-clip bg-background text-foreground">
        <a
          href="#mission"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-md focus:bg-[#0a1a2e] focus:px-3 focus:py-2 focus:text-sm focus:text-cyan-100"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
