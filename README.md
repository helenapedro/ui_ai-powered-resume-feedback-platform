# Resume Feedback Frontend

Frontend SPA for uploading, versioning, sharing, and collaboratively reviewing resumes, with AI-generated feedback.
Frontend application for a version-aware resume review workflow. Users can upload resumes, manage multiple versions, preview the selected file, generate AI feedback, create controlled share links, and collect comments in context.

This project is a React SPA that talks to an external backend API for authentication, resume storage, sharing, comments, and asynchronous AI analysis.

## Product Scope

The current app supports:

- email/password sign up and sign in
- Google sign in via Google Identity Services
- resume creation and version uploads
- version-aware preview and download
- AI feedback generation with async job polling
- recruiter-style feedback display with summary, strengths, and improvements
- share link creation, revocation, expiration, and usage limits
- version-specific comments
- pinned resumes and dashboard search
- basic profile management

## Tech Stack

- React 18
- TypeScript
- Vite 5
- React Router 6
- Redux Toolkit + React Redux
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- React Hook Form
- Zod
- react-pdf

## Application Structure

The codebase is organized by responsibility:

- `src/pages` route-level screens
- `src/components` reusable UI and feature components
- `src/components/ai-feedback` modularized AI feedback presentation components
- `src/features` feature hooks and orchestration logic
- `src/store` Redux store, slices, and typed hooks
- `src/services` API client and service layer
- `src/contexts` app-wide providers and compatibility wrappers
- `src/lib` small shared utilities
- `src/types` shared TypeScript contracts

## UI Architecture

The UI layer is intentionally split across route screens, feature orchestration, and reusable presentation components.

- `src/pages` owns route composition, page shells, and page-level layout
- `src/features` owns stateful hooks and feature orchestration
- `src/components` owns reusable presentational building blocks and feature UI
- `src/components/ui` owns low-level design-system primitives
- `src/components/ai-feedback` is the current example of a feature UI broken into focused modules instead of one large file

Typical flow:

1. a route component in `src/pages` renders the screen shell
2. the page or feature component calls a hook from `src/features`
3. that hook coordinates Redux actions, queries, and service calls
4. resulting data is passed into focused presentational components in `src/components`

The goal is to keep business flow and async coordination out of large JSX files, while avoiding premature abstraction for simple screens.

For the deeper UI-layer conventions, see [docs/ui-architecture.md](docs/ui-architecture.md).

## Main Routes

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

## AI Feedback Model

The backend returns feedback in this shape:

```ts
{
  summary: string;
  strengths: string[];
  improvements: string[];
}
```

On the frontend, each resume version can have an async AI job with status:

- `PENDING`
- `PROCESSING`
- `DONE`
- `FAILED`

When a job completes, the UI renders:

- an overall assessment from `summary`
- a "What's Working" section from `strengths`
- a "What's Holding It Back" section from `improvements`

Items with prefixes like `Experience: ...` or `Skills: ...` are parsed and shown with structured labels in the UI.

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_URL=https://your-api-host.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Notes:

- `VITE_API_URL` is optional. If omitted, the app defaults to `https://resumefeedback-api.hmpedro.com`
- if `VITE_API_URL` ends with `/api`, the frontend normalizes it automatically
- `VITE_GOOGLE_CLIENT_ID` is required for Google sign in

## Local Development

Prerequisites:

- Node.js 18+
- npm 9+ or Bun

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

## Available Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## State and Data Flow

The app currently uses both Redux Toolkit and TanStack Query:

- Redux manages auth, upload flow, resume details, comments, share links, and AI feedback job state
- TanStack Query is used for resume list fetching
- local component state handles transient UI-only behavior

Current Redux slices:

- `authSlice`
- `uploadSlice`
- `resumeDetailsSlice`
- `aiFeedbackSlice`

Important feature hooks:

- `src/features/upload/useUploadPage.ts`
- `src/features/resume-details/useResumeDetailsPage.ts`
- `src/features/ai/useAiFeedback.ts`

## API Integration Notes

- `src/services/api-config.ts` normalizes the backend base URL
- `src/services/api-client.ts` injects the JWT token from `localStorage`
- non-`FormData` requests are sent as JSON
- preview and file endpoints may use direct URLs instead of standard JSON fetch flows
- API failures are mapped into a normalized frontend error shape

## Authentication Notes

Current auth behavior:

- JWT access token is stored in `localStorage`
- the frontend reconstructs user state from the token payload
- `ProtectedRoute` guards authenticated pages
- `AuthProvider` exposes a compatibility layer for the rest of the app

Supported auth flows:

- register with email/password
- sign in with email/password
- sign in with Google

## Current UX Areas

- landing and about pages describe the product workflow
- dashboard shows searchable and pinnable resume workflows
- upload page supports new resumes and additional versions
- resume details page combines preview, version history, AI feedback, comments, and share links
- shared resume page supports external review through tokenized access

## Project Notes

- the app currently has no automated test suite wired into `package.json`
- the production build currently emits a large chunk warning, so code-splitting is still a useful next step
- the repository contains both `package-lock.json` and `bun.lockb`; standardizing on one package manager would reduce drift
- local storage is currently used for auth token persistence and pinned resume preferences

## Related Docs

- `docs/frontend-handoff.local.md` for backend integration and local handoff notes
- `docs/ui-architecture.md` for UI-layer structure, boundaries, and conventions
