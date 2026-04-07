# YouTube Playlist Helper: Professional Design & Implementation Guide

This document provides a comprehensive design-and-implementation framework for the YouTube Playlist Helper. It is designed to ensure a "Professional Edition" experience: sleek, modern, and high-performance.

---

## 1. Core Design Principles

- **Clarity & Consistency:** 1.5 line-height for body text; 32px - 64px section breathing room. Standard components and a unified color palette.
- **Obsidian Depth (Glassmorphism):** Multi-layer background blurs (40px - 80px), and 1px borders (`var(--border-strong)`) to create depth.
- **Feedback & Delight:** Immediate visual feedback for all actions. 60fps animations (< 16ms frame time).
- **Accessibility (WCAG 2.2 AA):** Minimum 4.5:1 contrast, visible focus outlines, ARIA labels, and keyboard-only operability.
- **Solid Information Architecture:** Logical grouping of related functions and progressive disclosure of advanced settings.

---

## 2. Layout & Grid Specifications

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Baseline Grid** | 4px | All spacing/sizing is a multiple of 4px. |
| **Max Container Width** | 1200px | Centered in viewport. |
| **Grid System** | 12-Column | Fluid percentage-based columns. |
| **Gutter Width** | 24px | Standardized via `var(--space-6)`. |
| **Breakpoints** | ≤ 480px (M) / 481-768px (T) / ≥ 769px (D) | Responsive reflow down to 320px. |

### Typography Scale (4px Baseline)
| Token | Size | Weight | Use Case |
| :--- | :--- | :--- | :--- |
| `--font-xs` | 0.7rem (11.2px) | 900 | Labels, Metadata, Badges |
| `--font-sm` | 0.825rem (13.2px) | 700 | Body text, Inputs, Buttons |
| `--font-base` | 0.95rem (15.2px) | 500 | Main paragraphs |
| `--font-lg` | 1.125rem (18px) | 800 | Card titles |
| `--font-xl` | 1.4rem (22.4px) | 900 | Section headers |
| `--font-4xl` | 4.5rem (72px) | 900 | Hero titles |

---

## 3. UI Component Library

### 3.1 Buttons (SuperButton)
- **Primary:** Gradient (#ff5252 -> #ff7575), white text, 100ms ripple.
- **Secondary:** `var(--bg-secondary)`, 1px border.
- **Danger:** Gradient (#ef4444 -> #ff6b6b).
- **Link:** `var(--primary)`, no background, underline on hover.
- **Micro-interaction:** Press scale 0.96, 100ms ripple effect.

### 3.2 Form Elements
- **SuperInput:** 12px radius, 1px border, 2px focus ring (primary, 0.2 opacity).
- **SuperSelect:** Custom arrow, obsidian glass background.
- **SuperToggle:** 44x22px track, 16px thumb, 150ms slide.
- **SuperCheckbox:** 20x20px, 6px radius, spring scale (0.8 -> 1.0).

### 3.3 Overlays & Feedback
- **Modals:** 32px radius, 80px blur, `fly` entry (y: 20 -> 0).
- **Tooltips:** 11px font, 150ms fade.
- **Notification Badges:** `var(--primary)`, All-caps bold, 4px radius.
- **Toasts:** 200ms fade-in, 10s visibility with undo option.
- **Loading Spinner:** 2Hz frequency (0.5s rotation period).

---

## 4. Interaction Patterns

| Pattern | Expected Behavior | Timing |
| :--- | :--- | :--- |
| **Click/Tap** | Visual ripple + subtle scale down. | 100ms |
| **Hover** | Luminous radial glow + Elevation lift (-2px). | 300ms |
| **Focus** | 2px solid primary outline with 2px offset. | Immediate |
| **Drag-and-Drop** | Visual ghosting, target highlight, spring reorder. | 400ms |
| **Undo/Redo** | Toast action + ActionLogger state recovery. | 200ms fade |
| **Navigation** | Tab order: Sidebar -> Filters -> Search -> Grid. | N/A |

---

## 5. Information Architecture

1. **Extension Icon:** Primary entry point for quick actions.
2. **Dashboard (Options Page):** Central hub for infrastructure management.
   - **Saved Collection:** Primary data view.
   - **New Intelligence:** Wizard/Editor for ingestion.
   - **Manage Hub:** Power tools and health stats.
   - **System Environment:** Progressive disclosure for settings/theming.

---

## 6. Accessibility & Performance
- **WCAG 2.2 AA:** 4.5:1 contrast, ARIA labels on icons, keyboard Space/Enter/Escape support.
- **Motion:** GPU-accelerated (`transform`, `opacity`), respects `prefers-reduced-motion`.
- **Latency:** All dashboard filtering is debounced to avoid layout thrashing.

---

## 7. User-Testing & Iteration Plan
- **Protocol:** 5-user remote usability test (Think-Aloud).
- **Metrics:** Task success rate, Time-on-task, SUS score (Target > 80).
- **Iteration:** Resolve high-priority blockers (Severity 1-2) before release.

---

## 8. Implementation Snippets

### React (SuperInput)
```tsx
export const SuperInput = ({ label, value, onChange }) => (
  <div className="super-input-wrapper">
    <label className="input-label">{label}</label>
    <div className="input-container">
      <input className="pro-input" value={value} onChange={onChange} />
      <div className="focus-ring" />
    </div>
  </div>
);
```

### Vue (SuperToggle)
```vue
<template>
  <button class="super-toggle" :class="{ 'is-active': active }" @click="toggle">
    <div class="toggle-track"><div class="toggle-thumb" /></div>
  </button>
</template>
```

---
*Authored by Jules, UI Architect.*
