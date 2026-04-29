import type { Prompt, Response, Snapshot, User } from "./types";

export function userByUsername(snap: Snapshot, username: string): User | null {
  return snap.users.find((u) => u.username === username) ?? null;
}

export function promptById(snap: Snapshot, id: string): Prompt | null {
  return snap.prompts.find((p) => p.id === id) ?? null;
}

export function promptsByUser(snap: Snapshot, username: string): Prompt[] {
  return snap.prompts
    .filter((p) => p.authorUsername === username)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function responsesForPrompt(
  snap: Snapshot,
  promptId: string,
): Response[] {
  return snap.responses
    .filter((r) => r.promptId === promptId)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
}

export function pinnedResponsesForUser(
  snap: Snapshot,
  username: string,
): Response[] {
  const promptIds = new Set(
    snap.prompts.filter((p) => p.authorUsername === username).map((p) => p.id),
  );
  return snap.responses
    .filter((r) => r.pinned && promptIds.has(r.promptId))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function feedPrompts(snap: Snapshot): Prompt[] {
  return [...snap.prompts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
