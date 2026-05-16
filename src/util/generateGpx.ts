export interface RouteExportData {
    name: string;
    coords: [number, number][]; // [lng, lat][]
    elevationProfile: { distanceM: number; elevationM: number }[] | null;
    waypoints?: { lat: number; lng: number }[] | null;
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export default function generateGpx(data: RouteExportData): string {
    const { name, coords, elevationProfile, waypoints } = data;

    const hasElevation =
        elevationProfile != null && elevationProfile.length === coords.length;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<gpx version="1.1" creator="PathQuest"\n`;
    xml += `     xmlns="http://www.topografix.com/GPX/1/1"\n`;
    xml += `     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    xml += `     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n`;
    xml += `  <metadata><name>${escapeXml(name)}</name></metadata>\n`;
    xml += `  <trk>\n`;
    xml += `    <name>${escapeXml(name)}</name>\n`;
    xml += `    <trkseg>\n`;

    for (let i = 0; i < coords.length; i++) {
        const [lng, lat] = coords[i];
        xml += `      <trkpt lat="${lat}" lon="${lng}">`;
        if (hasElevation) {
            xml += `<ele>${elevationProfile![i].elevationM}</ele>`;
        }
        xml += `</trkpt>\n`;
    }

    xml += `    </trkseg>\n`;
    xml += `  </trk>\n`;

    if (waypoints && waypoints.length > 0) {
        for (let i = 0; i < waypoints.length; i++) {
            const wp = waypoints[i];
            xml += `  <wpt lat="${wp.lat}" lon="${wp.lng}"><name>Waypoint ${i + 1}</name></wpt>\n`;
        }
    }

    xml += `</gpx>\n`;
    return xml;
}
