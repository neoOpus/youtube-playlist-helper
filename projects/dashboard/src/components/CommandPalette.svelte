<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { push } from "svelte-spa-router";
  import {
    SearchIcon,
    PlaylistPlusIcon,
    SaveIcon,
    PlaylistPlayIcon,
    TerminalIcon,
    type IconComponent
  } from "@yph/ui-kit";
  import { storageService, videoService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";

  const dispatch = createEventDispatcher();
  export let display = false;

  let query = "";
  let selectedIndex = 0;
  let inputElement: HTMLInputElement;

  let playlists: Playlist[] = [];
  let filteredPlaylists: Playlist[] = [];
  let videoResults: { video: Video, playlist: Playlist }[] = [];

  const staticActions = [
      { id: 'new', title: 'Create New Playlist', icon: PlaylistPlusIcon as any, action: () => push('/new') },
      { id: 'manage', title: 'Go to Manage Hub', icon: SaveIcon as any, action: () => push('/manage') },
      { id: 'saved', title: 'View Saved Playlists', icon: PlaylistPlayIcon as any, action: () => push('/') },
  ];

  onMount(async () => {
      playlists = await storageService.getPlaylists();
  });

  $: {
      if (query.trim().length < 2) {
          filteredPlaylists = [];
          videoResults = [];
      } else {
          const q = query.toLowerCase();
          filteredPlaylists = playlists.filter(p => p.title.toLowerCase().includes(q)).slice(0, 4);

          const matches: { video: Video, playlist: Playlist }[] = [];
          for (const pl of playlists) {
              if (pl.loadedVideos) {
                  for (const v of pl.loadedVideos) {
                      if (v.title.toLowerCase().includes(q)) {
                          matches.push({ video: v, playlist: pl });
                          if (matches.length >= 6) break;
                      }
                  }
              }
              if (matches.length >= 6) break;
          }
          videoResults = matches;
      }
      selectedIndex = 0;
  }

  $: totalItems = (query.trim() === "" ? staticActions.length : filteredPlaylists.length + videoResults.length);

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % totalItems;
      }
      if (e.key === "ArrowUp") {
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + totalItems) % totalItems;
      }
      if (e.key === "Enter") {
          e.preventDefault();
          execute(selectedIndex);
      }
  }

  function execute(index: number) {
      if (query.trim() === "") {
          staticActions[index].action();
      } else {
          if (index < filteredPlaylists.length) {
              push(`/edit/${filteredPlaylists[index].id}`);
          } else {
              const res = videoResults[index - filteredPlaylists.length];
              push(`/edit/${res.playlist.id}?videoId=${res.video.videoId}`);
          }
      }
      close();
  }

  function close() {
      display = false;
      query = "";
  }

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }

  onMount(() => {
      const globalHandler = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "k") {
              e.preventDefault();
              display = !display;
          }
      };
      window.addEventListener("keydown", globalHandler);
      return () => window.removeEventListener("keydown", globalHandler);
  });

  $: if (display && inputElement) setTimeout(() => inputElement.focus(), 10);
</script>

{#if display}
<div
    role="button"
    tabindex="0"
    class="palette-overlay"
    transition:fade
    on:click={close}
    on:keydown={(e) => e.key === 'Escape' && close()}
    aria-label="Close command palette"
>
    <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        tabindex="-1"
        class="palette-container pro-glass"
        in:fly={{ y: -40, duration: 400 }}
        on:click|stopPropagation
        on:keydown|stopPropagation
    >
        <div class="search-box">
            <SearchIcon size="20" color="var(--primary)" />
            <input
                bind:this={inputElement}
                bind:value={query}
                on:keydown={handleKeydown}
                placeholder="Search playlists, videos, or commands (Ctrl+K)..."
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
                        on:click={() => execute(i)}
                        on:mousemove={handleMouseMove}
                    >
                        <svelte:component this={action.icon} size="18" />
                        <span>{action.title}</span>
                        <span class="shortcut">PRO</span>
                    </button>
                {/each}
            {:else}
                {#if filteredPlaylists.length > 0}
                    <div class="section-label">Playlists</div>
                    {#each filteredPlaylists as pl, i}
                        <button
                            role="option"
                            aria-selected={selectedIndex === i}
                            class="result-item luminous-hover"
                            class:active={selectedIndex === i}
                            on:click={() => execute(i)}
                            on:mousemove={handleMouseMove}
                        >
                            <PlaylistPlayIcon size="18" />
                            <span>{pl.title}</span>
                            <span class="badge">Collection</span>
                        </button>
                    {/each}
                {/if}

                {#if videoResults.length > 0}
                    <div class="section-label mt-4">Deep Search (Videos)</div>
                    {#each videoResults as res, i}
                        {@const idx = i + filteredPlaylists.length}
                        <button
                            role="option"
                            aria-selected={selectedIndex === idx}
                            class="result-item luminous-hover"
                            class:active={selectedIndex === idx}
                            on:click={() => execute(idx)}
                            on:mousemove={handleMouseMove}
                        >
                            <SearchIcon size="18" color="var(--primary)" />
                            <div class="vid-meta">
                                <span class="v-title">{res.video.title}</span>
                                <span class="v-pl">{res.playlist.title}</span>
                            </div>
                            <span class="badge secondary">Video</span>
                        </button>
                    {/each}
                {/if}

                {#if filteredPlaylists.length === 0 && videoResults.length === 0}
                    <div class="empty-results">No matches found for "{query}"</div>
                {/if}
            {/if}
        </div>

        <div class="palette-footer">
            <span><strong>↑↓</strong> to navigate</span>
            <span><strong>Enter</strong> to select</span>
            <span><strong>Esc</strong> to close</span>
        </div>
    </div>
</div>
{/if}

<style>
    .palette-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); z-index: 5000; display: flex; justify-content: center; padding-top: 15vh; backdrop-filter: blur(8px); }
    .palette-container { width: 650px; max-width: 90vw; max-height: 550px; overflow: hidden; display: flex; flex-direction: column; cursor: default; }
    .pro-glass { background: var(--card-bg-alpha, rgba(15, 20, 30, 0.95)); backdrop-filter: blur(28px); border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 32px 128px rgba(0, 0, 0, 0.6); }

    .search-box { padding: 1.5rem; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); }
    .search-box input { background: transparent; border: none; color: var(--text); font-size: 1.2rem; width: 100%; outline: none; font-weight: 800; }

    .results-list { padding: 1rem; overflow-y: auto; flex-grow: 1; }
    .section-label { padding: 0.5rem 1rem; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; text-align: left; }
    .mt-4 { margin-top: 1.5rem; }

    .result-item { width: 100%; border: none; background: transparent; padding: 12px 16px; border-radius: 14px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s; font-weight: 700; color: var(--text); text-align: left; position: relative; overflow: hidden; }
    .result-item.active { background: var(--primary); color: white; transform: scale(1.02); box-shadow: 0 8px 24px rgba(255, 82, 82, 0.3); }

    .luminous-hover::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 60%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
    }
    .luminous-hover:hover::after { opacity: 1; }

    .vid-meta { display: flex; flex-direction: column; flex-grow: 1; min-width: 0; }
    .v-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .v-pl { font-size: 0.7rem; opacity: 0.6; }

    .shortcut, .badge { font-size: 0.6rem; font-weight: 900; padding: 4px 8px; background: var(--hover); color: var(--text-muted); border-radius: 6px; text-transform: uppercase; }
    .badge.secondary { border: 1px solid var(--border); background: transparent; }
    .result-item.active .shortcut, .result-item.active .badge { background: rgba(255, 255, 255, 0.2); color: white; }

    .empty-results { padding: 3rem; text-align: center; color: var(--text-muted); font-weight: 600; font-size: 1rem; }
    .palette-footer { padding: 1rem 1.5rem; background: var(--hover); border-top: 1px solid var(--border); display: flex; gap: 2rem; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }
    .palette-footer strong { color: var(--primary); }
</style>
