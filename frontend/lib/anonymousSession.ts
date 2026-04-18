const ANONYMOUS_ID_KEY = "vireka_anonymous_id";

function generateAnonymousId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getAnonymousId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(ANONYMOUS_ID_KEY);
  } catch {
    return null;
  }
}

export function getOrCreateAnonymousId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    let id = localStorage.getItem(ANONYMOUS_ID_KEY);

    if (!id) {
      id = generateAnonymousId();
      localStorage.setItem(ANONYMOUS_ID_KEY, id);
    }

    return id;
  } catch {
    return null;
  }
}

export function clearAnonymousId(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ANONYMOUS_ID_KEY);
  } catch {
    // no-op
  }
}
