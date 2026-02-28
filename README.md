# Monorepo: Multiple SOTA Projects

This repository contains two distinct, high-performance projects architected for the 2026 tech landscape.

## 1. Phoenix Form Recovery Suite
**Location:** `form-recovery-suite/`

A state-of-the-art form recovery system designed by **Anoir Ben Tanfous aka neoOpus**. It features:
- **Phoenix SOTA Userscript**: High-performance, heuristic-driven recovery.
- **Phoenix Extension (MV3)**: Next-gen browser extension.
- **Robustness Engine**: Multi-signal fingerprinting (V-Hash) and Nano-Delta compression.
- **Production Analysis**: Deep evaluation of legacy tools (Typio, Lazarus) and robustness strategies.

## 2. YouTube Playlist Helper
**Location:** `youtube-playlist-helper/`

A comprehensive tool for managing and enhancing YouTube playlists.
- Advanced playlist editor with Svelte dashboard.
- Intelligent de-duplication and metadata enrichment.
- AI-driven categorization and alternatives tracking.

---
**Maintained by neoOpus**

## Project Independence
Although these projects reside in the same monorepo, they are **architecturally distinct and independent**:
- **Isolated Build Chains**: Each project has its own `package.json`, build tools, and node_modules.
- **Zero Runtime Dependencies**: No shared code is required at runtime between Form Recovery and Playlist Helper.
- **Optional Integration**: The real-time data sharing via `BroadcastChannel` is strictly optional and fails gracefully if the other project is not present.
- **Dedicated Documentation**: Each project maintains its own research, roadmaps, and technical analysis.
