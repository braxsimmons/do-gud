"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useSnapshot } from "@/lib/store";
import {
  pinnedResponsesForUser,
  promptsByUser,
  responsesForPrompt,
  userByUsername,
} from "@/lib/queries";
import { PromptCard } from "@/components/prompt-card";
import { ResponseCard } from "@/components/response-card";
import { Avatar } from "@/components/avatar";
import { EmptyState } from "@/components/empty-state";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const snap = useSnapshot();

  const user = userByUsername(snap, username);
  if (!user && snap.users.length > 0) {
    // If our snapshot is hydrated and user isn't here, 404.
    notFound();
  }
  if (!user) {
    return <div className="h-40" />;
  }

  const prompts = promptsByUser(snap, username);
  const pinned = pinnedResponsesForUser(snap, username);

  return (
    <div className="space-y-10 pt-2">
      <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Avatar src={user.avatar} name={user.name} size={88} />
        <div>
          <h1 className="font-serif text-3xl text-[color:var(--color-ink-900)]">
            {user.name}
          </h1>
          <div className="mt-0.5 text-sm text-[color:var(--color-ink-400)]">
            @{user.username}
          </div>
          {user.bio ? (
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[color:var(--color-ink-500)]">
              {user.bio}
            </p>
          ) : null}
        </div>
      </section>

      {pinned.length > 0 ? (
        <section>
          <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
            What people say about {user.name.split(" ")[0]}
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
            Pinned reflections from others.
          </p>
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
                />
              );
            })}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
            Questions {user.name.split(" ")[0]} has asked
          </h2>
        </div>
        {prompts.length === 0 ? (
          <EmptyState
            title="No questions yet."
            body={`${user.name.split(" ")[0]} hasn't posted a prompt. Once they do, the people in their life can write back here.`}
            action={
              <Link
                href="/"
                className="inline-flex rounded-full border border-[color:var(--color-ink-200)] px-4 py-2 text-sm text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
              >
                Back to feed
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                author={user}
                responseCount={responsesForPrompt(snap, p.id).length}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
