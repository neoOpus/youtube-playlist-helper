# YouTube Playlist Helper: Design & Implementation Guide (Unicorn Edition)

## Core Design Principles
- **Clarity & Obsidian Depth:** Every element has a purpose. High-contrast typography paired with deep, translucent "Obsidian" surfaces ensures data is the hero.
- **Immediate SOTA Feedback:** No action goes unacknowledged. From haptic-style audio cues to spring-loaded motion, the system breathes responsiveness.
- **Infrastructure Hierarchy:** Information architecture follows a logical flow: Dashboard (Overview) → Infrastructure Hub (Management) → Node Editor (Deep Control).
- **Accessibility as a Standard:** 100% WCAG 2.2 AA compliance ensures every user can architect their collections.

## UI Component Library (Obsidian Depth v2)

### Foundations
- **Grid:** 4px Baseline Grid. All spacing (margin, padding, gap) is a multiple of 4px.
- **Palette:**
  - Accent: `#0066FF` (Unicorn Blue)
  - Surface: `#0F0F12`
  - Deep: `#050507`
  - Glass: `rgba(15, 15, 18, 0.7)` with 12px Backdrop Blur.

### Components
- **SimpleButton:** Spring-animated interactions. Primary variant uses `accent-glow` shadows.
- **SuperInput:** Dynamic focus rings with `0.3` opacity overlays. Integrated real-time validation.
- **SmartElement:** The foundational glass block. Supports `interactive` state with vertical lift on hover.
- **Modal:** Center-anchored, scale-transitioned (`300ms easeSpring`) with background dimming and focus trapping.

## SOTA Interaction Patterns
- **Query-Driven Maintenance:** Bulk Ops v2 uses a terminal-inspired interface for high-velocity metadata editing.
- **Automated Infrastructure:** Dynamic Smart Rules allow users to deploy "if-then" automation scripts to their nodes.
- **Force-Directed Topology:** A D3-powered graph visualizing how playlists and videos form a connected knowledge base.

## Implementation Details (Svelte 5 Runes)
```typescript
// Ultra-reactive state management
let playlist = $state<Playlist>({ ... });
let stats = $derived.by(() => calculateSystemHealth(playlist));

// Spring physics configuration
const springOpts = { stiffness: 0.2, damping: 0.1 };
```

## Responsive Breakpoints
- **Mobile (Pro):** < 480px. Sidebar collapses to bottom-nav or hidden-drawer.
- **Tablet:** 481px - 768px. Grid collapses to 1-column view.
- **Desktop:** > 769px. Full 12-column layout (max-width 1440px).

## Performance Standards
- **Processing:** Metadata analysis for 5,000+ nodes must complete in < 30ms.
- **Rendering:** GPU-accelerated transforms and opacity only. No layout shifts (`CLS < 0.1`).
- **Resilience:** Persistent action logging and E2EE local backup prompts on destructive operations.

*Guide version: 2.5.0-SOTA*
