<svelte:options runes={true} />
<script lang="ts">
  import { router } from "../stores/router";
  import {
    DeleteIcon,
    PencilIcon,
    ContextMenu,
    SuperCheckbox
  } from "@yph/ui-kit";
  import type { Playlist } from "@yph/core";
  import { storageService, actionLogger } from "@yph/core";
  import { fade, scale } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import { Layers, Clock, MoreVertical, Trash2, Edit3, ChevronRight } from "lucide-svelte";
  import { appState } from "../stores/theme.svelte";

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

  let showMenu = $state(false);
  let menuX = $state(0);
  let menuY = $state(0);

  async function deletePlaylist() {
    if (confirm(`Purge infrastructure node "${playlist.title}"?`)) {
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

  function handleCardClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('.selection, .card-actions')) return;
      router.push(`/edit/${playlist.id}`);
  }

  function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      menuX = e.clientX;
      menuY = e.clientY;
      showMenu = true;
  }

  const menuItems = [
      { label: "Edit Node", icon: Edit3, onclick: () => router.push(`/edit/${playlist.id}`) },
      { label: "Purge", icon: Trash2, onclick: deletePlaylist, danger: true }
  ];
</script>

<div
    role="button"
    tabindex="0"
    class="playlist-card surface-1"
    class:is-selected={selected}
    onclick={handleCardClick}
    oncontextmenu={handleContextMenu}
    onkeydown={e => e.key === 'Enter' && handleCardClick(e as any)}
    in:scale={{ start: 0.98, duration: 400, easing: backOut }}
>
  <div class="card-header">
      <div class="selection" onclick={e => e.stopPropagation()} role="presentation">
          <SuperCheckbox checked={selected} onchange={handleSelect} />
      </div>
      <div class="node-icon-group">
          <div class="node-icon"><Layers size="16" /></div>
          {#if videoCount > 0}
            <div class="indicator-ring"></div>
          {/if}
      </div>
      <div class="meta">
          <div class="count-pill">
              <span class="count">{videoCount}</span>
              <span class="unit">NODES</span>
          </div>
      </div>
  </div>

  <div class="card-body">
    <h3>{playlist.title || "Untitled Infrastructure"}</h3>
    <div class="modified-row">
        <Clock size="10" />
        <span>SYNCED: {lastModified}</span>
    </div>
    {#if playlist.groups && playlist.groups.length > 0}
      <div class="tag-row">
        {#each playlist.groups as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="card-footer">
    <div class="card-actions">
        <button class="action-item" onclick={() => router.push(`/edit/${playlist.id}`)}>
            <Edit3 size="14" />
        </button>
        <button class="action-item danger" onclick={deletePlaylist}>
            <Trash2 size="14" />
        </button>
    </div>
    <div class="enter-hint">
        <ChevronRight size="14" />
    </div>
  </div>

  <ContextMenu
    items={menuItems}
    bind:display={showMenu}
    x={menuX}
    y={menuY}
  />
</div>

<style>
  .playlist-card {
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    transition: all var(--duration-base) var(--ease-out);
    cursor: pointer;
    height: 100%;
    min-height: 200px;
    text-align: left;
    outline: none;
    position: relative;
    overflow: hidden;
  }

  .playlist-card:hover {
      border-color: var(--primary);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
  }

  .playlist-card.is-selected {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.05);
  }

  .card-header { display: flex; align-items: flex-start; justify-content: space-between; }

  .node-icon-group { position: relative; }
  .node-icon {
      width: 40px; height: 40px;
      background: var(--bg-surface-2);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: var(--primary);
      border: 1px solid var(--border-base);
  }

  .indicator-ring {
      position: absolute; inset: -2px; border: 2px solid var(--primary);
      border-radius: 12px; opacity: 0; transition: opacity 0.3s;
  }
  .playlist-card:hover .indicator-ring { opacity: 0.15; }

  .count-pill {
      display: flex; align-items: baseline; gap: 4px;
      background: var(--bg-surface-2); padding: 4px 10px; border-radius: 20px;
      border: 1px solid var(--border-base);
  }
  .count { font-size: 0.9rem; font-weight: 900; color: var(--text-main); line-height: 1; }
  .unit { font-size: 0.55rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; }

  .card-body h3 { font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin: 4px 0 6px; line-height: 1.2; letter-spacing: -0.01em; }

  .modified-row { display: flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 700; color: var(--text-dim); margin-bottom: 12px; }

  .tag-row { display: flex; flex-wrap: wrap; gap: 4px; }
  .tag { font-size: 0.6rem; font-weight: 800; color: var(--primary); background: rgba(var(--primary-rgb), 0.1); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

  .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-subtle); }
  .card-actions { display: flex; gap: 6px; }

  .action-item {
      background: var(--bg-surface-2); border: 1px solid var(--border-base);
      color: var(--text-secondary); width: 32px; height: 32px; border-radius: 8px;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
  }
  .action-item:hover { border-color: var(--primary); color: var(--primary); transform: scale(1.05); }
  .action-item.danger:hover { background: var(--danger); color: white; border-color: var(--danger); }

  .enter-hint { color: var(--text-muted); opacity: 0.3; transition: all 0.3s; }
  .playlist-card:hover .enter-hint { opacity: 0.8; transform: translateX(4px); color: var(--primary); }

  @media (max-width: 600px) { .playlist-card { padding: var(--space-4); } }
</style>
