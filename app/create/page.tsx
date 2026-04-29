"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { addPrompt, generateId, useCurrentUser } from "@/lib/store";
import { CATEGORY_META, type PromptCategory } from "@/lib/types";
import clsx from "clsx";

const SUGGESTIONS: Record<PromptCategory, string[]> = {
  strengths: [
    "Where do you think I shine without realizing it?",
    "What's something I'm objectively good at that I'm modest about?",
  ],
  personality: [
    "If you had to describe me in three words, what would they be?",
    "What's the energy I bring into a room?",
  ],
  "first-impressions": [
    "What's the first impression you remember getting from me?",
    "What did you assume about me that turned out to be wrong?",
  ],
  "hidden-talents": [
    "What's something you think I'm quietly really good at?",
    "What do I do well that I never give myself credit for?",
  ],
  growth: [
    "What's one thing you think I'm still figuring out?",
    "Where am I close, but not quite there yet?",
  ],
};

export default function CreatePromptPage() {
  const router = useRouter();
  const me = useCurrentUser();

  const [category, setCategory] = useState<PromptCategory>("strengths");
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");

  if (!me) {
    return (
      <div className="space-y-6 pt-6">
        <h1 className="font-serif text-3xl text-[color:var(--color-ink-900)]">
          Make a profile first.
        </h1>
        <p className="text-sm text-[color:var(--color-ink-500)]">
          You need somewhere to receive reflections.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
        >
          Make profile
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    const trimmed = question.trim();
    if (trimmed.length < 8) return;

    const prompt = {
      id: generateId("p"),
      authorUsername: me.username,
      question: trimmed,
      category,
      image: image.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addPrompt(prompt);
    router.push(`/p/${prompt.id}`);
  }

  return (
    <div className="space-y-8 pt-2">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Ask a question
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          What do you want to know{" "}
          <span className="italic text-[color:var(--color-sage-700)]">
            about yourself?
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[color:var(--color-ink-500)]">
          Pick a category. The more specific the question, the more useful the
          reflections you get back.
        </p>
      </section>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-[color:var(--color-ink-700)]">
            Category
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.keys(CATEGORY_META) as PromptCategory[]).map((c) => {
              const meta = CATEGORY_META[c];
              const active = c === category;
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={clsx(
                    "rounded-2xl border p-3 text-left transition",
                    active
                      ? "border-[color:var(--color-sage-700)] bg-[color:var(--color-sage-100)]"
                      : "border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 hover:border-[color:var(--color-sage-300)]",
                  )}
                >
                  <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
                    {meta.label}
                  </div>
                  <div className="mt-0.5 text-xs text-[color:var(--color-ink-500)]">
                    {meta.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[color:var(--color-ink-700)]">
            Your question
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            maxLength={180}
            placeholder="Write the thing you actually want to know."
            className="w-full resize-none rounded-2xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-4 py-3 font-serif text-xl leading-snug text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
          />
          <div className="mt-1 text-right text-xs text-[color:var(--color-ink-400)]">
            {question.length}/180
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink-400)]">
              Or borrow one
            </p>
            <div className="mt-2 space-y-1.5">
              {SUGGESTIONS[category].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuestion(s)}
                  className="block w-full rounded-xl border border-[color:var(--color-ink-200)]/60 bg-[color:var(--color-cream-100)]/40 px-3 py-2 text-left text-sm text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)] hover:bg-[color:var(--color-cream-100)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[color:var(--color-ink-700)]">
            Image URL{" "}
            <span className="font-normal text-[color:var(--color-ink-400)]">
              (optional)
            </span>
          </p>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-4 py-2.5 text-sm text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/me"
            className="rounded-full px-4 py-2 text-sm text-[color:var(--color-ink-500)] hover:text-[color:var(--color-ink-900)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={question.trim().length < 8}
            className="rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Post question
          </button>
        </div>
      </form>
    </div>
  );
}
