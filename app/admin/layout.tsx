import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!isAdminUser(me)) redirect("/");

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-rose-500)]">
            Admin
          </p>
          <h1 className="mt-1 font-serif text-2xl text-[color:var(--color-ink-900)]">
            Do Güd control room
          </h1>
        </div>
        <span className="hidden rounded-full bg-[color:var(--color-ink-900)] px-3 py-1 text-xs font-medium text-[color:var(--color-cream-50)] sm:inline-flex">
          @{me!.username}
        </span>
      </div>

      <nav className="-mx-1 flex flex-wrap gap-1 overflow-x-auto rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-1 text-sm">
        <AdminLink href="/admin">Overview</AdminLink>
        <AdminLink href="/admin/drops">Drops</AdminLink>
        <AdminLink href="/admin/users">Users</AdminLink>
        <AdminLink href="/admin/content">Content</AdminLink>
      </nav>

      {children}
    </div>
  );
}

function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-1.5 font-medium text-[color:var(--color-ink-700)] hover:bg-[color:var(--color-cream-200)] hover:text-[color:var(--color-ink-900)]"
    >
      {children}
    </Link>
  );
}
