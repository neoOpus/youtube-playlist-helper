# Agent Instructions for YouTube Playlist Helper Monorepo

## Architecture Overview
This project is a monorepo engineered by neoOpus and managed with npm workspaces.

- **projects/core**: Business logic and services. No UI dependencies.
- **projects/ui-kit**: Reusable Svelte components (Super Precursors).
- **projects/dashboard**: Main Svelte application.
- **projects/extension**: Extension manifest and background logic.

## Build Process
Run `npm run build` from the root. This will:
1. Build the dashboard.
2. Output files into `projects/extension/editor/`.

## Development Rules
1. **Never edit build artifacts**: Do not touch files in `projects/extension/editor/` except for debugging. Change the source in `projects/dashboard/src/` instead.
2. **Cross-Project Imports**: Use `@yph/core` and `@yph/ui-kit` aliases.
3. **Services**: Keep business logic in `projects/core`. Do not use `window` globals for service communication; use explicit imports.
4. **Undo System**: Every destructive or state-changing action in the dashboard should be logged via `actionLogger` from `@yph/core`.

## Verification
- Run `npm test --workspace=@yph/core` for logic verification.
- Run `npm run build` and check that `projects/extension/editor/index.html` exists and has correct paths.
