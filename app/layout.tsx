import type { Metadata } from "next";
import { Unbounded, Gabarito, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Variable fonts: no explicit weight needed. Display = Unbounded (chunky, candy),
// body = Hanken Grotesque (clean), renders = JetBrains Mono.
const display = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Gabarito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dumbometer.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "dumbometer · know when your AI gets dumb",
  description:
    "A live meter in your Claude Code status line that shows how full your context window is, so you /compact before your agent forgets your code. Free, MIT, zero tokens, never crashes.",
  keywords: [
    "claude code",
    "context window",
    "status line",
    "context rot",
    "developer tools",
    "dumbometer",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "dumbometer",
    title: "dumbometer · know when your AI gets dumb",
    description:
      "A live meter in your Claude Code status line. See how full your context window is at a glance, so you /compact before your agent forgets your code. Free, MIT, zero tokens.",
  },
  twitter: {
    card: "summary_large_image",
    title: "dumbometer · know when your AI gets dumb",
    description:
      "A live meter in your Claude Code status line. Free, MIT, zero tokens, never crashes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        {/* No-JS fallback: the entrance + scroll-reveal start hidden and are shown
            by JS. Without JS, reveal everything so content is never hidden. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".hero-top,.hero-eyebrow,.hero-h1,.hero-sub,.hero-meterbox,.hero-cta,.hero-trust,.reveal{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
