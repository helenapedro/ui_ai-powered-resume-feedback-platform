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

In short:

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
- currently, resume list fetching

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
