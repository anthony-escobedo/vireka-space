"use client";

const ANONYMOUS_ID_KEY = "vireka_anonymous_id";

export function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") {
    return "unknown";
  }

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
    if (existing) return existing;

    const created =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    window.localStorage.setItem(ANONYMOUS_ID_KEY, created);
    return created;
  } catch {
    return "unknown";
  }
}
