"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TraitChip } from "@/components/trait-chip";
import { TRAITS, type Trait } from "@/lib/types";
import { Send, Lock } from "lucide-react";
import { createResponse } from "@/lib/actions";

const MIN_LEN = 25;

export function ResponseForm({
  promptId,
  authorName,
  isSignedIn,
}: {
  promptId: string;
  authorName: string;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const [traits, setTraits] = useState<Trait[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSignedIn) {
    return (
      <div className="rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-6 text-center sm:p-8">
        <p className="font-serif text-lg italic text-[color:var(--color-ink-700)]">
          Make a profile to write a reflection.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-500)]">
          So {authorName} knows who said it (unless you choose to stay
          anonymous).
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
          >
            Make profile
          </Link>
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm text-[color:var(--color-ink-500)] hover:text-[color:var(--color-ink-900)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-6 text-center sm:p-8">
        <p className="font-serif text-lg italic text-[color:var(--color-sage-700)]">
          Your reflection is in.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-700)]">
          {authorName} can pin it if it lands.
        </p>
      </div>
    );
  }

  const len = text.trim().length;
  const tooShort = len < MIN_LEN;

  function handleToggle(t: Trait) {
    setTraits((curr) =>
      curr.includes(t)
        ? curr.filter((x) => x !== t)
        : curr.length >= 3
          ? curr
          : [...curr, t],
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (tooShort) return;
    setError(null);
    const fd = new FormData();
    fd.set("promptId", promptId);
    fd.set("text", text.trim());
    if (anonymous) fd.set("anonymous", "on");
    for (const t of traits) fd.append("traits", t);

    startTransition(async () => {
      const res = await createResponse(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSubmitted(true);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-5 sm:p-6"
    >
      <div>
        <p className="text-sm font-medium text-[color:var(--color-ink-700)]">
          Write your reflection for {authorName}
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-ink-400)]">
          Be specific. Aim for the kind of thing only you would say.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={500}
          placeholder={`Something only you would notice about ${authorName}…`}
          className="mt-3 w-full resize-none rounded-2xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-4 py-3 text-[15px] leading-relaxed text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-[color:var(--color-ink-400)]">
          <span>{tooShort ? `at least ${MIN_LEN} characters` : "looks good"}</span>
          <span>{len}/500</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[color:var(--color-ink-700)]">
          Tag a trait or two
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-ink-400)]">
          Optional. Up to 3.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {TRAITS.map((t) => (
            <TraitChip
              key={t}
              trait={t}
              selected={traits.includes(t)}
              onClick={() => handleToggle(t)}
            />
          ))}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[color:var(--color-rose-500)]">{error}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-ink-500)]">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-[color:var(--color-ink-300)] accent-[color:var(--color-sage-700)]"
          />
          <Lock size={13} />
          Send anonymously
        </label>

        <button
          type="submit"
          disabled={tooShort || pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
          {pending ? "Sending…" : "Send reflection"}
        </button>
      </div>
    </form>
  );
}
