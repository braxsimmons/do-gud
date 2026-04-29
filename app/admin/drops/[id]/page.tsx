import Link from "next/link";
import { notFound } from "next/navigation";
import { getDropById } from "@/lib/queries";
import { Avatar } from "@/components/avatar";
import { DropAdminControls } from "./controls";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDropDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drop = await getDropById(id);
  if (!drop) notFound();

  const now = Date.now();
  const isActive =
    new Date(drop.opensAt).getTime() <= now &&
    new Date(drop.closesAt).getTime() > now;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/drops"
        className="inline-flex items-center gap-1 text-sm text-[color:var(--color-ink-500)] hover:text-[color:var(--color-ink-900)]"
      >
        <ArrowLeft size={14} /> All drops
      </Link>

      <section className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-5">
        <p className="font-serif text-xl text-[color:var(--color-ink-900)]">
          “{drop.prompt}”
        </p>
        <p className="mt-2 text-xs text-[color:var(--color-ink-400)]">
          {new Date(drop.opensAt).toLocaleString()} →{" "}
          {new Date(drop.closesAt).toLocaleString()} ·{" "}
          {drop.reflections.length} reflections sent
        </p>
        <DropAdminControls dropId={drop.id} isActive={isActive} />
      </section>

      <section>
        <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          Reflections sent
        </h2>
        {drop.reflections.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
            None yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {drop.reflections.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={r.sender.avatar}
                    name={r.sender.name}
                    size={32}
                  />
                  <div className="text-sm leading-tight">
                    <span className="font-medium text-[color:var(--color-ink-900)]">
                      @{r.sender.username}
                    </span>{" "}
                    <span className="text-[color:var(--color-ink-400)]">→</span>{" "}
                    <span className="font-medium text-[color:var(--color-ink-900)]">
                      @{r.recipient.username}
                    </span>
                    <div className="text-xs text-[color:var(--color-ink-400)]">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[color:var(--color-ink-700)]">
                  {r.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
