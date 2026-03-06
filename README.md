# Resume Feedback Frontend

Frontend SPA for uploading, versioning, sharing, and collaboratively reviewing resumes, with AI-generated feedback and JWT/Google authentication.

The project consumes an external API for authentication, user management, file handling, comments, public share links, and asynchronous AI analysis.

## Overview

The product currently supports these main flows:

- email/password authentication
- Google sign-in and registration through Google Identity Services
- resume upload and new version submission
- file preview and download
- share link creation and revocation
- version-specific comments
- AI feedback with async job polling
- basic profile management
- resume pinning and title search in the dashboard

## Stack

- React 18
- TypeScript
- Vite 5
- React Router 6
- Redux Toolkit
- React Redux
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- React Hook Form
- Zod
- react-pdf

## Architecture

The application is organized into a few clear layers:

- `src/pages`: route-level screens
- `src/components`: reusable UI and feature components
- `src/features`: feature-specific hooks and orchestration logic
- `src/store`: Redux store, typed hooks, and slices
- `src/services`: HTTP client and domain services
- `src/contexts`: compatibility and global providers
- `src/types`: shared TypeScript contracts

State management currently follows this model:

- critical global state and async flows live in Redux
- short-lived, purely visual state stays local to components
- API access is centralized in `src/services`

Current slices:

- `authSlice`
- `uploadSlice`
- `resumeDetailsSlice`
- `aiFeedbackSlice`

Current feature hooks:

- `src/features/upload/useUploadPage.ts`
- `src/features/resume-details/useResumeDetailsPage.ts`
- `src/features/ai/useAiFeedback.ts`

## Routes

Public:

- `/`
- `/about`
- `/auth`
- `/share/:token`

Protected:

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

- `VITE_API_URL` may be provided with or without `/api`; the client normalizes the base URL internally
- `VITE_GOOGLE_CLIENT_ID` is required to render and use Google sign-in

## Setup

Prerequisites:

- Node.js 18+
- npm 9+ or Bun

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

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

## API Integration

The frontend uses a small, explicit service layer in `src/services`.

Important details:

- `api-config.ts` normalizes the base URL
- `api-client.ts` injects the JWT token from `localStorage`
- requests that are not `FormData` are sent as JSON
- API errors are converted into a consistent frontend error shape
- preview/download endpoints use direct URLs because they may return `302` redirects

Current default API base:

```text
https://resumefeedback-api.hmpedro.com
```

## Authentication

The current auth model is simple and pragmatic:

- the JWT access token is stored in `localStorage`
- the user is reconstructed from the token payload
- auth bootstrap is driven by the Redux store
- `useAuth()` still exists as a compatibility interface for the rest of the app
- protected pages are enforced through `ProtectedRoute`

Supported flows:

- register with email/password
- login with email/password
- login/register with Google
- reactivate account through a backend endpoint

## Main Features

### Resume Management

- upload an initial resume
- add new versions to an existing resume
- view version history
- preview the current or selected version
- pin important resumes to the top of the dashboard
- search resumes by title

### Sharing and Collaboration

- create links with permission, expiration, and usage limits
- revoke existing links
- comment on the version currently being previewed

### AI Feedback

- fetch the latest AI job per version
- poll automatically while the job is `PENDING` or `PROCESSING`
- load feedback when the job completes successfully
- regenerate feedback manually

## Relevant Structure

- main store in `src/store/index.ts`
- typed Redux hooks in `src/store/hooks.ts`
- auth logic in `src/store/slices/authSlice.ts`
- upload logic in `src/store/slices/uploadSlice.ts`
- resume details logic in `src/store/slices/resumeDetailsSlice.ts`
- AI feedback logic in `src/store/slices/aiFeedbackSlice.ts`
- upload orchestration in `src/features/upload/useUploadPage.ts`
- resume details orchestration in `src/features/resume-details/useResumeDetailsPage.ts`
- AI polling orchestration in `src/features/ai/useAiFeedback.ts`
- pinned resume persistence in `src/lib/pinned-resumes.ts`

## Project Status

Currently validated:

- Redux dependencies are installed
- production build passes with `npm run build`
- the most state-heavy flows have already been moved to Redux-backed feature modules
- the UI language has been migrated to English

Technical notes:

- there is still no automated test suite wired into `package.json`
- tokens still live in `localStorage`, which is functional but not the strongest model for higher-security environments
- there are still large files in the codebase, especially `Profile.tsx` and some reusable components
- the production bundle still emits a large chunk warning, which points to code-splitting/manual chunking as a next step
- the repository contains both `package-lock.json` and `bun.lockb`; the team should standardize on one package manager

## Recommended Next Steps

- continue refactoring the largest files into smaller feature modules/hooks
- add unit tests for services, slices, and critical hooks
- add integration tests for auth, upload, and resume details
- create a `.env.example`
- add CI for lint and build
- evaluate code-splitting to reduce the initial bundle size

## Note

Backend handoff documentation is available at `docs/frontend-handoff.local.md`, which is useful for local integration and endpoint troubleshooting.
