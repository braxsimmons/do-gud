import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { DropBanner } from "@/components/drop-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const APP_URL =
  process.env.APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "https://do-gud.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Do Güd — see yourself the way others actually see you",
    template: "%s",
  },
  description:
    "A reflection platform built on specific, structured affirmation. No likes, no scores — just honest, human notes from the people who know you.",
  applicationName: "Do Güd",
  openGraph: {
    title: "Do Güd",
    description:
      "See yourself the way others actually see you. A reflection platform built on specific, honest affirmation.",
    type: "website",
    url: APP_URL,
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do Güd",
    description:
      "See yourself the way others actually see you. A reflection platform built on specific, honest affirmation.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-5 sm:px-8">
          <Header />
          <div className="pt-3 sm:pt-4">
            <DropBanner />
          </div>
          <main className="flex-1 pb-32 pt-6 sm:pt-8">{children}</main>
          <footer className="space-y-3 pb-10 pt-16 text-center text-xs text-[color:var(--color-ink-400)]">
            <p>
              <span className="font-serif italic">Do Güd</span> · be specific,
              be honest, be kind
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a href="/about" className="hover:text-[color:var(--color-sage-700)]">
                How it works
              </a>
              <a href="/terms" className="hover:text-[color:var(--color-sage-700)]">
                Terms
              </a>
              <a href="/privacy" className="hover:text-[color:var(--color-sage-700)]">
                Privacy
              </a>
              <a
                href="mailto:hello@dogud.app"
                className="hover:text-[color:var(--color-sage-700)]"
              >
                Contact
              </a>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}
