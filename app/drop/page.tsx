import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import {
  getActiveDrop,
  getNextScheduledDrop,
  listUsers,
} from "@/lib/queries";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DropForm } from "./drop-form";
import { CountdownClient } from "./countdown-client";

export const dynamic = "force-dynamic";

export default async function DropPage() {
  const me = await getCurrentUser();
  const drop = await getActiveDrop();

  if (!drop) {
    const next = await getNextScheduledDrop();
    return (
      <div className="space-y-8 pt-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
            Reflection Drop
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
            No drop is open right now.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[color:var(--color-ink-500)]">
            Once a day, a reflection prompt opens for everyone. You pick someone
            you know, write a short note, and they get it. We&apos;ll let you
            know when the next one starts.
          </p>
        </div>

        {next ? (
          <div className="rounded-3xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-6 sm:p-7">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-sage-700)]">
              <Clock size={13} /> Next drop
            </div>
            <p className="mt-3 font-serif text-xl leading-snug text-[color:var(--color-ink-900)]">
              Opens{" "}
              <CountdownClient targetIso={next.opensAt.toISOString()} verb="in" />
            </p>
            <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
              {new Date(next.opensAt).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)]/30 p-6 text-sm text-[color:var(--color-ink-500)]">
            No drops scheduled yet. Check back soon.
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-ink-200)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
        >
          Back to feed <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="space-y-6 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-sage-700)]">
            <Sparkles size={13} /> Drop is live
          </div>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
            “{drop.prompt}”
          </h1>
          <p className="mt-3 text-sm text-[color:var(--color-ink-500)]">
            Closes{" "}
            <CountdownClient
              targetIso={drop.closesAt.toISOString()}
              verb="in"
            />
            . Make a profile to take part.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
          >
            Make a profile
          </Link>
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm text-[color:var(--color-ink-500)] hover:text-[color:var(--color-ink-900)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const alreadySent = await db.dropReflection.findMany({
    where: { dropId: drop.id, senderId: me.id },
    include: { recipient: true },
    orderBy: { createdAt: "desc" },
  });
  const sentToIds = new Set(alreadySent.map((r) => r.recipientId));

  const users = await listUsers(undefined, 200);
  const recipientChoices = users.filter(
    (u) => u.id !== me.id && !sentToIds.has(u.id),
  );

  return (
    <div className="space-y-8 pt-2">
      <section>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-sage-700)]">
          <Sparkles size={13} /> Drop is live · closes{" "}
          <CountdownClient targetIso={drop.closesAt.toISOString()} verb="in" />
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          “{drop.prompt}”
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[color:var(--color-ink-500)]">
          Pick one person. Write the kind of thing you&apos;d say to them in
          person but rarely do. They&apos;ll get it as soon as you send it.
        </p>
      </section>

      {alreadySent.length > 0 ? (
        <section className="rounded-2xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-5">
          <p className="text-sm font-medium text-[color:var(--color-sage-700)]">
            You&apos;ve sent {alreadySent.length} reflection
            {alreadySent.length === 1 ? "" : "s"} this drop.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {alreadySent.map((r) => (
              <li
                key={r.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-cream-50)] px-3 py-1 text-xs font-medium text-[color:var(--color-ink-700)]"
              >
                @{r.recipient.username}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <DropForm
        dropId={drop.id}
        recipients={recipientChoices}
        meUsername={me.username}
      />
    </div>
  );
}
