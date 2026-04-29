import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getActiveDrop } from "@/lib/queries";
import { CountdownClient } from "@/app/drop/countdown-client";

export async function DropBanner() {
  const drop = await getActiveDrop();
  if (!drop) return null;

  return (
    <Link
      href="/drop"
      className="group block rounded-2xl border border-[color:var(--color-sage-300)] bg-[color:var(--color-sage-100)]/70 p-4 transition hover:border-[color:var(--color-sage-700)] hover:bg-[color:var(--color-sage-100)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-sage-700)]">
            <Sparkles size={13} className="softpulse" />
            Drop is live
            <span className="text-[color:var(--color-ink-400)]">
              ·{" "}
              <CountdownClient
                targetIso={drop.closesAt.toISOString()}
                verb="in"
              />
            </span>
          </div>
          <p className="mt-1 line-clamp-1 font-serif text-base text-[color:var(--color-ink-900)] sm:text-lg">
            “{drop.prompt}”
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-[color:var(--color-sage-700)] sm:inline-flex">
          Join <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
