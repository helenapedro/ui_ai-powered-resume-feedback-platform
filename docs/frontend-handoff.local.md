# FRONTEND HANDOFF (LOCAL-ONLY, DO NOT COMMIT)

This document is for frontend implementation and integration only.

## Environment

- Production API base URL: `https://resumefeedback-api.hmpedro.com`
- Heroku app URL (fallback/debug): `https://feedback-api-async-859fb63e69b5.herokuapp.com`

Use:

```ts
export const API_BASE_URL = "https://resumefeedback-api.hmpedro.com";
```

## CORS Status

Backend CORS allowlist:
- `http://localhost:8080`
- `https://resumefeedback.hmpedro.com`
- `https://feedback.hmpedro.com`
- Methods: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
- Headers: `*`

Frontend should still send standard headers only (`Authorization`, `Content-Type`).

## Authentication

### Register
- `POST /api/auth/register`
- Body:
```json
{ "email": "user@test.com", "password": "1234" }
```

### Login
- `POST /api/auth/login`
- Body:
```json
{ "email": "user@test.com", "password": "1234" }
```
- Response:
```json
{ "accessToken": "<jwt>" }
```

### Google Login/Register
- `POST /api/auth/google`
- Body:
```json
{ "idToken": "<google_id_token_from_frontend_oauth_flow>" }
```
- Behavior:
  - If user email exists, logs in.
  - If user email does not exist, creates account and logs in.
- Response:
```json
{ "accessToken": "<jwt>" }
```

### Google Frontend Setup
- Frontend env var:
  - `VITE_GOOGLE_CLIENT_ID=<google_oauth_web_client_id>`
- Authorized JavaScript origins in Google Cloud OAuth client must include:
  - `https://resumefeedback.hmpedro.com`
  - `https://feedback.hmpedro.com`
  - your actual local frontend origin
- Important local dev note:
  - Backend CORS currently allows `http://localhost:8080`, not `http://localhost:5173`.
  - If the frontend runs on `5173`, backend CORS must be updated before browser requests will succeed.
- ID token acquisition:
  - Use Google Identity Services in frontend and request an ID token.
  - Send received ID token to backend `/api/auth/google`.

Minimal client-side flow:
1. User clicks "Continue with Google".
2. Frontend gets `idToken` from Google.
3. Frontend `POST /api/auth/google` with `{ idToken }`.
4. Store returned JWT (`accessToken`) and use `Authorization: Bearer <jwt>`.

Store token and send:
`Authorization: Bearer <jwt>`

### Reactivate disabled account
- `POST /api/auth/reactivate`
- Body:
```json
{ "email": "user@test.com", "password": "1234" }
```
- Response:
```json
{ "accessToken": "<jwt>" }
```

## User Profile (JWT required)

### Get current user profile
- `GET /api/users/me`

### Update current user profile
- `PATCH /api/users/me`
- Body (all optional):
```json
{
  "fullName": "Helena Pedro",
  "phone": "+1 555 123 4567",
  "bio": "Backend engineer focused on resume intelligence.",
  "avatarUrl": "https://cdn.example.com/avatars/helena.jpg"
}
```

### Upload current user avatar
- `POST /api/users/me/avatar`
- `multipart/form-data`
  - `file` (required, `png|jpg|jpeg|webp`, max `2MB`)
- Response: updated `UserProfileDTO` with new `avatarUrl`

### Deactivate current user account
- `POST /api/users/me/deactivate`
- Response:
  - `204 No Content`

### Permanently delete current user account
- `DELETE /api/users/me`
- Response:
  - `204 No Content`

## Resume Flows (JWT required)

### List resumes
- `GET /api/resumes`

### Get resume details + versions
- `GET /api/resumes/{resumeId}`

Response includes:
- `resume` summary
- `versions` list (each version has its own `id`)

Use each `version.id` to support per-version preview/download in UI.

### Upload first resume
- `POST /api/resumes`
- `multipart/form-data`
  - `file` (required)
  - `title` (optional)

### Add new version
- `POST /api/resumes/{resumeId}/versions`
- `multipart/form-data`
  - `file` (required)

### Delete resume
- `DELETE /api/resumes/{resumeId}`
- Response:
  - `204 No Content`

### Download version
- `GET /api/resumes/{resumeId}/versions/{versionId}/download`
- Can return:
  - direct file response, or
  - `302` redirect to pre-signed URL

Frontend should follow redirects.

### Preview version (inline)
- `GET /api/resumes/{resumeId}/versions/{versionId}/preview`
- Supports preview of any specific version (`v1`, `v2`, etc.) by changing `versionId`.
- Can return:
  - direct inline response, or
  - `302` redirect to pre-signed URL configured for inline content

Recommended UI behavior:
- In details page, add "Preview" action per version item.
- Open in embedded viewer (`iframe`/pdf.js) or new tab.

## Share Link Flows

### Owner
- `POST /api/resumes/{resumeId}/share-links`
- `GET /api/resumes/{resumeId}/share-links`
- `POST /api/resumes/{resumeId}/share-links/{linkId}/revoke`

Create request:
```json
{
  "permission": "VIEW",
  "expiresAt": "2026-03-31T23:59:59Z",
  "maxUses": 20
}
```

Important:
- Creation response returns the plaintext token once.
- Save this token in UI state at creation time.

### Public (no JWT)
- `GET /api/share/{token}`
- `GET /api/share/{token}/download`
- `GET /api/share/{token}/preview`

Note:
- Public token endpoints operate on the current resume version.
- They do not expose arbitrary historical versions.

## Comment Flows

### Owner comments (JWT)
- `GET /api/resumes/{resumeId}/versions/{versionId}/comments`
- `POST /api/resumes/{resumeId}/versions/{versionId}/comments`
- `DELETE /api/resumes/{resumeId}/versions/{versionId}/comments/{commentId}` (owner moderation)

### Shared-link comments (token + JWT required)
- `GET /api/share/{token}/comments`
- `POST /api/share/{token}/comments`
- `PATCH /api/share/{token}/comments/{commentId}`
- `DELETE /api/share/{token}/comments/{commentId}`

Rules:
- Share links with `permission=VIEW`:
  - Public preview/download allowed (no auth)
  - Comments are not available
- Share links with `permission=COMMENT`:
  - Comments endpoints require `Authorization: Bearer <jwt>`
  - New comments are authored by the authenticated user
  - Comment can be edited/deleted by:
    - the comment author, or
    - the resume owner (moderation)

Create comment body:
```json
{
  "body": "Great resume structure",
  "anchorRef": null,
  "parentCommentId": null
}
```

Update comment body:
```json
{
  "body": "Updated text",
  "anchorRef": "page:1#xywh=10,10,100,20"
}
```

## AI Flows

### Job status
- `GET /api/resumes/{resumeId}/versions/{versionId}/ai-jobs/latest`

Status values:
- `PENDING`
- `PROCESSING`
- `DONE`
- `FAILED`

### Regenerate
- `POST /api/resumes/{resumeId}/versions/{versionId}/ai-jobs/regenerate`
- Optional query param:
  - `language=EN|PT`

### Fetch feedback
- `GET /api/resumes/{resumeId}/versions/{versionId}/ai-feedback`

### Fetch version-to-version progress analysis
- `GET /api/resumes/{resumeId}/versions/{versionId}/ai-progress`
- Use when the current version has a previous version with baseline feedback.
- Frontend should treat missing progress as a valid state for first versions or versions without baseline history.

## Recommended Frontend Polling

When resume/version is uploaded:
1. Start polling `/ai-jobs/latest` every `3s`.
2. Stop when status is `DONE` or `FAILED`.
3. If `DONE`, fetch `/ai-feedback`.
4. Timeout UX after `90-120s` with retry option.

## Error Contract

Backend error format:
```json
{
  "code": "INTERNAL_ERROR",
  "message": "Human-readable message",
  "status": 500,
  "path": "/api/...",
  "timestamp": "2026-02-28T00:00:00Z",
  "traceId": "uuid-like",
  "details": {}
}
```

Frontend handling:
- Always display `message`.
- Log `traceId` for support/debug.
- On `401/403`, route to login/unauthorized state.

## Known Integration Notes

- `GET /api/auth/login` is invalid. Login is `POST`.
- Google auth backend requires env var:
  - `GOOGLE_OAUTH_CLIENT_ID` (or `GOOGLE_OAUTH_CLIENT_IDS` as comma-separated list)
- If Google login fails with audience mismatch, confirm frontend `VITE_GOOGLE_CLIENT_ID`
  and backend `GOOGLE_OAUTH_CLIENT_ID` belong to the same OAuth client.
- Download endpoints may return `302`.
- Preview endpoints may also return `302`.
- AI processing is asynchronous; UI must poll job status.
