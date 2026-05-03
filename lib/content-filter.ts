import "server-only";

/**
 * Floor-level content filter. Blocks the worst clearly-bad terms before they
 * land in the DB. Not perfect, not a substitute for a real moderation
 * pipeline — designed to keep public-launch noise out of the platform until
 * smarter filtering exists.
 */

const SLURS_AND_HATE = [
  // Hard slurs (representative subset; expand as needed)
  "n1gger",
  "n!gger",
  "nigger",
  "kike",
  "f@ggot",
  "faggot",
  "fag",
  "tranny",
  "retard",
  "retarded",
  "chink",
  "spic",
  "wetback",
  "gook",
  "raghead",
  // Harassment / threat patterns
  "kill yourself",
  "kys",
  "go die",
  "rape",
  "molest",
];

const NSFW = [
  "porn",
  "pornhub",
  "onlyfans",
  "naked pics",
  "nudes",
  "send nudes",
];

const SPAM = [
  "click here",
  "free money",
  "follow me on",
  "buy followers",
  "telegram.me",
  "t.me/",
  "wa.me/",
  "bit.ly/",
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‐-―]/g, "-")
    .replace(/\s+/g, " ");
}

function matches(text: string, list: string[]): string | null {
  const n = normalize(text);
  for (const term of list) {
    if (!term) continue;
    // word-bounded for short tokens, substring for phrases (containing spaces or punctuation)
    if (term.includes(" ") || /[^a-z0-9]/.test(term)) {
      if (n.includes(term)) return term;
    } else {
      const re = new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`, "i");
      if (re.test(n)) return term;
    }
  }
  return null;
}

export type ContentVerdict =
  | { ok: true }
  | { ok: false; reason: string; matched: string };

export function checkContent(text: string): ContentVerdict {
  if (!text?.trim()) return { ok: false, reason: "empty", matched: "" };

  const slur = matches(text, SLURS_AND_HATE);
  if (slur) {
    return {
      ok: false,
      reason:
        "That language doesn't belong here. Do Güd is built around honest, kind reflection.",
      matched: slur,
    };
  }

  const nsfw = matches(text, NSFW);
  if (nsfw) {
    return {
      ok: false,
      reason: "Sexual content isn't allowed on Do Güd.",
      matched: nsfw,
    };
  }

  const spam = matches(text, SPAM);
  if (spam) {
    return {
      ok: false,
      reason:
        "That looks like promotional content. Do Güd is for personal reflections, not promotion.",
      matched: spam,
    };
  }

  return { ok: true };
}
