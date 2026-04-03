<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { DeleteIcon, PencilIcon, SuperButton } from "@yph/ui-kit";
  import type { Playlist } from "@yph/core";
  import { storageService, actionLogger } from "@yph/core";
  import { scale } from "svelte/transition";

  export let playlist: Playlist;
  const dispatch = createEventDispatcher();

  async function deletePlaylist() {
    if (confirm(`Delete "${playlist.title}"?`)) {
        const previous = { ...playlist };
        actionLogger.log(`Delete ${playlist.title}`, async () => {
            await storageService.savePlaylist(previous);
            dispatch("restored", previous);
        });
        await storageService.removePlaylist(playlist);
        dispatch("deleted", playlist);
    }
  }

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }
</script>

<div
    class="playlist-card pro-glass luminous-hover"
    on:mousemove={handleMouseMove}
    in:scale={{ start: 0.95, duration: 400 }}
    role="region"
    aria-label="Playlist card: {playlist.title}"
>
  <div class="card-header">
    <div class="title-row">
        <a href="#/edit/{playlist.id}" class="title">{playlist.title}</a>
        <div class="meta-badge">{(playlist.videos || []).length}</div>
    </div>
    {#if playlist.groups?.length}
      <div class="groups">
        {#each playlist.groups as group}
          <span class="group-tag">{group}</span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="card-actions">
    <a href="#/edit/{playlist.id}" class="action-btn" title="Edit infrastructure" aria-label="Edit {playlist.title}">
        <PencilIcon size="16" />
    </a>
    <SuperButton
        on:click={deletePlaylist}
        circle
        className="action-btn danger-btn"
        title="Decommission"
        ariaLabel="Delete {playlist.title}"
    >
      <DeleteIcon size="16" />
    </SuperButton>
  </div>

  <div class="timestamp">
    Created: {new Date(playlist.timestamp).toLocaleDateString()}
  </div>
</div>

<style>
  .playlist-card {
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .playlist-card:hover {
    transform: translateY(-4px);
    border-color: var(--primary);
    box-shadow: var(--shadow-xl);
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
    margin-bottom: var(--space-2);
  }

  .title {
    font-size: var(--font-lg);
    font-weight: 800;
    color: var(--text);
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
    line-height: 1.4;
  }

  .title:hover { color: var(--primary); }

  .meta-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--font-xs);
    font-weight: 900;
    background: var(--hover);
    padding: 2px var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    color: var(--primary);
  }

  .groups { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .group-tag {
    font-size: var(--font-xs);
    font-weight: 800;
    background: var(--hover);
    color: var(--text-muted);
    padding: 2px var(--space-2);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .card-actions { display: flex; gap: var(--space-3); margin-top: auto; padding-top: var(--space-4); }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--hover);
    border: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    text-decoration: none;
  }

  .action-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
  }

  :global(.danger-btn:hover) {
    background: var(--danger) !important;
    border-color: var(--danger) !important;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
  }

  .timestamp {
    font-size: var(--font-xs);
    font-weight: 700;
    color: var(--text-muted);
    opacity: 0.6;
    margin-top: var(--space-2);
  }
</style>
