# @yph/core: The YouTube Companion Engine

High-performance business logic and AI services for video infrastructure management.

## Key Services

### 🧠 AI & Semantics
- **aiService**: Multi-provider interface (OpenAI, OpenRouter, Local). Handles enrichment and semantic expansion.
- **embeddingService**: WebGPU-powered local embeddings via Transformers.js.
- **vectorService**: High-performance IndexedDB storage for neural vectors.
- **sectorIntelligence**: Centroid-based auto-categorization suggestions.

### 🛡️ Autonomous Agents (Protocol: HEARTBEAT)
- **enrichmentAgent**: Background node analysis and metadata harvesting.
- **recoveryAgent**: Integrity auditing and autonomous mirror discovery (Wayback/Odysee).
- **heartbeatService**: Centralized state management for all active agents.

### ⚙️ Systems & Persistence
- **storageService**: Unified IndexedDB interface with Manifest V3 compatibility.
- **syncService**: AES-GCM encrypted WebDAV synchronization including neural vectors.
- **actionLogger**: Reversible user-action history (Undo/Redo stack).

## Architecture
This project follows a strict **"UI Grammar"**:
- **System**: The global application environment.
- **Protocol**: Standardized operational sequences (Sync, Curriculum).
- **Sector**: A logical grouping of nodes (Playlist).
- **Node**: An individual infrastructure unit (Video).
