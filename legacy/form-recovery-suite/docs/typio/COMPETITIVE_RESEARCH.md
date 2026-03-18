# Competitive Research: Form Recovery Landscape

## Evaluated Tools
1. **Typio Form Recovery** (Modern Baseline)
2. **Lazarus: Form Recovery** (The "Gold Standard" of the past)
3. **Form History Control** (Feature-rich, focus on history management)
4. **Generic Userscripts** (Lightweight, manual configuration)

## Feature Comparison Matrix

| Feature | Typio | Lazarus | Form History Control | Userscripts |
|---------|-------|---------|----------------------|-------------|
| **Field Detection** | Robust (ID-based) | High (Heuristics + Iframes) | High | Basic (Manual) |
| **Iframe Support** | Good | Excellent (Recursive) | Good | Poor |
| **AJAX/XHR Catching**| No | Yes (Monkey-patching) | Partial | No |
| **UI Integration** | Shadow DOM | Custom Elements | Browser UI | Injected Divs |
| **Privacy/Security** | Pass/CC Filter | Encrypted DB | Password Protected | LocalStorage |
| **Editor Hacks** | DraftJS/Slate | Facebook/TinyMCE | Generic | None |

## Key Insights "Under the Hood"

### 1. Lazarus XHR Listener
Lazarus uses a unique strategy of monkey-patching `XMLHttpRequest` to detect when a form is submitted via AJAX. This allows it to mark a form as "saved" or "submitted" even if the standard `submit` event never fires.
**Lesson**: 2026 Vision should use `Proxy` to intercept `fetch` and `XHR` for even better reliability in SPAs.

### 2. Typio's Shadow DOM
Typio excels at non-destructive UI injection. By using Shadow DOM, it avoids the CSS pollution issues that plagues older versions of Lazarus.
**Lesson**: Native Web Components + Shadow DOM is the only way to go for 2026.

### 3. Iframe "Madness"
Both Typio and Lazarus struggle with cross-origin iframes due to browser security (Same-Origin Policy).
**Lesson**: In Manifest V3, we can use `declarativeNetRequest` or more advanced content script injection rules to handle nested contexts more gracefully, though cross-origin will always be a hurdle.

### 4. Semantic Mapping (The Gap)
None of the evaluated tools use AI to understand *what* a field is. They all rely on DOM attributes (name, id, path).
**Opportunity**: The "Secret Sauce" for 2026 is using a local LLM to perform semantic mapping, allowing recovery even if the site undergoes a major redesign.

## Conclusion
Typio is the best starting point for a modern extension, but it can be significantly improved by adopting the "aggressive" detection strategies of Lazarus (XHR intercept, broad iframe support) combined with 2026 AI capabilities.
