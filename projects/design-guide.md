# YouTube Playlist Helper: Professional Design & Implementation Guide
**Architecture & Implementation Blueprint for the Pro Edition**

This guide defines the exact visual specifications, interaction patterns, and implementation strategy for the YouTube Playlist Helper Professional UI. It ensures the extension feels like a polished, modern web application.

---

## 1. Core Design Principles

*   **Clarity & Consistency:** 1.5 line-height for body text; 32px - 64px section breathing room. Standard components and a unified color palette.
*   **Obsidian Depth (Glassmorphism):** Employ translucency, multi-layer background blurs (40px - 80px), and subtle borders to create depth and focus.
*   **Feedback & Delight:** Provide immediate visual feedback for all user actions via micro-interactions and transitions (60fps, < 16ms per frame).
*   **Accessibility (WCAG 2.2 AA):** Minimum 4.5:1 contrast, visible focus outlines, ARIA labels for icons, and keyboard-only operability.
*   **Progressive Disclosure:** Advanced technical parameters are sequestered behind the "System Environment" section.

---

## 2. Layout & Grid Specifications (4px Baseline)

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Baseline Grid** | 4px | All measurements (padding, margin, width) must be multiples. |
| **Max Container Width** | 1600px | Centered in viewport. |
| **Grid System** | 12-Column | Fluid percentage-based widths. |
| **Gutter Width** | 24px | Standardized via `var(--space-6)`. |
| **Sidebar Width** | 280px | Collapses to 80px on mobile. |

---

## 3. UI Component Specifications

### 3.1 Buttons (SuperButton)
*   **Height:** 44px (Standard) / 32px (Mini).
*   **Typography:** Inter Bold (800), 12px (0.75rem), All-Caps.
*   **Corner Radius:** 12px (`var(--radius-md)`).
*   **Types:**
    *   *Primary:* Gradient (#ff5252 -> #ff7575), white text.
    *   *Secondary:* `var(--bg-secondary)` with 1px border.
    *   *Danger:* Gradient (#ef4444 -> #ff6b6b).
*   **States:**
    *   *Hover:* Scale 1.01; transform `translateY(-2px)`; Luminous radial glow.
    *   *Active:* Scale 0.96; transform `translateY(0)`.

### 3.2 Form Elements
*   **Input Fields / Selects:**
    *   *Typography:* Inter Bold (700), 14px.
    *   *Background:* Obsidian Glass (`var(--bg-secondary)`).
    *   *Focus:* 2px solid `var(--primary)` + 4px soft outer glow.
*   **Checkboxes:** 20px x 20px; 6px radius. Spring scale (0.8 -> 1.0) on state change.

### 3.3 Overlays
*   **Modals:** 32px radius (`var(--radius-xl)`); 80px glass blur; `translateY(20px -> 0)` entry.
*   **Tooltips:** 11px font; Black background; 150ms fade.
*   **Action Toasts:** 64px height; Bottom-right fixed; 10s progress bar for undo visibility.

---

## 4. Interaction Patterns

### 4.1 Micro-Interaction Timings
*   **Click Ripple:** 100ms.
*   **Luminous Hover Expansion:** 300ms.
*   **Sidebar Collapse:** 300ms `var(--easing-standard)`.

### 4.2 Keyboard Navigation
*   **Hierarchy:** [1] Global Search (/) -> [2] Navigation Sidebar -> [3] Filter Bar -> [4] Main Grid.
*   **Shortcuts:** `/` for Search; `N` for New; `S` for Saved; `M` for Manage; `ESC` to clear.

---

## 5. Accessibility Checklist
- [x] Contrast ratio ≥ 4.5:1 for all text.
- [x] `aria-label` on all icon-only buttons (e.g., Delete, Edit).
- [x] `aria-current="page"` on active navigation items.
- [x] Keyboard support (`Enter`/`Space`) for all custom controls (Checkboxes, Modals).
- [x] Focus trap in Modals and Wizards.
- [x] Visible focus outlines (2px solid primary).

---

## 6. Implementation Snippets

### 6.1 Svelte 5 Component (Primary)
```svelte
<script lang="ts">
  let { primary = false, onclick, children } = $props();
</script>

<SuperButton {primary} {onclick}>
  {@render children?.()}
</SuperButton>
```

### 6.2 React Component (Reference)
```tsx
export const SuperButton = ({ primary, onClick, children }) => (
  <button
    className={`super-button ${primary ? 'is-primary' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);
```

---

## 7. Deliverables Index
*   **SCSS Tokens:** `projects/pro-variables.scss`
*   **Motion Spec:** `projects/pro-animations.json`
*   **Accessibility:** `projects/accessibility-report.md`
*   **Test Template:** `projects/user-test-template.md`

---
*Authored by Jules, UI Architect.*
