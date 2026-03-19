<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { DeleteIcon, PencilIcon, SuperButton, PlaylistPlayIcon } from "@yph/ui-kit";
  import type { Playlist } from "@yph/core";
  import { storageService, actionLogger } from "@yph/core";
  import { scale, fade } from "svelte/transition";

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
    class="playlist-card pro-glass luminous-hover aura-glow"
    on:mousemove={handleMouseMove}
    in:scale={{ start: 0.98, duration: 400 }}
    role="region"
    aria-label="Playlist card: {playlist.title}"
>
  <div class="card-header">
    <div class="title-row">
        <a href="#/edit/{playlist.id}" class="title">
            <span class="icon"><PlaylistPlayIcon size="16" color="var(--primary)" /></span>
            {playlist.title}
        </a>
        <div class="meta-badge">{(playlist.videos || []).length} NODES</div>
    </div>
    {#if playlist.groups?.length}
      <div class="groups">
        {#each playlist.groups as group}
          <span class="badge secondary">{group}</span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="card-footer">
      <div class="timestamp">
        <span class="muted">Indexed:</span> {new Date(playlist.timestamp).toLocaleDateString()}
      </div>
      <div class="card-actions">
        <a href="#/edit/{playlist.id}" class="action-btn" title="Edit infrastructure" aria-label="Edit {playlist.title}">
            <PencilIcon size="16" />
        </a>
        <button
            on:click={deletePlaylist}
            class="action-btn danger-btn"
            title="Decommission"
            aria-label="Delete {playlist.title}"
        >
          <DeleteIcon size="16" />
        </button>
      </div>
  </div>
</div>

<style>
  .playlist-card {
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    transition: all 0.4s var(--easing-standard);
    position: relative;
    overflow: hidden;
    height: 100%;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
  }

  .playlist-card:hover {
    transform: translateY(-8px);
    border-color: rgba(var(--primary-rgb), 0.3);
    box-shadow: 0 20px 60px -15px var(--shadow);
    background: rgba(var(--primary-rgb), 0.03);
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .title {
    font-size: var(--font-lg);
    font-weight: 800;
    color: var(--text);
    text-decoration: none;
    display: flex;
    gap: 12px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .title .icon { flex-shrink: 0; margin-top: 2px; }
  .title:hover { color: var(--primary); }

  .meta-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    font-weight: 900;
    background: var(--hover);
    padding: 2px 10px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
    color: var(--primary);
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .groups { display: flex; flex-wrap: wrap; gap: var(--space-2); }

  .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: var(--space-6);
      border-top: 1px solid var(--border);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    transition: all 0.2s var(--easing-standard);
    background: var(--bg-secondary);
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
    transform: scale(1.1);
  }

  .danger-btn:hover {
    background: var(--danger) !important;
    border-color: var(--danger) !important;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
  }

  .timestamp {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text);
    opacity: 0.8;
  }

  .card-actions { display: flex; gap: var(--space-2); }
</style>
