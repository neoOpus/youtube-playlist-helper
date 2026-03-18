# YouTube Playlist Helper: Next-Level Design & Implementation Guide

This guide defines the front-end architecture, UI/UX standards, and implementation details for the "Quantum Edition" of the YouTube Playlist Helper. It ensures the extension feels like a polished, modern web application.

## 1. Core Design Principles
- **Clarity & Consistency:** Use standard components and a unified color palette to reduce cognitive load.
- **Glassmorphism:** Employ translucency, background blurs, and subtle borders to create depth and focus.
- **Feedback & Delight:** Provide immediate visual feedback for all user actions via micro-interactions and transitions.
- **Accessibility (WCAG 2.2 AA):** Minimum 4.5:1 contrast, visible focus outlines, ARIA labels for icons, and keyboard operability.
- **Performance:** Limit animations to GPU-accelerated properties (`transform`, `opacity`) to maintain 60fps.

## 2. UI Component Library

### Color Palette
| Token | Dark (SOTA Red) | GitHub Light | Dracula |
| :--- | :--- | :--- | :--- |
| `--primary` | `#ff5252` | `#0969da` | `#bd93f9` |
| `--bg` | `#0b0f1a` | `#f6f8fa` | `#282a36` |
| `--card-bg-alpha` | `rgba(10, 16, 28, 0.85)` | `rgba(246, 248, 250, 0.95)` | `rgba(40, 42, 54, 0.9)` |
| `--border` | `rgba(255, 255, 255, 0.08)` | `rgba(208, 215, 222, 0.8)` | `rgba(68, 71, 90, 0.8)` |
| `--text` | `#f1f5f9` | `#1f2328` | `#f8f8f2` |

### Typography Scale (4px Baseline)
| Size | Token | Value | Weight | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| XS | `--font-xs` | 0.75rem (12px) | 800 | Labels, Metadata, Badges |
| SM | `--font-sm` | 0.875rem (14px) | 500/700 | Body text, Inputs, Buttons |
| BASE | `--font-base` | 1rem (16px) | 500 | Main paragraphs |
| LG | `--font-lg` | 1.125rem (18px) | 800 | Card titles |
| XL | `--font-xl` | 1.25rem (20px) | 900 | Section headers, Sidebar Logo |
| 4XL | `--font-4xl` | 2.25rem (36px) | 900 | Page titles (Saved Collection) |

### Elevation & Radius
- **Radius Sm/Md/Lg/Xl:** 4px / 8px / 12px / 18px.
- **Shadows:**
  - `--shadow-sm`: 0 1px 2px rgba(0,0,0,0.05)
  - `--shadow-xl`: 0 20px 25px -5px rgba(0,0,0,0.1)

## 3. Interaction Patterns
- **Hover:** Background shift (`var(--hover)`) + Lift (`translateY(-4px)`).
- **Focus:** 2px solid primary outline with 2px offset (`focus-visible`).
- **Keyboard Navigation:** Tab order follows logical flow (Sidebar -> Filters -> Results).
- **Undo/Redo:** Toast notification with "Undo" action (250ms fade-in).
- **Micro-interactions:**
  - Button press ripple: 150ms transform scale down (0.96).
  - Luminous Hover: Radial gradient (12% opacity primary) follows cursor.

## 4. Accessibility Checklist
- [ ] Contrast ratio ≥ 4.5:1 for all text.
- [ ] `aria-label` on all icon-only buttons (e.g., Delete, Edit).
- [ ] `aria-current="page"` on active navigation items.
- [ ] Keyboard support (`Enter`/`Space`) for all custom controls (Checkboxes, Modals).
- [ ] Focus trap in Modals and Wizards.

## 5. Responsive & Adaptive Layout
- **Mobile (≤ 480px):** Sidebar collapses to 60px icons only, 1-column grid.
- **Tablet (481px - 1024px):** 2-column grid for playlists, sticky sidebar.
- **Desktop (≥ 1025px):** 12-column layout (max-width 1200px), multi-column playlist grid.

## 6. Motion & Performance
- Limit animations to GPU-accelerated properties: `transform`, `opacity`.
- Use `prefers-reduced-motion` to disable non-critical animations.
- Lazy-load playlist videos beyond the first 10 using virtualization.

## 7. Information Architecture (IA)
1. **Extension Icon:** Primary entry point.
2. **Popup:** Quick search and "Add Current Video" action.
3. **Sidebar (Primary Nav):** Saved Playlists, New, Manage, Cloud Sync, Support.
4. **Main View:** Filters/Sort at top, Results in grid, Modals for destructive actions.

## 8. User-Testing Plan (Lightweight)
- **Protocol:** 5-user remote "think-aloud" test.
- **Tasks:** 1. Find a specific video using Smart Sort. 2. Create a new playlist. 3. Delete a playlist and undo.
- **Metrics:** Success rate, Time-on-task, SUS (System Usability Scale) score.

## 9. Deliverables

### CSS Variables (`_variables.scss` / `app.css`)
```css
:root {
  --space-4: 1rem;
  --primary: #ff5252;
  --radius-lg: 12px;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Component Snippets
#### Svelte (Primary)
```svelte
<SuperButton primary on:click={save}>Save Changes</SuperButton>
```

#### React
```tsx
const SuperButton = ({ children, primary, onClick }) => (
  <button className={`super-button ${primary ? 'is-primary' : ''}`} onClick={onClick}>
    {children}
  </button>
);
```

#### Vanilla JS
```javascript
const btn = document.createElement('button');
btn.className = 'super-button is-primary';
btn.textContent = 'Save Changes';
btn.addEventListener('click', () => save());
```

---
*Created by Jules, Software Engineer.*
