"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  avatarUrl,
  generateId,
  signIn,
  useSnapshot,
} from "@/lib/store";
import { Avatar } from "@/components/avatar";
import { Shuffle } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const snap = useSnapshot();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [seedKey, setSeedKey] = useState(() =>
    Math.random().toString(36).slice(2),
  );
  const [error, setError] = useState<string | null>(null);

  const cleanedUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Add your name.");
    if (!cleanedUsername) return setError("Pick a username.");
    if (snap.users.some((u) => u.username === cleanedUsername)) {
      return setError("That username is taken.");
    }

    const user = {
      id: generateId("u"),
      username: cleanedUsername,
      name: name.trim(),
      bio: bio.trim(),
      avatar: avatarUrl(seedKey),
      joinedAt: new Date().toISOString(),
    };

    signIn(user);
    router.push("/me");
  }

  const existingUsers = snap.users.filter((u) =>
    ["maya", "jordan", "sami", "lena", "theo"].includes(u.username),
  );

  return (
    <div className="space-y-10 pt-2">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Make your profile
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          A few things, then you can start asking.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[color:var(--color-ink-500)]">
          Your profile lives on your device for this demo — so you can try the
          full experience without an account. Switch profiles anytime from your
          reflection hub.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="input"
            maxLength={60}
            autoFocus
          />
        </Field>

        <Field label="Username" hint="lowercase, no spaces">
          <div className="flex items-center rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] focus-within:border-[color:var(--color-sage-300)]">
            <span className="pl-3 text-[color:var(--color-ink-400)]">@</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              className="w-full bg-transparent px-2 py-2.5 text-[15px] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:outline-none"
              maxLength={24}
            />
          </div>
        </Field>

        <Field label="Bio" hint="optional, 140 chars">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
            className="rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
          >
            Create profile
          </button>
        </div>
      </form>

      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Or try a sample profile
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
          Sign in as one of the people in the demo to see what their reflection
          hub looks like.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {existingUsers.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                signIn(u);
                router.push("/me");
              }}
              className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-3 text-left transition hover:border-[color:var(--color-sage-300)] hover:bg-[color:var(--color-cream-100)]"
            >
              <Avatar src={u.avatar} name={u.name} size={36} />
              <div className="leading-tight">
                <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
                  {u.name}
                </div>
                <div className="text-xs text-[color:var(--color-ink-400)]">
                  @{u.username}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

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
    </div>
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
