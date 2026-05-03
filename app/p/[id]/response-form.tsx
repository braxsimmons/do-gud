"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TraitChip } from "@/components/trait-chip";
import { TRAITS, type Trait } from "@/lib/types";
import { Send, Lock, ArrowRight } from "lucide-react";
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
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const len = text.trim().length;
  const tooShort = len < MIN_LEN;
  const guestNameMissing = !isSignedIn && !guestName.trim();

  function toggle(t: Trait) {
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
    if (tooShort || guestNameMissing) return;
    setError(null);
    const fd = new FormData();
    fd.set("promptId", promptId);
    fd.set("text", text.trim());
    if (anonymous) fd.set("anonymous", "on");
    for (const t of traits) fd.append("traits", t);
    if (!isSignedIn) {
      fd.set("guestName", guestName.trim());
      if (guestEmail.trim()) fd.set("guestEmail", guestEmail.trim());
    }

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

  if (submitted) {
    return (
      <div className="space-y-4 rounded-3xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-6 text-center sm:p-8">
        <p className="font-serif text-xl italic text-[color:var(--color-sage-700)]">
          Sent.
        </p>
        <p className="mx-auto max-w-sm text-sm text-[color:var(--color-ink-700)]">
          {authorName} can pin it if it lands.
        </p>
        {!isSignedIn ? (
          <div className="mt-4 rounded-2xl bg-[color:var(--color-ink-900)] p-5 text-left text-[color:var(--color-cream-100)]">
            <p className="font-serif text-base">
              Want one of these for yourself?
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-cream-200)]/80">
              Make a profile and ask the people in your life how they actually
              see you. Takes 30 seconds.
            </p>
            <Link
              href="/onboarding"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-cream-50)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-900)] hover:bg-[color:var(--color-sage-300)]"
            >
              Make a profile <ArrowRight size={14} />
            </Link>
          </div>
        ) : null}
      </div>
    );
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
          {!isSignedIn ? " No account needed." : ""}
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

      {!isSignedIn ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[color:var(--color-ink-700)]">
              Your first name
            </span>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="So they know it's you"
              maxLength={40}
              required
              className="w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3 py-2.5 text-[15px] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[color:var(--color-ink-700)]">
              Email{" "}
              <span className="font-normal text-[color:var(--color-ink-400)]">
                (optional)
              </span>
            </span>
            <input
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3 py-2.5 text-[15px] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
            />
          </label>
        </div>
      ) : null}

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
              onClick={() => toggle(t)}
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
          disabled={tooShort || guestNameMissing || pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
          {pending ? "Sending…" : "Send reflection"}
        </button>
      </div>

      {!isSignedIn ? (
        <p className="text-center text-xs text-[color:var(--color-ink-400)]">
          By sending, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[color:var(--color-ink-700)]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[color:var(--color-ink-700)]">
            Privacy Policy
          </Link>
          .
        </p>
      ) : null}
    </form>
  );
}
