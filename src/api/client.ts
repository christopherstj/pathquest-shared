import { ApiError } from "../util/errors";

export type HeadersObject = Record<string, string>;

export type GetAuthHeaders = () => HeadersObject | Promise<HeadersObject>;

export type CreateApiClientOptions = {
  baseUrl: string;
  /**
   * Auth/header injection hook. Implementations may return:
   * - `{ Authorization: "Bearer ..." }`
   * - and/or any app-specific headers (e.g. `x-user-id`, etc.)
   */
  getAuthHeaders?: GetAuthHeaders;
  /**
   * Override fetch for tests. Defaults to global fetch.
   */
  fetchImpl?: typeof fetch;
  /**
   * Always-applied headers (e.g. Accept / Content-Type defaults).
   */
  defaultHeaders?: HeadersObject;
};

export type JsonRequestInit = Omit<RequestInit, "headers" | "body"> & {
  headers?: HeadersObject;
  json?: unknown;
};

export interface ApiClient {
  baseUrl: string;
  fetchJson<T = unknown>(pathOrUrl: string, init?: JsonRequestInit): Promise<T>;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function resolveUrl(baseUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = normalizeBaseUrl(baseUrl);
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function createApiClient(opts: CreateApiClientOptions): ApiClient {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const baseUrl = normalizeBaseUrl(opts.baseUrl);
  const defaultHeaders = opts.defaultHeaders ?? {};

  return {
    baseUrl,
    async fetchJson<T>(pathOrUrl: string, init?: JsonRequestInit): Promise<T> {
      const url = resolveUrl(baseUrl, pathOrUrl);
      const authHeaders = (await opts.getAuthHeaders?.()) ?? {};

      const headers: HeadersObject = {
        ...defaultHeaders,
        ...authHeaders,
        ...(init?.headers ?? {}),
      };

      let body: BodyInit | undefined = undefined;
      if (init && "json" in init) {
        body = init.json === undefined ? undefined : JSON.stringify(init.json);
        // Only set content-type if caller didn't override it.
        if (!headers["Content-Type"] && !headers["content-type"]) {
          headers["Content-Type"] = "application/json";
        }
      }

      const res = await fetchImpl(url, {
        ...init,
        headers,
        body,
      });

      if (!res.ok) {
        const bodyText = await res.text().catch(() => undefined);
        throw new ApiError({
          status: res.status,
          url,
          bodyText,
          message: bodyText || `API request failed (${res.status})`,
        });
      }

      // Handle empty responses (204, etc.)
      const text = await res.text();
      if (!text) return undefined as T;

      try {
        return JSON.parse(text) as T;
      } catch {
        // If caller expected JSON but upstream returned text, surface it.
        throw new ApiError({
          status: res.status,
          url,
          bodyText: text,
          message: "Failed to parse JSON response",
        });
      }
    },
  };
}


