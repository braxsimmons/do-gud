import clsx from "clsx";

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src: string;
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={clsx(
        "rounded-full bg-[color:var(--color-cream-100)] object-cover ring-1 ring-[color:var(--color-ink-200)]/60",
        className,
      )}
    />
  );
}
