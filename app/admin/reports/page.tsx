import { db } from "@/lib/db";
import { ReportRowControls } from "./controls";

export const dynamic = "force-dynamic";

const REASON_LABEL: Record<string, string> = {
  spam: "Spam",
  hateful: "Hate speech",
  harassment: "Harassment",
  sexual: "Sexual",
  self_harm: "Self-harm",
  other: "Other",
};

const TARGET_LABEL: Record<string, string> = {
  response: "Reflection",
  prompt: "Prompt",
  drop_reflection: "Drop reflection",
  user: "User",
};

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const status = statusParam ?? "pending";

  const reports = await db.report.findMany({
    where: status === "all" ? {} : { status },
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { reporter: { select: { username: true, name: true } } },
  });

  // Eager-load target content for context
  const responseIds = reports
    .filter((r) => r.targetType === "response")
    .map((r) => r.targetId);
  const dropReflectionIds = reports
    .filter((r) => r.targetType === "drop_reflection")
    .map((r) => r.targetId);
  const promptIds = reports
    .filter((r) => r.targetType === "prompt")
    .map((r) => r.targetId);
  const userIds = reports
    .filter((r) => r.targetType === "user")
    .map((r) => r.targetId);

  const [responses, dropReflections, prompts, users] = await Promise.all([
    responseIds.length
      ? db.response.findMany({
          where: { id: { in: responseIds } },
          include: { responder: { select: { username: true } }, prompt: { select: { question: true } } },
        })
      : [],
    dropReflectionIds.length
      ? db.dropReflection.findMany({
          where: { id: { in: dropReflectionIds } },
          include: { sender: { select: { username: true } }, recipient: { select: { username: true } } },
        })
      : [],
    promptIds.length
      ? db.prompt.findMany({
          where: { id: { in: promptIds } },
          include: { author: { select: { username: true } } },
        })
      : [],
    userIds.length
      ? db.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, username: true, name: true },
        })
      : [],
  ]);

  const targetById = new Map<string, { snippet: string; meta: string }>();
  for (const r of responses) {
    targetById.set(r.id, {
      snippet: r.text.slice(0, 240),
      meta: `by @${r.responder?.username ?? "guest"} on “${r.prompt.question.slice(0, 60)}…”`,
    });
  }
  for (const r of dropReflections) {
    targetById.set(r.id, {
      snippet: r.text.slice(0, 240),
      meta: `from @${r.sender.username} → @${r.recipient.username}`,
    });
  }
  for (const p of prompts) {
    targetById.set(p.id, {
      snippet: p.question,
      meta: `by @${p.author.username}`,
    });
  }
  for (const u of users) {
    targetById.set(u.id, {
      snippet: `${u.name} (@${u.username})`,
      meta: "",
    });
  }

  return (
    <div className="space-y-5">
      <nav className="flex gap-1 text-sm">
        {["pending", "actioned", "dismissed", "all"].map((s) => (
          <a
            key={s}
            href={`/admin/reports?status=${s}`}
            className={
              status === s
                ? "rounded-full bg-[color:var(--color-ink-900)] px-3 py-1 font-medium text-[color:var(--color-cream-50)]"
                : "rounded-full border border-[color:var(--color-ink-200)] px-3 py-1 text-[color:var(--color-ink-700)] hover:border-[color:var(--color-sage-300)]"
            }
          >
            {s}
          </a>
        ))}
      </nav>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-100)]/30 p-6 text-center text-sm text-[color:var(--color-ink-500)]">
          Nothing in this queue.
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => {
            const target = targetById.get(r.targetId);
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-[color:var(--color-ink-200)]/70 bg-[color:var(--color-cream-100)]/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-[color:var(--color-rose-100)] px-2 py-0.5 font-medium uppercase tracking-wide text-[color:var(--color-rose-500)]">
                        {REASON_LABEL[r.reason] ?? r.reason}
                      </span>
                      <span className="rounded-full bg-[color:var(--color-cream-200)] px-2 py-0.5 text-[color:var(--color-ink-700)]">
                        {TARGET_LABEL[r.targetType] ?? r.targetType}
                      </span>
                      <span className="text-[color:var(--color-ink-400)]">
                        @{r.reporter.username} · {new Date(r.createdAt).toLocaleString()}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                          r.status === "pending"
                            ? "bg-[color:var(--color-amber-100)] text-[color:var(--color-amber-500)]"
                            : r.status === "actioned"
                              ? "bg-[color:var(--color-sage-700)] text-[color:var(--color-cream-50)]"
                              : "bg-[color:var(--color-ink-200)] text-[color:var(--color-ink-700)]"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    {target ? (
                      <>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[color:var(--color-ink-900)]">
                          {target.snippet}
                        </p>
                        {target.meta ? (
                          <p className="mt-1 text-xs text-[color:var(--color-ink-400)]">
                            {target.meta}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p className="mt-2 text-sm italic text-[color:var(--color-ink-400)]">
                        Target deleted or unavailable.
                      </p>
                    )}
                    {r.detail ? (
                      <p className="mt-2 rounded-lg border border-[color:var(--color-ink-200)] bg-[color:var(--color-cream-50)] p-2 text-xs text-[color:var(--color-ink-700)]">
                        Reporter note: {r.detail}
                      </p>
                    ) : null}
                  </div>
                </div>
                <ReportRowControls
                  reportId={r.id}
                  targetType={r.targetType}
                  targetId={r.targetId}
                  status={r.status}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
