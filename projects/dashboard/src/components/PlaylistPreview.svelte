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
    <a href="#/edit/{playlist.id}" class="action-btn secondary" title="Edit infrastructure" aria-label="Edit {playlist.title}">
        <PencilIcon size="16" />
    </a>
    <SuperButton
        on:click={deletePlaylist}
        circle
        bgcolor="rgba(220, 53, 69, 0.1)"
        className="action-btn danger"
        title="Decommission"
        ariaLabel="Delete {playlist.title}"
    >
      <DeleteIcon size="16" color="#dc3545" />
    </SuperButton>
  </div>

  <div class="timestamp small muted">
    Created: {new Date(playlist.timestamp).toLocaleDateString()}
  </div>
</div>

<style>
  .playlist-card {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .playlist-card:hover { transform: translateY(-4px) scale(1.01); border-color: var(--primary); }

  .title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  .title { font-size: 1.1rem; font-weight: 800; color: var(--text); text-decoration: none; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2; overflow: hidden; }
  .title:hover { color: var(--primary); }

  .meta-badge { font-family: 'JetBrains Mono'; font-size: 0.7rem; font-weight: 900; background: var(--hover); padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border); color: var(--primary); }

  .groups { display: flex; flex-wrap: wrap; gap: 6px; }
  .group-tag { font-size: 0.65rem; font-weight: 800; background: var(--hover); color: var(--text-muted); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border); text-transform: uppercase; }

  .card-actions { display: flex; gap: 10px; margin-top: auto; }

  :global(.action-btn) { display: flex !important; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; transition: all 0.2s; background: var(--hover); border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; text-decoration: none; }
  :global(.action-btn:hover) { background: var(--primary) !important; color: white !important; border-color: var(--primary) !important; }
  :global(.action-btn.danger:hover) { background: #dc3545 !important; }

  .timestamp { font-size: 0.65rem; font-weight: 800; opacity: 0.6; }
</style>
