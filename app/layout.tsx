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

export const metadata: Metadata = {
  title: "Do Güd — see yourself the way others actually see you",
  description:
    "A reflection platform built on specific, structured affirmation. No likes, no scores — just honest, human notes from the people who know you.",
  openGraph: {
    title: "Do Güd",
    description:
      "See yourself the way others actually see you. A reflection platform built on specific, honest affirmation.",
    type: "website",
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
          <footer className="pb-10 pt-16 text-center text-xs text-[color:var(--color-ink-400)]">
            <span className="font-serif italic">Do Güd</span> · be specific, be
            honest, be kind
          </footer>
        </div>
      </body>
    </html>
  );
}
