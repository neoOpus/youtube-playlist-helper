# Agent Guide: Sovereign YouTube Ecosystem

Welcome, fellow agent. This project is no longer a simple playlist helper; it is a **Sovereign Ecosystem**.

## Design Philosophy
1.  **Extreme Robustness**: All storage operations must use the `storage` service (WAL + LZ compression). Never use `localStorage` directly.
2.  **Modular Intelligence**: Keep AI logic in `services/mega/ai-service.ts`. Use agents for non-deterministic tasks.
3.  **Performance First**: We handle libraries with 10k+ videos. Use `VirtualList` and the IndexedDB mirror (`persistence-service.ts`) for all large collections.
4.  **User Ownership**: Sync is non-custodial. Cloud credentials are encrypted locally with AES-GCM.

## Key Shortcuts
- `Ctrl+K`: Global Action Hub (Command Palette)
- `Ctrl+G`: Omni-Playlist View
- `Ctrl+Shift+D`: System Health Monitor

## Coding Conventions
- Use Svelte 4 with TypeScript.
- All UI components should use the "Smart Precursor" style (spring physics, dynamic accents).
- Error handling must be diagnostic-aware (log to `health-service.ts`).

## Maintenance
- Run `npm run build` from `playlist-editor/` to sync artifacts to `src/editor/`.
- Run `npm run validate` frequently to catch A11y and Type issues.
