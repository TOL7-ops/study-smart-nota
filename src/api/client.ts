const API_URL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:8000";

export class APIError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  try {
    return localStorage.getItem("auth.token");
  } catch {
    return null;
  }
}

type Options = RequestInit & {
  json?: any;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");
  if (res.ok) {
    if (res.status === 204) return undefined as unknown as T;
    if (isJSON) return (await res.json()) as T;
    return (await res.text()) as unknown as T;
  }
  let errorPayload: any = undefined;
  try {
    errorPayload = isJSON ? await res.json() : await res.text();
  } catch {
    // ignore
  }
  const message =
    (errorPayload && (errorPayload.detail || errorPayload.message)) ||
    `Request failed with status ${res.status}`;
  throw new APIError(message, res.status, errorPayload);
}

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(options.headers || {});
  const token = getToken();
  headers.set("Accept", "application/json");
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const init: RequestInit = {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  };

  const res = await fetch(url, init);
  return handleResponse<T>(res);
}

// Convenience helpers
export const client = {
  get: <T>(path: string, options?: Options) => apiFetch<T>(path, { ...(options || {}), method: "GET" }),
  post: <T>(path: string, json?: any, options?: Options) =>
    apiFetch<T>(path, { ...(options || {}), method: "POST", json }),
  put: <T>(path: string, json?: any, options?: Options) =>
    apiFetch<T>(path, { ...(options || {}), method: "PUT", json }),
  patch: <T>(path: string, json?: any, options?: Options) =>
    apiFetch<T>(path, { ...(options || {}), method: "PATCH", json }),
  delete: <T>(path: string, options?: Options) => apiFetch<T>(path, { ...(options || {}), method: "DELETE" }),
};