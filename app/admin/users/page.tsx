import Link from "next/link";
import { db } from "@/lib/db";
import { Avatar } from "@/components/avatar";
import { UserRowControls } from "./controls";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const where = q
    ? {
        OR: [
          { username: { contains: q, mode: "insensitive" as const } },
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};
  const users = await db.user.findMany({
    where,
    orderBy: { joinedAt: "desc" },
    take: 100,
    include: {
      _count: { select: { prompts: true, responses: true, dropsSent: true, dropsReceived: true } },
    },
  });

  return (
    <div className="space-y-5">
      <form className="flex items-center gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name, username, or email"
          className="w-full rounded-xl border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3 py-2 text-sm text-[color:var(--color-ink-900)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[color:var(--color-ink-900)] px-4 py-2 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
        >
          Search
        </button>
      </form>

      {users.length === 0 ? (
        <p className="text-sm text-[color:var(--color-ink-500)]">
          No users yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/u/${u.username}`}
                  className="flex min-w-0 items-center gap-3"
                >
                  <Avatar src={u.avatar} name={u.name} size={36} />
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-sm font-medium text-[color:var(--color-ink-900)]">
                      {u.name}{" "}
                      {u.role === "admin" ? (
                        <span className="ml-1 rounded-full bg-[color:var(--color-rose-100)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--color-rose-500)]">
                          admin
                        </span>
                      ) : null}
                    </div>
                    <div className="truncate text-xs text-[color:var(--color-ink-400)]">
                      @{u.username} · {u.email}
                    </div>
                  </div>
                </Link>
                <UserRowControls
                  userId={u.id}
                  username={u.username}
                  isAdmin={u.role === "admin"}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[color:var(--color-ink-400)]">
                <span>{u._count.prompts} prompts</span>
                <span>{u._count.responses} reflections written</span>
                <span>{u._count.dropsSent} drops sent</span>
                <span>{u._count.dropsReceived} drops received</span>
                <span>joined {new Date(u.joinedAt).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
