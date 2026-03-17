<script lang="ts">
  import PlaylistCount from "./PlaylistCount.svelte";
  import { SmartElement, PencilIcon, DeleteIcon, ClipboardMultiple } from "@yph/ui-kit";
  import type { Playlist } from "@yph/core";
  import { createEventDispatcher } from "svelte";
  import { storageService, notificationService } from "@yph/core";

  export let playlist: Playlist;
  export let active = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("click", playlist);
  }

  async function deletePlaylist(e: MouseEvent) {
      e.stopPropagation();
      if (confirm(`Delete playlist "${playlist.title}"?`)) {
          await storageService.removePlaylist(playlist);
          notificationService.success("Playlist deleted.");
          window.location.reload();
      }
  }

  function copyId(e: MouseEvent) {
      e.stopPropagation();
      navigator.clipboard.writeText(playlist.id);
      notificationService.info("Playlist ID copied to clipboard.");
  }
</script>

{#if playlist}
<SmartElement {active} on:click={handleClick} className="playlist-preview-card">
  <div class="content">
    <div class="info">
        <div class="title-row">
            <span class="title">{playlist.title || 'Untitled'}</span>
            <PlaylistCount count={playlist.videos?.length || 0} />
        </div>
        <div class="meta">
            {#if playlist.groups && playlist.groups.length > 0}
                <div class="tags">
                    {#each playlist.groups.slice(0, 2) as group}
                        <span class="tag">{group}</span>
                    {/each}
                    {#if playlist.groups.length > 2}
                        <span class="tag-more">+${playlist.groups.length - 2}</span>
                    {/if}
                </div>
            {/if}
            <span class="date">{new Date(playlist.timestamp).toLocaleDateString()}</span>
        </div>
    </div>
    <div class="quick-actions">
        <button on:click={copyId} title="Copy ID"><ClipboardMultiple size="14" /></button>
        <button on:click={deletePlaylist} class="delete" title="Delete"><DeleteIcon size="14" /></button>
    </div>
  </div>
</SmartElement>
{/if}

<style>
  :global(.playlist-preview-card) {
    padding: 1.25rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card-bg);
    margin: 8px;
    width: 280px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    color: var(--text);
  }

  :global(.playlist-preview-card:hover) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow);
      border-color: var(--primary);
  }

  .content {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
    overflow: hidden;
  }

  .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
  }

  .title {
    font-weight: 700;
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text);
  }

  .meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
  }

  .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
  }

  .tag {
      background: var(--hover);
      color: var(--text-muted);
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
  }

  .tag-more {
      font-size: 0.65rem;
      color: var(--text-muted);
  }

  .date {
      font-size: 0.75rem;
      color: var(--text-muted);
  }

  .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;
  }

  :global(.playlist-preview-card:hover) .quick-actions {
      opacity: 1;
  }

  .quick-actions button {
      background: var(--hover);
      border: 1px solid var(--border);
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
  }

  .quick-actions button:hover {
      background: var(--active);
      color: var(--text);
  }

  .quick-actions button.delete:hover {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
      border-color: #dc3545;
  }
</style>
