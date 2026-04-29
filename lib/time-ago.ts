/** Client-safe time formatter (no DB imports). */
export function timeAgo(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const dy = Math.floor(h / 24);
  if (dy < 7) return `${dy}d`;
  const w = Math.floor(dy / 7);
  if (w < 5) return `${w}w`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
