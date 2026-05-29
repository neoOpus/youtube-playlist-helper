<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { router } from '../stores/router';
  import {
    SearchIcon,
    TerminalIcon,
    PlaylistPlayIcon,
    PlaylistPlusIcon,
    SaveIcon,
    Tooltip
  } from '@yph/ui-kit';
  import { storageService, aiService, embeddingService } from '@yph/core';
  import type { Playlist, Video } from '@yph/core';

  let { display = $bindable(false) } = $props();

  let query = $state("");
  let selectedIndex = $state(0);
  let inputElement = $state<HTMLInputElement | null>(null);
  let playlists = $state<Playlist[]>([]);
  let filteredPlaylists = $state<Playlist[]>([]);
  let videoResults = $state<{video: Video, playlist: Playlist, score?: number}[]>([]);
  let isScanning = $state(false);

  const staticActions = [
      { id: 'new', title: 'Create New Playlist', icon: PlaylistPlusIcon, action: () => router.push('/new') },
      { id: 'manage', title: 'Go to Manage Hub', icon: SaveIcon, action: () => router.push('/manage') },
      { id: 'saved', title: 'View Saved Playlists', icon: PlaylistPlayIcon, action: () => router.push('/') }
  ];

  onMount(async () => {
      playlists = await storageService.getPlaylists();
  });

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = (selectedIndex + 1) % totalItems; }
      if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = (selectedIndex - 1 + totalItems) % totalItems; }
      if (e.key === 'Enter') { e.preventDefault(); executeSelected(selectedIndex); }
  }

  function executeSelected(index: number) {
      if (query.trim() === "") {
          staticActions[index].action();
      } else if (index < filteredPlaylists.length) {
          router.push(`/edit/${filteredPlaylists[index].id}`);
      } else {
          const res = videoResults[index - filteredPlaylists.length];
          router.push(`/edit/${res.playlist.id}?videoId=${res.video.videoId}`);
      }
      close();
  }

  function close() { display = false; query = ""; }

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  onMount(() => {
      const handler = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); display = !display; }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
  });

  async function performDeepScan() {
      if (query.trim().length < 2) {
          filteredPlaylists = [];
          videoResults = [];
          return;
      }

      isScanning = true;
      const q = query.toLowerCase();
      const { useLocalEmbeddings } = await aiService.getSettings();
      let queryEmbeddings: number[] | undefined;

      if (useLocalEmbeddings) {
          queryEmbeddings = await embeddingService.getEmbeddings(q);
      }

      filteredPlaylists = playlists.filter(p => p.title.toLowerCase().includes(q)).slice(0, 4);

      const matches: {video: Video, playlist: Playlist, score: number}[] = [];
      for (const pl of playlists) {
          if (pl.loadedVideos) {
              for (const v of pl.loadedVideos) {
                  let score = 0;
                  const titleMatch = v.title.toLowerCase().includes(q);
                  if (titleMatch) score += 100;

                  if (queryEmbeddings && v.embeddings) {
                      const sim = embeddingService.cosineSimilarity(queryEmbeddings, v.embeddings);
                      score += sim * 80;
                  }

                  if (score > 0.5) {
                      matches.push({ video: v, playlist: pl, score });
                  }
              }
          }
      }

      videoResults = matches.sort((a, b) => b.score - a.score).slice(0, 8);
      isScanning = false;
      selectedIndex = 0;
  }

  $effect(() => {
      query;
      performDeepScan();
  });

  let totalItems = $derived(query.trim() === "" ? staticActions.length : filteredPlaylists.length + videoResults.length);

  $effect(() => {
      if (display && inputElement) {
          setTimeout(() => inputElement?.focus(), 10);
      }
  });
</script>

{#if display}
  <div class="palette-overlay" transition:fade={{ duration: 200 }} onclick={close} onkeydown={handleKeydown} role="button" tabindex="0">
    <div class="palette-container pro-glass-high" transition:fly={{ y: -40, duration: 400 }} onclick={e => e.stopPropagation()} onkeydown={e => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
        <div class="search-box">
            <div class="icon-pulse" class:active={isScanning}>
                <TerminalIcon size="20" color="var(--primary)" />
            </div>
            <input
                bind:this={inputElement}
                bind:value={query}
                placeholder="Deep-scan infrastructure nodes (Semantic Search Active)..."
                type="text"
            />
        </div>
        <div class="results-list" role="listbox">
            {#if query.trim() === ""}
                <div class="section-label">Quick Actions</div>
                {#each staticActions as action, i}
                    <button
                        role="option"
                        aria-selected={selectedIndex === i}
                        class="result-item luminous-hover"
                        class:active={selectedIndex === i}
                        onclick={() => executeSelected(i)}
                        onmousemove={handleMouseMove}
                    >
                        <action.icon size="18" />
                        <span>{action.title}</span>
                        <span class="shortcut">PRO</span>
                    </button>
                {/each}
            {:else}
                {#if filteredPlaylists.length > 0}
                    <div class="section-label">Sectors</div>
                    {#each filteredPlaylists as pl, i}
                        <button
                            role="option"
                            aria-selected={selectedIndex === i}
                            class="result-item luminous-hover"
                            class:active={selectedIndex === i}
                            onclick={() => executeSelected(i)}
                            onmousemove={handleMouseMove}
                        >
                            <PlaylistPlayIcon size="18" />
                            <span>{pl.title}</span>
                            <span class="badge">Sector</span>
                        </button>
                    {/each}
                {/if}
                {#if videoResults.length > 0}
                    <div class="section-label mt-4">Resonance Matches (Nodes)</div>
                    {#each videoResults as res, i}
                        {@const index = i + filteredPlaylists.length}
                        <Tooltip text="Resonates with '{query}' at {Math.round(res.score || 0)}% semantic similarity." position="right">
                            <button
                                role="option"
                                aria-selected={selectedIndex === index}
                                class="result-item luminous-hover"
                                class:active={selectedIndex === index}
                                onclick={() => executeSelected(index)}
                                onmousemove={handleMouseMove}
                            >
                                <div class="resonance-indicator" style="opacity: {Math.min(1, (res.score || 0) / 100)}"></div>
                                <div class="vid-meta">
                                    <span class="v-title">{res.video.title}</span>
                                    <span class="v-pl">{res.playlist.title}</span>
                                </div>
                                <span class="badge secondary">Node</span>
                            </button>
                        </Tooltip>
                    {/each}
                {/if}
                {#if !isScanning && filteredPlaylists.length === 0 && videoResults.length === 0}
                    <div class="empty-results">No resonance found for "{query}" in local infrastructure.</div>
                {/if}
            {/if}
        </div>
        <div class="palette-footer">
            <span><strong>↑↓</strong> to navigate</span>
            <span><strong>Enter</strong> to select</span>
            <span><strong>Esc</strong> to close</span>
            <div class="spacer"></div>
            <div class="engine-tag">OBSIDIAN_DEPTH_V3_ENGINE</div>
        </div>
    </div>
  </div>
{/if}

<style>
    .palette-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 5000; display: flex; justify-content: center; padding-top: 15vh; backdrop-filter: blur(12px); }
    .palette-container { width: 700px; max-width: 92vw; max-height: 600px; overflow: hidden; display: flex; flex-direction: column; cursor: default; }
    .search-box { padding: 1.5rem 2rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid var(--border); }
    .search-box input { background: transparent; border: none; color: var(--text); font-size: 1.2rem; width: 100%; outline: none; font-weight: 800; letter-spacing: -0.02em; }

    .icon-pulse.active { animation: pulse-icon 1s infinite alternate; }
    @keyframes pulse-icon { from { opacity: 0.4; transform: scale(0.9); } to { opacity: 1; transform: scale(1.1); } }

    .results-list { padding: 1rem; overflow-y: auto; flex-grow: 1; }
    .section-label { padding: 0.5rem 1rem; font-size: 0.65rem; font-weight: 900; color: var(--text-dim); text-transform: uppercase; letter-spacing: 2px; }

    .result-item { width: 100%; border: none; background: transparent; padding: 14px 20px; border-radius: 16px; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 700; color: var(--text); text-align: left; position: relative; overflow: hidden; }
    .result-item.active { background: var(--primary); color: white; transform: scale(1.01) translateX(4px); box-shadow: 0 8px 30px rgba(255, 82, 82, 0.3); }

    .resonance-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--primary); box-shadow: 2px 0 10px var(--primary); }
    .result-item.active .resonance-indicator { background: white; box-shadow: 2px 0 10px white; }

    .vid-meta { display: flex; flex-direction: column; flex-grow: 1; min-width: 0; }
    .v-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.95rem; }
    .v-pl { font-size: 0.7rem; opacity: 0.6; font-weight: 800; text-transform: uppercase; margin-top: 2px; }

    .shortcut, .badge { font-size: 0.6rem; font-weight: 900; padding: 4px 8px; background: var(--hover); color: var(--text-muted); border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; }
    .badge.secondary { border: 1px solid var(--border); background: transparent; }
    .result-item.active .shortcut, .result-item.active .badge { background: rgba(255,255,255,0.2); color: white; }

    .empty-results { padding: 4rem; text-align: center; color: var(--text-dim); font-weight: 800; font-size: 0.9rem; }

    .palette-footer { padding: 1.25rem 2rem; background: rgba(0,0,0,0.2); border-top: 1px solid var(--border); display: flex; gap: 2rem; font-size: 0.7rem; font-weight: 800; color: var(--text-dim); align-items: center; }
    .palette-footer strong { color: var(--primary); }
    .spacer { flex-grow: 1; }
    .engine-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; opacity: 0.4; }

    .mt-4 { margin-top: 1rem; }
</style>
