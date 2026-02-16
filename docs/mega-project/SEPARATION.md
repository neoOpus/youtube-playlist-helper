# Project Separation & Modular Boundaries

This document details the architectural split between the **Core** and **Mega** projects within this repository.

## Core Project (The Foundation)
**Goal**: Stable, reliable, and lean YouTube playlist management.
- **Location**: `src/components/core`, `src/services/core`.
- **Features**: Basic CRUD operations, storage persistence, drag-drop, basic de-duplication, and WebDAV sync fallback.
- **Dependencies**: Minimal. Browser storage and YouTube API only.

## Mega Project (The Ultimate Companion)
**Goal**: Intelligent, automated, and power-user optimized dashboard ecosystem.
- **Location**: `src/components/mega`, `src/services/mega`, `src/components/ui`.
- **Features**:
    - **Cloud 2.0**: Real-time Supabase sync with conflict resolution.
    - **Intelligence Hub**: AI Agents for categorization and health monitoring.
    - **Advanced GUI**: Command Palette, SVG Logigrams, Curriculum Modes.
    - **Metadata Enrichment**: Video ID Cards with persistent notes and ratings.
- **Dependencies**: Supabase JS, FontAwesome, Svelte Motion.

## Separation Rules
1. **Unidirectional Imports**: Core components MUST NOT import from Mega components or services.
2. **Feature Toggling**: All Mega features should be gated behind settings, allowing for a "Lite" mode.
3. **UI Consistency**: Both projects share the `src/components/ui` library to ensure a unified aesthetic.
