"use client";

import Link from "next/link";
import type { Response, User } from "@/lib/types";
import { Avatar } from "./avatar";
import { TraitChip } from "./trait-chip";
import { timeAgo } from "@/lib/queries";
import { Pin, PinOff } from "lucide-react";
import clsx from "clsx";

export function ResponseCard({
  response,
  responder,
  canPin,
  onTogglePin,
}: {
  response: Response;
  responder: User | null;
  canPin?: boolean;
  onTogglePin?: () => void;
}) {
  const anonymous = response.anonymous || !responder;

  return (
    <article
      className={clsx(
        "rounded-2xl border p-4 sm:p-5",
        response.pinned
          ? "border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60"
          : "border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {anonymous ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-cream-200)] text-sm font-medium text-[color:var(--color-ink-500)] ring-1 ring-[color:var(--color-ink-200)]/60">
              ?
            </div>
          ) : (
            <Avatar src={responder.avatar} name={responder.name} size={36} />
          )}
          <div className="leading-tight">
            <div className="text-sm font-medium text-[color:var(--color-ink-900)]">
              {anonymous ? "Anonymous" : responder.name}
            </div>
            <div className="text-xs text-[color:var(--color-ink-400)]">
              {anonymous ? (
                "private reflection"
              ) : (
                <Link
                  href={`/u/${responder.username}`}
                  className="hover:text-[color:var(--color-sage-700)]"
                >
                  @{responder.username}
                </Link>
              )}{" "}
              · {timeAgo(response.createdAt)}
            </div>
          </div>
        </div>

        {canPin ? (
          <button
            type="button"
            onClick={onTogglePin}
            aria-label={response.pinned ? "Unpin reflection" : "Pin reflection"}
            className={clsx(
              "rounded-full p-1.5 text-[color:var(--color-ink-400)] transition",
              "hover:bg-[color:var(--color-cream-200)] hover:text-[color:var(--color-sage-700)]",
              response.pinned && "text-[color:var(--color-sage-700)]",
            )}
          >
            {response.pinned ? <Pin size={16} /> : <PinOff size={16} />}
          </button>
        ) : response.pinned ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-sage-700)]/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[color:var(--color-sage-700)]">
            <Pin size={11} /> pinned
          </span>
        ) : null}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-[color:var(--color-ink-700)]">
        {response.text}
      </p>

      {response.traits.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {response.traits.map((t) => (
            <TraitChip key={t} trait={t} size="sm" />
          ))}
        </div>
      ) : null}
    </article>
  );
}
