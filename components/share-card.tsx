"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link as LinkIcon, Send, Sparkles } from "lucide-react";

export function ShareCard({
  promptId,
  question,
  authorFirstName,
}: {
  promptId: string;
  question: string;
  authorFirstName: string;
}) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const url = origin ? `${origin}/p/${promptId}` : "";
  const text = `I'm trying something — I asked "${question}" on Do Güd. Curious how you'd answer it about me. No pressure, just honest.`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: "A question for you",
        text,
        url,
      });
    } catch {
      /* user dismissed */
    }
  }

  return (
    <section className="rounded-3xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-6 sm:p-7">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-sage-700)]">
        <Sparkles size={13} />
        Step 3 of 3 · Your question is live
      </div>

      <h2 className="mt-3 font-serif text-2xl leading-snug text-[color:var(--color-ink-900)]">
        Now share it with people who know {authorFirstName}.
      </h2>
      <p className="mt-2 text-sm text-[color:var(--color-ink-700)]">
        Reflections only happen when you ask. Send the link to a few friends,
        a sibling, a coworker — whoever would say something true.
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-50)] p-2 pl-3">
        <LinkIcon
          size={14}
          className="shrink-0 text-[color:var(--color-ink-400)]"
        />
        <span className="flex-1 truncate text-sm text-[color:var(--color-ink-700)]">
          {url || "—"}
        </span>
        <button
          type="button"
          onClick={copy}
          disabled={!url}
          className="inline-flex items-center gap-1 rounded-lg bg-[color:var(--color-ink-900)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)] disabled:opacity-50"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={copyMessage}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-ink-700)] transition hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
        >
          <Copy size={14} /> Copy a ready-made message
        </button>
        {canShare ? (
          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
          >
            <Send size={14} /> Share via…
          </button>
        ) : (
          <a
            href={`sms:?&body=${encodeURIComponent(`${text}\n\n${url}`)}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
          >
            <Send size={14} /> Send as a text
          </a>
        )}
      </div>

      <details className="mt-4 text-sm text-[color:var(--color-ink-500)]">
        <summary className="cursor-pointer select-none text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink-400)] hover:text-[color:var(--color-ink-700)]">
          Preview the message
        </summary>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-50)] p-3 text-[color:var(--color-ink-700)]">
          {text}
          {"\n\n"}
          {url}
        </p>
      </details>
    </section>
  );
}
