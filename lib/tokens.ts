import "server-only";
import { db } from "./db";

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomToken(len = 40) {
  const arr = new Uint8Array(len);
  if (typeof crypto !== "undefined") crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHA[arr[i] % ALPHA.length];
  return out;
}

export async function createVerificationToken(opts: {
  userId: string;
  purpose?: string;
  ttlMinutes?: number;
}) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + (opts.ttlMinutes ?? 60 * 24) * 60 * 1000);
  await db.verificationToken.create({
    data: {
      userId: opts.userId,
      token,
      purpose: opts.purpose ?? "email_verification",
      expiresAt,
    },
  });
  return token;
}

export async function consumeToken(token: string, purpose: string) {
  const row = await db.verificationToken.findUnique({ where: { token } });
  if (!row) return null;
  if (row.purpose !== purpose) return null;
  if (row.expiresAt < new Date()) return null;
  await db.verificationToken.delete({ where: { token } });
  return row;
}
