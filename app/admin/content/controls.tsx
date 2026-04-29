"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { adminDeletePrompt, adminDeleteResponse } from "@/lib/actions";

export function ContentControls({
  type,
  id,
}: {
  type: "prompt" | "response";
  id: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete this ${type}?`)) return;
        startTransition(async () => {
          const fn = type === "prompt" ? adminDeletePrompt : adminDeleteResponse;
          const r = await fn(id);
          if (r.ok) router.refresh();
        });
      }}
      className="shrink-0 rounded-full border border-[color:var(--color-rose-300)] bg-[color:var(--color-cream-50)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-rose-500)] hover:bg-[color:var(--color-rose-100)] disabled:opacity-50"
    >
      Delete
    </button>
  );
}
