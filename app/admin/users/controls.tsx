"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  adminDeleteUser,
  adminPromoteUser,
  adminDemoteUser,
  adminBanUser,
  adminUnbanUser,
} from "@/lib/actions";

export function UserRowControls({
  userId,
  username,
  isAdmin,
  banned,
}: {
  userId: string;
  username: string;
  isAdmin: boolean;
  banned: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      {banned ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const r = await adminUnbanUser(userId);
              if (r.ok) router.refresh();
            })
          }
          className="rounded-full border border-[color:var(--color-amber-300)] bg-[color:var(--color-cream-50)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-amber-500)] hover:bg-[color:var(--color-amber-100)]"
        >
          Unban
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm(`Ban @${username}? They'll be unable to sign in or post.`)) return;
            startTransition(async () => {
              const r = await adminBanUser(userId);
              if (r.ok) router.refresh();
            });
          }}
          className="rounded-full border border-[color:var(--color-amber-300)] bg-[color:var(--color-cream-50)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-amber-500)] hover:bg-[color:var(--color-amber-100)]"
        >
          Ban
        </button>
      )}

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
