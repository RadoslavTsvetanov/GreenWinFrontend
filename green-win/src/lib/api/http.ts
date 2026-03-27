import { refreshSession } from "@/lib/auth/api";
import { clearSession, readToken } from "@/lib/auth/storage";

function getApiBase() {
  return "/backend-api";
}

async function parseErrorResponse(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const parsed = JSON.parse(text) as { message?: string | string[] };
    const message = Array.isArray(parsed.message)
      ? parsed.message.join(", ")
      : parsed.message;
    return message || text;
  } catch {
    return text;
  }
}

export async function authorizedApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const doRequest = async () => {
    const token = readToken();
    const headers: HeadersInit = {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(`${getApiBase()}${path}`, { ...init, headers });
  };

  let response = await doRequest();
  if (response.status !== 401) {
    return response;
  }

  try {
    await refreshSession();
  } catch {
    clearSession();
    return response;
  }

  response = await doRequest();
  return response;
}

export async function ensureOk(response: Response): Promise<Response> {
  if (response.ok) {
    return response;
  }
  const message = await parseErrorResponse(response);
  throw new Error(message);
}

