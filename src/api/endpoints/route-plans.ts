import type { ApiClient, JsonRequestInit } from "../client";
import { ApiError } from "../../util/errors";
import type {
    RoutePlan,
    RoutePlanWithAnalysis,
    CreateRoutePlanBody,
    CreateRoutePlanFromActivityBody,
    CreateRoutePlanFromStravaRouteBody,
    CreateRoutePlanResponse,
    ListRoutePlansResponse,
    ListStravaRoutesResponse,
    RouteConditionsResponse,
    GenerateRoutePlanBody,
    GenerateRoutePlanResponse,
    CreateFromGeometryBody,
    RouteSegmentBody,
    RouteSegmentResponse,
} from "../../types";

export async function createRoutePlan(
    client: ApiClient,
    body: CreateRoutePlanBody,
    init?: JsonRequestInit
): Promise<CreateRoutePlanResponse> {
    return await client.fetchJson<CreateRoutePlanResponse>("/route-plans", {
        ...init,
        method: "POST",
        json: body,
    });
}

export async function createRoutePlanFromActivity(
    client: ApiClient,
    body: CreateRoutePlanFromActivityBody,
    init?: JsonRequestInit
): Promise<CreateRoutePlanResponse> {
    return await client.fetchJson<CreateRoutePlanResponse>(
        "/route-plans/from-activity",
        {
            ...init,
            method: "POST",
            json: body,
        }
    );
}

export async function listRoutePlans(
    client: ApiClient,
    params?: { page?: number; limit?: number },
    init?: JsonRequestInit
): Promise<ListRoutePlansResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    const query = searchParams.toString();
    return await client.fetchJson<ListRoutePlansResponse>(
        `/route-plans${query ? `?${query}` : ""}`,
        init
    );
}

export async function getRoutePlan(
    client: ApiClient,
    id: string,
    init?: JsonRequestInit
): Promise<RoutePlanWithAnalysis> {
    return await client.fetchJson<RoutePlanWithAnalysis>(
        `/route-plans/${encodeURIComponent(id)}`,
        init
    );
}

export async function deleteRoutePlan(
    client: ApiClient,
    id: string,
    init?: JsonRequestInit
): Promise<void> {
    await client.fetchJson<void>(
        `/route-plans/${encodeURIComponent(id)}`,
        { ...init, method: "DELETE" }
    );
}

export async function getRouteConditions(
    client: ApiClient,
    id: string,
    init?: JsonRequestInit
): Promise<RouteConditionsResponse> {
    return await client.fetchJson<RouteConditionsResponse>(
        `/route-plans/${encodeURIComponent(id)}/conditions`,
        init
    );
}

export async function refreshRoutePlan(
    client: ApiClient,
    id: string,
    init?: JsonRequestInit
): Promise<CreateRoutePlanResponse> {
    return await client.fetchJson<CreateRoutePlanResponse>(
        `/route-plans/${encodeURIComponent(id)}/refresh`,
        { ...init, method: "POST" }
    );
}

export async function listStravaRoutes(
    client: ApiClient,
    params?: { page?: number; perPage?: number },
    init?: JsonRequestInit
): Promise<ListStravaRoutesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.perPage) searchParams.set("perPage", params.perPage.toString());
    const query = searchParams.toString();
    return await client.fetchJson<ListStravaRoutesResponse>(
        `/route-plans/strava-routes${query ? `?${query}` : ""}`,
        init
    );
}

export async function createRoutePlanFromStravaRoute(
    client: ApiClient,
    body: CreateRoutePlanFromStravaRouteBody,
    init?: JsonRequestInit
): Promise<CreateRoutePlanResponse> {
    return await client.fetchJson<CreateRoutePlanResponse>(
        "/route-plans/from-strava-route",
        {
            ...init,
            method: "POST",
            json: body,
        }
    );
}

export async function generateRoutePlan(
    client: ApiClient,
    body: GenerateRoutePlanBody,
    options?: {
        onStatus?: (message: string) => void;
        init?: JsonRequestInit;
    }
): Promise<GenerateRoutePlanResponse> {
    const res = await client.fetchSSE("/route-plans/generate", {
        ...options?.init,
        method: "POST",
        json: body,
    });

    const text = await res.text();
    let result: GenerateRoutePlanResponse | null = null;
    let errorMessage: string | null = null;

    // Parse SSE events from the response body
    for (const block of text.split("\n\n")) {
        const lines = block.split("\n");
        let event = "";
        let data = "";
        for (const line of lines) {
            if (line.startsWith("event: ")) event = line.slice(7);
            else if (line.startsWith("data: ")) data = line.slice(6);
        }
        if (!event || !data) continue;

        if (event === "status" && options?.onStatus) {
            const parsed = JSON.parse(data) as { message: string };
            options.onStatus(parsed.message);
        } else if (event === "result") {
            result = JSON.parse(data) as GenerateRoutePlanResponse;
        } else if (event === "error") {
            errorMessage = (JSON.parse(data) as { message: string }).message;
        }
    }

    if (errorMessage) {
        throw new ApiError({
            status: 500,
            url: "/route-plans/generate",
            message: errorMessage,
        });
    }
    if (!result) {
        throw new ApiError({
            status: 500,
            url: "/route-plans/generate",
            message: "No result received from route generation",
        });
    }

    return result;
}

export async function createFromGeometry(
    client: ApiClient,
    body: CreateFromGeometryBody,
    init?: JsonRequestInit
): Promise<CreateRoutePlanResponse> {
    return await client.fetchJson<CreateRoutePlanResponse>(
        "/route-plans/from-geometry",
        {
            ...init,
            method: "POST",
            json: body,
        }
    );
}

export async function routeSegment(
    client: ApiClient,
    body: RouteSegmentBody,
    init?: JsonRequestInit
): Promise<RouteSegmentResponse> {
    return await client.fetchJson<RouteSegmentResponse>(
        "/route-plans/route-segment",
        {
            ...init,
            method: "POST",
            json: body,
        }
    );
}
