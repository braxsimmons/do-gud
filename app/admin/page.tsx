import Link from "next/link";
import { adminMetrics, getActiveDrop, getRecentDrops } from "@/lib/queries";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function AdminOverviewPage() {
  const [m, active, drops] = await Promise.all([
    adminMetrics(),
    getActiveDrop(),
    getRecentDrops(5),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          Right now
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Users" value={m.users} delta={m.newUsers24h} />
          <Stat label="Prompts" value={m.prompts} delta={m.newPrompts24h} />
          <Stat
            label="Reflections"
            value={m.responses}
            delta={m.newResponses24h}
          />
          <Stat label="Drops" value={m.drops} delta={m.dropReflections} deltaLabel="sent total" />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          Drop status
        </h2>
        {active ? (
          <Link
            href={`/admin/drops/${active.id}`}
            className="mt-3 block rounded-2xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/60 p-5 hover:border-[color:var(--color-sage-700)]"
          >
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-sage-700)]">
              <Sparkles size={13} /> Live drop
            </div>
            <p className="mt-2 font-serif text-lg text-[color:var(--color-ink-900)]">
              “{active.prompt}”
            </p>
            <p className="mt-1 text-xs text-[color:var(--color-ink-500)]">
              Closes {new Date(active.closesAt).toLocaleString()}
            </p>
          </Link>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)]/30 p-5 text-sm text-[color:var(--color-ink-500)]">
            No active drop.{" "}
            <Link
              href="/admin/drops"
              className="font-medium text-[color:var(--color-sage-700)] hover:underline"
            >
              Schedule one →
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
            Recent drops
          </h2>
          <Link
            href="/admin/drops"
            className="inline-flex items-center gap-1 text-sm text-[color:var(--color-sage-700)] hover:underline"
          >
            All drops <ArrowRight size={13} />
          </Link>
        </div>

        {drops.length === 0 ? (
          <p className="mt-3 text-sm text-[color:var(--color-ink-500)]">
            No drops yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {drops.map((d) => (
              <li
                key={d.id}
                className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4"
              >
                <Link
                  href={`/admin/drops/${d.id}`}
                  className="font-serif text-base text-[color:var(--color-ink-900)] hover:text-[color:var(--color-sage-700)]"
                >
                  “{d.prompt}”
                </Link>
                <div className="mt-1 text-xs text-[color:var(--color-ink-400)]">
                  Opened {new Date(d.opensAt).toLocaleString()} ·{" "}
                  {d._count.reflections} reflections
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  deltaLabel = "in 24h",
}: {
  label: string;
  value: number;
  delta?: number;
  deltaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink-400)]">
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl text-[color:var(--color-ink-900)] tabular-nums">
        {value}
      </p>
      {typeof delta === "number" ? (
        <p className="mt-0.5 text-xs text-[color:var(--color-sage-700)]">
          +{delta} {deltaLabel}
        </p>
      ) : null}
    </div>
  );
}
