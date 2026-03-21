# YouTube Playlist Helper: Professional Design Guide

This guide defines the "State of the Art" (Pro) front-end architecture and implementation for the YouTube Playlist Helper: Pro Edition. It serves as a comprehensive blueprint for developers to achieve a polished, modern, and delightful user experience.

## 1. Core Design Principles
*   **Clarity:** Use whitespace and typography to separate concerns. Minimalist aesthetics to reduce cognitive load.
*   **Consistency:** All components follow the "Pro" design system (4px grid, shared color tokens).
*   **Feedback:** Immediate visual or haptic responses to user actions (Ripples, Toasts, Hover Glows).
*   **Visual Hierarchy:** High-contrast headings and "Aura Glow" backgrounds for primary content.
*   **Accessibility (WCAG 2.2 AA):** High contrast (4.5:1+), keyboard focus visibility, and semantic HTML.
*   **Simplicity:** Progressive disclosure of complex features (Advanced Mode).
*   **Responsiveness:** Fluid layouts that adapt from mobile popups to 4K dashboards.
*   **Delight:** Smooth 60fps transitions and cursor-tracking radial gradients.
*   **Information Architecture:** Flattened navigation with clear breadcrumbs.

## 2. UI Component Library (Specifications)

### Layout & Grid
*   **Baseline Grid:** 4px.
*   **Max-Width:** 1200px (Desktop), 768px (Tablet), 480px (Mobile/Popup).
*   **Layout:** 12-column grid for dashboard; single-column for extension popup.

### Design Tokens (CSS Variables)
| Token | Dark (Pro) | GitHub Light | Dracula | Pro Red |
| :--- | :--- | :--- | :--- | :--- |
| `--primary` | `#ff5252` | `#0969da` | `#bd93f9` | `#ff0000` |
| `--bg` | `#030712` | `#ffffff` | `#282a36` | `#0a0000` |
| `--card-bg` | `rgba(3, 7, 18, 0.75)` | `rgba(255, 255, 255, 0.9)` | `rgba(40, 42, 54, 0.85)` | `rgba(15, 0, 0, 0.9)` |
| `--border` | `rgba(255, 255, 255, 0.05)` | `rgba(31, 35, 40, 0.1)` | `rgba(68, 71, 90, 0.8)` | `rgba(255, 0, 0, 0.1)` |
| `--text` | `#f9fafb` | `#1f2328` | `#f8f8f2` | `#ffffff` |

### Components
*   **Buttons:**
    *   *Primary:* Solid `--primary`, white text, 8px radius, 0 4px 15px shadow.
    *   *Secondary:* Glass background, 1px border, 0.8 opacity text.
    *   *Danger:* `#ff4444` solid.
*   **Input Fields:** 12px padding, 8px radius, 1px border. Focus: 2px border `--primary`.
*   **Modals:** Backdrop blur (32px), centered, 16px radius, Y-offset +20px entry animation.
*   **Tooltips:** Dark background, 12px font, 4px radius, 200ms fade-in.
*   **Toasts:** Bottom-right, progress bar (10s), "Undo" action link.

## 3. Interaction Patterns
*   **Luminous Hover:** A radial gradient `radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.06), transparent 40%)` follows the mouse.
*   **Click/Tap:** 100ms scale down (0.96) for buttons.
*   **Loading:** 2Hz pulsing "Aura Glow" on skeleton states.
*   **Undo/Redo:** `Ctrl+Z` / `Ctrl+Y` support; Toasts provide a 10s window to reverse deletions.
*   **Keyboard:** `Tab` for focus; `Space/Enter` for activation; `/` to focus global search.

## 4. Responsive & Adaptive Layout
*   **Breakpoint ≤ 480px (Extension Popup):**
    *   Hide sidebar; show bottom navigation bar.
    *   Compact list items (no channel thumbnails).
*   **Breakpoint 481px - 768px (Tablet):**
    *   Collapsible sidebar (icons only).
    *   2-column grid for playlists.
*   **Breakpoint ≥ 769px (Desktop):**
    *   Full sidebar with labels.
    *   3+ column grid.

## 5. Motion & Performance
*   **Frame Budget:** < 16.6ms (60fps).
*   **Hardware Acceleration:** Use `will-change: transform, opacity`.
*   **Transitions:** `cubic-bezier(0.4, 0, 0.2, 1)` for standard; `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring effects.

## 6. Information Architecture (IA)
1.  **Extension Icon:** Quick status & "Open Dashboard" button.
2.  **Popup (Primary Actions):** Current tab video → Add to Playlist; Search.
3.  **Dashboard (Main Hub):**
    *   **Sidebar:** Root navigation (New, Saved, Manage, Sync).
    *   **Main View:** Data display (Grid/Table).
    *   **Bottom Bar:** Selection & Mass Actions.
4.  **Options Page:** Theme selection, storage stats, E2EE toggle.

## 7. User-Testing Protocol
*   **Format:** 5-user remote "Think Aloud" test.
*   **Metrics:** Task Success Rate (%), Time-on-Task (s), SUS Score (0-100).
*   **Iteration:** Any task with < 80% success rate requires immediate UI redesign.

## 8. Implementation Snippets (Svelte/TypeScript)

### Breadcrumbs Component
```svelte
<nav class="breadcrumbs">
  {#each items as item, i}
    <span>{item}</span>
    {#if i < items.length - 1} <ChevronRight /> {/if}
  {/each}
</nav>
```

### SuperButton Styles (SCSS)
```scss
.super-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &.primary { background: var(--primary); color: white; }
  &:hover { filter: brightness(1.2); transform: translateY(-2px); }
  &:active { transform: scale(0.96); }
}
```

---
*Authored by Jules, Software Engineer.*
