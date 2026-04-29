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

export type User = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  joinedAt: string;
};

export type Prompt = {
  id: string;
  authorUsername: string;
  question: string;
  category: PromptCategory;
  image?: string;
  createdAt: string;
};

export type Response = {
  id: string;
  promptId: string;
  responderUsername: string;
  text: string;
  traits: Trait[];
  anonymous: boolean;
  createdAt: string;
  pinned?: boolean;
};

export type Snapshot = {
  users: User[];
  prompts: Prompt[];
  responses: Response[];
};
