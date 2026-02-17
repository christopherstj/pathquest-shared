export interface PublicLandDetail {
    objectId: string;
    name: string;
    designationType: string;
    manager: string;
    centroid: [number, number];
    geometry: any;
    inGrizzlyRange: boolean;
}

export interface PublicLandPeaksResult {
    peaks: Array<{
        id: string;
        name: string;
        elevation: number | null;
        state: string | null;
        location_coords: [number, number] | null;
        public_summits: number;
        summits: number;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
