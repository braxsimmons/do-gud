"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  useSnapshot,
  useCurrentUser,
  addResponse,
  togglePinResponse,
  generateId,
} from "@/lib/store";
import { promptById, responsesForPrompt, timeAgo } from "@/lib/queries";
import { Avatar } from "@/components/avatar";
import { CategoryChip } from "@/components/category-chip";
import { TraitChip } from "@/components/trait-chip";
import { ResponseCard } from "@/components/response-card";
import { TRAITS, type Trait } from "@/lib/types";
import { Send, Lock } from "lucide-react";

const MIN_LEN = 25;

export default function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const snap = useSnapshot();
  const me = useCurrentUser();

  const prompt = promptById(snap, id);
  if (!prompt && snap.prompts.length > 0) notFound();
  if (!prompt) return <div className="h-40" />;

  const author = snap.users.find((u) => u.username === prompt.authorUsername);
  const responses = responsesForPrompt(snap, prompt.id);

  const isAuthor = me?.username === prompt.authorUsername;

  return (
    <div className="space-y-8 pt-2">
      <section className="rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/60 p-6 sm:p-7">
        {author ? (
          <div className="flex items-center justify-between">
            <Link
              href={`/u/${author.username}`}
              className="flex items-center gap-3"
            >
              <Avatar src={author.avatar} name={author.name} size={40} />
              <div className="leading-tight">
                <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
                  {author.name}
                </div>
                <div className="text-xs text-[color:var(--color-ink-400)]">
                  @{author.username} · {timeAgo(prompt.createdAt)}
                </div>
              </div>
            </Link>
            <CategoryChip category={prompt.category} />
          </div>
        ) : null}

        {prompt.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={prompt.image}
            alt=""
            className="mt-5 aspect-[16/10] w-full rounded-2xl object-cover"
          />
        ) : null}

        <p className="mt-5 font-serif text-2xl leading-snug text-[color:var(--color-ink-900)] sm:text-3xl">
          “{prompt.question}”
        </p>
      </section>

      {!isAuthor ? (
        <ResponseForm
          promptId={prompt.id}
          authorName={author?.name?.split(" ")[0] ?? "them"}
          isSignedIn={!!me}
          meUsername={me?.username}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)]/30 p-5 text-sm text-[color:var(--color-ink-500)]">
          This is your question. Reflections from others will appear below —
          you can pin the ones that hit something true.
        </div>
      )}

      <section>
        <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
          {responses.length === 0
            ? "No reflections yet."
            : `${responses.length} reflection${responses.length === 1 ? "" : "s"}`}
        </h2>
        {responses.length === 0 ? (
          <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
            Be specific. Be honest. Write the thing you&apos;d say to them in
            person but don&apos;t usually get the chance to.
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {responses.map((r) => {
            const responder = snap.users.find(
              (u) => u.username === r.responderUsername,
            );
            return (
              <ResponseCard
                key={r.id}
                response={r}
                responder={responder ?? null}
                canPin={isAuthor}
                onTogglePin={() => togglePinResponse(r.id)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ResponseForm({
  promptId,
  authorName,
  isSignedIn,
  meUsername,
}: {
  promptId: string;
  authorName: string;
  isSignedIn: boolean;
  meUsername?: string;
}) {
  const [text, setText] = useState("");
  const [traits, setTraits] = useState<Trait[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isSignedIn) {
    return (
      <div className="rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-6 text-center sm:p-8">
        <p className="font-serif text-lg italic text-[color:var(--color-ink-700)]">
          Make a profile to write a reflection.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-500)]">
          So {authorName} knows who said it (unless you choose to stay
          anonymous).
        </p>
        <Link
          href="/onboarding"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
        >
          Make profile
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-6 text-center sm:p-8">
        <p className="font-serif text-lg italic text-[color:var(--color-sage-700)]">
          Your reflection is in.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-700)]">
          {authorName} can pin it if it lands. You can write another from any
          prompt on the feed.
        </p>
      </div>
    );
  }

  const len = text.trim().length;
  const tooShort = len < MIN_LEN;

  function handleToggle(t: Trait) {
    setTraits((curr) =>
      curr.includes(t)
        ? curr.filter((x) => x !== t)
        : curr.length >= 3
          ? curr
          : [...curr, t],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tooShort || !meUsername) return;
    addResponse({
      id: generateId("r"),
      promptId,
      responderUsername: meUsername,
      text: text.trim(),
      traits,
      anonymous,
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-5 sm:p-6"
    >
      <div>
        <p className="text-sm font-medium text-[color:var(--color-ink-700)]">
          Write your reflection for {authorName}
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-ink-400)]">
          Be specific. Aim for the kind of thing only you would say.
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
              onClick={() => handleToggle(t)}
            />
          ))}
        </div>
      </div>

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
          disabled={tooShort}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
          Send reflection
        </button>
      </div>
    </form>
  );
}
