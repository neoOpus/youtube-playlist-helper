# Production-Ready Robustness Rules for Form Recovery

Based on an analysis of legacy tools (Typio, Lazarus) and modern web patterns, the following rules must be implemented to achieve "next-level" robustness.

## 1. Input Monitoring Exceptions
- **Event Cancellation**: Libraries like **Slate.js** may cancel the `input` event. Monitor `keydown` as a fallback for text changes.
- **Rich Text Complexity**: For `contenteditable` fields, a simple `input` listener is insufficient. Use a `MutationObserver` with `childList: true, subtree: true` to catch formatting changes (bold, italic) or library-specific DOM manipulations.
- **State-Managed Editors (React/Vue)**: Directly setting `el.value` or `el.innerHTML` often breaks the internal state of the editor (e.g., **DraftJS**). Use `document.execCommand('insertHTML', ...)` to ensure the editor's state remains in sync.
- **DraftJS Special Case**: If a DraftJS field is empty, it may require a simulated keystroke before it accepts programmatic input.

## 2. Submission Detection (AJAX/SPAs)
- **Beyond Form Submit**: Modern apps rarely use standard `submit` events. Intercept `fetch` and `XMLHttpRequest.send` using `Proxy`.
- **Submission Marking**: If a network request payload contains the currently saved text, mark that entry as "submitted" and hide it from recovery prompts to reduce clutter.

## 3. Iframe & Shadow DOM Depth
- **The "about:blank" Problem**: Many editors initialize in `about:blank` iframes. Content scripts must monitor these by attaching listeners to the `contentDocument` as soon as it's available.
- **Recursive Shadow DOM**: Use a recursive function or `composedPath()` to detect inputs hidden deep within nested Shadow Roots.

## 4. Field Identification Resilience (The "Drift" Problem)
- **Heuristic-First**: If a DOM path (`nth-of-type`) changes, fallback to **Semantic Fingerprinting**:
  - `aria-label` + `placeholder` + `name`
  - Nearest `<label>` text content.
  - Logical position (e.g., "the 2nd textarea in the 1st form").

## 5. Performance & Privacy
- **Throttle Saves**: Debounce storage writes to once per 1000ms per field to avoid blocking the main thread or hitting storage limits.
- **Sensitive Data Redaction**: Automatically exclude fields with `type="password"` (unless opted-in) and use regex to detect and redact credit card patterns (`XXXX-XXXX-XXXX-XXXX`).
- **Memory Management**: Periodically purge references to elements that are no longer in the DOM to avoid memory leaks.

## 6. Edge Case: Feedly/Twitter Pattern
- Twitter replaces composer nodes in-place. Periodically verify that cached element references are still `document.body.contains(el)`. If not, re-initialize the monitoring for the new node.
