import type { RouteExportData } from "./generateGpx";

export default function generateGeoJson(data: RouteExportData): string {
    const { name, coords, elevationProfile, waypoints } = data;

    const hasElevation =
        elevationProfile != null && elevationProfile.length === coords.length;

    const coordinates = hasElevation
        ? coords.map(([lng, lat], i) => [lng, lat, elevationProfile![i].elevationM])
        : coords.map(([lng, lat]) => [lng, lat]);

    const features: any[] = [
        {
            type: "Feature",
            properties: { name },
            geometry: {
                type: "LineString",
                coordinates,
            },
        },
    ];

    if (waypoints && waypoints.length > 0) {
        for (let i = 0; i < waypoints.length; i++) {
            features.push({
                type: "Feature",
                properties: { name: `Waypoint ${i + 1}` },
                geometry: {
                    type: "Point",
                    coordinates: [waypoints[i].lng, waypoints[i].lat],
                },
            });
        }
    }

    return JSON.stringify(
        { type: "FeatureCollection", features },
        null,
        2
    );
}
