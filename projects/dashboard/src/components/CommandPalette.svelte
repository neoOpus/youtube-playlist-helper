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
    CloudSyncIcon,
    SupportIcon,
    MergeIcon,
    Filter
  } from '@yph/ui-kit';
  import { storageService } from '@yph/core';
  import { themeState, setTheme } from '../stores/theme.svelte';
  import type { Playlist, Video } from '@yph/core';

  let { display = $bindable(false) } = $props();

  let query = $state("");
  let selectedIndex = $state(0);
  let inputElement = $state<HTMLInputElement | null>(null);
  let playlists = $state<Playlist[]>([]);
  let filteredPlaylists = $state<Playlist[]>([]);
  let videoResults = $state<{video: Video, playlist: Playlist}[]>([]);
  let commandResults = $state<any[]>([]);

  const baseCommands = [
      { id: 'new', title: 'Create New Playlist', icon: PlaylistPlusIcon, category: 'Actions', action: () => router.push('/new') },
      { id: 'manage', title: 'Go to Manage Hub', icon: SaveIcon, category: 'Navigation', action: () => router.push('/manage') },
      { id: 'saved', title: 'View Saved Playlists', icon: PlaylistPlayIcon, category: 'Navigation', action: () => router.push('/') },
      { id: 'sync', title: 'WebDAV Sync Settings', icon: CloudSyncIcon, category: 'Settings', action: () => router.push('/sync') },
      { id: 'merge', title: 'Merge Playlists', icon: MergeIcon, category: 'Actions', action: () => router.push('/merge') },
      { id: 'support', title: 'Project Support & Feedback', icon: SupportIcon, category: 'Meta', action: () => router.push('/support') },
      { id: 'theme-dark', title: 'Switch to Dark Mode', icon: TerminalIcon, category: 'Appearance', action: () => setTheme('dark') },
      { id: 'theme-light', title: 'Switch to Light Mode', icon: TerminalIcon, category: 'Appearance', action: () => setTheme('light') },
      { id: 'theme-pro', title: 'Activate Pro Red Theme', icon: Filter, category: 'Appearance', action: () => setTheme('pro-red') }
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
          baseCommands[index].action();
      } else {
          // Calculate which list the index belongs to
          if (index < commandResults.length) {
              commandResults[index].action();
          } else if (index < commandResults.length + filteredPlaylists.length) {
              const pl = filteredPlaylists[index - commandResults.length];
              router.push(`/edit/${pl.id}`);
          } else {
              const res = videoResults[index - commandResults.length - filteredPlaylists.length];
              router.push(`/edit/${res.playlist.id}?videoId=${res.video.videoId}`);
          }
      }
      close();
  }

  function close() { display = false; query = ""; }

  function handleMouseMove(index: number) {
      selectedIndex = index;
  }

  onMount(() => {
      const handler = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); display = !display; }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
  });

  $effect(() => {
      if (query.trim().length === 0) {
          commandResults = baseCommands;
          filteredPlaylists = [];
          videoResults = [];
      } else {
          const q = query.toLowerCase();
          commandResults = baseCommands.filter(c =>
              c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
          );

          filteredPlaylists = playlists.filter(p =>
              p.title.toLowerCase().includes(q)
          ).slice(0, 5);

          const matches: {video: Video, playlist: Playlist}[] = [];
          for (const pl of playlists) {
              if (pl.loadedVideos) {
                  for (const v of pl.loadedVideos) {
                      if (v.title.toLowerCase().includes(q)) {
                          matches.push({ video: v, playlist: pl });
                          if (matches.length >= 5) break;
                      }
                  }
              }
              if (matches.length >= 5) break;
          }
          videoResults = matches;
      }
      selectedIndex = 0;
  });

  let totalItems = $derived(commandResults.length + filteredPlaylists.length + videoResults.length);

  $effect(() => {
      if (display && inputElement) {
          setTimeout(() => inputElement?.focus(), 50);
      }
  });
</script>

{#if display}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="palette-overlay" transition:fade={{ duration: 200 }} onclick={close} onkeydown={handleKeydown}>
    <div class="palette-container pro-glass-high" transition:fly={{ y: -40, duration: 400 }} onclick={e => e.stopPropagation()}>
        <div class="search-box">
            <div class="search-icon-wrapper aura-glow">
                <SearchIcon size="20" color="var(--primary)" />
            </div>
            <input
                bind:this={inputElement}
                bind:value={query}
                placeholder="Type a command or search..."
                type="text"
                spellcheck="false"
                autocomplete="off"
            />
            <div class="k-hint">ESC</div>
        </div>
        <div class="results-list" role="listbox">
            {#if commandResults.length > 0}
                <div class="section-label">Commands</div>
                {#each commandResults as cmd, i}
                    <button
                        role="option"
                        aria-selected={selectedIndex === i}
                        class="result-item"
                        class:active={selectedIndex === i}
                        onclick={() => executeSelected(i)}
                        onmouseenter={() => handleMouseMove(i)}
                    >
                        <div class="icon-box">
                            <cmd.icon size="18" />
                        </div>
                        <div class="item-meta">
                            <span class="item-title">{cmd.title}</span>
                            <span class="item-sub">{cmd.category}</span>
                        </div>
                        {#if selectedIndex === i}
                            <span class="enter-hint" in:fade>ENTER</span>
                        {/if}
                    </button>
                {/each}
            {/if}

            {#if filteredPlaylists.length > 0}
                <div class="section-label mt-4">Playlists</div>
                {#each filteredPlaylists as pl, i}
                    {@const index = i + commandResults.length}
                    <button
                        role="option"
                        aria-selected={selectedIndex === index}
                        class="result-item"
                        class:active={selectedIndex === index}
                        onclick={() => executeSelected(index)}
                        onmouseenter={() => handleMouseMove(index)}
                    >
                        <div class="icon-box pl-icon">
                            <PlaylistPlayIcon size="18" />
                        </div>
                        <div class="item-meta">
                            <span class="item-title">{pl.title}</span>
                            <span class="item-sub">Saved Infrastructure</span>
                        </div>
                    </button>
                {/each}
            {/if}

            {#if videoResults.length > 0}
                <div class="section-label mt-4">Videos</div>
                {#each videoResults as res, i}
                    {@const index = i + commandResults.length + filteredPlaylists.length}
                    <button
                        role="option"
                        aria-selected={selectedIndex === index}
                        class="result-item"
                        class:active={selectedIndex === index}
                        onclick={() => executeSelected(index)}
                        onmouseenter={() => handleMouseMove(index)}
                    >
                        <div class="icon-box vid-icon">
                            <TerminalIcon size="18" />
                        </div>
                        <div class="item-meta">
                            <span class="item-title">{res.video.title}</span>
                            <span class="item-sub">Node: {res.playlist.title}</span>
                        </div>
                    </button>
                {/each}
            {/if}

            {#if totalItems === 0}
                <div class="empty-results" in:fade>
                    <TerminalIcon size="48" color="var(--text-muted)" />
                    <p>No results found for "<span class="highlight">{query}</span>"</p>
                </div>
            {/if}
        </div>
        <div class="palette-footer">
            <div class="kb-hints">
                <span><kbd>↑↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Select</span>
                <span><kbd>ESC</kbd> Close</span>
            </div>
            <div class="branding">SOTA COMMANDS</div>
        </div>
    </div>
  </div>
{/if}

<style>
    .palette-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 5000;
        display: flex;
        justify-content: center;
        padding-top: 10vh;
        backdrop-filter: blur(12px);
    }

    .palette-container {
        width: 700px;
        max-width: 95vw;
        max-height: 600px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.1), var(--shadow-2xl);
        border-radius: var(--radius-2xl);
    }

    .search-box {
        padding: 1.25rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-bottom: 1px solid var(--border);
        background: rgba(255,255,255,0.02);
    }

    .search-icon-wrapper {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--hover);
        border-radius: var(--radius-lg);
    }

    .search-box input {
        background: transparent;
        border: none;
        color: var(--text);
        font-size: 1.25rem;
        flex-grow: 1;
        outline: none;
        font-weight: 600;
        font-family: inherit;
    }

    .k-hint {
        padding: 4px 8px;
        background: var(--hover);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        font-size: 0.7rem;
        font-weight: 800;
        color: var(--text-muted);
    }

    .results-list {
        padding: 0.75rem;
        overflow-y: auto;
        flex-grow: 1;
        scrollbar-width: thin;
        scrollbar-color: var(--border) transparent;
    }

    .section-label {
        padding: 0.75rem 1rem 0.5rem;
        font-size: 0.65rem;
        font-weight: 900;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.2em;
    }

    .result-item {
        width: 100%;
        border: none;
        background: transparent;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: left;
        color: var(--text);
        position: relative;
    }

    .result-item.active {
        background: var(--hover);
        box-shadow: inset 0 0 0 1px var(--border);
    }

    .icon-box {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--hover);
        border-radius: var(--radius-lg);
        color: var(--text-muted);
        transition: all 0.2s;
    }

    .active .icon-box {
        background: var(--primary);
        color: white;
        box-shadow: var(--shadow-sm);
    }

    .pl-icon { color: #60a5fa; }
    .vid-icon { color: #f472b6; }

    .item-meta {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0;
    }

    .item-title {
        font-weight: 700;
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item-sub {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-weight: 500;
    }

    .enter-hint {
        font-size: 0.65rem;
        font-weight: 800;
        padding: 4px 8px;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        color: var(--text-muted);
    }

    .empty-results {
        padding: 4rem 2rem;
        text-align: center;
        color: var(--text-muted);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .empty-results p { font-weight: 600; font-size: 1.1rem; }
    .highlight { color: var(--primary); }

    .palette-footer {
        padding: 0.85rem 1.5rem;
        background: rgba(255,255,255,0.02);
        border-top: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .kb-hints { display: flex; gap: 1.5rem; }
    .kb-hints span { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; }

    kbd {
        background: var(--hover);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.65rem;
    }

    .branding {
        font-size: 0.65rem;
        font-weight: 900;
        letter-spacing: 0.2em;
        color: var(--primary);
        opacity: 0.8;
    }

    .mt-4 { margin-top: 1rem; }
</style>
