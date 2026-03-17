<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { storageService, aiService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { viewMode } from "../stores/view-mode";
  import PlaylistsFilters from "../components/PlaylistsFilters.svelte";
  import PlaylistPreview from "../components/PlaylistPreview.svelte";
  import { InfoIcon, SearchIcon, PlaylistPlayIcon, SaveIcon } from "@yph/ui-kit";

  let playlists: Playlist[] = [];
  let filteredPlaylists: Playlist[] = [];
  let virtualFolders: { title: string, count: number, type: 'tag' | 'rating' }[] = [];
  let selectedFolder = "all";

  onMount(async () => {
    playlists = await storageService.getPlaylists();
    generateVirtualFolders();
  });

  function generateVirtualFolders() {
      const tagMap = new Map<string, number>();
      const ratings = { high: 0 };

      playlists.forEach(pl => {
          (pl.loadedVideos || []).forEach(v => {
              (v.aiTags || []).forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1));
              if (v.rating && v.rating >= 4) ratings.high++;
          });
      });

      virtualFolders = [
          { title: "Favorites (4+ ★)", count: ratings.high, type: 'rating' },
          ...Array.from(tagMap.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([tag, count]) => ({ title: `#${tag}`, count, type: 'tag' as const }))
      ];
  }

  $: displayedPlaylists = selectedFolder === "all"
      ? filteredPlaylists
      : filteredPlaylists.filter(pl => {
          if (selectedFolder.startsWith("#")) {
              const tag = selectedFolder.slice(1);
              return (pl.loadedVideos || []).some(v => (v.aiTags || []).includes(tag));
          }
          if (selectedFolder === "Favorites (4+ ★)") {
              return (pl.loadedVideos || []).some(v => v.rating && v.rating >= 4);
          }
          return true;
      });

  function handleDeleted(e: any) {
      const pl = (e as CustomEvent<Playlist>).detail;
      playlists = playlists.filter(p => p.id !== pl.id);
  }
</script>

<main in:fade>
  <div class="saved-header">
      <div class="header-left">
          <h1>Saved Collection</h1>
          <p class="muted">Access your curated YouTube infrastructure.</p>
      </div>
  </div>

  <div class="saved-layout">
      <aside class="folders-sidebar">
          <p class="section-label">VIRTUAL FOLDERS</p>
          <button class="folder-item" class:active={selectedFolder === 'all'} on:click={() => selectedFolder = 'all'}>
              <PlaylistPlayIcon size="16" />
              <span>All Playlists</span>
              <span class="count">{playlists.length}</span>
          </button>

          {#each virtualFolders as folder}
              <button
                class="folder-item"
                class:active={selectedFolder === folder.title}
                on:click={() => selectedFolder = folder.title}
                in:fly={{ x: -10, delay: 100 }}
              >
                  <SearchIcon size="16" color="var(--primary)" />
                  <span>{folder.title}</span>
                  <span class="count">{folder.count}</span>
              </button>
          {/each}
      </aside>

      <section class="content-area">
          <PlaylistsFilters {playlists} bind:filteredPlaylists />

          <div class="results-grid mt-6">
              {#if displayedPlaylists.length > 0}
                  {#each displayedPlaylists as pl (pl.id)}
                      <div animate:flip={{ duration: 400 }} in:scale={{ start: 0.9, duration: 300 }}>
                          <PlaylistPreview playlist={pl} on:deleted={handleDeleted} />
                      </div>
                  {/each}
              {:else}
                  <div class="empty-state pro-glass" in:fade>
                      <InfoIcon size="48" color="var(--text-muted)" />
                      <h3>No Matches Found</h3>
                      <p>Adjust your filters or select a different folder.</p>
                  </div>
              {/if}
          </div>
      </section>
  </div>
</main>

<style>
  main { padding: 2rem; max-width: 1400px; margin: 0 auto; color: var(--text); }
  .saved-header { margin-bottom: 2.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
  h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1.5px; }

  .saved-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2.5rem; align-items: start; }

  .folders-sidebar { display: flex; flex-direction: column; gap: 6px; }
  .section-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1.5px; padding-left: 12px; margin-bottom: 10px; }

  .folder-item { border: none; background: transparent; padding: 12px 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; color: var(--text); transition: all 0.2s; text-align: left; }
  .folder-item:hover { background: var(--hover); transform: translateX(4px); }
  .folder-item.active { background: var(--hover); color: var(--primary); font-weight: 800; box-shadow: inset 4px 0 0 var(--primary); }

  .folder-item span { flex-grow: 1; }
  .count { font-size: 0.7rem; font-weight: 900; font-family: 'JetBrains Mono'; opacity: 0.5; }

  .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

  .empty-state { grid-column: 1 / -1; padding: 5rem; text-align: center; border: 1px dashed var(--border); border-radius: 24px; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .empty-state h3 { margin: 0; font-weight: 900; }

  .mt-6 { margin-top: 1.5rem; }

  @media (max-width: 900px) { .saved-layout { grid-template-columns: 1fr; } .folders-sidebar { display: none; } }
</style>
