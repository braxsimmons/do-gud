import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getPinnedReflectionsForUser,
  getUserByUsername,
} from "@/lib/queries";
import { signOut } from "@/lib/actions";
import { Avatar } from "@/components/avatar";
import { PromptCard } from "@/components/prompt-card";
import { ResponseCard } from "@/components/response-card";
import { EmptyState } from "@/components/empty-state";
import { Plus, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/onboarding");

  const [profile, pinned] = await Promise.all([
    getUserByUsername(me.username),
    getPinnedReflectionsForUser(me.id),
  ]);
  if (!profile) redirect("/onboarding");

  return (
    <div className="space-y-10 pt-2">
      <section className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={me.avatar} name={me.name} size={64} />
          <div className="leading-tight">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
              Your reflection hub
            </p>
            <h1 className="mt-1 font-serif text-2xl text-[color:var(--color-ink-900)]">
              {me.name}
            </h1>
            <div className="text-sm text-[color:var(--color-ink-400)]">
              @{me.username}
            </div>
          </div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            title="Sign out"
            className="rounded-full border border-[color:var(--color-ink-200)] p-2 text-[color:var(--color-ink-500)] hover:border-[color:var(--color-rose-300)] hover:text-[color:var(--color-rose-500)]"
          >
            <LogOut size={15} />
          </button>
        </form>
      </section>

      {profile.prompts.length === 0 ? (
        <section className="space-y-5 rounded-3xl bg-[color:var(--color-ink-900)] p-6 text-[color:var(--color-cream-100)] sm:p-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-cream-200)]/60">
              Your next move
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-snug">
              Ask your first question.
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-cream-200)]/80">
              You can&apos;t see what people quietly notice about you until
              you ask. Pick one thing you&apos;re actually curious about — a
              strength, a first impression, something you might be missing.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-cream-50)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-900)] transition hover:bg-[color:var(--color-sage-300)]"
          >
            <Plus size={14} /> Ask your first question
          </Link>
        </section>
      ) : (
        <>
          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
                  The mirror
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
                  Reflections you&apos;ve pinned. The picture of you, built by
                  the people who know you.
                </p>
              </div>
            </div>
            {pinned.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  title="Nothing pinned yet."
                  body="Open one of your questions below and pin the responses that hit something true. They&apos;ll show up here over time."
                />
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {pinned.map((r) => (
                  <ResponseCard
                    key={r.id}
                    response={r}
                    responder={r.responder}
                    canPin
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
                  Your questions
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
                  Tap any to read what people wrote and pin what resonates.
                </p>
              </div>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-4 py-2 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
              >
                <Plus size={14} /> Ask
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {profile.prompts.map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={p}
                  author={profile}
                  responseCount={p._count.responses}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
