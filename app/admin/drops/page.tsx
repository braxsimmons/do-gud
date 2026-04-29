import Link from "next/link";
import { getRecentDrops, getActiveDrop } from "@/lib/queries";
import { CreateDropForm } from "./create-form";

export default async function AdminDropsPage() {
  const [drops, active] = await Promise.all([
    getRecentDrops(50),
    getActiveDrop(),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          Schedule a drop
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-ink-500)]">
          A drop opens at the time you set and stays open for the duration. The
          banner appears across the app for everyone signed in.
        </p>
        <CreateDropForm />
      </section>

      <section>
        <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          All drops
        </h2>
        {drops.length === 0 ? (
          <p className="mt-3 text-sm text-[color:var(--color-ink-500)]">
            No drops yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {drops.map((d) => {
              const now = Date.now();
              const isActive =
                new Date(d.opensAt).getTime() <= now &&
                new Date(d.closesAt).getTime() > now;
              const isFuture = new Date(d.opensAt).getTime() > now;
              const status = isActive
                ? { label: "Live", tone: "sage" }
                : isFuture
                  ? { label: "Scheduled", tone: "amber" }
                  : { label: "Closed", tone: "ink" };
              const tone =
                status.tone === "sage"
                  ? "bg-[color:var(--color-sage-700)] text-[color:var(--color-cream-50)]"
                  : status.tone === "amber"
                    ? "bg-[color:var(--color-amber-100)] text-[color:var(--color-amber-500)]"
                    : "bg-[color:var(--color-ink-200)] text-[color:var(--color-ink-700)]";
              return (
                <li
                  key={d.id}
                  className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/admin/drops/${d.id}`}
                      className="min-w-0 flex-1"
                    >
                      <p className="line-clamp-2 font-serif text-base text-[color:var(--color-ink-900)] hover:text-[color:var(--color-sage-700)]">
                        “{d.prompt}”
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--color-ink-400)]">
                        {new Date(d.opensAt).toLocaleString()} →{" "}
                        {new Date(d.closesAt).toLocaleString()} ·{" "}
                        {d._count.reflections} reflections
                      </p>
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tone}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {active ? (
          <p className="mt-3 text-xs text-[color:var(--color-ink-400)]">
            Note: only one drop can be live at a time. Scheduling a new one
            during an active drop will create overlap.
          </p>
        ) : null}
      </section>
    </div>
  );
}
