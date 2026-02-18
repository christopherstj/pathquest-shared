import { ApiClient, JsonRequestInit } from "../client";
import type {
    DeviceConnectionsResponse,
    LinkStravaRequest,
    LinkStravaResponse,
    UnlinkDeviceResponse,
} from "../../types/DeviceConnection";

/**
 * Get all device connections for the authenticated user.
 */
export async function getUserDevices(
    client: ApiClient,
    fetchOptions?: Partial<JsonRequestInit>
): Promise<DeviceConnectionsResponse> {
    return client.fetchJson("/api/user/devices", {
        method: "GET",
        ...fetchOptions,
    });
}

/**
 * Link a Strava account to the authenticated user.
 */
export async function linkStrava(
    client: ApiClient,
    params: LinkStravaRequest,
    fetchOptions?: Partial<JsonRequestInit>
): Promise<LinkStravaResponse> {
    return client.fetchJson("/api/user/devices/strava/link", {
        method: "POST",
        json: params,
        ...fetchOptions,
    });
}

/**
 * Unlink a device connection.
 */
export async function unlinkDevice(
    client: ApiClient,
    connectionId: number,
    fetchOptions?: Partial<JsonRequestInit>
): Promise<UnlinkDeviceResponse> {
    return client.fetchJson(`/api/user/devices/${connectionId}`, {
        method: "DELETE",
        ...fetchOptions,
    });
}
