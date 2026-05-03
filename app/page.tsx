import Link from "next/link";
import { ArrowRight, MessageCircleQuestion, Send, Pin } from "lucide-react";
import { getFeedPrompts } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { PromptCard } from "@/components/prompt-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const me = await getCurrentUser();
  const prompts = await getFeedPrompts(me?.id);

  return (
    <div className="space-y-12">
      <section className="relative pt-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          <span className="softpulse inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-sage-500)]" />
          A quieter kind of social
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-[color:var(--color-ink-900)] sm:text-5xl">
          See yourself the way{" "}
          <span className="italic text-[color:var(--color-sage-700)]">
            others actually see you.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-500)] sm:text-base">
          Do Güd is a reflection platform. You ask the people who know you a
          specific question — about your strengths, your blind spots, the
          things you can&apos;t see in yourself — and they write back honestly.
          No likes. No scores. No comparison.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {me ? (
            <Link
              href={prompts.length === 0 ? "/welcome" : "/create"}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
            >
              {prompts.length === 0 ? "Start the first one" : "Ask a question"}{" "}
              <ArrowRight size={15} />
            </Link>
          ) : (
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
            >
              Make your profile <ArrowRight size={15} />
            </Link>
          )}
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-ink-200)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-700)] transition hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
          >
            How it works
          </Link>
        </div>
      </section>

      <div className="dotted-divider" />

      {prompts.length === 0 ? (
        <FirstUserSection signedIn={!!me} />
      ) : (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--color-ink-900)]">
                Today&apos;s reflections
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
                Recent questions. Tap one to write a response.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                author={p.author}
                responseCount={p._count.responses}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FirstUserSection({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[color:var(--color-ink-900)]">
          Nobody&apos;s asked yet.
        </h2>
        <p className="mt-2 max-w-lg text-sm text-[color:var(--color-ink-500)]">
          You&apos;re early. The first question on Do Güd should be yours —
          something you actually want to know about yourself.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <HowStep
          n="1"
          icon={<MessageCircleQuestion size={18} />}
          title="Ask"
          body="One specific question. The narrower the better."
        />
        <HowStep
          n="2"
          icon={<Send size={18} />}
          title="Share"
          body="One link. Send it to the people who know you."
        />
        <HowStep
          n="3"
          icon={<Pin size={18} />}
          title="Pin"
          body="Keep the reflections that hit something true."
        />
      </div>

      <div className="flex items-center justify-between rounded-3xl bg-[color:var(--color-ink-900)] p-6 text-[color:var(--color-cream-100)] sm:p-7">
        <div>
          <p className="font-serif text-lg leading-snug">
            Ready when you are.
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-cream-200)]/70">
            Takes about 30 seconds.
          </p>
        </div>
        <Link
          href={signedIn ? "/create" : "/onboarding"}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-cream-50)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-900)] transition hover:bg-[color:var(--color-sage-300)]"
        >
          {signedIn ? "Ask the first question" : "Make a profile"}{" "}
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function HowStep({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-4">
      <div className="flex items-center gap-2 text-[color:var(--color-sage-700)]">
        {icon}
        <span className="font-serif text-sm italic">step {n}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-[color:var(--color-ink-900)]">
        {title}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-ink-500)]">
        {body}
      </p>
    </div>
  );
}
