import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CreatePromptForm } from "./create-form";

export const dynamic = "force-dynamic";

export default async function CreatePromptPage() {
  const me = await getCurrentUser();

  if (!me) {
    return (
      <div className="space-y-6 pt-6">
        <h1 className="font-serif text-3xl text-[color:var(--color-ink-900)]">
          Make a profile first.
        </h1>
        <p className="text-sm text-[color:var(--color-ink-500)]">
          You need somewhere to receive reflections.
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/onboarding"
            className="inline-flex rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
          >
            Make profile
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

  return (
    <div className="space-y-8 pt-2">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Ask a question
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          What do you want to know{" "}
          <span className="italic text-[color:var(--color-sage-700)]">
            about yourself?
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[color:var(--color-ink-500)]">
          Pick a category. The more specific the question, the more useful the
          reflections you get back.
        </p>
      </section>

      <CreatePromptForm />
    </div>
  );
}

export const metadata = { title: "Ask a question · Do Güd" };
