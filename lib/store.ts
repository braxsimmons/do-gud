"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Prompt, Response, Snapshot, User } from "./types";
import { SEED } from "./seed";

/**
 * Client-side store. The seed snapshot is the shared "world" everyone sees on
 * first load. The user's own profile, prompts, and responses are layered on
 * top via localStorage so the demo is fully interactive without a backend.
 *
 * This file is intentionally the only place that touches localStorage so a
 * real persistence layer can replace it cleanly.
 */

const KEY = "dogud:v1";

type Local = {
  currentUserId: string | null;
  users: User[];
  prompts: Prompt[];
  responses: Response[];
};

const empty: Local = {
  currentUserId: null,
  users: [],
  prompts: [],
  responses: [],
};

function load(): Local {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Local>;
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

let state: Local = empty;
let hydrated = false;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  state = load();
  hydrated = true;
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  ensureHydrated();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Local {
  ensureHydrated();
  return state;
}

function getServerSnapshot(): Local {
  return empty;
}

function update(mut: (s: Local) => Local) {
  state = mut(state);
  persist();
  emit();
}

export function useLocal() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The merged world view = seed + local additions, with local taking precedence. */
export function useSnapshot(): Snapshot {
  const local = useLocal();
  const [merged, setMerged] = useState<Snapshot>(SEED);

  useEffect(() => {
    const userMap = new Map<string, User>();
    for (const u of SEED.users) userMap.set(u.id, u);
    for (const u of local.users) userMap.set(u.id, u);

    const promptMap = new Map<string, Prompt>();
    for (const p of SEED.prompts) promptMap.set(p.id, p);
    for (const p of local.prompts) promptMap.set(p.id, p);

    const responseMap = new Map<string, Response>();
    for (const r of SEED.responses) responseMap.set(r.id, r);
    for (const r of local.responses) responseMap.set(r.id, r);

    setMerged({
      users: [...userMap.values()],
      prompts: [...promptMap.values()],
      responses: [...responseMap.values()],
    });
  }, [local]);

  return merged;
}

export function useCurrentUser(): User | null {
  const snap = useSnapshot();
  const local = useLocal();
  if (!local.currentUserId) return null;
  return snap.users.find((u) => u.id === local.currentUserId) ?? null;
}

export function signIn(user: User) {
  update((s) => {
    const others = s.users.filter((u) => u.id !== user.id);
    return { ...s, currentUserId: user.id, users: [...others, user] };
  });
}

export function signOut() {
  update((s) => ({ ...s, currentUserId: null }));
}

export function upsertUser(user: User) {
  update((s) => {
    const others = s.users.filter((u) => u.id !== user.id);
    return { ...s, users: [...others, user] };
  });
}

export function addPrompt(prompt: Prompt) {
  update((s) => ({ ...s, prompts: [prompt, ...s.prompts] }));
}

export function addResponse(response: Response) {
  update((s) => ({ ...s, responses: [response, ...s.responses] }));
}

export function togglePinResponse(responseId: string) {
  update((s) => ({
    ...s,
    responses: s.responses.map((r) =>
      r.id === responseId ? { ...r, pinned: !r.pinned } : r,
    ),
  }));
}

export function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=eef2e9,f4eede,f5e6e0,e9eaf3,e3edf2`;
}
