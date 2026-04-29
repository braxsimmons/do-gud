"use client";

import { useTransition } from "react";
import { Pin, PinOff, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Avatar } from "@/components/avatar";
import { TraitChip } from "@/components/trait-chip";
import { timeAgo } from "@/lib/time-ago";
import { toggleDropPin } from "@/lib/actions";

type R = {
  id: string;
  text: string;
  traits: string[];
  pinned: boolean;
  createdAt: Date | string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  drop: {
    id: string;
    prompt: string;
  };
};

export function DropReflectionCard({ reflection: r }: { reflection: R }) {
  const [pending, startTransition] = useTransition();

  return (
    <article
      className={clsx(
        "rounded-2xl border p-4 sm:p-5",
        r.pinned
          ? "border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60"
          : "border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar src={r.sender.avatar} name={r.sender.name} size={36} />
          <div className="leading-tight">
            <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
              {r.sender.name}
            </div>
            <div className="text-xs text-[color:var(--color-ink-400)]">
              @{r.sender.username} · {timeAgo(r.createdAt)}
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await toggleDropPin(r.id);
            })
          }
          aria-label={r.pinned ? "Unpin reflection" : "Pin reflection"}
          className={clsx(
            "rounded-full p-1.5 transition",
            "hover:bg-[color:var(--color-cream-200)] hover:text-[color:var(--color-sage-700)]",
            r.pinned
              ? "text-[color:var(--color-sage-700)]"
              : "text-[color:var(--color-ink-400)]",
            pending && "opacity-50",
          )}
        >
          {r.pinned ? <Pin size={16} /> : <PinOff size={16} />}
        </button>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-[color:var(--color-ink-700)]">
        {r.text}
      </p>

      {r.traits.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {r.traits.map((t) => (
            <TraitChip key={t} trait={t} size="sm" />
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-1.5 text-xs text-[color:var(--color-ink-400)]">
        <Sparkles size={11} className="text-[color:var(--color-sage-700)]" />
        From the drop: <em className="italic">“{r.drop.prompt}”</em>
      </div>
    </article>
  );
}
