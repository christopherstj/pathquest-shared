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
 */
export interface PeakPhotosResponse {
    photos: PublicPeakPhoto[];
}

/**
 * Response from GET /photos/by-summit.
 */
export interface SummitPhotosResponse {
    photos: SummitPhoto[];
}

