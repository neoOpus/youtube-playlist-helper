# @yph/ui-kit: SOTA Component Architecture

Re-usable Svelte 5 visual units following the "Obsidian Depth" design specification.

## Core Principles
1. **Rune-Based Reactivity**: 100% Svelte 5 Runes for ultra-low overhead state management.
2. **Tactile Motion**: All interactive elements utilize `svelte/motion` spring physics for a "physical" feel.
3. **Accessibility (WCAG 2.2)**: Strict adherence to ARIA roles and keyboard management.
4. **Visual Density**: Optimized for high information density without sacrificing clarity.

## Featured Components
- **ParametricBackground**: WebGL/Canvas-powered dynamic ambient environment with noise grain and light nodes.
- **SuperToggle / SuperCheckbox**: Spring-loaded state switches with tactile hover responses.
- **CommandPalette**: Global fuzzy-search and semantic search entry point.
- **TopologyGraph**: D3.js powered visualization engine with automatic SVG-to-Canvas scaling.
