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
  import { fade } from "svelte/transition";
  import { Layers, Clock, MoreVertical, Trash2, Edit3 } from "lucide-svelte";
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
>
  <div class="card-header">
      <div class="selection" onclick={e => e.stopPropagation()} role="presentation">
          <SuperCheckbox checked={selected} onchange={handleSelect} />
      </div>
      <div class="node-icon"><Layers size="16" /></div>
      <div class="meta">
          <span class="count-badge">{videoCount}</span>
          <span class="date">{lastModified}</span>
      </div>
  </div>

  <div class="card-body">
    <h3>{playlist.title}</h3>
    {#if playlist.groups && playlist.groups.length > 0}
      <div class="tag-row">
        {#each playlist.groups as tag}
          <span class="tag">#{tag}</span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="card-footer">
    <div class="card-actions">
        <button class="icon-btn" onclick={() => router.push(`/edit/${playlist.id}`)} title="Edit">
            <Edit3 size="14" />
        </button>
        <button class="icon-btn danger" onclick={deletePlaylist} title="Delete">
            <Trash2 size="14" />
        </button>
    </div>
    <span class="node-id">{playlist.id.slice(0,6)}</span>
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
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    transition: transform var(--duration-base) var(--ease-out), border-color var(--duration-base), box-shadow var(--duration-base);
    cursor: pointer;
    height: 100%;
    min-height: 180px;
    text-align: left;
    outline: none;
  }

  .playlist-card:hover {
      border-color: var(--border-strong);
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
  }

  .playlist-card.is-selected {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.03);
  }

  .card-header { display: flex; align-items: center; gap: 12px; }

  .node-icon {
      width: 32px; height: 32px;
      background: var(--bg-surface-2);
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-secondary);
  }

  .meta { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; }
  .count-badge { font-size: 0.7rem; font-weight: 800; color: var(--primary); background: rgba(var(--primary-rgb), 0.1); padding: 2px 6px; border-radius: 4px; }
  .date { font-size: 0.65rem; color: var(--text-muted); margin-top: 2px; font-weight: 600; }

  .card-body h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 4px 0 8px; line-height: 1.3; }

  .tag-row { display: flex; flex-wrap: wrap; gap: 4px; }
  .tag { font-size: 0.6rem; font-weight: 700; color: var(--text-secondary); background: var(--border-subtle); padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }

  .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-subtle); }
  .card-actions { display: flex; gap: 8px; }

  .icon-btn {
      background: transparent; border: 1px solid var(--border-base);
      color: var(--text-muted); padding: 6px; border-radius: 6px;
      cursor: pointer; transition: all 0.2s;
  }
  .icon-btn:hover { background: var(--border-subtle); color: var(--text-main); border-color: var(--border-strong); }
  .icon-btn.danger:hover { color: var(--danger); border-color: var(--danger); }

  .node-id { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--text-muted); opacity: 0.5; }
</style>
