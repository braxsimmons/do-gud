import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/onboarding");

  // If they already have a prompt, the walkthrough is done — send them to /me.
  const promptCount = await db.prompt.count({ where: { authorId: me.id } });
  if (promptCount > 0) redirect("/me");

  return (
    <div className="space-y-12 pt-2">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          You&apos;re in, {me.name.split(" ")[0]}
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          Here&apos;s how Do Güd actually works.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-500)]">
          Three steps. No likes, no scores, no rankings — just the people who
          know you, writing back honestly.
        </p>
      </section>

      <ol className="space-y-3">
        <Step
          n="1"
          state="active"
          title="Ask a question"
          body="Pick something you actually want to know about yourself. Strengths. Blind spots. First impressions. The more specific, the better the answers."
        />
        <Step
          n="2"
          state="upcoming"
          title="Share it with people who know you"
          body="One link. Send it to a few friends, your sibling, a coworker who'd be honest. They write back in their own words."
        />
        <Step
          n="3"
          state="upcoming"
          title="Pin what resonates"
          body="The reflections that hit something true become your mirror — a portrait of you, written by people who actually see you."
        />
      </ol>

      <div className="flex items-center justify-between rounded-3xl bg-[color:var(--color-ink-900)] p-6 text-[color:var(--color-cream-100)] sm:p-7">
        <div>
          <p className="font-serif text-lg leading-snug">
            Ready to ask the first one?
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-cream-200)]/70">
            Takes about 30 seconds.
          </p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-cream-50)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-900)] transition hover:bg-[color:var(--color-sage-300)]"
        >
          Start <ArrowRight size={15} />
        </Link>
      </div>

      <p className="text-center text-sm text-[color:var(--color-ink-400)]">
        Or browse the{" "}
        <Link
          href="/"
          className="text-[color:var(--color-sage-700)] hover:underline"
        >
          feed
        </Link>{" "}
        first.
      </p>
    </div>
  );
}

function Step({
  n,
  state,
  title,
  body,
}: {
  n: string;
  state: "active" | "upcoming" | "done";
  title: string;
  body: string;
}) {
  return (
    <li
      className={
        state === "active"
          ? "flex gap-4 rounded-2xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-5"
          : "flex gap-4 rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-5 opacity-90"
      }
    >
      <div
        className={
          state === "active"
            ? "font-serif text-3xl italic text-[color:var(--color-sage-700)]"
            : "font-serif text-3xl italic text-[color:var(--color-ink-300)]"
        }
      >
        {n}
      </div>
      <div>
        <h3 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-ink-500)]">
          {body}
        </p>
      </div>
    </li>
  );
}
