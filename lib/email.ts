import "server-only";
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "Do Güd <noreply@dogud.app>";
const APP_URL =
  process.env.APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

let _resend: Resend | null = null;
function client() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

export function appUrl(): string {
  return APP_URL;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const c = client();
  if (!c) {
    // Graceful degradation — log to console so the dev/admin can see the
    // intended payload without blocking the user flow.
    console.log(
      `[email:dry-run] to=${opts.to} subject=${opts.subject}\n${opts.text}`,
    );
    return { ok: true, reason: "dry-run (RESEND_API_KEY not set)" };
  }
  try {
    await c.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html ?? opts.text.replace(/\n/g, "<br/>"),
    });
    return { ok: true };
  } catch (err) {
    console.error("[email:send] failed", err);
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "send failed",
    };
  }
}

export function emailDeliveryEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}
