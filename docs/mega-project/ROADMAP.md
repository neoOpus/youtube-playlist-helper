# Mega-Project Roadmap: The YouTube Companion

## Phase 1: Stabilization & Foundation (DONE)
- [x] Migrate to `local` storage.
- [x] Implement Multi-select & Batch Delete.
- [x] Basic Auto-backup.
- [x] Refactored De-duplication.

## Phase 2: Power-User Experience (DONE)
- [x] **Action Logging & Undo**: Full reversible history for title, groups, and deletions.
- [x] **Watched Tracking**: Visual "WATCHED" status and overlays.
- [x] **Enhanced Metadata (ID Cards)**: Full tag management and notes.
- [x] **Modular Monorepo Architecture**: Separation of Core, UI-Kit, Dashboard, and Extension.

## Phase 3: Intelligence & Advanced UI (DONE)
- [x] **Modern Build Stack**: Migrated to Vite + Svelte 5 for latest standards.
- [x] **Dynamic Layout Engine**: Custom sidebars and collapsible panels.
- [x] **Smart Sorters**: AI-driven sorting based on content relevance.
- [x] **Advanced Filtering**: Regex-based search for power users.

## Phase 4: Cloud & Sync (IN PROGRESS)
- [x] **WebDAV Implementation**: Initial backup/restore and auto-sync logic.
- [ ] **Google Drive Backup**: Official drive API integration.
- [ ] **Conflict Resolution**: Smart merging of remote and local data.

## Phase 5: AI Agents & Automation
- [ ] **Auto-Categorization**: AI automatically groups videos into playlists.
- [ ] **Playlist Summaries**: Generation of structured summaries for entire playlists.
- [ ] **Alternative Finder v2**: Deep scraping for deleted videos on Odysee/Rumble/Archive.org.

## Phase 6: Ecosystem & Community
- [ ] **Preset Marketplace**: Share dashboard layouts and filter rules.
- [ ] **Curriculum Mode**: Turn playlists into structured courses with progress tracking.
- [ ] **Developer API**: Allow other extensions to hook into the YPH Core.
