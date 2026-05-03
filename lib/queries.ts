import "server-only";
import { db } from "./db";

export async function getFeedPrompts(viewerId?: string, limit = 50) {
  const blockedIds = viewerId
    ? (
        await db.block.findMany({
          where: { OR: [{ blockerId: viewerId }, { blockedId: viewerId }] },
          select: { blockerId: true, blockedId: true },
        })
      )
        .flatMap((b) => [b.blockerId, b.blockedId])
        .filter((id) => id !== viewerId)
    : [];

  return db.prompt.findMany({
    where: {
      removed: false,
      ...(blockedIds.length > 0 ? { authorId: { notIn: blockedIds } } : {}),
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      _count: {
        select: { responses: { where: { removed: false } } },
      },
    },
  });
}

export async function getPromptById(id: string) {
  const prompt = await db.prompt.findUnique({
    where: { id },
    include: {
      author: true,
      responses: {
        where: { removed: false },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        include: { responder: true },
      },
    },
  });
  if (!prompt || prompt.removed) return null;
  return prompt;
}

export async function getUserByUsername(username: string) {
  return db.user.findUnique({
    where: { username },
    include: {
      prompts: {
        where: { removed: false },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { responses: { where: { removed: false } } },
          },
        },
      },
    },
  });
}

export async function getPinnedReflectionsForUser(userId: string) {
  return db.response.findMany({
    where: {
      pinned: true,
      removed: false,
      prompt: { authorId: userId, removed: false },
    },
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
        where: { removed: false },
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
    include: {
      _count: { select: { reflections: { where: { removed: false } } } },
    },
  });
}

export async function getReceivedDropReflections(userId: string, limit = 20) {
  return db.dropReflection.findMany({
    where: { recipientId: userId, removed: false },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { sender: true, drop: true },
  });
}

export async function listUsers(query?: string, limit = 24, excludeBlockedFor?: string) {
  const where: Record<string, unknown> = { banned: false };
  if (query) {
    Object.assign(where, {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    });
  }
  if (excludeBlockedFor) {
    const blocks = await db.block.findMany({
      where: {
        OR: [
          { blockerId: excludeBlockedFor },
          { blockedId: excludeBlockedFor },
        ],
      },
      select: { blockerId: true, blockedId: true },
    });
    const ids = blocks
      .flatMap((b) => [b.blockerId, b.blockedId])
      .filter((id) => id !== excludeBlockedFor);
    if (ids.length > 0) {
      Object.assign(where, { id: { notIn: ids } });
    }
  }

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
  const [users, prompts, responses, drops, dropReflections, openReports] =
    await Promise.all([
      db.user.count(),
      db.prompt.count({ where: { removed: false } }),
      db.response.count({ where: { removed: false } }),
      db.reflectionDrop.count(),
      db.dropReflection.count({ where: { removed: false } }),
      db.report.count({ where: { status: "pending" } }),
    ]);
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
    openReports,
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
