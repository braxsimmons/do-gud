import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPromptById, timeAgo } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { Avatar } from "@/components/avatar";
import { CategoryChip } from "@/components/category-chip";
import { ResponseCard } from "@/components/response-card";
import { ResponseForm } from "./response-form";
import { ShareCard } from "@/components/share-card";
import type { PromptCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPromptById(id);
  if (!prompt) {
    return { title: "Reflection · Do Güd" };
  }
  const title = `${prompt.author.name} is asking: “${prompt.question}”`;
  const description = "Write a specific, honest reflection. No likes, no scores.";
  const ogUrl = `/api/og/p/${prompt.id}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function PromptDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const [{ id }, sp, me] = await Promise.all([
    params,
    searchParams,
    getCurrentUser(),
  ]);
  const prompt = await getPromptById(id);
  if (!prompt) notFound();

  const isAuthor = me?.id === prompt.authorId;
  const showShare = isAuthor && (sp.new === "1" || prompt.responses.length === 0);

  return (
    <div className="space-y-8 pt-2">
      <section className="rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/60 p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <Link
            href={`/u/${prompt.author.username}`}
            className="flex items-center gap-3"
          >
            <Avatar
              src={prompt.author.avatar}
              name={prompt.author.name}
              size={40}
            />
            <div className="leading-tight">
              <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
                {prompt.author.name}
              </div>
              <div className="text-xs text-[color:var(--color-ink-400)]">
                @{prompt.author.username} · {timeAgo(prompt.createdAt)}
              </div>
            </div>
          </Link>
          <CategoryChip category={prompt.category as PromptCategory} />
        </div>

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

      {showShare ? (
        <ShareCard
          promptId={prompt.id}
          question={prompt.question}
          authorFirstName={prompt.author.name.split(" ")[0]}
        />
      ) : null}

      {!isAuthor ? (
        <ResponseForm
          promptId={prompt.id}
          authorName={prompt.author.name.split(" ")[0]}
          isSignedIn={!!me}
        />
      ) : !showShare ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)]/30 p-5 text-sm text-[color:var(--color-ink-500)]">
          This is your question. Reflections from others will appear below —
          you can pin the ones that hit something true.
        </div>
      ) : null}

      <section>
        <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
          {prompt.responses.length === 0
            ? "No reflections yet."
            : `${prompt.responses.length} reflection${prompt.responses.length === 1 ? "" : "s"}`}
        </h2>
        {prompt.responses.length === 0 ? (
          <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
            Be specific. Be honest. Write the thing you&apos;d say to them in
            person but don&apos;t usually get the chance to.
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {prompt.responses.map((r) => (
            <ResponseCard
              key={r.id}
              response={r}
              responder={r.responder}
              guestName={r.guestName}
              canPin={isAuthor}
              canReport={!!me}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
