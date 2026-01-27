import type { ApiClient, JsonRequestInit } from "../client";
import type {
  SummitType,
  PhotoUploadUrlResponse,
  PhotoCompleteResponse,
  PhotoUpdateResponse,
  PhotoDeleteResponse,
  PeakPhotosResponse,
  SummitPhotosResponse,
  PublicSummitPhotosResponse,
} from "../../types";

// ─────────────────────────────────────────────────────────────────────────────
// Photo Upload Flow
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Request a signed URL for uploading a photo to GCS.
 * After receiving the URL, the client should PUT the image bytes directly to it.
 *
 * POST /photos/upload-url
 */
export async function getPhotoUploadUrl(
  client: ApiClient,
  params: {
    summitType: SummitType;
    summitId: string;
    contentType?: string;
    filename?: string;
  },
  init?: JsonRequestInit
): Promise<PhotoUploadUrlResponse> {
  return client.fetchJson<PhotoUploadUrlResponse>("/photos/upload-url", {
    ...init,
    method: "POST",
    json: {
      summitType: params.summitType,
      summitId: params.summitId,
      contentType: params.contentType ?? "image/jpeg",
      filename: params.filename,
    },
  });
}

/**
 * Confirm that a photo upload is complete.
 * The server will generate a thumbnail and update metadata.
 *
 * POST /photos/:id/complete
 */
export async function completePhotoUpload(
  client: ApiClient,
  params: {
    photoId: string;
    width?: number;
    height?: number;
    takenAt?: string;
  },
  init?: JsonRequestInit
): Promise<PhotoCompleteResponse> {
  return client.fetchJson<PhotoCompleteResponse>(
    `/photos/${encodeURIComponent(params.photoId)}/complete`,
    {
      ...init,
      method: "POST",
      json: {
        width: params.width,
        height: params.height,
        takenAt: params.takenAt,
      },
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Photo Management
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update a photo's caption.
 *
 * PUT /photos/:id
 */
export async function updatePhotoCaption(
  client: ApiClient,
  params: {
    photoId: string;
    caption: string | null;
  },
  init?: JsonRequestInit
): Promise<PhotoUpdateResponse> {
  return client.fetchJson<PhotoUpdateResponse>(
    `/photos/${encodeURIComponent(params.photoId)}`,
    {
      ...init,
      method: "PUT",
      json: { caption: params.caption },
    }
  );
}

/**
 * Delete a photo.
 *
 * DELETE /photos/:id
 */
export async function deletePhoto(
  client: ApiClient,
  photoId: string,
  init?: JsonRequestInit
): Promise<PhotoDeleteResponse> {
  return client.fetchJson<PhotoDeleteResponse>(
    `/photos/${encodeURIComponent(photoId)}`,
    {
      ...init,
      method: "DELETE",
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Photo Retrieval
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get public photos for a peak (community gallery).
 * Only returns photos from public summits by public users.
 * Supports cursor-based pagination for efficient infinite scrolling.
 *
 * GET /peaks/:id/photos
 */
export async function getPeakPhotos(
  client: ApiClient,
  params: {
    peakId: string;
    /** ISO timestamp cursor for pagination. Omit for first page. */
    cursor?: string;
    /** Max photos per page (default 20, max 100). */
    limit?: number;
  },
  init?: JsonRequestInit
): Promise<PeakPhotosResponse> {
  const searchParams = new URLSearchParams();
  if (params.cursor != null) {
    searchParams.set("cursor", params.cursor);
  }
  if (params.limit != null) {
    searchParams.set("limit", String(params.limit));
  }
  const qs = searchParams.toString();
  return client.fetchJson<PeakPhotosResponse>(
    `/peaks/${encodeURIComponent(params.peakId)}/photos${qs ? `?${qs}` : ""}`,
    init
  );
}

/**
 * Get photos for a specific summit owned by the current user.
 * Used in the summit report modal to manage the user's own photos.
 *
 * GET /photos/by-summit
 */
export async function getSummitPhotos(
  client: ApiClient,
  params: {
    summitType: SummitType;
    summitId: string;
  },
  init?: JsonRequestInit
): Promise<SummitPhotosResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("summitType", params.summitType);
  searchParams.set("summitId", params.summitId);
  return client.fetchJson<SummitPhotosResponse>(
    `/photos/by-summit?${searchParams.toString()}`,
    init
  );
}

/**
 * Get public photos for a specific summit.
 * Used in the community section to show photos on public summit cards.
 * No authentication required - only returns photos from public summits by public users.
 *
 * GET /photos/by-summit/public
 */
export async function getPublicSummitPhotos(
  client: ApiClient,
  params: {
    summitType: SummitType;
    summitId: string;
    limit?: number;
  },
  init?: JsonRequestInit
): Promise<PublicSummitPhotosResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("summitType", params.summitType);
  searchParams.set("summitId", params.summitId);
  if (params.limit != null) {
    searchParams.set("limit", String(params.limit));
  }
  return client.fetchJson<PublicSummitPhotosResponse>(
    `/photos/by-summit/public?${searchParams.toString()}`,
    init
  );
}
