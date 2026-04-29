import { db } from "@/lib/db";
import { ContentControls } from "./controls";

export default async function AdminContentPage() {
  const [prompts, responses] = await Promise.all([
    db.prompt.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { username: true, name: true } },
        _count: { select: { responses: true } },
      },
    }),
    db.response.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        responder: { select: { username: true, name: true } },
        prompt: { select: { id: true, question: true, authorId: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          Recent prompts
        </h2>
        {prompts.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
            No prompts yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {prompts.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-serif text-sm text-[color:var(--color-ink-900)]">
                      “{p.question}”
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--color-ink-400)]">
                      @{p.author.username} ·{" "}
                      {new Date(p.createdAt).toLocaleString()} ·{" "}
                      {p._count.responses} reflections
                    </p>
                  </div>
                  <ContentControls type="prompt" id={p.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-serif text-lg text-[color:var(--color-ink-900)]">
          Recent reflections
        </h2>
        {responses.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
            No reflections yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {responses.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[color:var(--color-ink-400)]">
                      @{r.responder.username} on{" "}
                      <span className="italic">
                        “{r.prompt.question.slice(0, 60)}…”
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--color-ink-700)]">
                      {r.text}
                    </p>
                  </div>
                  <ContentControls type="response" id={r.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
