"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signOut,
  togglePinResponse,
  useCurrentUser,
  useSnapshot,
} from "@/lib/store";
import {
  pinnedResponsesForUser,
  promptsByUser,
  responsesForPrompt,
} from "@/lib/queries";
import { Avatar } from "@/components/avatar";
import { PromptCard } from "@/components/prompt-card";
import { ResponseCard } from "@/components/response-card";
import { EmptyState } from "@/components/empty-state";
import { Plus, LogOut } from "lucide-react";

export default function MePage() {
  const router = useRouter();
  const me = useCurrentUser();
  const snap = useSnapshot();

  if (!me) {
    return (
      <div className="space-y-6 pt-6">
        <h1 className="font-serif text-3xl text-[color:var(--color-ink-900)]">
          Make a profile.
        </h1>
        <p className="text-sm text-[color:var(--color-ink-500)]">
          Once you do, your reflection hub lives here.
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

  const myPrompts = promptsByUser(snap, me.username);
  const pinned = pinnedResponsesForUser(snap, me.username);

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

        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          aria-label="Sign out"
          className="rounded-full border border-[color:var(--color-ink-200)] p-2 text-[color:var(--color-ink-500)] hover:border-[color:var(--color-rose-300)] hover:text-[color:var(--color-rose-500)]"
          title="Sign out"
        >
          <LogOut size={15} />
        </button>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
              The mirror
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
              Reflections you&apos;ve pinned. The picture of you, built by the
              people who know you.
            </p>
          </div>
        </div>
        {pinned.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="Nothing pinned yet."
              body="Pin the responses that hit something true. They show up here as a portrait of you over time."
            />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {pinned.map((r) => {
              const responder = snap.users.find(
                (u) => u.username === r.responderUsername,
              );
              return (
                <ResponseCard
                  key={r.id}
                  response={r}
                  responder={responder ?? null}
                  canPin
                  onTogglePin={() => togglePinResponse(r.id)}
                />
              );
            })}
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

        {myPrompts.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No questions yet."
              body="The whole point of this place is finding out something about yourself you can't see alone. Start with one question."
              action={
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
                >
                  <Plus size={14} /> Ask your first question
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {myPrompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                author={me}
                responseCount={responsesForPrompt(snap, p.id).length}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
