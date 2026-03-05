# Resume Feedback Frontend

Frontend application for uploading resumes, reviewing version history, sharing documents with collaborators, collecting comments, and surfacing AI-generated feedback.

This project is built as a Vite + React SPA and integrates with a separate backend API for authentication, file handling, sharing, comments, and asynchronous AI analysis.

## Overview

The application covers the following user flows:

- Email/password authentication
- Google sign-in via Google Identity Services
- Resume upload and version management
- PDF preview and download
- Share link creation and revocation
- Commenting on resume versions
- AI feedback polling and rendering
- Basic profile management

## Tech Stack

- React 18
- TypeScript
- Vite 5
- React Router 6
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- React Hook Form
- Zod
- react-pdf

## Project Structure

```text
src/
  components/       Reusable UI and feature components
  contexts/         App-wide providers, including auth
  hooks/            Shared React hooks
  lib/              Small utilities
  pages/            Route-level screens
  services/         API client and domain service modules
  types/            Shared TypeScript contracts
docs/
  frontend-handoff.local.md   Backend integration notes used during development
```

## Application Routes

Public routes:

- `/`
- `/about`
- `/auth`
- `/share/:token`

Protected routes:

- `/my-resumes`
- `/upload`
- `/resume/:id`
- `/profile`

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_URL=https://your-api-host.com
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Notes:

- `VITE_API_URL` should point to the API host, not necessarily the `/api` path. The client normalizes this internally.
- `VITE_GOOGLE_CLIENT_ID` is required for Google sign-in to render and work correctly.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or Bun

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the codebase

```bash
npm run lint
```

## API Integration

The frontend talks to the backend through a small service layer in `src/services`.

Key implementation details:

- `api-config.ts` centralizes API URL normalization
- `api-client.ts` injects the JWT token from `localStorage`
- non-`FormData` requests are sent as JSON
- backend errors are parsed into a consistent frontend error shape
- resume preview and download use direct URLs because those endpoints may redirect

The default production API configured in the client is:

```text
https://resumefeedback-api.hmpedro.com
```

## Authentication Model

- JWT access token is stored in `localStorage`
- auth state is restored on app boot from the stored token
- user identity is derived from the JWT payload on the client
- protected pages are guarded through `ProtectedRoute`

Supported auth flows:

- Register with email/password
- Login with email/password
- Login/register with Google
- Reactivate account through backend support endpoint

## Feature Notes

### Resume Management

- Users can upload an initial resume and create additional versions
- The resume details page combines metadata, version history, preview, comments, and share controls in one place
- PDF preview uses authenticated requests when necessary

### Sharing and Collaboration

- Owners can create share links with permission, expiration, and max-use controls
- Share links can be revoked from the resume details page
- Comments are version-aware

### AI Feedback

- AI analysis is asynchronous
- The frontend checks job status and loads feedback when processing is complete
- Regeneration is supported through the API layer

## Engineering Notes

- Route composition is defined in `src/App.tsx`
- Auth state lives in `src/contexts/AuthContext.tsx`
- API configuration lives in `src/services/api-config.ts`
- API request orchestration lives in `src/services/api-client.ts`

Current constraints worth addressing next:

- there is no automated test suite wired into `package.json`
- token storage relies on `localStorage`, which is simple but not ideal for higher-security environments
- some UI copy is localized in Portuguese while project metadata is in English, so language consistency should be clarified
- the repository includes both `package-lock.json` and `bun.lockb`; the team should standardize on one package manager

## Suggested Next Improvements

If this project is going to production at scale, the next engineering steps should be:

- add unit and integration tests for service modules and route-level flows
- add request retry/backoff strategy where appropriate for async AI jobs
- formalize environment handling with `.env.example`
- add CI for linting and build verification
- define stronger auth/session handling and token expiry behavior

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## Status

The application is functional as a modern frontend client for a resume review platform, with a clean separation between route screens, feature components, and API services. The main gap today is engineering hardening: tests, CI, and a more explicit deployment/runtime contract.
