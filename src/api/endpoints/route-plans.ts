import type { ApiClient, JsonRequestInit } from "../client";
import type {
    RoutePlan,
    RoutePlanWithAnalysis,
    CreateRoutePlanBody,
    CreateRoutePlanFromActivityBody,
    CreateRoutePlanResponse,
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
): Promise<RoutePlan[]> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    const query = searchParams.toString();
    return await client.fetchJson<RoutePlan[]>(
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
