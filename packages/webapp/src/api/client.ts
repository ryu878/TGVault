/**
 * API client for TGVault backend
 */

const API_BASE =
  import.meta.env.VITE_API_URL ?? (typeof window !== "undefined" ? "" : "http://localhost:8000");

let _token: string | null = null;

export function setAuthToken(token: string): void {
  _token = token;
}

export function getAuthToken(): string | null {
  return _token;
}

export function clearAuthToken(): void {
  _token = null;
}

export const apiClient = {
  async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${API_BASE}/api/v1${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (_token) headers["Authorization"] = `Bearer ${_token}`;
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return undefined as T;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.detail ?? res.statusText) as Error & { status?: number };
      err.status = res.status;
      throw err;
    }
    return data as T;
  },
  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  },
  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  },
  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  },
};
