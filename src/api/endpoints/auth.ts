import { ApiClient, JsonRequestInit } from "../client";

/**
 * User data returned from mobile auth endpoints.
 */
export interface MobileAuthUser {
    id: string;
    name: string;
    email?: string | null;
    pic?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    isPublic?: boolean;
}

/**
 * Response from the mobile Strava token exchange endpoint.
 */
export interface MobileExchangeResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user: MobileAuthUser;
}

/**
 * Response from the mobile token refresh endpoint.
 */
export interface MobileRefreshResponse {
    accessToken: string;
    expiresAt: number;
}

/**
 * Exchange a Strava authorization code for PathQuest session tokens.
 * This is the entry point for mobile app authentication.
 *
 * @param client - API client (no auth headers needed for this endpoint)
 * @param params - The authorization code and PKCE code verifier
 * @param fetchOptions - Optional fetch options (e.g., for Next.js caching)
 */
export async function exchangeStravaCode(
    client: ApiClient,
    params: {
        code: string;
        codeVerifier: string;
        redirectUri?: string;
    },
    fetchOptions?: Partial<JsonRequestInit>
): Promise<MobileExchangeResponse> {
    return client.fetchJson("/api/auth/mobile/strava/exchange", {
        method: "POST",
        json: params,
        ...fetchOptions,
    });
}

/**
 * Refresh an expired access token using a valid refresh token.
 *
 * @param client - API client (no auth headers needed for this endpoint)
 * @param params - The refresh token
 * @param fetchOptions - Optional fetch options
 */
export async function refreshMobileToken(
    client: ApiClient,
    params: {
        refreshToken: string;
    },
    fetchOptions?: Partial<JsonRequestInit>
): Promise<MobileRefreshResponse> {
    return client.fetchJson("/api/auth/mobile/refresh", {
        method: "POST",
        json: params,
        ...fetchOptions,
    });
}

