import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const serverClientOptions = {
  global: {
    fetch: (input: RequestInfo | URL, init: RequestInit = {}) =>
      fetch(input, {
        ...init,
        cache: "no-store",
      }),
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
} as const;

let cachedServiceClient: SupabaseClient | null = null;
let cachedServiceUrl: string | null = null;
let cachedServiceKey: string | null = null;

/**
 * Service-role client for webhooks and routes that should fail gracefully when env is missing.
 */
export function getSupabaseServiceClientOrNull(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    return null;
  }
  if (
    !cachedServiceClient ||
    cachedServiceUrl !== url ||
    cachedServiceKey !== serviceRoleKey
  ) {
    cachedServiceClient = createClient(url, serviceRoleKey, {
      ...serverClientOptions,
    });
    cachedServiceUrl = url;
    cachedServiceKey = serviceRoleKey;
  }
  return cachedServiceClient;
}

/**
 * Service-role client for server routes that require Supabase. Throws if env is missing.
 */
export function getSupabaseServerClient() {
  const c = getSupabaseServiceClientOrNull();
  if (!c) {
    throw new Error("Supabase server env vars are not configured");
  }
  return c;
}
