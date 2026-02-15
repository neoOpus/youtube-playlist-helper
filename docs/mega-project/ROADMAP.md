# Mega-Project Roadmap

## Phase 1: Stabilization & Foundation
- [x] Migrate to `local` storage (Stability).
- [x] Implement Multi-select & Batch Delete.
- [x] Basic Auto-backup.
- [x] Refactored De-duplication.
- [x] **Transactional Storage**: WAL-based storage layer to prevent data corruption.

## Phase 2: Power-User Experience
- [x] **Action Logging & Undo**: Every move is reversible.
- [x] **Watched Tracking**: Visually mark and filter watched videos.
- [x] **Enhanced Metadata (ID Cards)**: Per-video notes and 1-5 star ratings.
- [x] **Playlist Grouping**: Organize playlists into custom categories.

## Phase 3: Advanced Dashboard & UI
- [x] **Modular Dashboard Layout**: Implemented "Smart Precursor" UI library.
- [x] **Dashboard Modes**: Switching between List, Insights, and Curriculum.
- [x] **Logigrams**: SVG-based playlist flow visualization.

## Phase 4: Intelligence & Cloud
- [x] **Cloud Sync**: Diff-based sync with Conflict Resolution (Supabase/WebDAV).
- [x] **Google Account**: Sign in with Google via Supabase.
- [x] **AI Agents**: Smart renaming, auto-categorization heuristics.
- [x] **Action Marketplace Core**: Dynamic action registration and Hub.
- [ ] **Community Marketplace**: Public sharing of presets and custom actions.
