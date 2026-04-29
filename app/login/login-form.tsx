"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "@/lib/actions";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await signIn(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(res.redirectTo ?? "/me");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-6 sm:p-7"
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[color:var(--color-ink-700)]">
          Email or username
        </span>
        <input
          name="identifier"
          placeholder="you@example.com"
          autoFocus
          required
          className="w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3.5 py-2.5 text-[15px] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[color:var(--color-ink-700)]">
          Password
        </span>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3.5 py-2.5 text-[15px] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
        />
      </label>

      {error ? (
        <p className="text-sm text-[color:var(--color-rose-500)]">{error}</p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Link
          href="/"
          className="rounded-full px-4 py-2 text-sm text-[color:var(--color-ink-500)] hover:text-[color:var(--color-ink-900)]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)] disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
