<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { router } from "../stores/router";
  import { storageService, actionLogger } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { fade } from "svelte/transition";
  import { TerminalIcon, SearchIcon, SuperButton } from "@yph/ui-kit";

  let { playlistId }: { playlistId: string } = $props();
  let playlist = $state<Playlist | null>(null);
  let searchQuery = $state("");

  onMount(async () => {
      playlist = await storageService.getPlaylist(playlistId);
  });

  let filteredVideos = $derived(
      playlist?.loadedVideos?.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())) || []
  );
</script>

<div class="advanced-view" in:fade>
    {#if playlist}
        <header class="adv-header">
            <h2>{playlist.title}</h2>
            <div class="search-wrap">
                <SearchIcon size="16" />
                <input bind:value={searchQuery} placeholder="Deep scan nodes..." />
            </div>
        </header>

        <div class="nodes-table">
            {#each filteredVideos as video}
                <div class="node-row">
                    <span class="v-title">{video.title}</span>
                    <SuperButton outline mini onclick={() => router.push(`/edit/${playlist.id}?videoId=${video.videoId}`)}>Focus</SuperButton>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .advanced-view { padding: var(--space-8); }
    .adv-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .search-wrap { display: flex; align-items: center; gap: 12px; background: var(--bg-secondary); padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); }
    input { background: transparent; border: none; color: var(--text); outline: none; }
    .nodes-table { display: flex; flex-direction: column; gap: 8px; }
    .node-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--hover); border-radius: 8px; }
</style>
