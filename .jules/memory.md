# Memory: YouTube Playlist Helper Refactoring Prep - Phase 2

## Project Structure Changes
- **Legacy Isolation**: All Manifest V2 files (background, popup, options) and unrelated projects (form-recovery-suite) moved to a root `legacy/` folder.
- **Manifest V3 Baseline**: `projects/extension/manifest.json` updated to V3, using a Svelte-based popup and a bundled TypeScript background worker.
- **Build Unification**: Vite in `projects/dashboard` now handles bundling for both the main UI and the extension background script.

## Svelte 5 & Runes
- **Legacy Compatibility**: Disabled global runes mode in `svelte.config.js` to allow the existing `export let` and reactive statement syntax while supporting the Svelte 5 runtime.
- **UI-Kit Cleanup**: Converted rune-like syntax in icons (`$props()`) back to standard `export let` to maintain consistency with the rest of the application.

## Lessons Learned
- **Cross-Project Bundling**: Vite can handle multiple entry points (UI + Background) by specifying them in `build.rollupOptions.input`. This ensures both components share the same core logic and are bundled correctly.
- **Dependency Management**: Monorepo workspace dependencies must be explicitly installed (e.g., `notyf`) to ensure the build pipeline has access to all required modules.
- **Permissions**: Manifest V3 requires explicit `contextMenus` permission and `host_permissions` for YouTube interactions.

## Technical Patterns
- **Unified Service Layer**: Both the background script and the dashboard UI import from `@yph/core`, ensuring consistent data handling (e.g., `storageService`, `videoService`).
