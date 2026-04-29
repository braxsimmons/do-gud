import { CATEGORY_META, type PromptCategory } from "@/lib/types";
import clsx from "clsx";

const tones: Record<PromptCategory, string> = {
  strengths:
    "bg-[color:var(--color-sage-100)] text-[color:var(--color-sage-700)]",
  personality:
    "bg-[color:var(--color-amber-100)] text-[color:var(--color-amber-500)]",
  "first-impressions":
    "bg-[color:var(--color-rose-100)] text-[color:var(--color-rose-500)]",
  "hidden-talents":
    "bg-[color:var(--color-violet-100)] text-[color:var(--color-violet-500)]",
  growth: "bg-[color:var(--color-sky-100)] text-[color:var(--color-sky-500)]",
};

export function CategoryChip({
  category,
  className,
}: {
  category: PromptCategory;
  className?: string;
}) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        tones[category],
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
