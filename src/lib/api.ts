const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001"
).replace(/\/$/, "");

export const AUTH_TOKEN_KEY = "carebridge_token";
export const AUTH_ROLE_KEY = "carebridge_role";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(AUTH_TOKEN_KEY)
      : null;

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Unable to connect to the backend at ${API_BASE_URL}. Check that the backend server is running.`,
    );
  }

  const result = (await response.json().catch(() => null)) as
    | (ApiErrorResponse & Record<string, unknown>)
    | null;

  if (!response.ok || result?.success === false) {
    throw new ApiError(
      typeof result?.message === "string"
        ? result.message
        : `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  return result as T;
}
