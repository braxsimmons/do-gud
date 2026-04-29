import clsx from "clsx";

export function TraitChip({
  trait,
  selected,
  onClick,
  size = "md",
}: {
  trait: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={clsx(
        "inline-flex items-center rounded-full border transition",
        size === "sm"
          ? "px-2 py-0.5 text-[11px]"
          : "px-3 py-1 text-xs font-medium",
        selected
          ? "border-[color:var(--color-sage-700)] bg-[color:var(--color-sage-700)] text-[color:var(--color-cream-50)]"
          : "border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)] text-[color:var(--color-ink-700)]",
        onClick &&
          !selected &&
          "hover:border-[color:var(--color-sage-300)] hover:bg-[color:var(--color-sage-100)]",
      )}
    >
      {trait}
    </Tag>
  );
}
