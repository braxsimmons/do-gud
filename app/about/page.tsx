import Link from "next/link";

const principles = [
  {
    title: "Specific over flattering",
    body: "“You’re amazing” is noise. “You’re the person who actually remembers what people said three weeks ago” is a mirror.",
  },
  {
    title: "No numbers, no rankings",
    body: "There are no likes, no scores, no leaderboards. There’s no version of this app where one person’s reflection is worth more than another’s.",
  },
  {
    title: "Curiosity, not validation",
    body: "The point isn’t to feel good. It’s to find out something about yourself you couldn’t have seen alone.",
  },
  {
    title: "Honest is allowed",
    body: "Growth prompts let people name something you’re still becoming. That only works because the platform refuses to weaponize it.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-10 pt-2">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          How Do Güd works
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          A platform built around one question:{" "}
          <span className="italic text-[color:var(--color-sage-700)]">
            how do other people actually see me?
          </span>
        </h1>
      </section>

      <section className="space-y-4">
        <Step
          n="1"
          title="You ask"
          body="Pick a question — strengths, personality, first impressions, hidden talents, growth — and post it from your profile."
        />
        <Step
          n="2"
          title="They reflect"
          body="People in your life write back. Specifically. In their own words. They can tag a few traits if it helps."
        />
        <Step
          n="3"
          title="You keep what resonates"
          body="Pin the responses that hit something true. Over time you build a portrait of yourself shaped by the people who know you best."
        />
      </section>

      <div className="dotted-divider" />

      <section>
        <h2 className="font-serif text-2xl text-[color:var(--color-ink-900)]">
          The rules of the room
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/50 p-5"
            >
              <h3 className="font-serif text-lg text-[color:var(--color-ink-900)]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-500)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[color:var(--color-ink-900)] p-8 text-[color:var(--color-cream-100)]">
        <p className="font-serif text-2xl leading-snug">
          “The hardest thing to see is the thing everyone around you already
          knows about you.”
        </p>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-cream-50)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-900)] transition hover:bg-[color:var(--color-sage-300)]"
        >
          Make your profile →
        </Link>
      </section>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-5">
      <div className="font-serif text-3xl italic text-[color:var(--color-sage-700)]">
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
    </div>
  );
}
