"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  adminDeletePrompt,
  adminDeleteResponse,
  adminDeleteDropReflection,
  adminBanUser,
  adminResolveReport,
} from "@/lib/actions";

export function ReportRowControls({
  reportId,
  targetType,
  targetId,
  status,
}: {
  reportId: string;
  targetType: string;
  targetId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function dismiss() {
    startTransition(async () => {
      await adminResolveReport({ reportId, action: "dismissed" });
      router.refresh();
    });
  }
  function removeContent() {
    startTransition(async () => {
      if (targetType === "response") await adminDeleteResponse(targetId);
      if (targetType === "drop_reflection") await adminDeleteDropReflection(targetId);
      if (targetType === "prompt") await adminDeletePrompt(targetId);
      if (targetType === "user") await adminBanUser(targetId);
      await adminResolveReport({ reportId, action: "actioned" });
      router.refresh();
    });
  }

  if (status !== "pending") return null;

  return (
    <div className="mt-3 flex flex-wrap justify-end gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={dismiss}
        className="rounded-full border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-3 py-1 text-xs font-medium text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)] disabled:opacity-50"
      >
        Dismiss
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const verb = targetType === "user" ? "ban this user" : `remove this ${targetType}`;
          if (!confirm(`Are you sure you want to ${verb}?`)) return;
          removeContent();
        }}
        className="rounded-full border border-[color:var(--color-rose-300)] bg-[color:var(--color-cream-50)] px-3 py-1 text-xs font-medium text-[color:var(--color-rose-500)] hover:bg-[color:var(--color-rose-100)] disabled:opacity-50"
      >
        {targetType === "user" ? "Ban user" : `Remove ${targetType}`}
      </button>
    </div>
  );
}
