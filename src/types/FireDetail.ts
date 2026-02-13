export interface FireDetail {
    incidentId: string;
    name: string;
    acres: number | null;
    percentContained: number | null;
    state: string | null;
    incidentType: string | null;
    discoveredAt: string | null;
    fetchedAt: string;
    centroid: [number, number];
    geometry: any;
    nearbyPeaks: { id: string; name: string; distanceKm: number }[];
}
