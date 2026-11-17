# UI Architecture

This document explains how the frontend UI layer is organized, where logic should live, and how to keep feature code maintainable as the app grows.

## Goals

The current UI architecture is optimized for:

- clear separation between routing, orchestration, and presentation
- smaller files with single-purpose components
- predictable data flow from route to feature hook to UI
- pragmatic reuse without turning simple screens into abstract frameworks

## Layer Overview

### `src/pages`

Route-level screens live here.

Responsibilities:

- compose page sections
- provide page shells and layout
- connect route params, navigation, and high-level feature components
- keep only light page-local UI state when needed

Avoid:

- burying large async workflows directly inside page JSX
- building large reusable UI systems here

Examples:

- `Landing.tsx`
- `ResumeDetails.tsx`
- `Upload.tsx`

### `src/features`

Feature orchestration lives here, usually as hooks.

Responsibilities:

- coordinate Redux actions and async flows
- bridge UI components with service and store layers
- encapsulate feature-specific state transitions
- expose a clean interface for pages and components

Avoid:

- large visual markup
- generic UI primitives

Examples:

- `useUploadPage.ts`
- `useResumeDetailsPage.ts`
- `useAiFeedback.ts`
- `target-opportunities/queries.ts`

### `src/components`

Reusable presentation components and feature UI live here.

Responsibilities:

- render data passed from pages or feature hooks
- encapsulate reusable visual patterns
- keep markup and styling close to the rendered structure

Avoid:

- taking ownership of too much cross-feature business logic
- combining async orchestration, route concerns, and heavy presentation in one file

Examples:

- `ResumeCard.tsx`
- `CommentList.tsx`
- `AiFeedback.tsx`

### `src/components/ui`

Low-level design-system primitives live here.

Responsibilities:

- buttons, cards, inputs, badges, dialogs, skeletons, and related primitives
- composable styling building blocks
- project-wide baseline UI consistency

These files should stay generic and should not absorb feature-specific product rules.

### `src/services`

Backend communication lives here.

Responsibilities:

- API calls
- request/response shaping
- URL helpers
- auth token handling through the API client

This keeps transport details out of pages and presentational components.

### `src/store`

Global state and Redux flows live here.

Responsibilities:

- slices
- async thunks
- selectors
- store configuration

## Typical Data Flow

The common flow in this app is:

1. a route in `src/pages` renders a page
2. the page calls a hook from `src/features` or renders a feature component
3. the feature hook talks to Redux, queries, or services
4. data is passed down into presentational components
5. user actions go back up through callback props into the feature hook or Redux flow

Data-flow summary:

`page -> feature hook -> store/service -> presentational components`

## State Placement Rules

Use page or component local state for:

- modal open/close flags
- input drafts
- search text
- selected tabs
- drag/drop hover state

Use feature hooks for:

- screen-specific orchestration
- combining multiple store or service calls
- route-aware workflows
- derived UI actions that should not clutter the page component

Use Redux for:

- auth state
- resume details and related entities
- async upload and AI feedback flows
- other shared or cross-component state that multiple parts of the screen depend on

Use TanStack Query for:

- server data that benefits from cache-oriented fetching patterns
- resume list fetching
- target opportunity CRUD, targeted review job polling, and latest targeted review reads

## Presentational vs Orchestration Components

Prefer this split when a feature starts growing:

- orchestration component or hook: owns data loading, mutations, and decision logic
- presentational components: receive data and callbacks, and focus on rendering

This keeps JSX files smaller and easier to scan.

## Example: `AiFeedback`

`AiFeedback` used to be a large single file that mixed:

- async orchestration
- feedback parsing
- state rendering
- final review presentation

It was split into:

- `AiFeedback.tsx` as the public orchestration entry
- `constants.tsx` for status presentation mapping
- `utils.ts` for parsing `Label: content`
- `FeedbackCardShell.tsx` for shared shell layout
- `FeedbackStates.tsx` for loading, empty, processing, and error states
- `FeedbackCompletedView.tsx` for the final review layout
- `FeedbackItem.tsx`, `FeedbackSection.tsx`, and `FeedbackEmptyList.tsx` for reusable presentation pieces

That split is the preferred direction when a UI feature starts carrying multiple responsibilities.

## Example: Target Opportunities

The target opportunity workflow follows the same separation:

- `src/services/target-opportunities.ts` owns REST calls to `resume-api`
- `src/features/target-opportunities/queries.ts` owns TanStack Query hooks, mutation invalidation, and polling behavior
- `src/components/TargetOpportunitiesPanel.tsx` owns the feature UI on the resume detail page
- `src/types/index.ts` owns the shared TypeScript contracts for opportunities, jobs, and targeted review artifacts

The frontend does not call the worker, databases, storage, queues, or AI providers directly. Targeted review creation and reads remain behind the `resume-api` REST boundary.

## File Placement Guidelines

Put code in `src/pages` when:

- it exists because of a route
- it mostly composes page sections and navigation

Put code in `src/features` when:

- it is feature-specific orchestration
- it combines multiple async or state concerns
- it should be reused by a page and possibly other feature components

Put code in `src/components` when:

- it is mostly rendering
- it can be reused across screens or within a feature
- it benefits from isolated styling and markup ownership

Create a feature subfolder like `src/components/ai-feedback` when:

- the UI has several related components
- one feature needs internal primitives or helpers
- keeping everything in one file would make maintenance harder

## Practical Boundaries

Good signs a file should be split:

- it mixes route concerns, data loading, and rendering
- it repeats parsing or formatting logic in multiple places
- it has multiple distinct visual states in one component
- scrolling the file makes it hard to understand the top-level intent

Good signs a file should stay together:

- the component is still small
- the logic is local and obvious
- extracting parts would create meaningless wrapper files

## Styling Approach

Current styling is built from:

- Tailwind utility classes
- shared primitives in `src/components/ui`
- feature-local composition inside components

Prefer:

- keeping styles close to the markup they affect
- extracting reusable UI pieces when patterns repeat
- avoiding global CSS unless the concern is truly app-wide

## Recommended Direction

As the frontend grows, prefer:

- route screens that mostly compose
- feature hooks that own orchestration
- reusable presentational components with focused props
- small feature folders when a module becomes visually or behaviorally complex

The aim is not maximal abstraction. The aim is readable, maintainable code with clear ownership.

## Career interview voice mode

The interview composer offers voice input as an optional mode per turn.
There is no per-session toggle: the user presses the mic button, grants
browser permission, and speaks. The behavior, in one place:

- Draft-first. A recording is transcribed and the transcript lands in the
  composer as an editable draft in the existing sessionStorage draft. The
  user reviews and edits it before sending it with the existing send
  action, so the idempotency key, the 4000 character limit, and the
  conflict and agent error handling all apply unchanged. A transcript is
  never auto-sent.
- Live transcription. While recording, the browser speech recognizer
  (Web Speech API, interim results) fills the draft as the user speaks,
  in the session language (pt-PT for Portuguese, en-US for English).
  Each result rebuilds the draft as the text captured at recording start
  plus the live transcript, so a corrected interim guess replaces the
  previous one instead of appending to it. On stop, the provider
  transcript still replaces the draft for accuracy: it stays the source
  of truth, and the draft-first, never-auto-send behavior is unchanged.
  When the browser has no SpeechRecognition, recording falls back
  silently to the transcript-after-stop behavior, with no error and the
  text field still usable. Editing the draft while recording is
  overwritten by the next interim result, so edits belong after stop.
- Repeat and repair. An empty transcript shows a distinct repeat prompt
  (ask the candidate to speak again), not the generic extraction-failure
  text. A transcript that yields no usable facts falls back to the
  existing focused follow-up, which the normal turn already produces.
  A 400 from the transcribe proxy is a browser-input problem (empty,
  unsupported, or oversize audio) and is shown as a correctable input
  error, not an agent failure.
- Playback. When a new assistant reply arrives, the frontend requests
  synthesis for that reply text and plays it. Playback is best effort:
  if it fails, the text is still there and no error blocks the
  interview. Only the latest reply is synthesized, never the whole
  history, and never again on refetch.
- Wiring. `useCareerInterview` owns the voice state (recording,
  transcribing, playback) and the transcribe/synthesize calls; the
  composer stays presentational and the service owns HTTP. Synthesis
  uses a small binary fetch because the shared apiClient parses every
  response as JSON. The session language comes from session detail, the
  single source of truth; the client never passes a language to the
  proxies, Java passes the locked language server side.
- Privacy. No audio is stored anywhere: recordings live in memory until
  transcription, and synthesized audio lives in a revoked object URL.
- Known limits. The repo has no test runner, so verification is a clean
  production build plus a real-browser click test, never the build alone.
  Recording duration is a browser stop at 120 seconds plus the server
  cap (120 s / 10 MB); there is no server-side duration check. Live
  transcription depends on the browser speech service: headless
  Chromium in the sandbox may not produce interim results, so the click
  test reports honestly whether interim text appeared, and the real
  browser check stays owed until Helena confirms it.
- Deploy. Merging to main automatically deploys to Hostinger, so the
  live site at feedback.hmpedro.com picks up the merge. The deploy lives
  outside this repo: there is no deploy workflow, config, or script here,
  and the README covers build and preview only. After a merge, confirm
  the feature is actually live on the site before telling anyone it is
  ready to test.
