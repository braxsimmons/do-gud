import Link from "next/link";
import type { PromptUI, UserUI } from "@/lib/types";
import { CategoryChip } from "./category-chip";
import { Avatar } from "./avatar";
import { timeAgo } from "@/lib/time-ago";
import { MessageCircle } from "lucide-react";
import type { PromptCategory } from "@/lib/types";

export function PromptCard({
  prompt,
  author,
  responseCount,
}: {
  prompt: PromptUI;
  author: UserUI;
  responseCount: number;
}) {
  return (
    <Link
      href={`/p/${prompt.id}`}
      className="group block rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-5 transition hover:border-[color:var(--color-sage-300)] hover:bg-[color:var(--color-cream-100)] sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar src={author.avatar} name={author.name} size={36} />
          <div className="leading-tight">
            <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
              {author.name}
            </div>
            <div className="text-xs text-[color:var(--color-ink-400)]">
              @{author.username} · {timeAgo(prompt.createdAt)}
            </div>
          </div>
        </div>
        <CategoryChip category={prompt.category as PromptCategory} />
      </div>

      {prompt.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={prompt.image}
          alt=""
          className="mt-4 aspect-[16/10] w-full rounded-2xl object-cover"
        />
      ) : null}

      <p className="mt-4 font-serif text-xl leading-snug text-[color:var(--color-ink-900)] sm:text-2xl">
        “{prompt.question}”
      </p>

      <div className="mt-5 flex items-center justify-between text-sm text-[color:var(--color-ink-500)]">
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle size={15} strokeWidth={2} />
          {responseCount === 0
            ? "Be the first to reflect"
            : `${responseCount} reflection${responseCount === 1 ? "" : "s"}`}
        </span>
        <span className="text-[color:var(--color-sage-700)] opacity-0 transition group-hover:opacity-100">
          Respond →
        </span>
      </div>
    </Link>
  );
}
