# YouTube Playlist Helper (Modular Edition)

A powerful, modular YouTube playlist manager and creator, refactored for the modern web.

## 🏗️ Architecture (Monorepo)

This project has been refactored into a clean, modular monorepo using npm workspaces:

- **@yph/core**: Pure business logic, services (Storage, AI, Sync, Undo), and domain models.
- **@yph/ui-kit**: Reusable Svelte 5 component library with a dedicated icon set.
- **@yph/dashboard**: Modern SPA dashboard powered by Vite and Svelte 5.
- **@yph/extension**: Browser extension manifest, background scripts, and build artifacts.

## 🚀 Key Features

- **Robust Undo System**: Revert any destructive action (delete, title change, de-duplicate).
- **AI-Powered Organization**: Auto-categorization and relevance sorting.
- **Cloud Sync**: Integrated WebDAV support with smart conflict resolution.
- **Enhanced Metadata**: Track "Watched" status, ratings, and custom notes per video.
- **Advanced UI**: Resizable panels, collapsible sidebars, and fluid Svelte 5 animations.
- **Performance**: Paginated views and optimized rendering for large playlists.

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm 9+

### Commands
- `npm run build`: Builds all packages (outputs extension to `projects/extension/`).
- `npm test`: Runs unit tests for core services using Vitest.
- `npm run dev`: (In `projects/dashboard`) Starts the Vite dev server for UI work.

## 📜 Roadmap
See [ROADMAP.md](ROADMAP.md) for the vision and future phases.

## 📄 License
MIT
