# YouTube Playlist Helper: Quantum SOTA Design Guide

This guide defines the "State of the Art" (SOTA) front-end architecture and implementation for the YouTube Playlist Helper Quantum Revamp.

## 1. The SOTA Aesthetic
The design language is centered around **Deep Glassmorphism** and **Aura Luminance**:
- **Backgrounds:** Ultra-dark base (`#030712`) with 32px backdrop blur.
- **Accents:** High-intensity "SOTA Red" (`#ff5252`) with radial glow effects.
- **Surfaces:** Floating translucent panels with subtle 1px white-alpha borders.
- **Micro-interactions:** 300-500ms easing for all layout shifts and state changes.

## 2. Core UI Component Library (Revamped)

### Color Tokens
| Mode | Primary | Base BG | Card BG Alpha |
| :--- | :--- | :--- | :--- |
| **SOTA Red** | `#ff5252` | `#030712` | `0.75` |
| **Dracula** | `#bd93f9` | `#282a36` | `0.85` |
| **GitHub Dark** | `#2f81f7` | `#0d1117` | `0.90` |

### Typography Scale (Fluid & Precise)
- **4XL (Titles):** 2.5rem, 900 weight, -0.06em tracking.
- **XL (Headers):** 1.3rem, 800 weight, -0.03em tracking.
- **LG (Cards):** 1.1rem, 800 weight.
- **BASE (Body):** 0.95rem, 500 weight.
- **XS (Metadata):** 0.7rem, 900 weight, 0.15em tracking.

## 3. The "Aura" System
The Aura system uses radial gradients to provide depth and focus:
- **Aura Glow:** A subtle, static radial background behind main headers and active items.
- **Luminous Hover:** A dynamic radial gradient that tracks the user's cursor within cards and buttons.

```css
.luminous-hover::after {
  background: radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%);
}
```

## 4. Interaction Standards
- **Nav Shifts:** Sidebar items translate 6px on hover with a 300ms transition.
- **Card Lift:** Playlist cards lift 8px on hover and change background opacity to highlight selection.
- **Active Indicators:** 4px vertical bar with a primary glow (`box-shadow: 0 0 15px var(--primary)`).

## 5. Responsive Core
- **Breakpoints:** 480px (Mobile), 900px (Tablet), 1200px (Desktop), 1600px (Ultra-wide).
- **Behavior:** Grid expands from 1 to 4 columns; sidebar collapses to icon-only state.

## 6. Implementation Snippet (Svelte 5)
### The SOTA Playlist Card
```svelte
<div class="playlist-card pro-glass luminous-hover aura-glow">
  <header>
    <a href="/edit/{id}" class="title">
      <PlaylistPlayIcon size="16" color="var(--primary)" />
      {title}
    </a>
    <div class="meta-badge">{videoCount} NODES</div>
  </header>
  ...
</div>
```

---
*Authored by Jules, Software Engineer.*
