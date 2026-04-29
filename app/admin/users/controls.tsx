"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  adminDeleteUser,
  adminPromoteUser,
  adminDemoteUser,
} from "@/lib/actions";

export function UserRowControls({
  userId,
  username,
  isAdmin,
}: {
  userId: string;
  username: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      {isAdmin ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const r = await adminDemoteUser(userId);
              if (r.ok) router.refresh();
            })
          }
          className="rounded-full border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-ink-700)] hover:border-[color:var(--color-amber-300)]"
        >
          Demote
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const r = await adminPromoteUser(userId);
              if (r.ok) router.refresh();
            })
          }
          className="rounded-full border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)] hover:text-[color:var(--color-sage-700)]"
        >
          Make admin
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete @${username}? This cascades through all their content.`)) return;
          startTransition(async () => {
            const r = await adminDeleteUser(userId);
            if (r.ok) router.refresh();
          });
        }}
        className="rounded-full border border-[color:var(--color-rose-300)] bg-[color:var(--color-cream-50)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-rose-500)] hover:bg-[color:var(--color-rose-100)]"
      >
        Delete
      </button>
    </div>
  );
}
