"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { adminEndDrop, adminDeleteDrop } from "@/lib/actions";

export function DropAdminControls({
  dropId,
  isActive,
}: {
  dropId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {isActive ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await adminEndDrop(dropId);
              if (res.ok) router.refresh();
            })
          }
          className="rounded-full bg-[color:var(--color-ink-900)] px-4 py-1.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)] disabled:opacity-50"
        >
          End drop now
        </button>
      ) : null}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this drop and all reflections inside it?")) return;
          startTransition(async () => {
            const res = await adminDeleteDrop(dropId);
            if (res.ok && res.redirectTo) router.push(res.redirectTo);
          });
        }}
        className="rounded-full border border-[color:var(--color-rose-300)] bg-[color:var(--color-cream-50)] px-4 py-1.5 text-sm font-medium text-[color:var(--color-rose-500)] hover:bg-[color:var(--color-rose-100)] disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
