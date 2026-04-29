import Link from "next/link";
import { Plus, User as UserIcon, Sparkles, Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { getActiveDrop } from "@/lib/queries";

export async function Header() {
  const [me, drop] = await Promise.all([getCurrentUser(), getActiveDrop()]);
  const admin = isAdminUser(me);

  return (
    <header className="sticky top-0 z-30 -mx-5 flex items-center justify-between border-b border-[color:var(--color-ink-200)]/50 bg-[color:var(--color-cream-50)]/85 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
      <Link href="/" className="group flex items-baseline gap-1.5">
        <span className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--color-ink-900)]">
          Do
        </span>
        <span className="font-serif text-2xl font-semibold tracking-tight italic text-[color:var(--color-sage-700)]">
          Güd
        </span>
      </Link>

      <nav className="flex items-center gap-1.5">
        {drop ? (
          <Link
            href="/drop"
            className="hidden items-center gap-1.5 rounded-full bg-[color:var(--color-sage-100)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-sage-700)] hover:bg-[color:var(--color-sage-300)]/70 sm:inline-flex"
          >
            <Sparkles size={14} className="softpulse" />
            Drop
          </Link>
        ) : null}
        {me ? (
          <>
            {admin ? (
              <Link
                href="/admin"
                aria-label="Admin"
                className="rounded-full p-2 text-[color:var(--color-ink-500)] hover:bg-[color:var(--color-cream-200)] hover:text-[color:var(--color-rose-500)]"
                title="Admin"
              >
                <Shield size={15} />
              </Link>
            ) : null}
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-3.5 py-1.5 text-sm font-medium text-[color:var(--color-cream-50)] transition hover:bg-[color:var(--color-sage-700)]"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Ask</span>
            </Link>
            <Link
              href="/me"
              aria-label="Your reflection hub"
              className="rounded-full p-1 transition hover:ring-2 hover:ring-[color:var(--color-sage-300)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={me.avatar}
                alt={me.name}
                className="h-8 w-8 rounded-full bg-[color:var(--color-cream-100)] object-cover"
              />
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--color-ink-700)] hover:text-[color:var(--color-sage-700)]"
            >
              Sign in
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink-900)] px-3.5 py-1.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
            >
              <UserIcon size={14} strokeWidth={2.5} />
              Join
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
