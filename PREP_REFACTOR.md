# Preparation for Total Refactoring - YouTube Playlist Helper

This document summarizes the changes made to sanitize the project and prepare for a total refactoring.

## Changes Made

1.  **Legacy Isolation**:
    *   Created a root-level `legacy/` directory.
    *   Moved `form-recovery-suite/`, `screenshots/`, and all Manifest V2 specific extension files (background, popup, options, actions, css) to `legacy/`.
    *   This clears the way for a modern Manifest V3 architecture without legacy baggage.

2.  **Manifest V3 Migration (Initial State)**:
    *   Updated `projects/extension/manifest.json` to Manifest V3.
    *   Configured the extension to use the Svelte Dashboard (`editor/index.html`) as the main popup.
    *   Introduced a TypeScript background script (`projects/extension/background.ts`) that integrates directly with `@yph/core` services.
    *   Configured Vite in `projects/dashboard` to bundle the background script into the extension's `editor/build/` directory.

3.  **Build System Hardening**:
    *   Resolved missing dependencies (`notyf`, `vite`, `svelte-check`) by correctly installing them in their respective workspace projects.
    *   Confirmed that `npm run build` from the dashboard project correctly generates the full extension package in `projects/extension/editor/`.
    *   Validated the Svelte components across the project using `svelte-check`.

4.  **Architectural Cleanup**:
    *   Consolidated all business logic into `@yph/core`.
    *   The extension's background worker now uses the same `storageService` and `videoService` as the dashboard, ensuring a single source of truth for all data operations.

## Next Steps for Refactoring

*   **Complete Background Logic**: Fully port the legacy `background.js` logic (context menus, bookmark scanning) into the new `background.ts` using core services.
*   **UI Consolidation**: Ensure all user interaction (including options and popup) is handled by the Svelte Dashboard with internal routing.
*   **Advanced Features**: Implement the remaining Phase 4 & 5 goals from the `docs/mega-project/ROADMAP.md`.
