# PathQuest Shared Architecture

## Overview
`pathquest-shared` is the shared TypeScript library used by PathQuest client applications:
- `pathquest-frontend` (Next.js web app)
- `pathquest-native` (Expo / React Native app)

The goal is to **avoid copy/paste** by keeping:
- shared request/response types
- shared domain types
- shared API client helpers (endpoint wrappers)

`pathquest-shared` should not contain any Next.js- or Expo-specific code. It is a plain TypeScript package consumed from GitHub.

## Scope
### Included
- Shared types (e.g. `Peak`, `Challenge`, `Summit`, etc.)
- Shared API endpoint wrappers for `pathquest-api` (pure `fetch`)
- Optional runtime validation (e.g. Zod schemas) for defensive parsing

### Not included
- Next.js server actions (`"use server"`)
- React components / hooks
- Environment variable loading (handled by each app)
- Secrets (never ship Strava client secret)

## Package Layout (proposed)
```
pathquest-shared/
  src/
    index.ts
    types/
      index.ts
      peaks.ts
      challenges.ts
      activities.ts
      users.ts
    api/
      index.ts
      client.ts          # createClient({ baseUrl, getAuthHeaders, fetchImpl })
      endpoints/
        peaks.ts
        challenges.ts
        activities.ts
        users.ts
    util/
      index.ts
      errors.ts          # ApiError, error helpers
  dist/                  # compiled output (generated)
  package.json
  tsconfig.json
  README.md
  ARCHITECTURE.md
```

## API Client Design
The API client is designed to be shared across platforms by injecting auth + transport:

- `baseUrl`: the `pathquest-api` base URL
- `getAuthHeaders()`: async function returning headers (e.g. `{ Authorization: "Bearer …" }`)
  - web: returns NextAuth session JWT token
  - native: returns PathQuest mobile session token (from expo-secure-store)
- `fetchImpl`: optional override for testing (defaults to global `fetch`)

This keeps all "what endpoint / what types / how to parse errors" logic in one place.

## API Endpoints

### Auth (`api/endpoints/auth.ts`)
Mobile authentication endpoints (no auth required):
- `exchangeStravaCode(client, { code, codeVerifier })` - Exchange Strava PKCE code for PathQuest tokens
- `refreshMobileToken(client, { refreshToken })` - Refresh an expired access token

### Peaks (`api/endpoints/peaks.ts`)
Peak discovery and summit management endpoints.

Phase 2 additions (used by native Peak Detail):
- `getPeakActivity(client, peakId)` → `GET /api/peaks/:id/activity`
- `getPeakPublicSummitsCursor(client, { peakId, cursor?, limit? })` → `GET /api/peaks/:id/public-summits` (cursor pagination; returns `{ summits, nextCursor, totalCount }`)

### Challenges (`api/endpoints/challenges.ts`)
Challenge browsing and progress tracking endpoints.

### Activities (`api/endpoints/activities.ts`)
Activity viewing, reprocessing, and trip report endpoints.

Trip report endpoints (added for activity-first trip reports):
- `updateActivityReport(client, activityId, { tripReport?, tripReportIsPublic?, displayTitle?, conditionTags? })` → `PUT /api/activities/:id/report` (auth required, owner only). Automatically sets `is_reviewed = TRUE`. Returns updated activity.
- `dismissActivityReview(client, activityId)` → `POST /api/activities/:id/dismiss` (auth required, owner only). Sets `is_reviewed = TRUE` without modifying trip report fields. Returns `{ success: boolean }`.
- `getPublicActivity(client, activityId)` → `GET /api/activities/:id/public` (no auth). Returns PathQuest-owned activity data only (no Strava data): display_title, trip_report (if public), condition_tags (if public), start_time, timezone, user info (if public), and summits with peak data.

### Users (`api/endpoints/users.ts`)
User profile and settings endpoints.

### Photos (`api/endpoints/photos.ts`)
Photo upload, management, and retrieval endpoints (Stage 4).

**Upload Flow:**
- `getPhotoUploadUrl(client, { summitType, summitId, contentType?, filename? })` → `POST /photos/upload-url`
  - Returns signed GCS URL for direct upload
- `completePhotoUpload(client, { photoId, width?, height?, takenAt? })` → `POST /photos/:id/complete`
  - Server generates thumbnail and updates metadata

**Management:**
- `updatePhotoCaption(client, { photoId, caption })` → `PUT /photos/:id`
- `deletePhoto(client, photoId)` → `DELETE /photos/:id`

**Retrieval:**
- `getPeakPhotos(client, { peakId, cursor?, limit? })` → `GET /peaks/:id/photos`
  - Public photos for peak community gallery with cursor-based pagination
  - Returns `{ photos, nextCursor, totalCount }`
- `getSummitPhotos(client, { summitType, summitId })` → `GET /photos/by-summit`
  - Owner's photos for a specific summit (used in summit report modal)
- `getPublicSummitPhotos(client, { summitType, summitId, limit? })` → `GET /photos/by-summit/public`
  - Public photos for a specific summit (used in community section)

**Types (`types/Photo.ts`):**
- `SummitType` - `"activity" | "manual"`
- `SummitPhoto` - Photo owned by current user
- `PublicPeakPhoto` - Public photo with user attribution
- `PhotoUploadUrlResponse`, `PhotoCompleteResponse`, `PhotoUpdateResponse`, `PhotoDeleteResponse`
- `PeakPhotosResponse` - Paginated response with `photos`, `nextCursor`, `totalCount`
- `SummitPhotosResponse`
- `PublicSummitPhoto` - Photo for public summit cards (no user attribution)
- `PublicSummitPhotosResponse`

### Search (`api/endpoints/search.ts`)
Unified relevancy-based search endpoints.

- `unifiedSearch(client, params)` → `GET /api/search`
  - **Params**: `{ query, lat?, lng?, bounds?, limit?, includePeaks?, includeChallenges? }`
  - **Returns**: `UnifiedSearchResponse` with ranked results and totals
  - Combines peaks and challenges into a single relevancy-ranked result set
  - Supports geographic proximity, text match quality, and public popularity scoring
  - Viewport bounds boost results visible on the current map

**Types (`types/UnifiedSearchResult.ts`):**
- `RelevancyFactors` - Individual score components (textMatch, geoProximity, publicPopularity, personalRelevance, challengeMembership)
- `PeakSearchResult` - Peak with relevancy score and factors
- `ChallengeSearchResult` - Challenge with relevancy score and factors
- `UnifiedSearchResult` - Union of peak/challenge results
- `UnifiedSearchResponse` - Response with results and totals
- `UnifiedSearchParams` - Search query parameters

## Consumption (GitHub, no npm publish)
Both client repos depend on this package via a **git URL pinned to a commit SHA**.

Example dependency:
- `git+ssh://git@github.com/<org>/pathquest-shared.git#<sha>`

Benefits:
- no npm publishing
- no semver churn required early on
- installs are reproducible (SHA is the version)

Update workflow:
1. Commit + push changes to `pathquest-shared`
2. Update the SHA in `pathquest-frontend` and/or `pathquest-native`
3. Commit lockfile updates in those repos

### Vercel / CI access requirements
If `pathquest-shared` is **private**, Vercel must have permission to fetch it during `npm install` for `pathquest-frontend` builds.

- Ensure the Vercel project is connected to GitHub via the Vercel GitHub integration.
- In GitHub, grant the Vercel GitHub App access to the `pathquest-shared` repository (organization/repo access settings).
- Prefer `git+https://github.com/<org>/pathquest-shared.git#<sha>` in `package.json` for Vercel compatibility.
- This package uses `prepare` to run `npm run build` on install. Vercel’s install step must not disable lifecycle scripts.

## Build Strategy for Git Dependencies
Git dependencies should provide compiled JS + `.d.ts` to consumers.

Recommended approach:
- `tsc` outputs to `dist/`
- `package.json` points `main`/`types` to `dist/*`
- use `prepare` script so installs from git build automatically

Notes:
- Keep the build small and deterministic.
- Avoid platform-specific code (no Node-only APIs unless also needed by RN).

## Compatibility Notes
- Avoid importing Node-only modules (e.g. `fs`, `path`) since `pathquest-native` runs in React Native.
- Prefer web-standard APIs (`fetch`, `URL`, etc.).

---

## Migration Plan: Files to Transfer from `pathquest-frontend`

This section documents which files from `pathquest-frontend/frontend/pathquest/src/` should be moved to `pathquest-shared` and how they should be adapted.

### 1. Type Definitions (Complete Transfer)

**Source**: `pathquest-frontend/frontend/pathquest/src/typeDefs/*.ts`

All 21 type definition files should be moved as-is to `pathquest-shared/src/types/`:

#### Core Domain Types
- `Activity.ts` - Strava activity data structure (includes trip report fields: `trip_report`, `trip_report_is_public`, `display_title`, `condition_tags`, `is_reviewed`)
- `PublicActivity.ts` - Public activity data (PathQuest-owned only, no Strava data). Includes `PublicActivityUser` and `PublicActivitySummit` types.
- `ActivityStart.ts` - Activity start location
- `Peak.ts` - Mountain peak catalog entry
- `Challenge.ts` - Challenge definition
- `Summit.ts` - Summit entry (includes `Difficulty`, `ExperienceRating`, `ConditionTag` types)
- `SummitWithPeak.ts` - Summit with nested peak data
- `User.ts` - User account data
- `ManualPeakSummit.ts` - Manual summit entry payload

#### Composite Types
- `ChallengeProgress.ts` - Challenge with progress tracking (extends `Challenge`)
- `AscentDetail.ts` - Detailed ascent information
- `JournalEntry.ts` - Journal entry structure
- `UserPeakWithSummitCount.ts` - Peak with user's summit count
- `UserChallengeFavorite.ts` - User's favorited challenge

#### Response Types
- `ServerActionResult.ts` - Generic API response wrapper (`{ success, data?, error? }`)
- `ProfileStats.ts` - User profile statistics
- `DashboardStats.ts` - Dashboard quick stats
- `PeakActivity.ts` - Peak activity indicators (recent summits)
- `CurrentWeather.ts` - Weather data structure
- `UnconfirmedSummit.ts` - Summit needing user review

#### Other Types
- `StravaCreds.ts` - Strava OAuth credentials (request/response)
- `ProductDisplay.ts` - Stripe product display data

**Action**: Copy all files to `pathquest-shared/src/types/` with no modifications (they're already platform-agnostic).

---

### 2. API Client Helpers (Extract from Server Actions)

**Source**: `pathquest-frontend/frontend/pathquest/src/actions/*/*.ts`

Server actions contain Next.js-specific code (`"use server"`, `useAuth()`, `getGoogleIdToken()`) that cannot be shared. However, the **core fetch logic** (endpoint paths, query params, request/response types) can be extracted into platform-agnostic functions.

#### Extraction Pattern

Each server action follows this pattern:
1. Get auth context (`useAuth()`, `getGoogleIdToken()`)
2. Build URL with query params
3. Call `fetch()` with headers
4. Parse response
5. Return typed data

**What to extract**: Steps 2-4 (URL building, fetch call, response parsing)
**What stays in frontend**: Steps 1 and 5 (auth context, Next.js-specific return wrappers)

#### Files to Extract From

##### Peaks (`actions/peaks/`)
- `getPeakDetailsPublic.ts` → Extract: `GET /peaks/:id` (public, no auth)
- `getPeakDetails.ts` → Extract: `GET /peaks/:id` (authenticated)
- `searchPeaks.ts` → Extract: `GET /peaks/search` with query params
- `getTopPeaks.ts` → Extract: `GET /peaks/top`
- `getPeaks.ts` → Extract: `GET /peaks` (paginated list)
- `getPeakSummits.ts` → Extract: `GET /peaks/summits/:userId`
- `getRecentSummits.ts` → Extract: `GET /peaks/summits/recent`
- `getUnclimbedPeaks.ts` → Extract: `GET /peaks/summits/unclimbed`
- `getUnclimbedPeaksWithBounds.ts` → Extract: `GET /peaks/summits/unclimbed` with bounds
- `getFavoritePeaks.ts` → Extract: `GET /peaks/summits/favorites`
- `getIsPeakFavorited.ts` → Extract: `GET /peaks/favorite`
- `toggleFavoritePeak.ts` → Extract: `PUT /peaks/favorite`
- `addManualPeakSummit.ts` → Extract: `POST /peaks/summits/manual`
- `getAscentDetails.ts` → Extract: `GET /peaks/ascent/:ascentId`
- `updateAscent.ts` → Extract: `PUT /peaks/ascent/:ascentId`
- `deleteAscent.ts` → Extract: `DELETE /peaks/ascent/:ascentId`
- `getPeakWeather.ts` → Extract: `GET /peaks/:id/weather` (returns `CurrentWeather` from `pathquest-api`)
- `searchPeaksAlongRoute.ts` → Extract: `POST /peaks/search/along-route` (if exists)
- `redirectPublicPage.ts` → **Skip** (Next.js redirect, not API call)

##### Challenges (`actions/challenges/`)
- `getPublicChallengeDetails.ts` → Extract: `GET /challenges/:id/details` (public)
- `getChallengeDetails.ts` → Extract: `GET /challenges/:id/details` (authenticated)
- `getAllChallenges.ts` → Extract: `GET /challenges` (with bounds filter)
- `getAllChallengeIds.ts` → Extract: `GET /challenges` (IDs only, for static generation)
- `getChallenges.ts` → Extract: `GET /challenges` (paginated)
- `searchChallenges.ts` → Extract: `GET /challenges/search`
- `getFavoriteChallenges.ts` → Extract: `GET /challenges` (favorites filter)
- `getIncompleteChallenges.ts` → Extract: `POST /challenges/incomplete`
- `addChallengeFavorite.ts` → Extract: `POST /challenges/favorite`
- `deleteChallengeFavorite.ts` → Extract: `DELETE /challenges/favorite/:id`
- `updateChallengeFavorite.ts` → Extract: `PUT /challenges/favorite`
- `getChallengeActivity.ts` → Extract: `GET /challenges/:id/activity`
- `getNextPeakSuggestion.ts` → Extract: `GET /challenges/:id/next-peak`

##### Activities (`actions/activities/`)
- `getActivityDetails.ts` → Extract: `GET /activities/:id`
- `getActivityCoords.ts` → Extract: `GET /activities/:id/coords`
- `getActivityStarts.ts` → Extract: `GET /activities/starts` (if exists)
- `getRecentActivities.ts` → Extract: `GET /activities/recent`
- `searchNearestActivities.ts` → Extract: `GET /activities/search/nearest`
- `deleteActivity.ts` → Extract: `DELETE /activities/:id`
- `reprocessActivity.ts` → Extract: `POST /activities/reprocess`

##### Users (`actions/users/`)
- `getUser.ts` → Extract: `GET /users/:id`
- `getUserProfile.ts` → Extract: `GET /users/:id/profile`
- `getUserChallengeProgress.ts` → Extract: `GET /users/:userId/challenges/:challengeId`
- `searchUserPeaks.ts` → Extract: `GET /users/:id/peaks`
- `searchUserSummits.ts` → Extract: `GET /users/:id/summits`
- `getUserSummitStates.ts` → Extract: `GET /users/:userId/peaks/states`
- `getActivitiesProcessing.ts` → Extract: `GET /users/:id/activities-processing`
- `getImportStatus.ts` → Extract: `GET /users/:id/import-status`
- `getIsUserSubscribed.ts` → Extract: `GET /users/:userId/is-subscribed`
- `createUser.ts` → Extract: `POST /auth/signup` (uses `StravaCreds` from shared types)
- `createUserInterest.ts` → Extract: `POST /auth/user-interest`
- `updateUser.ts` → Extract: `PUT /users/:id`
- `deleteUser.ts` → Extract: `DELETE /users/:id`
- `processHistoricalData.ts` → Extract: `POST /historical-data`

##### Auth (`actions/auth/`)
- `redirectEmail.ts` → **Skip** (Next.js redirect)
- `redirectLogin.ts` → **Skip** (Next.js redirect)

##### Root Actions
- `searchNearestPeaks.ts` → Extract: `GET /peaks/search/nearest`
- `getTimezoneFromCoords.ts` → Extract: `GET /timezone` (if exists) or note it's frontend-only (uses geo-tz library)

#### Extraction Example

**Before** (server action):
```typescript
"use server";
import getGoogleIdToken from "@/auth/getGoogleIdToken";
import { useAuth } from "@/auth/useAuth";
import getBackendUrl from "@/helpers/getBackendUrl";
import Peak from "@/typeDefs/Peak";

const backendUrl = getBackendUrl();

const searchPeaks = async (
    search?: string,
    page?: string
): Promise<Peak[]> => {
    const session = await useAuth();
    const token = await getGoogleIdToken().catch(() => null);
    
    const url = new URL(`${backendUrl}/peaks/search`);
    if (search) url.searchParams.append("search", search);
    if (page) url.searchParams.append("page", page);
    
    const res = await fetch(url.toString(), {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(session?.user?.id ? { "x-user-id": session.user.id } : {}),
        },
    });
    
    if (!res.ok) return [];
    return await res.json();
};
```

**After** (shared API client):
```typescript
// pathquest-shared/src/api/endpoints/peaks.ts
import { ApiClient } from '../client';
import { Peak } from '../../types';

export function searchPeaks(
    client: ApiClient,
    params: { search?: string; page?: string }
): Promise<Peak[]> {
    const url = new URL(`${client.baseUrl}/peaks/search`);
    if (params.search) url.searchParams.append("search", params.search);
    if (params.page) url.searchParams.append("page", params.page);
    
    return client.fetch(url.toString(), { method: 'GET' });
}
```

**After** (web server action wrapper):
```typescript
"use server";
import { searchPeaks } from "@pathquest/shared/api";
import { createApiClient } from "@/lib/api-client"; // web-specific wrapper

const searchPeaksAction = async (search?: string, page?: string) => {
    const client = await createApiClient(); // injects getGoogleIdToken + useAuth
    return searchPeaks(client, { search, page });
};
```

**Action**: Create `pathquest-shared/src/api/endpoints/` with extracted functions. Each function accepts an `ApiClient` instance and typed params, returns typed data.

---

### 3. Utility Functions (Platform-Agnostic Only)

**Source**: `pathquest-frontend/frontend/pathquest/src/helpers/*.ts`

Only move utilities that are **platform-agnostic** (no DOM, no Next.js, no browser APIs).

#### Files to Transfer

- `metersToFt.ts` - Pure conversion function
- `getDistanceString.ts` - Formatting function (meters → string)
- `getElevationString.ts` - Formatting function (elevation → string)
- `getVerticalGainString.ts` - Formatting function (gain → string)
- `numSecsToHhmmss.ts` - Time formatting (seconds → HH:MM:SS)
- `stateAbbreviations.ts` - State name/abbreviation mapping + search query utilities

#### Files to Keep in Frontend (Platform-Specific)

- `getBackendUrl.ts` - Environment variable loading (each app handles differently)
- `getAuthHeaders.ts` - Next.js-specific auth header building
- `getMapStateFromURL.ts` - URL parsing (Next.js router)
- `updateMapStateInURL.ts` - URL manipulation (Next.js router)
- `updateMapURL.ts` - URL manipulation (Next.js router)
- `navigateWithMapState.ts` - Next.js router integration
- `getBoundsFromURL.ts` - URL parsing
- `updateURLWithBounds.ts` - URL manipulation
- `getTrueMapCenter.ts` - Mapbox-specific (web GL JS)
- `convertPeaksToGeoJSON.ts` - Mapbox-specific (web GL JS)
- `convertChallengesToGeoJSON.ts` - Mapbox-specific (web GL JS)
- `convertActivitiesToGeoJSON.ts` - Mapbox-specific (web GL JS)
- `convertSummitsToPeaks.ts` - Mapbox-specific (web GL JS)
- `getNewData.ts` - Mapbox-specific (web GL JS)
- `peaksSearchState.ts` - React state management (module-level state)
- `getRoutes.tsx` - Next.js route config
- `getStripe.ts` - Stripe client (Node.js)
- `dayjs.ts` - Day.js config (may be app-specific)
- `checkEmail.ts` - Email validation (can be shared if pure)
- `hexToRgb.ts` - Color conversion (can be shared if pure)
- `oklchToHex.ts` - Color conversion (can be shared if pure)

**Action**: Copy the 6 utility files listed above to `pathquest-shared/src/util/`.

---

### 4. Summary

**Total files to transfer**:
- **21 type definition files** → `src/types/`
- **~50+ API endpoint functions** (extracted from server actions) → `src/api/endpoints/`
- **6 utility functions** → `src/util/`

**Files to keep in frontend**:
- All server actions (they become thin wrappers around shared API client)
- Next.js-specific helpers (URL manipulation, router integration)
- Mapbox GL JS-specific helpers (GeoJSON conversion, map state)
- Environment/config loading

**Migration order**:
1. Move types first (no dependencies)
2. Create API client infrastructure (`client.ts`, error handling)
3. Extract API endpoint functions (depends on types + client)
4. Move utility functions (depends on types)
5. Update frontend to use shared package (server actions become wrappers)


