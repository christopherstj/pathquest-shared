/**
 * Type of summit that a photo is attached to.
 * - "activity": Photo attached to an activities_peaks record (Strava sync)
 * - "manual": Photo attached to a user_peak_manual record (manual entry)
 */
export type SummitType = "activity" | "manual";

/**
 * A photo owned by the current user for a specific summit.
 * Returned by GET /photos/by-summit.
 */
export interface SummitPhoto {
    id: string;
    thumbnailUrl: string;
    fullUrl: string;
    caption: string | null;
    takenAt: string | null;
}

/**
 * A public photo visible on a peak's community page.
 * Returned by GET /peaks/:id/photos.
 */
export interface PublicPeakPhoto {
    id: string;
    thumbnailUrl: string;
    fullUrl: string;
    caption: string | null;
    takenAt: string | null;
    userName: string | null;
}

/**
 * Response from POST /photos/upload-url.
 */
export interface PhotoUploadUrlResponse {
    uploadUrl: string;
    photoId: string;
    storagePath: string;
}

/**
 * Response from POST /photos/:id/complete.
 */
export interface PhotoCompleteResponse {
    id: string;
    thumbnailUrl: string;
}

/**
 * Response from PUT /photos/:id (caption update).
 */
export interface PhotoUpdateResponse {
    success: boolean;
}

/**
 * Response from DELETE /photos/:id.
 */
export interface PhotoDeleteResponse {
    success: boolean;
}

/**
 * Response from GET /peaks/:id/photos.
 * Supports cursor-based pagination for efficient infinite scrolling.
 */
export interface PeakPhotosResponse {
    photos: PublicPeakPhoto[];
    /** ISO timestamp cursor for fetching the next page. Null if no more pages. */
    nextCursor: string | null;
    /** Total count of photos (only returned on first page for efficiency). */
    totalCount: number;
}

/**
 * Response from GET /photos/by-summit.
 */
export interface SummitPhotosResponse {
    photos: SummitPhoto[];
}

/**
 * A public photo for a summit visible in the community section.
 * Returned by GET /photos/by-summit/public.
 * Does not include user attribution (user info is on the summit card itself).
 */
export interface PublicSummitPhoto {
    id: string;
    thumbnailUrl: string;
    fullUrl: string;
    caption: string | null;
    takenAt: string | null;
}/**
 * Response from GET /photos/by-summit/public.
 */
export interface PublicSummitPhotosResponse {
    photos: PublicSummitPhoto[];
}/**
 * Hero image metadata for a peak (auto-fetched from Wikipedia/Flickr/Mapbox).
 * Returned as part of the peak details response.
 * The URL is a GCS signed URL or public URL generated server-side.
 */
export interface HeroImage {
    url: string;
    thumbnailUrl: string | null;
    source: "wikipedia" | "flickr" | "mapbox_satellite";
    attribution: string | null;
    attributionUrl: string | null;
    license: string | null;
    width: number | null;
    height: number | null;
}