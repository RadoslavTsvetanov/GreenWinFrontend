import { AuthSession, AuthUser, LoginPayload, RegisterPayload } from "./types";
import { readSession, saveSession } from "./storage";

function getApiBase() {
  return "/backend-api";
}

function normalizeUser(raw: Record<string, unknown>): AuthUser {
  return {
    id: String(raw.id ?? ""),
    email: String(raw.email ?? ""),
    name: typeof raw.name === "string" ? raw.name : null,
    organizationId:
      typeof raw.organizationId === "string" ? raw.organizationId : null,
    organizationName:
      typeof raw.organizationName === "string" ? raw.organizationName : null,
    defaultCloudProviders: Array.isArray(raw.defaultCloudProviders)
      ? (raw.defaultCloudProviders as string[])
      : null,
    defaultRegions: Array.isArray(raw.defaultRegions)
      ? (raw.defaultRegions as string[])
      : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : null,
  };
}

function parseTokens(data: Record<string, unknown>) {
  const accessToken =
    (typeof data.access_token === "string" && data.access_token) ||
    (typeof data.accessToken === "string" && data.accessToken) ||
    (typeof data.token === "string" && data.token) ||
    "";

  const refreshToken =
    (typeof data.refresh_token === "string" && data.refresh_token) ||
    (typeof data.refreshToken === "string" && data.refreshToken) ||
    "";

  if (!accessToken) {
    throw new Error("Invalid auth response: missing access token.");
  }

  return {
    accessToken,
    refreshToken: refreshToken || null,
  };
}

function parseAuthSessionResponse(data: Record<string, unknown>): AuthSession {
  const { accessToken, refreshToken } = parseTokens(data);
  const userRaw = (data.user ?? null) as Record<string, unknown> | null;

  if (!userRaw) {
    throw new Error("Invalid auth response.");
  }

  return {
    token: accessToken,
    refreshToken,
    user: normalizeUser(userRaw),
  };
}

async function requestAuth(
  path: string,
  body: LoginPayload | RegisterPayload,
): Promise<AuthSession> {
  let response: Response;
  try {
    response = await fetch(`${getApiBase()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach backend API.");
  }

  if (!response.ok) {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text) as { message?: string | string[] };
      const message = Array.isArray(parsed.message)
        ? parsed.message.join(", ")
        : parsed.message;
      throw new Error(message || `Auth failed with status ${response.status}`);
    } catch {
      throw new Error(text || `Auth failed with status ${response.status}`);
    }
  }

  const data = (await response.json()) as Record<string, unknown>;
  return parseAuthSessionResponse(data);
}

export async function refreshSession(): Promise<AuthSession> {
  const session = readSession();
  if (!session) {
    throw new Error("Not authenticated.");
  }

  if (!session.refreshToken) {
    throw new Error("No refresh token available.");
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBase()}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.refreshToken}`,
      },
    });
  } catch {
    throw new Error("Cannot reach backend API.");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Refresh failed with status ${response.status}`);
  }

  const data = (await response.json()) as Record<string, unknown>;
  const { accessToken, refreshToken } = parseTokens(data);

  const updated: AuthSession = {
    ...session,
    token: accessToken,
    refreshToken,
  };

  saveSession(updated);
  return updated;
}

export function login(payload: LoginPayload) {
  return requestAuth("/auth/login", payload);
}

export function register(payload: RegisterPayload) {
  return requestAuth("/auth/register", payload);
}
