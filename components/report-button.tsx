"use client";

import { useState, useTransition } from "react";
import { Flag, X } from "lucide-react";
import { reportContent } from "@/lib/actions";

const REASONS = [
  { value: "spam", label: "Spam or promotional" },
  { value: "hateful", label: "Hate speech or slurs" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "sexual", label: "Sexual or inappropriate" },
  { value: "self_harm", label: "Self-harm" },
  { value: "other", label: "Something else" },
] as const;

type TargetType = "response" | "prompt" | "drop_reflection" | "user";

export function ReportButton({
  targetType,
  targetId,
}: {
  targetType: TargetType;
  targetId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [detail, setDetail] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!reason) {
      setError("Pick a reason.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("targetType", targetType);
    fd.set("targetId", targetId);
    fd.set("reason", reason);
    if (detail) fd.set("detail", detail);
    startTransition(async () => {
      const r = await reportContent(fd);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setReason("");
        setDetail("");
      }, 1500);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-[11px] text-[color:var(--color-ink-400)] hover:text-[color:var(--color-rose-500)]"
      >
        <Flag size={11} />
        Report
      </button>
    );
  }

  if (done) {
    return (
      <p className="text-[11px] text-[color:var(--color-sage-700)]">
        Thanks. We&apos;ll review.
      </p>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-50)] p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink-500)]">
          Report this
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="rounded-full p-1 text-[color:var(--color-ink-400)] hover:text-[color:var(--color-ink-900)]"
        >
          <X size={12} />
        </button>
      </div>
      <div className="mt-2 space-y-1.5">
        {REASONS.map((r) => (
          <label
            key={r.value}
            className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-[color:var(--color-cream-100)]"
          >
            <input
              type="radio"
              name="reason"
              value={r.value}
              checked={reason === r.value}
              onChange={(e) => setReason(e.target.value)}
              className="h-3.5 w-3.5 accent-[color:var(--color-sage-700)]"
            />
            <span className="text-[color:var(--color-ink-700)]">{r.label}</span>
          </label>
        ))}
      </div>
      <textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Optional detail"
        rows={2}
        maxLength={500}
        className="mt-2 w-full resize-none rounded-lg border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] px-2.5 py-1.5 text-xs text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:border-[color:var(--color-sage-300)] focus:outline-none"
      />
      {error ? (
        <p className="mt-2 text-xs text-[color:var(--color-rose-500)]">{error}</p>
      ) : null}
      <div className="mt-3 flex justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-3 py-1 text-xs text-[color:var(--color-ink-500)] hover:text-[color:var(--color-ink-900)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={pending || !reason}
          className="rounded-full bg-[color:var(--color-ink-900)] px-3 py-1 text-xs font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-rose-500)] disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send report"}
        </button>
      </div>
    </div>
  );
}
