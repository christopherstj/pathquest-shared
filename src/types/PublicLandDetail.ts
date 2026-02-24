export interface PublicLandDetail {
    objectId: string;
    name: string;
    designationType: string;
    manager: string;
    centroid: [number, number];
    geometry: any;
    inGrizzlyRange: boolean;
}

export interface PublicLandPeak {
    id: string;
    name: string;
    elevation: number | null;
    state: string | null;
    location_coords: [number, number] | null;
    public_summits: number;
    summits: number;
    heroImage?: {
        url: string;
        thumbnailUrl: string | null;
        source: "wikipedia" | "flickr" | "mapbox_satellite";
        attribution: string | null;
        attributionUrl: string | null;
        license: string | null;
        width: number | null;
        height: number | null;
    } | null;
}

export interface PublicLandPeaksResult {
    peaks: PublicLandPeak[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
