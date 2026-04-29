import type { ReactNode } from "react";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)]/40 p-8 text-center">
      <p className="font-serif text-lg italic text-[color:var(--color-ink-700)]">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-500)]">
        {body}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
