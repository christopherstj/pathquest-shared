# PathQuest Shared Guide

## Purpose

`pathquest-shared` provides:
- Shared TypeScript types (Peak, Challenge, Summit, etc.)
- Platform-agnostic API client wrappers
- Utility functions (formatting, conversions)

Consumed by both `pathquest-frontend` and `pathquest-native`.

## Package Layout

```
pathquest-shared/src/
  types/          # Domain types (Peak, Challenge, etc.)
  api/
    client.ts     # createClient({ baseUrl, getAuthHeaders })
    endpoints/    # Endpoint wrappers (peaks.ts, challenges.ts, etc.)
  util/           # Pure utility functions
```

## API Client Pattern

```typescript
// client.ts
export function createClient(config: {
  baseUrl: string;
  getAuthHeaders: () => Promise<Record<string, string>>;
}) { ... }

// endpoints/peaks.ts
export function searchPeaks(
  client: ApiClient,
  params: { search?: string; page?: string }
): Promise<Peak[]> { ... }
```

## Consumption

Each app creates its own client:

```typescript
// Web (Next.js)
const client = createClient({
  baseUrl: process.env.BACKEND_URL,
  getAuthHeaders: () => getNextAuthHeaders(),
});

// Native (Expo)
const client = createClient({
  baseUrl: EXPO_PUBLIC_API_URL,
  getAuthHeaders: () => ({ Authorization: `Bearer ${token}` }),
});
```

## Installation (Git SHA)

```json
{
  "dependencies": {
    "@pathquest/shared": "git+https://github.com/org/pathquest-shared.git#<sha>"
  }
}
```

**Update workflow**:
1. Push changes to pathquest-shared
2. Update SHA in consuming repos
3. Run `npm install` to update lockfile

## Rules

- **No platform-specific code** (no Node.js `fs`, no React Native APIs)
- **No React components** (types and pure functions only)
- **No environment variables** (injected by each app)
- **Web-standard APIs only** (`fetch`, `URL`, etc.)
