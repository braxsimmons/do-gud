import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 pt-12 text-center">
      <p className="font-serif text-5xl italic text-[color:var(--color-sage-700)]">
        404
      </p>
      <p className="text-sm text-[color:var(--color-ink-500)]">
        That page hasn&apos;t been written yet.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-full bg-[color:var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-sage-700)]"
      >
        Back to feed
      </Link>
    </div>
  );
}
