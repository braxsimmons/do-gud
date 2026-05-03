import "server-only";
import { headers } from "next/headers";
import { db } from "./db";

export type RateLimitKind =
  | "signup"
  | "login"
  | "create_prompt"
  | "create_response"
  | "drop_reflection"
  | "report";

const LIMITS: Record<
  RateLimitKind,
  { count: number; windowSec: number }
> = {
  signup: { count: 3, windowSec: 60 * 60 }, // 3 / hr per IP
  login: { count: 10, windowSec: 60 * 15 }, // 10 / 15 min per IP
  create_prompt: { count: 8, windowSec: 60 * 60 }, // 8 / hr per user
  create_response: { count: 30, windowSec: 60 * 60 }, // 30 / hr per user-or-IP
  drop_reflection: { count: 25, windowSec: 60 * 60 },
  report: { count: 20, windowSec: 60 * 60 },
};

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function checkRateLimit(
  kind: RateLimitKind,
  identifier: string,
): Promise<{ ok: true } | { ok: false; retryInSec: number }> {
  const cfg = LIMITS[kind];
  const bucket = `${kind}:${identifier}`;
  const now = new Date();

  // Quick path: try to upsert with conditional reset.
  const existing = await db.rateLimit.findUnique({ where: { bucket } });

  if (!existing || existing.resetAt <= now) {
    await db.rateLimit.upsert({
      where: { bucket },
      update: {
        count: 1,
        resetAt: new Date(now.getTime() + cfg.windowSec * 1000),
      },
      create: {
        bucket,
        count: 1,
        resetAt: new Date(now.getTime() + cfg.windowSec * 1000),
      },
    });
    return { ok: true };
  }

  if (existing.count >= cfg.count) {
    return {
      ok: false,
      retryInSec: Math.max(
        1,
        Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000),
      ),
    };
  }

  await db.rateLimit.update({
    where: { bucket },
    data: { count: { increment: 1 } },
  });
  return { ok: true };
}

export async function purgeExpiredRateLimits() {
  await db.rateLimit.deleteMany({ where: { resetAt: { lte: new Date() } } });
}
