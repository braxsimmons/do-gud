import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: { email: string; role?: string } | null) {
  if (!user) return false;
  if (user.role === "admin") return true;
  return adminEmails().includes(user.email.toLowerCase());
}

export async function requireAdmin() {
  const me = await getCurrentUser();
  if (!isAdminUser(me)) redirect("/");
  return me!;
}
