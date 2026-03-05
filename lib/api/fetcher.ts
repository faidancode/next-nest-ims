import { useAuthStore } from "@/app/stores/auth";
import { ApiEnvelope } from "@/types/api";

const DEFAULT_HEADERS: HeadersInit = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
};

export type ApiRequestInit = RequestInit & {
  raw?: boolean;
};

const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

function shouldSkipRefresh(path: string) {
  return NO_REFRESH_PATHS.some((p) => path.startsWith(p));
}

export class ApiError<TBody = unknown> extends Error {
  status: number;
  body?: TBody;

  constructor(status: number, message: string, body?: TBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function extractMessage(body: unknown): string {
  if (!body) return "";
  if (typeof body === "string") return body;

  if (typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (
      record.error &&
      typeof record.error === "object" &&
      typeof (record.error as { message?: unknown }).message === "string"
    ) {
      return (record.error as { message: string }).message;
    }
  }

  return "";
}

async function apiFetch(
  path: string,
  options: ApiRequestInit & { __retry?: boolean } = {},
) {
  const accessToken = useAuthStore.getState().accessToken;
  const headers = new Headers(options.headers);
  headers.set("X-Client-Type", "web-admin");

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`/api${path}`, {
    credentials: "include",
    cache: "no-store",
    ...options,
    headers,
  });

  if (res.status === 401 && !options.__retry && !shouldSkipRefresh(path)) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return apiFetch(path, {
        ...options,
        __retry: true,
      });
    }

    throw new ApiError(401, "Session expired", {
      shouldLogout: true,
      isSessionExpired: true,
    });
  }

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }

    const message = extractMessage(body) || res.statusText || "Request failed";
    throw new ApiError(res.status, message, body);
  }

  if (options.raw) return res;
  return res.json();
}

export async function apiRequest<T>(
  path: string,
  bodyOrOptions?: unknown,
  maybeOptions: ApiRequestInit = {},
): Promise<ApiEnvelope<T>> {
  const isOptionsOnly =
    bodyOrOptions &&
    typeof bodyOrOptions === "object" &&
    ("method" in bodyOrOptions || "headers" in bodyOrOptions);

  const body = isOptionsOnly ? undefined : bodyOrOptions;
  const options = isOptionsOnly
    ? (bodyOrOptions as ApiRequestInit)
    : maybeOptions;

  const isFormData = body instanceof FormData;
  const method = options.method ?? (body ? "POST" : "GET");

  const res = await apiFetch(path, {
    ...options,
    method,
    body: body
      ? isFormData
        ? body
        : typeof body === "string"
          ? body
          : JSON.stringify(body)
      : undefined,
    headers: {
      ...(isFormData ? {} : DEFAULT_HEADERS),
      ...(options.headers || {}),
    },
  });

  return res as ApiEnvelope<T>;
}

export function unwrapEnvelope<T>(
  envelope: ApiEnvelope<T>,
  fallback = "Request failed",
): T {
  if (envelope.ok) return envelope.data;

  const message =
    typeof envelope.error?.message === "string"
      ? envelope.error.message
      : fallback;

  throw new ApiError(400, message, envelope.error);
}

export function buildQueryString(params?: Record<string, unknown>) {
  if (!params) return "";

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }

  return search.toString();
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: {
        "X-Client-Type": "web-admin",
      },
    });

    if (!res.ok) return false;

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      return false;
    }

    const accessToken = extractAccessToken(body);
    if (!accessToken) return false;

    useAuthStore.getState().setAccessToken(accessToken);
    return true;
  } catch {
    return false;
  }
}

function extractAccessToken(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;

  const record = body as Record<string, unknown>;
  if (typeof record.accessToken === "string" && record.accessToken.length > 0) {
    return record.accessToken;
  }

  if (record.data && typeof record.data === "object") {
    const data = record.data as Record<string, unknown>;
    if (typeof data.accessToken === "string" && data.accessToken.length > 0) {
      return data.accessToken;
    }
  }

  return null;
}
