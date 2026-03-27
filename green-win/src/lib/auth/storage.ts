import { AuthSession } from "./types";

const SESSION_STORAGE_KEY = "greenwin.auth.session";
const TOKEN_COOKIE_KEY = "greenwin_token";
const listeners = new Set<() => void>();
let cachedRawSession: string | null | undefined;
let cachedParsedSession: AuthSession | null = null;

function emitSessionChange() {
  listeners.forEach((listener) => listener());
}

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(
    session.token,
  )}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  emitSessionChange();
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  return getSessionSnapshot();
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(SESSION_STORAGE_KEY);
  document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
  emitSessionChange();
}

export function readToken(): string | null {
  return readSession()?.token ?? null;
}

export function getSessionSnapshot(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (raw === cachedRawSession) {
    return cachedParsedSession;
  }

  cachedRawSession = raw;
  if (!raw) {
    cachedParsedSession = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    cachedParsedSession = {
      token: String(parsed.token ?? ""),
      refreshToken:
        typeof parsed.refreshToken === "string" ? parsed.refreshToken : null,
      user: parsed.user as AuthSession["user"],
    };
    return cachedParsedSession;
  } catch {
    cachedParsedSession = null;
    return null;
  }
}

export function subscribeAuthSession(listener: () => void) {
  listeners.add(listener);

  if (typeof window !== "undefined") {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SESSION_STORAGE_KEY) {
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return () => {
    listeners.delete(listener);
  };
}
