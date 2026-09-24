import { useAuthStore } from "@/core/store/useAuthStore";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";

// Use `localhost` (not 127.0.0.1) in dev: the refresh cookie is SameSite=Lax,
// and the browser only sends it when the page and the API are the same site.
// `localhost:3000` -> `localhost:8000` is; `localhost` -> `127.0.0.1` is not.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// The storefront and the admin portal are separate sessions: separate tokens,
// separate refresh cookies, separate stores. Which one a request uses is
// decided by the API area it targets.
type Realm = "customer" | "admin";

const REALMS = {
  customer: { store: useAuthStore, refreshPath: "/api/v1/auth/refresh" },
  admin: { store: useAdminAuthStore, refreshPath: "/admin/auth/refresh" },
} as const;

const realmFor = (endpoint: string): Realm => {
  const path = endpoint.startsWith(API_BASE_URL) ? endpoint.slice(API_BASE_URL.length) : endpoint;
  return path.startsWith("/admin") ? "admin" : "customer";
};

// A 401 from these means "wrong credentials/link", not "access token expired",
// so refreshing and retrying would be pointless (and login would loop).
const AUTH_ENDPOINT = /\/auth\/(login|login\/json|register|refresh|logout|verify-email)$/;

const inflightRefresh: Partial<Record<Realm, Promise<string | null>>> = {};

async function doRefresh(realm: Realm): Promise<string | null> {
  const { store, refreshPath } = REALMS[realm];
  try {
    const res = await fetch(`${API_BASE_URL}${refreshPath}`, { method: "POST", credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      store.getState().setAuth(data.access_token, data.user);
      return data.access_token;
    }
    // No/expired/revoked session: it's genuinely over.
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      store.getState().signOut();
    }
    // Anything else (429, 5xx) is transient — keep the user signed in and let
    // the next request try again.
    return null;
  } catch {
    // Offline or the API is down: same reasoning, don't sign anyone out for it.
    return null;
  }
}

/** Shared per realm, so ten requests waking up at once cause one refresh, not ten. */
export function refreshSession(realm: Realm): Promise<string | null> {
  if (!inflightRefresh[realm]) {
    inflightRefresh[realm] = doRefresh(realm).finally(() => {
      delete inflightRefresh[realm];
    });
  }
  return inflightRefresh[realm]!;
}

/**
 * The access token lives only in memory, so after a page load it's gone even
 * though the persisted "signed in" hint says we have a session. In that case
 * the refresh cookie gets us a new one.
 */
async function ensureToken(realm: Realm): Promise<string | null> {
  const state = REALMS[realm].store.getState();
  if (state.token) return state.token;
  if (state.isAuthenticated) return refreshSession(realm);
  return null;
}

/** Restore a session after a full page load (no-op if already restored or signed out). */
export const restoreSession = (realm: Realm) => ensureToken(realm);

/**
 * fetch() with the right credentials attached: sends the realm's access token,
 * and if the server says it expired, refreshes once and retries. Returns the
 * raw Response; use fetchClient for JSON.
 */
export const authFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const isServer = typeof window === "undefined";
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const realm = realmFor(endpoint);

  const send = (token: string | null) =>
    fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const token = isServer ? null : await ensureToken(realm);
  let res = await send(token);

  if (res.status === 401 && token && !isServer && !AUTH_ENDPOINT.test(endpoint)) {
    const fresh = await refreshSession(realm);
    if (fresh) res = await send(fresh);
    // Still unauthorized after a fresh token: the session is no good.
    if (res.status === 401) REALMS[realm].store.getState().signOut();
  }

  return res;
};

export const fetchClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await authFetch(endpoint, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    const { handleApiResponseError } = await import("@/core/errors/errorHandler");
    await handleApiResponseError(res);
  }

  // 204 No Content (e.g. logout) has no body to parse.
  if (res.status === 204) return undefined as T;
  return res.json();
};
