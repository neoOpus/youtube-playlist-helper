<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { sectorIntelligence, notificationService, storageService } from "@yph/core";
  import type { Video, Playlist } from "@yph/core";
  import { TerminalIcon, PlusMultiple, InfoIcon, SuperButton } from "@yph/ui-kit";
  import { fade, slide } from "svelte/transition";

  let { video, onmoved }: { video: Video, onmoved?: (v: Video) => void } = $props();
  let suggestions = $state<{ playlist: Playlist, confidence: number }[]>([]);
  let isLoading = $state(false);

  async function getSuggestions() {
      isLoading = true;
      suggestions = await sectorIntelligence.suggestSectors(video);
      isLoading = false;
  }

  async function moveToSector(playlist: Playlist) {
      if (!playlist.loadedVideos) playlist.loadedVideos = [];

      // Add to new
      playlist.loadedVideos.push({ ...video });
      playlist.videos.push(video.videoId);
      await storageService.savePlaylist(playlist);

      notificationService.success(`Node relocated to ${playlist.title}.`);
      if (onmoved) onmoved(video);
      suggestions = [];
  }
</script>

<div class="sector-intelligence">
    {#if suggestions.length > 0}
        <div class="suggestions-pane pro-glass-high mt-4" transition:slide>
            <div class="pane-header">
                <TerminalIcon size="14" />
                <span>SEMANTIC_RESONANCE_DETECTED</span>
            </div>
            <div class="suggestion-list mt-4">
                {#each suggestions as sug}
                    <button class="suggestion-item" onclick={() => moveToSector(sug.playlist)}>
                        <div class="sug-info">
                            <span class="pl-title">{sug.playlist.title}</span>
                            <span class="confidence">{sug.confidence}% Match</span>
                        </div>
                        <PlusMultiple size="14" />
                    </button>
                {/each}
            </div>
        </div>
    {:else if isLoading}
        <div class="mini-loader mt-4"><TerminalIcon size="12" class="spin" /> Scanning Sector Topology...</div>
    {:else}
        <button class="suggest-trigger mt-2" onclick={getSuggestions}>
            <TerminalIcon size="12" />
            <span>Identify Optimal Sector</span>
        </button>
    {/if}
</div>

<style>
    .suggest-trigger { background: transparent; border: 1px dashed var(--border); padding: 6px 12px; border-radius: 8px; color: var(--text-dim); font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .suggest-trigger:hover { border-color: var(--primary); color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }

    .suggestions-pane { padding: var(--space-4); border: 1px solid var(--primary); background: rgba(var(--primary-rgb), 0.02); }
    .pane-header { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 900; color: var(--primary); }

    .suggestion-list { display: flex; flex-direction: column; gap: 6px; }
    .suggestion-item { display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: var(--text); }
    .suggestion-item:hover { border-color: var(--primary); transform: translateX(4px); }
    .sug-info { display: flex; flex-direction: column; text-align: left; }
    .pl-title { font-size: 0.8rem; font-weight: 800; }
    .confidence { font-size: 10px; font-weight: 700; color: var(--success); font-family: 'JetBrains Mono', monospace; }

    .mini-loader { font-size: 10px; font-weight: 800; color: var(--text-dim); display: flex; align-items: center; gap: 8px; }
    :global(.spin) { animation: spin 1s linear infinite; }
</style>
