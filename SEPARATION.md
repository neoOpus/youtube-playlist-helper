# Intelligent YouTube Companion - Modular Architecture

This project is divided into two distinct domains to ensure high performance and stability.

## 1. Core Module (Stable Engine)
The core engine handles the essential playlist and video operations. It is designed to be lean, fast, and bulletproof.
- **Storage Service**: Transactional WAL-based storage with LZ-compression and Soft Delete (Trash Bin).
- **Video Service**: Rate-limited YT metadata fetching and URL parsing.
- **Playlist Service**: High-speed de-duplication, merging, and CRUD operations.
- **I18n Service**: Global localization (EN/FR).

## 2. Mega Module (Intelligence & UX Layer)
The Mega layer provides the "standalone project" features that make this extension unique.
- **AI Agent Framework**: Categorizers, deleted video watchdogs, and the custom Action Architect.
- **Sync Engine**: Multi-backend sync (Supabase/WebDAV) with AES-GCM credential encryption.
- **Smart Precursor UI**: Advanced UI components with spring physics and context-aware menus.
- **Insights & Dashboard**: Omni-View, Curriculum Architect, and Logigrams for visualization.
- **Performance Layer**: IndexedDB cold-start mirror and virtualization for 10k+ video streams.

## Security & Privacy
- **Global Stealth Mode**: Metadata blurring and session isolation.
- **Encrypted Sync**: Credentials and sensitive data never leave the device in plain text.

## Debugging
- **System Health Monitor (Ctrl+Shift+D)**: Real-time resource usage and error logging.
- **Diagnostic Engine**: Self-healing checks for storage and sync integrity.
