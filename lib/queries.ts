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

export async function getActiveDrop() {
  const now = new Date();
  return db.reflectionDrop.findFirst({
    where: { opensAt: { lte: now }, closesAt: { gt: now } },
    orderBy: { opensAt: "desc" },
  });
}

export async function getNextScheduledDrop() {
  const now = new Date();
  return db.reflectionDrop.findFirst({
    where: { opensAt: { gt: now } },
    orderBy: { opensAt: "asc" },
  });
}

export async function getDropById(id: string) {
  return db.reflectionDrop.findUnique({
    where: { id },
    include: {
      reflections: {
        orderBy: { createdAt: "desc" },
        include: { sender: true, recipient: true },
      },
    },
  });
}

export async function getRecentDrops(limit = 20) {
  return db.reflectionDrop.findMany({
    take: limit,
    orderBy: { opensAt: "desc" },
    include: { _count: { select: { reflections: true } } },
  });
}

export async function getReceivedDropReflections(userId: string, limit = 20) {
  return db.dropReflection.findMany({
    where: { recipientId: userId },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { sender: true, drop: true },
  });
}

export async function listUsers(query?: string, limit = 24) {
  const where = query
    ? {
        OR: [
          { username: { contains: query, mode: "insensitive" as const } },
          { name: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};
  return db.user.findMany({
    where,
    take: limit,
    orderBy: { joinedAt: "desc" },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      bio: true,
    },
  });
}

export async function adminMetrics() {
  const [users, prompts, responses, drops, dropReflections] = await Promise.all(
    [
      db.user.count(),
      db.prompt.count(),
      db.response.count(),
      db.reflectionDrop.count(),
      db.dropReflection.count(),
    ],
  );
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [newUsers24h, newPrompts24h, newResponses24h] = await Promise.all([
    db.user.count({ where: { joinedAt: { gte: since } } }),
    db.prompt.count({ where: { createdAt: { gte: since } } }),
    db.response.count({ where: { createdAt: { gte: since } } }),
  ]);
  return {
    users,
    prompts,
    responses,
    drops,
    dropReflections,
    newUsers24h,
    newPrompts24h,
    newResponses24h,
  };
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
