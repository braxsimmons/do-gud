export type PromptCategory =
  | "strengths"
  | "personality"
  | "first-impressions"
  | "hidden-talents"
  | "growth";

export const CATEGORY_META: Record<
  PromptCategory,
  { label: string; description: string; accent: string }
> = {
  strengths: {
    label: "Strengths",
    description: "What I'm genuinely good at",
    accent: "var(--accent-sage)",
  },
  personality: {
    label: "Personality",
    description: "How I show up in a room",
    accent: "var(--accent-amber)",
  },
  "first-impressions": {
    label: "First impressions",
    description: "The signal you pick up early",
    accent: "var(--accent-rose)",
  },
  "hidden-talents": {
    label: "Hidden talents",
    description: "What people miss about me",
    accent: "var(--accent-violet)",
  },
  growth: {
    label: "Growth",
    description: "Where I'm still becoming",
    accent: "var(--accent-sky)",
  },
};

export type Trait =
  | "thoughtful"
  | "driven"
  | "kind"
  | "funny"
  | "creative"
  | "steady"
  | "curious"
  | "generous"
  | "honest"
  | "calm"
  | "leader"
  | "loyal";

export const TRAITS: Trait[] = [
  "thoughtful",
  "driven",
  "kind",
  "funny",
  "creative",
  "steady",
  "curious",
  "generous",
  "honest",
  "calm",
  "leader",
  "loyal",
];

/** Lightweight UI-only shapes — what the components actually need. */
export type UserUI = {
  id?: string;
  username: string;
  name: string;
  bio?: string;
  avatar: string;
};

export type PromptUI = {
  id: string;
  question: string;
  category: string;
  image?: string | null;
  createdAt: Date | string;
};

export type ResponseUI = {
  id: string;
  text: string;
  traits: string[];
  anonymous: boolean;
  pinned: boolean;
  createdAt: Date | string;
};

export function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=eef2e9,f4eede,f5e6e0,e9eaf3,e3edf2`;
}
