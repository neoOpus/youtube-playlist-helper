# Roadmap: Typio 2026 Rewrite

## Phase 1: Foundation (The "Clean Slate")
- [ ] Initialize a new monorepo using **Vite** and **CRXJS**.
- [ ] Define the **Manifest V3** structure.
- [ ] Implement a **TypeScript-first** architecture with shared types between Background and Content scripts.
- [ ] Set up **Dexie.js** for IndexedDB management.

## Phase 2: Core Engine (Lessons from Legacy)
- [ ] **Field Identification**: Port the ID generation logic but improve it with heuristic-based fallback (label matching, placeholder matching).
- [ ] **Input Monitoring**: Implement the `input` and `mutation` observers. Use the "Slate/DraftJS hacks" from the original codebase to ensure compatibility with complex editors.
- [ ] **Storage Strategy**: Re-implement the "Bucket" logic using IndexedDB transactions for better atomicity.

## Phase 3: Modern UI & Integration
- [ ] **Super Precursor Components**: Build a library of Svelte 5 components for the injected UI.
- [ ] **Shadow DOM Wrapper**: Encapsulate all injected UI to ensure zero conflict with site styles.
- [ ] **Action Logger**: Implement a global Undo/Redo system for form restorations.

## Phase 4: Intelligence & Privacy
- [ ] **Local AI Integration**: Integrate a lightweight transformer model for semantic field mapping.
- [ ] **Encryption Layer**: Implement AES-GCM encryption for the local database.
- [ ] **E2EE Sync**: Optional WebDAV or Google Drive sync with client-side encryption.

## Carry-over "Hacks" (The Secret Sauce)
The original Typio codebase contains several critical "hacks" that must be retained in the rewrite:
- **DraftJS Keystroke Simulation**: Simulating a keystroke for empty DraftJS fields to initialize internal state.
- **execCommand vs. insertHTML**: Using specific insertion methods depending on the editor type to avoid breaking internal DOM management of libraries like React/Vue.
- **Subtree Mutation Watching**: Specifically for `contenteditable` fields that might change without standard input events.
