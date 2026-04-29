import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const me = await getCurrentUser();
  if (me) redirect("/me");

  return (
    <div className="space-y-10 pt-2">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Sign in
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--color-ink-900)] sm:text-4xl">
          Welcome back.
        </h1>
      </section>

      <LoginForm />

      <p className="text-center text-sm text-[color:var(--color-ink-500)]">
        New here?{" "}
        <Link
          href="/onboarding"
          className="text-[color:var(--color-sage-700)] hover:underline"
        >
          Make a profile
        </Link>
        .
      </p>
    </div>
  );
}
