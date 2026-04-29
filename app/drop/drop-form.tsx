"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Send, Lock } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { TraitChip } from "@/components/trait-chip";
import { TRAITS, type Trait } from "@/lib/types";
import { sendDropReflection } from "@/lib/actions";
import clsx from "clsx";

type Recipient = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string | null;
};

const MIN_LEN = 25;

export function DropForm({
  dropId,
  recipients,
  meUsername,
}: {
  dropId: string;
  recipients: Recipient[];
  meUsername: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Recipient | null>(null);
  const [text, setText] = useState("");
  const [traits, setTraits] = useState<Trait[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipients.slice(0, 12);
    return recipients
      .filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q),
      )
      .slice(0, 24);
  }, [query, recipients]);

  function toggleTrait(t: Trait) {
    setTraits((curr) =>
      curr.includes(t)
        ? curr.filter((x) => x !== t)
        : curr.length >= 3
          ? curr
          : [...curr, t],
    );
  }

  function reset() {
    setPicked(null);
    setText("");
    setTraits([]);
    setSubmitted(false);
    setQuery("");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!picked || text.trim().length < MIN_LEN) return;
    setError(null);
    const fd = new FormData();
    fd.set("dropId", dropId);
    fd.set("recipientId", picked.id);
    fd.set("text", text.trim());
    for (const t of traits) fd.append("traits", t);

    startTransition(async () => {
      const res = await sendDropReflection(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSubmitted(true);
      router.refresh();
    });
  }

  if (recipients.length === 0 && !submitted) {
    return (
      <div className="rounded-3xl border border-dashed border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)]/40 p-6 text-center">
        <p className="font-serif text-lg italic text-[color:var(--color-ink-700)]">
          You&apos;ve already sent a reflection to everyone here.
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
          More people will join the platform soon. Invite someone and the next
          drop will have someone new to send to.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-6 text-center sm:p-7">
        <p className="font-serif text-xl italic text-[color:var(--color-sage-700)]">
          Sent.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-700)]">
          They&apos;ll see it the next time they open Do Güd. You can send one
          more reflection in this drop if you want.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  if (!picked) {
    return (
      <section>
        <p className="text-sm font-medium text-[color:var(--color-ink-700)]">
          Pick someone you want to send a reflection to
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-ink-400)]">
          @{meUsername} is you.
        </p>

        <div className="mt-3 flex items-center rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] focus-within:border-[color:var(--color-sage-300)]">
          <Search
            size={15}
            className="ml-3 text-[color:var(--color-ink-400)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or @username"
            className="w-full bg-transparent px-2 py-2.5 text-[15px] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-4 text-sm text-[color:var(--color-ink-400)]">
            Nobody matches that.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {filtered.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => setPicked(u)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-3 text-left transition hover:border-[color:var(--color-sage-300)] hover:bg-[color:var(--color-cream-100)]"
                >
                  <Avatar src={u.avatar} name={u.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[color:var(--color-ink-900)]">
                      {u.name}
                    </div>
                    <div className="truncate text-xs text-[color:var(--color-ink-400)]">
                      @{u.username}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  const len = text.trim().length;
  const tooShort = len < MIN_LEN;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-3">
        <div className="flex items-center gap-3">
          <Avatar src={picked.avatar} name={picked.name} size={40} />
          <div className="leading-tight">
            <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
              For {picked.name}
            </div>
            <div className="text-xs text-[color:var(--color-ink-400)]">
              @{picked.username}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPicked(null)}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink-500)] hover:text-[color:var(--color-ink-900)]"
        >
          Change
        </button>
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={500}
          autoFocus
          placeholder={`Something only you would notice about ${picked.name.split(" ")[0]}…`}
          className="w-full resize-none rounded-2xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-4 py-3 text-[15px] leading-relaxed text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
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
              onClick={() => toggleTrait(t)}
            />
          ))}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[color:var(--color-rose-500)]">{error}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-ink-400)]">
          <Lock size={12} />
          Only {picked.name.split(" ")[0]} sees this.
        </span>
        <button
          type="submit"
          disabled={tooShort || pending}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]",
            (tooShort || pending) && "cursor-not-allowed opacity-40",
          )}
        >
          <Send size={14} /> {pending ? "Sending…" : "Send reflection"}
        </button>
      </div>
    </form>
  );
}
