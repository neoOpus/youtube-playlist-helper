<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { router } from "../stores/router";
  import {
    DeleteIcon,
    PencilIcon,
    SuperButton,
    ContextMenu,
    TerminalIcon,
    SaveIcon,
    PlaylistPlayIcon,
    SuperCheckbox
  } from "@yph/ui-kit";
  import type { Playlist } from "@yph/core";
  import { storageService, actionLogger } from "@yph/core";
  import { scale } from "svelte/transition";

  interface Props {
    playlist: Playlist;
    selected?: boolean;
    ondeleted?: (pl: Playlist) => void;
    onselect?: (selected: boolean) => void;
  }

  let {
    playlist,
    selected = false,
    ondeleted = (pl: Playlist) => {},
    onselect = (selected: boolean) => {}
  }: Props = $props();

  let videoCount = $derived(playlist.loadedVideos?.length || 0);
  let lastModified = $derived(playlist.lastModified ? new Date(playlist.lastModified).toLocaleDateString() : 'N/A');

  let showMenu = false;
  let menuX = 0;
  let menuY = 0;

  async function deletePlaylist() {
    if (confirm(`Decommission infrastructure node "${playlist.title}"?`)) {
        const original = { ...playlist };
        actionLogger.log(`Delete "${playlist.title}"`, async () => {
            await storageService.savePlaylist(original);
            ondeleted(original);
        });
        await storageService.removePlaylist(playlist);
        ondeleted(playlist);
    }
  }

  function handleSelect(newVal: boolean) {
      onselect(newVal);
  }

  function navigateToEdit() {
      router.push(`/edit/${playlist.id}`);
  }

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }

  function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      menuX = e.clientX;
      menuY = e.clientY;
      showMenu = true;
  }

  const menuItems = [
      { label: "Modify System", icon: PencilIcon, onclick: navigateToEdit },
      { label: "Neural Scan", icon: TerminalIcon, onclick: () => console.log("Scan initiated") },
      { label: "Export Data", icon: SaveIcon, onclick: () => console.log("Export") },
      { label: "Decommission", icon: DeleteIcon, onclick: deletePlaylist, danger: true }
  ];
</script>

<button
    type="button"
    class="playlist-card pro-glass luminous-hover aura-glow"
    class:is-selected={selected}
    onmousemove={handleMouseMove}
    oncontextmenu={handleContextMenu}
    onclick={(e) => {
        if ((e.target as HTMLElement).closest('.selection-overlay, .actions, .card-actions')) return;
        navigateToEdit();
    }}
    in:scale={{ start: 0.95, duration: 400 }}
>
  <div class="card-header">
      <div class="selection-overlay">
          <SuperCheckbox checked={selected} onchange={handleSelect} />
      </div>
      <div class="header-icon">
          <PlaylistPlayIcon size="24" color="var(--primary)" />
          {#if videoCount > 20}
            <div class="pulse-indicator"></div>
          {/if}
      </div>
      <div class="meta">
          <span class="badge secondary">{videoCount} Nodes</span>
          <span class="small muted">{lastModified}</span>
      </div>
  </div>

  <div class="card-body">
    <h3>{playlist.title}</h3>
    {#if playlist.groups && playlist.groups.length > 0}
      <div class="tags-row">
        {#each playlist.groups as group}
          <span class="tag">#{group}</span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="card-footer">
    <div class="actions">
        <SuperButton outline onclick={navigateToEdit} title="Modify System">
            <PencilIcon size="14" />
        </SuperButton>
        <SuperButton outline onclick={deletePlaylist} danger title="Decommission">
            <DeleteIcon size="14" />
        </SuperButton>
    </div>
    <div class="system-info">
        <div class="timestamp">
            Created: {new Date(playlist.timestamp).toLocaleDateString()}
        </div>
        <div class="system-id">
            <TerminalIcon size="10" />
            <span>{playlist.id.slice(0, 8)}</span>
        </div>
    </div>
  </div>

  <ContextMenu
    items={menuItems}
    bind:display={showMenu}
    x={menuX}
    y={menuY}
  />
</button>

<style>
  .playlist-card {
    position: relative;
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid var(--border);
    cursor: pointer;
    height: 100%;
    min-height: 240px;
    background: var(--card-bg-alpha);
    text-align: left;
    width: 100%;
    color: inherit;
    font-family: inherit;
    overflow: hidden;
  }

  .playlist-card:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(var(--primary-rgb), 0.5);
    box-shadow:
        0 20px 40px -10px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(var(--primary-rgb), 0.2),
        var(--luminous-shadow, 0 0 0 transparent);
    z-index: 10;
  }

  /* Custom mouse-following shadow enhancement */
  .playlist-card:hover {
      --luminous-shadow: 0 0 30px -5px rgba(var(--primary-rgb), 0.15);
  }

  .playlist-card.is-selected {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary);
    background: rgba(var(--primary-rgb), 0.05);
  }

  .card-header { display: flex; align-items: flex-start; justify-content: space-between; position: relative; }
  .header-icon {
    position: relative;
    background: var(--bg-secondary);
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px var(--shadow);
  }

  .pulse-indicator {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: var(--primary);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--primary);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }

  .meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }

  .card-body { flex-grow: 1; }
  .card-body h3 {
    font-size: var(--font-lg);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.2;
    margin-bottom: var(--space-3);
    color: var(--text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tags-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag {
    font-size: 0.65rem;
    font-weight: 800;
    color: var(--text-muted);
    background: var(--hover);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: border-color 0.3s;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .playlist-card:hover .tag { border-color: rgba(var(--primary-rgb), 0.1); }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    padding-top: var(--space-4);
    margin-top: auto;
    gap: var(--space-2);
  }

  .actions { display: flex; gap: var(--space-2); }

  .system-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .timestamp {
    font-size: var(--font-xs);
    font-weight: 700;
    color: var(--text-muted);
    opacity: 0.5;
  }

  .system-id {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 800;
    color: var(--text-muted);
    opacity: 0.3;
    transition: opacity 0.3s;
  }
  .playlist-card:hover .system-id { opacity: 0.7; }

  .selection-overlay {
    position: absolute;
    top: -10px;
    left: -10px;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    transform: scale(0.8);
  }
  .playlist-card:hover .selection-overlay, .playlist-card.is-selected .selection-overlay { opacity: 1; transform: scale(1); }

  .aura-glow::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(circle at center, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%);
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s;
  }
  .playlist-card:hover::before { opacity: 1; }
</style>
