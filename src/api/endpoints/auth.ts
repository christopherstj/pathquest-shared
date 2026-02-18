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
 * Response from provider-login (Google, email).
 */
export interface ProviderLoginResponse {
    user: MobileAuthUser;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    isNewUser: boolean;
}

/**
 * Response from email magic link send endpoint.
 */
export interface EmailSendResponse {
    success: boolean;
}

/**
 * Response from email magic link verify endpoint.
 */
export interface EmailVerifyResponse {
    user: MobileAuthUser;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

/**
 * Exchange a Strava authorization code for PathQuest session tokens.
 * This is the entry point for mobile app authentication.
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

/**
 * Login or register via provider (Google, email) on mobile.
 */
export async function mobileProviderLogin(
    client: ApiClient,
    params: {
        provider: string;
        providerId: string;
        email?: string | null;
        name?: string | null;
        picture?: string | null;
    },
    fetchOptions?: Partial<JsonRequestInit>
): Promise<ProviderLoginResponse> {
    return client.fetchJson("/api/auth/mobile/provider-login", {
        method: "POST",
        json: params,
        ...fetchOptions,
    });
}

/**
 * Send a magic link email for passwordless auth.
 */
export async function sendMagicLink(
    client: ApiClient,
    params: { email: string },
    fetchOptions?: Partial<JsonRequestInit>
): Promise<EmailSendResponse> {
    return client.fetchJson("/api/auth/email/send", {
        method: "POST",
        json: params,
        ...fetchOptions,
    });
}

/**
 * Verify a magic link token and log in.
 */
export async function verifyMagicLink(
    client: ApiClient,
    params: { token: string },
    fetchOptions?: Partial<JsonRequestInit>
): Promise<EmailVerifyResponse> {
    return client.fetchJson("/api/auth/email/verify", {
        method: "POST",
        json: params,
        ...fetchOptions,
    });
}
