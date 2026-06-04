<script lang="ts">
  import { router } from "../stores/router";
  import { ContextMenu } from "@yph/ui-kit";
  import type { Playlist } from "@yph/core";
  import { storageService } from "@yph/core";
  import { Play, Trash2, Edit3, Clock } from "lucide-svelte";

  interface Props {
    playlist: Playlist;
    ondeleted?: (pl: Playlist) => void;
  }

  let {
    playlist,
    ondeleted = (pl: Playlist) => {}
  }: Props = $props();

  let videoCount = $derived(playlist.videos?.length || 0);
  let lastModified = $derived(playlist.lastModified ? new Date(playlist.lastModified).toLocaleDateString() : 'N/A');

  let showMenu = $state(false);
  let menuX = $state(0);
  let menuY = $state(0);

  async function deletePlaylist() {
    if (confirm(`Delete playlist "${playlist.title}"?`)) {
        await storageService.removePlaylist(playlist);
        ondeleted(playlist);
    }
  }

  function handleCardClick() {
      router.push(`/edit/${playlist.id}`);
  }

  function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      menuX = e.clientX;
      menuY = e.clientY;
      showMenu = true;
  }

  const menuItems = [
      { label: "Edit", icon: Edit3, onclick: () => router.push(`/edit/${playlist.id}`) },
      { label: "Delete", icon: Trash2, onclick: deletePlaylist, danger: true }
  ];
</script>

<div
    role="button"
    tabindex="0"
    class="playlist-card surface-1"
    onclick={handleCardClick}
    oncontextmenu={handleContextMenu}
    onkeydown={e => e.key === 'Enter' && handleCardClick()}
>
  <div class="card-body">
    <div class="header-row">
        <h3>{playlist.title || "Untitled Playlist"}</h3>
        <div class="video-count">
            <Play size="12" />
            <span>{videoCount}</span>
        </div>
    </div>

    <div class="info-row">
        <div class="timestamp">
            <Clock size="12" />
            <span>{lastModified}</span>
        </div>
    </div>
  </div>

  <div class="card-actions">
      <button class="action-btn" onclick={e => { e.stopPropagation(); router.push(`/edit/${playlist.id}`); }}>
          <Edit3 size="14" />
      </button>
      <button class="action-btn danger" onclick={e => { e.stopPropagation(); deletePlaylist(); }}>
          <Trash2 size="14" />
      </button>
  </div>

  <ContextMenu items={menuItems} bind:display={showMenu} x={menuX} y={menuY} />
</div>

<style>
  .playlist-card {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: all 0.2s;
    cursor: pointer;
    border-radius: 12px;
    background: var(--bg-surface-1);
    border: 1px solid var(--border-base);
  }

  .playlist-card:hover {
      border-color: var(--primary);
      background: var(--bg-surface-2);
  }

  .header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 0; line-height: 1.3; }

  .video-count {
      display: flex; align-items: center; gap: 4px; padding: 2px 8px;
      background: var(--bg-app); border-radius: 6px; font-size: 0.75rem; font-weight: 700;
  }

  .info-row { display: flex; align-items: center; color: var(--text-muted); font-size: 0.75rem; }
  .timestamp { display: flex; align-items: center; gap: 6px; }

  .card-actions { display: flex; gap: 8px; margin-top: 0.5rem; }
  .action-btn {
      background: transparent; border: 1px solid var(--border-base);
      color: var(--text-secondary); width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
  }
  .action-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--bg-app); }
  .action-btn.danger:hover { color: var(--danger); border-color: var(--danger); }
</style>
