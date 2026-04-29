import "server-only";
import { db } from "./db";

export async function getFeedPrompts(limit = 50) {
  return db.prompt.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      _count: { select: { responses: true } },
    },
  });
}

export async function getPromptById(id: string) {
  return db.prompt.findUnique({
    where: { id },
    include: {
      author: true,
      responses: {
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        include: { responder: true },
      },
    },
  });
}

export async function getUserByUsername(username: string) {
  return db.user.findUnique({
    where: { username },
    include: {
      prompts: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { responses: true } } },
      },
    },
  });
}

export async function getPinnedReflectionsForUser(userId: string) {
  return db.response.findMany({
    where: { pinned: true, prompt: { authorId: userId } },
    orderBy: { createdAt: "desc" },
    include: { responder: true, prompt: true },
  });
}

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
