export interface DeviceConnection {
    id: number;
    provider: "strava" | "garmin" | "coros";
    providerUserId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DeviceConnectionsResponse {
    connections: DeviceConnection[];
}

export interface LinkStravaRequest {
    code: string;
    redirectUri?: string;
}

export interface LinkStravaResponse {
    connection: DeviceConnection;
}

export interface UnlinkDeviceResponse {
    success: boolean;
}
