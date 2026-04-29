"use client";

import Link from "next/link";
import { useSnapshot, useCurrentUser } from "@/lib/store";
import { feedPrompts, responsesForPrompt } from "@/lib/queries";
import { PromptCard } from "@/components/prompt-card";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const snap = useSnapshot();
  const me = useCurrentUser();
  const prompts = feedPrompts(snap);

  return (
    <div className="space-y-12">
      <section className="relative pt-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          <span className="softpulse inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-sage-500)]" />
          A quieter kind of social
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-[color:var(--color-ink-900)] sm:text-5xl">
          See yourself the way{" "}
          <span className="italic text-[color:var(--color-sage-700)]">
            others actually see you.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-500)] sm:text-base">
          Do Güd is a reflection platform. You ask the people who know you a
          specific question — about your strengths, your blind spots, the
          things you can&apos;t see in yourself — and they write back honestly.
          No likes. No scores. No comparison.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {me ? (
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
            >
              Ask a question <ArrowRight size={15} />
            </Link>
          ) : (
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
            >
              Make your profile <ArrowRight size={15} />
            </Link>
          )}
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-ink-200)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-700)] transition hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
          >
            How it works
          </Link>
        </div>
      </section>

      <div className="dotted-divider" />

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--color-ink-900)]">
              Today&apos;s reflections
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
              Recent questions from the community. Tap one to write a response.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {prompts.map((p) => {
            const author = snap.users.find(
              (u) => u.username === p.authorUsername,
            );
            if (!author) return null;
            const count = responsesForPrompt(snap, p.id).length;
            return (
              <PromptCard
                key={p.id}
                prompt={p}
                author={author}
                responseCount={count}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
