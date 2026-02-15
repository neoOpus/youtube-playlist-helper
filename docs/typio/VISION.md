# 2026 Vision: Typio Modernization (v2)

## Core Philosophy
In 2026, form recovery should be invisible, intelligent, and uncompromising on privacy. Typio should transition from a "dumb" keylogger to a "smart" contextual assistant.

## The Modern Tech Stack
- **Extension Manifest V3**: Utilizing Service Workers for background processing and declarative content scripts.
- **Frontend**: **Svelte 5** with Runes for a lightweight, high-performance UI.
- **Language**: **TypeScript** for safety.
- **Build Tooling**: **Vite + CRXJS**.
- **Storage**: **Dexie.js (IndexedDB)** with AES-GCM encryption.

## Key 2026 Features (Refined by Research)

### 1. AI-Assisted Semantic Mapping
- **The Problem**: Current tools (Typio, Lazarus) rely on DOM paths or IDs that break when a site updates.
- **The Solution**: Use a **Local LLM** (WebGPU) to generate a semantic "fingerprint" of the field (e.g., "Main Login Email").
- **Robustness**: If the DOM changes but the field's purpose remains, Typio 2026 will still map the saved data correctly.

### 2. Aggressive Catching Strategy (Lessons from Lazarus)
- **XHR/Fetch Interception**: Use `Proxy` to intercept all network requests. If a request contains large text blocks that match what the user typed, mark that form as "safely submitted".
- **Enhanced Iframe Recursive Monitoring**: Implement a robust observer that can dive into nested `about:blank` and same-origin iframes automatically, catching text editors like TinyMCE and CKEditor without custom "hacks".

### 3. Zero-Knowledge Privacy & E2EE
- **Local Encryption**: The database is locked with a user-defined key or WebAuthn.
- **E2EE Sync**: Sync recovery data via WebDAV/Google Drive using end-to-end encryption. The extension provider never has access to the data.

### 4. Non-Destructive UI (Shadow DOM)
- Injected components are encapsulated in Shadow DOM (lessons from Typio).
- Use **Web Components** for the recovery icons and dialogs to ensure zero style leakage.

### 5. Smart PII & Password Protection
- Use local NLP to identify and warn/mask PII (Personally Identifiable Information) before saving.
- Enhanced password field protection, with a "Request to Save" prompt for sensitive types if not explicitly enabled.

## Conclusion
Typio 2026 combines the **encapsulation** of Typio, the **aggressive detection** of Lazarus, and **modern AI** to create a form recovery tool that is both more powerful and more private than anything available in the 2020s.
