"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Avatar } from "@/components/avatar";
import { Shuffle } from "lucide-react";
import { signUp } from "@/lib/actions";
import { avatarUrl } from "@/lib/types";

export function SignUpForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [seedKey, setSeedKey] = useState(() =>
    Math.random().toString(36).slice(2),
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("avatarSeed", seedKey);

    startTransition(async () => {
      const res = await signUp(fd);
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
      <div className="flex items-center gap-4">
        <Avatar src={avatarUrl(seedKey)} name="you" size={64} />
        <button
          type="button"
          onClick={() => setSeedKey(Math.random().toString(36).slice(2))}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-ink-200)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
        >
          <Shuffle size={13} /> Shuffle avatar
        </button>
      </div>

      <Field label="Name">
        <input
          name="name"
          placeholder="Your full name"
          className="input"
          maxLength={60}
          autoFocus
          required
        />
      </Field>

      <Field label="Username" hint="lowercase letters, numbers, underscores">
        <div className="flex items-center rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] focus-within:border-[color:var(--color-sage-300)]">
          <span className="pl-3 text-[color:var(--color-ink-400)]">@</span>
          <input
            name="username"
            placeholder="yourname"
            className="w-full bg-transparent px-2 py-2.5 text-[15px] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:outline-none"
            maxLength={24}
            required
          />
        </div>
      </Field>

      <Field label="Email">
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          className="input"
          required
        />
      </Field>

      <Field label="Password" hint="8+ characters">
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          className="input"
          minLength={8}
          required
        />
      </Field>

      <Field label="Bio" hint="optional, 140 chars">
        <textarea
          name="bio"
          placeholder="One line about you."
          className="input min-h-[72px] resize-none"
          maxLength={140}
        />
      </Field>

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
          className="rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)] disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create profile"}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-ink-200);
          background: var(--color-cream-50);
          padding: 0.625rem 0.875rem;
          font-size: 15px;
          color: var(--color-ink-900);
          outline: none;
          transition: border-color 0.15s;
        }
        :global(.input:focus) {
          border-color: var(--color-sage-300);
        }
        :global(.input::placeholder) {
          color: var(--color-ink-300);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-[color:var(--color-ink-700)]">
          {label}
        </span>
        {hint ? (
          <span className="text-xs text-[color:var(--color-ink-400)]">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </label>
  );
}
