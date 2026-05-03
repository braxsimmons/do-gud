import Link from "next/link";
import { redirect } from "next/navigation";
import { consumeToken } from "@/lib/tokens";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const me = await getCurrentUser();

  if (!token) {
    return Status({
      title: "Missing verification token.",
      body: "Open the link from your email again.",
      tone: "rose",
    });
  }

  const row = await consumeToken(token, "email_verification");
  if (!row) {
    return Status({
      title: "That link expired or has already been used.",
      body: me
        ? "Sign in and request a fresh verification email from your profile."
        : "Sign in and we can send you a new one.",
      tone: "rose",
      cta: { href: me ? "/me" : "/login", label: me ? "Go to your hub" : "Sign in" },
    });
  }

  await db.user.update({
    where: { id: row.userId },
    data: { emailVerified: new Date() },
  });

  if (me?.id !== row.userId) {
    redirect("/login?verified=1");
  }
  redirect("/me?verified=1");
}

function Status({
  title,
  body,
  tone,
  cta,
}: {
  title: string;
  body: string;
  tone: "sage" | "rose";
  cta?: { href: string; label: string };
}) {
  const accent =
    tone === "sage"
      ? "border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 text-[color:var(--color-sage-700)]"
      : "border-[color:var(--color-rose-300)] bg-[color:var(--color-rose-100)]/60 text-[color:var(--color-rose-500)]";
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className={`rounded-3xl border p-8 ${accent}`}>
        <p className="font-serif text-2xl italic">{title}</p>
        <p className="mt-3 text-sm text-[color:var(--color-ink-700)]">{body}</p>
        {cta ? (
          <Link
            href={cta.href}
            className="mt-5 inline-flex rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
          >
            {cta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
