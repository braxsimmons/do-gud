"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "./db";
import {
  createSession,
  destroySession,
  getCurrentUser,
  requireUser,
} from "./auth";
import { isAdminUser } from "./admin";
import { TRAITS, type Trait, type PromptCategory } from "./types";

const VALID_CATEGORIES: PromptCategory[] = [
  "strengths",
  "personality",
  "first-impressions",
  "hidden-talents",
  "growth",
];

export type ActionResult =
  | { ok: true; redirectTo?: string }
  | { ok: false; error: string };

function avatarFor(seed: string) {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=eef2e9,f4eede,f5e6e0,e9eaf3,e3edf2`;
}

const USERNAME_RE = /^[a-z0-9_]{2,24}$/;

export async function signUp(formData: FormData): Promise<ActionResult> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const usernameRaw = (formData.get("username") as string | null) ?? "";
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const bio = ((formData.get("bio") as string | null) ?? "").trim().slice(0, 140);
  const avatarSeed =
    (formData.get("avatarSeed") as string | null) || Math.random().toString(36).slice(2);

  const username = usernameRaw.toLowerCase().replace(/[^a-z0-9_]/g, "");

  if (!name) return { ok: false, error: "Add your name." };
  if (!USERNAME_RE.test(username)) {
    return { ok: false, error: "Username must be 2–24 chars, letters/numbers/_." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Use a real email." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const existingUsername = await db.user.findUnique({ where: { username } });
  if (existingUsername) return { ok: false, error: "That username is taken." };
  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail) return { ok: false, error: "That email is already in use." };

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      username,
      email,
      bio,
      avatar: avatarFor(avatarSeed),
      passwordHash,
    },
  });

  await createSession(user.id);
  return { ok: true, redirectTo: "/welcome" };
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const identifier =
    (formData.get("identifier") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!identifier || !password) {
    return { ok: false, error: "Email/username and password required." };
  }

  const user = await db.user.findFirst({
    where: identifier.includes("@")
      ? { email: identifier }
      : { username: identifier.replace(/^@/, "") },
  });
  if (!user) return { ok: false, error: "No account matches that." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { ok: false, error: "Wrong password." };

  await createSession(user.id);
  return { ok: true, redirectTo: "/me" };
}

export async function signOut() {
  await destroySession();
  redirect("/");
}

export async function createPrompt(formData: FormData): Promise<ActionResult> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Sign in first." };

  const question = ((formData.get("question") as string | null) ?? "").trim();
  const category = (formData.get("category") as string | null) ?? "";
  const image = ((formData.get("image") as string | null) ?? "").trim();

  if (question.length < 8 || question.length > 180) {
    return { ok: false, error: "Question must be 8–180 characters." };
  }
  if (!VALID_CATEGORIES.includes(category as PromptCategory)) {
    return { ok: false, error: "Pick a category." };
  }

  const prompt = await db.prompt.create({
    data: {
      authorId: me.id,
      question,
      category,
      image: image || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/me");
  return { ok: true, redirectTo: `/p/${prompt.id}?new=1` };
}

export async function createResponse(formData: FormData): Promise<ActionResult> {
  const me = await requireUser();

  const promptId = (formData.get("promptId") as string | null) ?? "";
  const text = ((formData.get("text") as string | null) ?? "").trim();
  const traitsRaw = formData.getAll("traits").map(String);
  const anonymous = formData.get("anonymous") === "on";

  if (!promptId) return { ok: false, error: "Missing prompt." };
  if (text.length < 25) {
    return { ok: false, error: "Reflection must be at least 25 characters." };
  }
  if (text.length > 500) {
    return { ok: false, error: "Reflection must be under 500 characters." };
  }

  const validTraits = traitsRaw.filter((t): t is Trait =>
    (TRAITS as string[]).includes(t),
  );
  if (validTraits.length > 3) validTraits.length = 3;

  const prompt = await db.prompt.findUnique({ where: { id: promptId } });
  if (!prompt) return { ok: false, error: "Prompt not found." };
  if (prompt.authorId === me.id) {
    return { ok: false, error: "You can't respond to your own question." };
  }

  await db.response.create({
    data: {
      promptId,
      responderId: me.id,
      text,
      traits: validTraits,
      anonymous,
    },
  });

  revalidatePath(`/p/${promptId}`);
  return { ok: true };
}

export async function togglePin(responseId: string): Promise<ActionResult> {
  const me = await requireUser();
  const response = await db.response.findUnique({
    where: { id: responseId },
    include: { prompt: true },
  });
  if (!response) return { ok: false, error: "Not found." };
  if (response.prompt.authorId !== me.id) {
    return { ok: false, error: "Only the prompt author can pin." };
  }

  await db.response.update({
    where: { id: responseId },
    data: { pinned: !response.pinned },
  });

  revalidatePath(`/p/${response.promptId}`);
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/me");
  return { ok: true };
}

export async function toggleDropPin(reflectionId: string): Promise<ActionResult> {
  const me = await requireUser();
  const r = await db.dropReflection.findUnique({ where: { id: reflectionId } });
  if (!r) return { ok: false, error: "Not found." };
  if (r.recipientId !== me.id) {
    return { ok: false, error: "Only the recipient can pin." };
  }
  await db.dropReflection.update({
    where: { id: reflectionId },
    data: { pinned: !r.pinned },
  });
  revalidatePath("/me");
  return { ok: true };
}

/* ───────── Drops ───────── */

export async function sendDropReflection(formData: FormData): Promise<ActionResult> {
  const me = await requireUser();

  const dropId = (formData.get("dropId") as string | null) ?? "";
  const recipientId = (formData.get("recipientId") as string | null) ?? "";
  const text = ((formData.get("text") as string | null) ?? "").trim();
  const traitsRaw = formData.getAll("traits").map(String);

  if (!dropId || !recipientId) return { ok: false, error: "Missing fields." };
  if (recipientId === me.id) {
    return { ok: false, error: "You can't send a drop to yourself." };
  }
  if (text.length < 25) {
    return { ok: false, error: "Reflection must be at least 25 characters." };
  }
  if (text.length > 500) {
    return { ok: false, error: "Reflection must be under 500 characters." };
  }

  const drop = await db.reflectionDrop.findUnique({ where: { id: dropId } });
  if (!drop) return { ok: false, error: "Drop not found." };
  const now = new Date();
  if (drop.opensAt > now) return { ok: false, error: "Drop hasn't opened yet." };
  if (drop.closesAt <= now) return { ok: false, error: "Drop has closed." };

  const recipient = await db.user.findUnique({ where: { id: recipientId } });
  if (!recipient) return { ok: false, error: "Recipient not found." };

  const validTraits = traitsRaw.filter((t): t is Trait =>
    (TRAITS as string[]).includes(t),
  );
  if (validTraits.length > 3) validTraits.length = 3;

  try {
    await db.dropReflection.create({
      data: {
        dropId,
        senderId: me.id,
        recipientId,
        text,
        traits: validTraits,
      },
    });
  } catch (err) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as { code?: string }).code === "P2002"
    ) {
      return {
        ok: false,
        error: "You already sent a reflection to this person in this drop.",
      };
    }
    throw err;
  }

  revalidatePath("/drop");
  revalidatePath("/me");
  return { ok: true };
}

/* ───────── Admin ───────── */

async function requireAdminUser() {
  const me = await getCurrentUser();
  if (!isAdminUser(me)) throw new Error("Forbidden");
  return me!;
}

export async function adminCreateDrop(formData: FormData): Promise<ActionResult> {
  const me = await requireAdminUser();

  const prompt = ((formData.get("prompt") as string | null) ?? "").trim();
  const opensAtRaw = (formData.get("opensAt") as string | null) ?? "";
  const durationMin = Number(formData.get("durationMin")) || 60;

  if (prompt.length < 8) return { ok: false, error: "Prompt is too short." };
  if (!opensAtRaw) return { ok: false, error: "Pick an open time." };

  const opensAt = new Date(opensAtRaw);
  if (Number.isNaN(opensAt.getTime())) {
    return { ok: false, error: "Invalid open time." };
  }
  const closesAt = new Date(opensAt.getTime() + durationMin * 60 * 1000);

  const drop = await db.reflectionDrop.create({
    data: { prompt, opensAt, closesAt, createdById: me.id },
  });

  revalidatePath("/admin/drops");
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, redirectTo: `/admin/drops/${drop.id}` };
}

export async function adminEndDrop(dropId: string): Promise<ActionResult> {
  await requireAdminUser();
  const drop = await db.reflectionDrop.findUnique({ where: { id: dropId } });
  if (!drop) return { ok: false, error: "Not found." };
  await db.reflectionDrop.update({
    where: { id: dropId },
    data: { closesAt: new Date() },
  });
  revalidatePath("/admin/drops");
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function adminDeleteDrop(dropId: string): Promise<ActionResult> {
  await requireAdminUser();
  await db.reflectionDrop.delete({ where: { id: dropId } });
  revalidatePath("/admin/drops");
  revalidatePath("/admin");
  return { ok: true, redirectTo: "/admin/drops" };
}

export async function adminDeletePrompt(promptId: string): Promise<ActionResult> {
  await requireAdminUser();
  await db.prompt.delete({ where: { id: promptId } });
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function adminDeleteResponse(responseId: string): Promise<ActionResult> {
  await requireAdminUser();
  await db.response.delete({ where: { id: responseId } });
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminDeleteUser(userId: string): Promise<ActionResult> {
  const me = await requireAdminUser();
  if (userId === me.id) return { ok: false, error: "Can't delete yourself." };
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function adminPromoteUser(userId: string): Promise<ActionResult> {
  await requireAdminUser();
  await db.user.update({ where: { id: userId }, data: { role: "admin" } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function adminDemoteUser(userId: string): Promise<ActionResult> {
  const me = await requireAdminUser();
  if (userId === me.id) return { ok: false, error: "Can't demote yourself." };
  await db.user.update({ where: { id: userId }, data: { role: "user" } });
  revalidatePath("/admin/users");
  return { ok: true };
}
