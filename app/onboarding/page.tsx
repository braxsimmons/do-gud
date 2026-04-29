import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SignUpForm } from "./signup-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const me = await getCurrentUser();
  if (me) redirect("/me");

  return (
    <div className="space-y-10 pt-2">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Step 1 of 3 · Make your profile
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          A few things, then you can start asking.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[color:var(--color-ink-500)]">
          Your reflections are private to you and the people you share your
          questions with. Nothing public, nothing scored.
        </p>
      </section>

      <SignUpForm />

      <p className="text-center text-sm text-[color:var(--color-ink-500)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[color:var(--color-sage-700)] hover:underline"
        >
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}
