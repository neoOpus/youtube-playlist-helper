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
  import { Layers, Clock, MoreVertical, Trash2, Edit3, ChevronRight, Activity, BookOpen } from "lucide-svelte";
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

  function handleSelect(newVal: boolean) { onselect(newVal); }

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
    class:is-curriculum={playlist.curriculum?.enabled}
    onclick={handleCardClick}
    oncontextmenu={handleContextMenu}
    onkeydown={e => e.key === 'Enter' && handleCardClick(e as any)}
    in:scale={{ start: 0.98, duration: 400, easing: backOut }}
>
  <div class="card-header">
      <div class="selection" onclick={e => e.stopPropagation()} role="presentation">
          <SuperCheckbox checked={selected} onchange={handleSelect} />
      </div>

      <div class="node-badge">
          {#if playlist.curriculum?.enabled}
              <div class="curr-icon" title="Learning Path Active"><BookOpen size="14" /></div>
          {:else}
              <div class="node-icon"><Layers size="14" /></div>
          {/if}
      </div>

      <div class="meta">
          <div class="count-chip">
              <span class="val">{videoCount}</span>
              <span class="lab">NODES</span>
          </div>
      </div>
  </div>

  <div class="card-body">
    <h3>{playlist.title || "Untitled Infrastructure"}</h3>
    <div class="info-row">
        <div class="timestamp">
            <Clock size="10" />
            <span>{lastModified}</span>
        </div>
        {#if playlist.curriculum?.enabled}
            <div class="progress-mini">
                <div class="prog-label">TRACKING</div>
                <Activity size="10" class="text-secondary" />
            </div>
        {/if}
    </div>
    {#if playlist.groups && playlist.groups.length > 0}
      <div class="tag-cloud">
        {#each playlist.groups as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="card-footer">
    <div class="card-actions">
        <button class="action-btn" onclick={() => router.push(`/edit/${playlist.id}`)} title="Edit Configuration">
            <Edit3 size="14" />
        </button>
        {#if playlist.curriculum?.enabled}
            <button class="action-btn path-enter" onclick={() => router.push(`/path/${playlist.id}`)} title="Enter Learning Path">
                <ChevronRight size="14" />
            </button>
        {/if}
        <button class="action-btn danger" onclick={deletePlaylist} title="Purge Node">
            <Trash2 size="14" />
        </button>
    </div>
    <div class="system-id">#{playlist.id.slice(0, 4)}</div>
  </div>

  <ContextMenu items={menuItems} bind:display={showMenu} x={menuX} y={menuY} />
</div>

<style>
  .playlist-card {
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    transition: all var(--duration-base) var(--ease-out);
    cursor: pointer;
    height: 100%;
    min-height: 180px;
    text-align: left;
    outline: none;
    position: relative;
    border: 1px solid var(--border-base);
    border-radius: 12px;
  }

  .playlist-card:hover {
      border-color: var(--primary);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
  }

  .is-selected { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.03); }
  .is-curriculum { border-left: 3px solid var(--secondary); }

  .card-header { display: flex; align-items: center; justify-content: space-between; }

  .node-badge { display: flex; gap: 8px; }
  .node-icon, .curr-icon {
      width: 28px; height: 28px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      background: var(--bg-surface-2); border: 1px solid var(--border-base);
  }
  .node-icon { color: var(--text-muted); }
  .curr-icon { color: var(--secondary); border-color: var(--secondary); }

  .count-chip {
      background: var(--bg-surface-2); padding: 2px 8px; border-radius: 20px;
      display: flex; align-items: baseline; gap: 4px; border: 1px solid var(--border-base);
  }
  .count-chip .val { font-size: 0.8rem; font-weight: 900; color: var(--text-main); }
  .count-chip .lab { font-size: 0.5rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; }

  .card-body h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 4px 0 4px; line-height: 1.2; letter-spacing: -0.01em; }

  .info-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .timestamp { display: flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 700; color: var(--text-dim); }
  .progress-mini { display: flex; align-items: center; gap: 6px; }
  .prog-label { font-size: 0.55rem; font-weight: 900; color: var(--secondary); letter-spacing: 0.05em; }

  .tag-cloud { display: flex; flex-wrap: wrap; gap: 4px; }
  .tag { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); background: var(--bg-surface-2); padding: 1px 6px; border-radius: 4px; border: 1px solid var(--border-subtle); text-transform: uppercase; }

  .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-subtle); }
  .card-actions { display: flex; gap: 6px; }

  .action-btn {
      background: var(--bg-surface-2); border: 1px solid var(--border-base);
      color: var(--text-secondary); width: 28px; height: 28px; border-radius: 6px;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
  }
  .action-btn:hover { border-color: var(--primary); color: var(--primary); }
  .action-btn.danger:hover { color: var(--danger); border-color: var(--danger); background: rgba(239, 68, 68, 0.1); }
  .path-enter { background: rgba(16, 185, 129, 0.05); color: var(--secondary); border-color: var(--secondary); }
  .path-enter:hover { background: var(--secondary); color: white; }

  .system-id { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; font-weight: 800; color: var(--text-dim); opacity: 0.4; }

</style>
