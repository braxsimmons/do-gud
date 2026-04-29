"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adminCreateDrop } from "@/lib/actions";

const TEMPLATES = [
  "Send a reflection to someone who's been on your mind this week.",
  "Tell someone something you've quietly admired about them.",
  "Send a friend the thing you'd say if you weren't worried about being too much.",
  "Reflect to someone about how they've grown lately.",
];

function localISO(d: Date) {
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function CreateDropForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState(TEMPLATES[0]);
  const [opensAt, setOpensAt] = useState(() =>
    localISO(new Date(Date.now() + 5 * 60 * 1000)),
  );
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("prompt", prompt.trim());
    fd.set("opensAt", new Date(opensAt).toISOString());
    fd.set("durationMin", String(duration));
    startTransition(async () => {
      const res = await adminCreateDrop(fd);
      if (!res.ok) return setError(res.error);
      if (res.redirectTo) router.push(res.redirectTo);
    });
  }

  function startNow() {
    setOpensAt(localISO(new Date(Date.now() + 60 * 1000)));
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 space-y-4 rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-5"
    >
      <div>
        <label className="text-sm font-medium text-[color:var(--color-ink-700)]">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          maxLength={200}
          className="mt-1.5 w-full resize-none rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3 py-2 text-[15px] text-[color:var(--color-ink-900)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPrompt(t)}
              className="rounded-full border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-2.5 py-1 text-xs text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
            >
              {t.slice(0, 36)}…
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[color:var(--color-ink-700)]">
              Opens at
            </span>
            <button
              type="button"
              onClick={startNow}
              className="text-xs font-medium text-[color:var(--color-sage-700)] hover:underline"
            >
              In 1 min
            </button>
          </div>
          <input
            type="datetime-local"
            value={opensAt}
            onChange={(e) => setOpensAt(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3 py-2 text-[15px] text-[color:var(--color-ink-900)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--color-ink-700)]">
            Duration
          </span>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3 py-2 text-[15px] text-[color:var(--color-ink-900)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={120}>2 hours</option>
            <option value={240}>4 hours</option>
            <option value={1440}>24 hours</option>
          </select>
        </label>
      </div>

      {error ? (
        <p className="text-sm text-[color:var(--color-rose-500)]">{error}</p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)] disabled:opacity-50"
        >
          {pending ? "Scheduling…" : "Schedule drop"}
        </button>
      </div>
    </form>
  );
}
