# YouTube Playlist Helper: Professional Design Guide
**Architecture & Implementation Blueprint for the Pro Edition**

This document defines the exact visual specifications, interaction patterns, and implementation strategy for the YouTube Playlist Helper Professional UI.

---

## 1. Core Design Principles

*   **Clarity:** 1.5 line-height for body text; 32px - 64px section breathing room.
*   **Consistency:** Strict adherence to the 4px baseline grid.
*   **Liveness:** 60fps animations; < 100ms response time for interactions.
*   **Accessibility:** WCAG 2.2 AA (Color contrast 4.5:1; Focus outlines 2px).
*   **Progressive Disclosure:** Advanced technical parameters are sequestered behind the "System Architect" toggle in the sidebar.

---

## 2. Layout & Grid Specifications

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Baseline Grid** | 4px | All measurements (padding, margin, width) must be multiples. |
| **Max Container Width** | 1400px | Centered in viewport. |
| **Grid System** | 12-Column | Fluid percentage-based widths. |
| **Gutter Width** | 32px | Standardized via `var(--space-8)`. |
| **Content Padding** | 48px | Standardized via `var(--space-12)`. |

---

## 3. UI Component Specifications

### 3.1 Buttons (SuperButton)
*   **Height:** 44px (Standard) / 32px (Mini).
*   **Typography:** Inter Bold (700), 14px, All-Caps.
*   **Corner Radius:** 10px (`$radius-md`).
*   **Types:**
    *   *Primary:* Gradient (#ff5252 -> #ff7575), white text.
    *   *Secondary:* `var(--bg-secondary)` with 1px border.
    *   *Danger:* Gradient (#ef4444 -> #ff6b6b).
*   **States:**
    *   *Hover:* Scale 1.02; brightness 110%.
    *   *Active:* Scale 0.96; brightness 90%.

### 3.2 Form Elements
*   **Input Fields / Selects:**
    *   *Typography:* Inter Medium (500), 14px.
    *   *Background:* Obsidian Glass (`var(--bg-secondary)`).
    *   *Focus:* 2px solid `var(--primary)` + 4px soft outer glow.
*   **Checkboxes:** 20px x 20px; 6px radius. Spring scale (0.8 -> 1.0) on state change.

### 3.3 Overlays
*   **Modals:** 28px radius; 64px glass blur; `translateY(30px -> 0)` entry.
*   **Tooltips:** 11px font; Black background; 150ms fade.
*   **Action Toasts:** 64px height; Bottom-right fixed; 10s progress bar for undo visibility.

---

## 4. Interaction Patterns

### 4.1 Micro-Interaction Timings
*   **Click Ripple:** 100ms.
*   **Luminous Hover Expansion:** 300ms.
*   **Sidebar Collapse:** 300ms `cubic-bezier(0.4, 0, 0.2, 1)`.

### 4.2 Keyboard Navigation
*   **Hierarchy:** [1] Global Search -> [2] Navigation Sidebar -> [3] Filter Bar -> [4] Main Grid.
*   **Shortcuts:** `/` for Search; `N` for New; `M` for Manage; `ESC` to clear.

---

## 5. Implementation Snippets

### 5.1 Svelte 5 Component (Reference)
```svelte
<script lang="ts">
  let { primary = false, onclick, children } = $props();
</script>

<button
  class="super-button {primary ? 'primary' : ''}"
  onclick={onclick}
>
  {@render children?.()}
</button>
```

### 5.2 React Component (Reference)
```tsx
export const SuperButton = ({ primary, onClick, children }) => (
  <button
    className={`super-button ${primary ? 'primary' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);
```

---

## 6. Deliverables Index
*   **SCSS Tokens:** `projects/pro-variables.scss`
*   **Motion Spec:** `projects/pro-animations.json`
*   **Accessibility:** `projects/accessibility-report.md`
*   **Test Template:** `projects/user-test-template.md`

---
*Authored by Jules, UI Architect.*
