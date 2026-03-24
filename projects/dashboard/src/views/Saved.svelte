<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { storageService, actionLogger } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import PlaylistsFilters from "../components/PlaylistsFilters.svelte";
  import PlaylistPreview from "../components/PlaylistPreview.svelte";
  import { InfoIcon, SearchIcon, PlaylistPlayIcon, DeleteIcon, MergeIcon, SuperButton, Breadcrumbs } from "@yph/ui-kit";

  let playlists = $state<Playlist[]>([]);
  let filteredPlaylists = $state<Playlist[]>([]);
  let selectedFolder = $state("all");
  let selectedIds = $state(new Set<string>());

  let virtualFolders = $derived.by(() => {
      const tagMap = new Map<string, number>();
      const ratings = { high: 0 };
      playlists.forEach(pl => {
          (pl.loadedVideos || []).forEach(v => {
              (v.aiTags || []).forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1));
              if (v.rating && v.rating >= 4) ratings.high++;
          });
      });
      return [
          { title: "Favorites (4+ ★)", count: ratings.high, type: 'rating' },
          ...Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tag, count]) => ({ title: `#${tag}`, count, type: 'tag' as const }))
      ];
  });

  let displayedPlaylists = $derived(
      selectedFolder === "all"
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
        })
  );

  onMount(async () => {
    const data = await storageService.getPlaylists();
    if (data && data.length > 0) {
        playlists = data;
    } else {
        await seedData();
    }
  });

  async function seedData() {
      const mock = [
        { id: "1", title: "Pro Computing for Beginners", loadedVideos: [{ id: "v1", title: "Introduction", aiTags: ["Pro", "Science"], rating: 5 }], groups: ["Tech"], videos: ["v1"], timestamp: Date.now() },
        { id: "2", title: "Pro Frontend Architecture", loadedVideos: [{ id: "v2", title: "Design Systems", aiTags: ["UI", "UX"], rating: 4 }], groups: ["Design"], videos: ["v2"], timestamp: Date.now() }
      ];
      playlists = mock;
      for (const p of mock) await storageService.savePlaylist(p as any);
  }

  function handleDeleted(pl: Playlist) {
      playlists = playlists.filter(p => p.id !== pl.id);
      selectedIds.delete(pl.id);
      selectedIds = new Set(selectedIds);
  }

  function handleSelection(id: string, isSelected: boolean) {
      if (isSelected) selectedIds.add(id); else selectedIds.delete(id);
      selectedIds = new Set(selectedIds);
  }

  function clearSelection() {
      selectedIds = new Set();
  }

  async function deleteSelected() {
      if (confirm(`Decommission ${selectedIds.size} nodes?`)) {
          for (const id of selectedIds) {
              const pl = playlists.find(p => p.id === id);
              if (pl) await storageService.removePlaylist(pl);
          }
          playlists = playlists.filter(p => !selectedIds.has(p.id));
          clearSelection();
      }
  }
</script>

<main class="view-container">
  <header class="view-header">
      <div class="header-content aura-glow">
          <Breadcrumbs items={[{label: 'INFRASTRUCTURE'}, {label: 'SAVED NODES', active: true}]} />
          <h1>Saved Infrastructure</h1>
          <p class="muted">Access your curated YouTube nodes and collections.</p>
      </div>
  </header>

  <div class="view-layout">
      <aside class="folders-sidebar">
          <p class="section-label">VIRTUAL NODES</p>
          <button class="folder-item" class:active={selectedFolder === 'all'} onclick={() => selectedFolder = 'all'}>
              <PlaylistPlayIcon size="16" />
              <span>All Infrastructure</span>
              <span class="count">{playlists.length}</span>
          </button>
          {#each virtualFolders as folder (folder.title)}
              <button class="folder-item" class:active={selectedFolder === folder.title} onclick={() => selectedFolder = folder.title}>
                  <SearchIcon size="16" color="var(--primary)" />
                  <span>{folder.title}</span>
                  <span class="count">{folder.count}</span>
              </button>
          {/each}
      </aside>

      <section class="content-area">
          <PlaylistsFilters {playlists} bind:filteredPlaylists />
          <div class="results-grid mt-8">
              {#if displayedPlaylists.length > 0}
                  {#each displayedPlaylists as pl (pl.id)}
                      <div animate:flip={{ duration: 500 }} in:scale={{ start: 0.98, duration: 400 }}>
                          <PlaylistPreview
                            playlist={pl}
                            selected={selectedIds.has(pl.id)}
                            ondeleted={handleDeleted}
                            onselect={(val) => handleSelection(pl.id, val)}
                          />
                      </div>
                  {/each}
              {:else}
                  <div class="empty-state pro-glass" in:fade>
                      <InfoIcon size="48" color="var(--text-muted)" />
                      <h3>No Matching Nodes</h3>
                      <p>Adjust your search filters or select a different folder.</p>
                  </div>
              {/if}
          </div>
      </section>
  </div>

  {#if selectedIds.size > 0}
    <div class="selection-bar pro-glass-high visible" transition:fly={{ y: 100, duration: 600 }}>
        <div class="selection-info">
            <span class="badge primary">{selectedIds.size}</span>
            <span class="bold ml-2">Nodes Selected</span>
        </div>
        <div class="selection-actions">
            <SuperButton outline onclick={clearSelection}>Cancel</SuperButton>
            <SuperButton danger onclick={deleteSelected} title="Decommission All">
                <DeleteIcon size="18" />
            </SuperButton>
        </div>
    </div>
  {/if}
</main>

<style>
  .view-header { margin-bottom: var(--space-8); padding-bottom: var(--space-6); }
  .header-content { display: flex; flex-direction: column; gap: var(--space-4); }
  .view-layout { display: grid; grid-template-columns: 260px 1fr; gap: var(--space-12); align-items: start; }
  .folders-sidebar { display: flex; flex-direction: column; gap: var(--space-2); position: sticky; top: var(--space-12); }
  .section-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); letter-spacing: 0.15em; padding-left: var(--space-4); margin-bottom: var(--space-4); text-transform: uppercase; opacity: 0.6; }
  .folder-item { border: none; background: transparent; padding: var(--space-4) var(--space-5); border-radius: var(--radius-lg); display: flex; align-items: center; gap: var(--space-4); cursor: pointer; color: var(--text-muted); transition: all 0.3s var(--easing-standard); text-align: left; font-weight: 700; }
  .folder-item:hover { background: var(--hover); color: var(--text); transform: translateX(6px); }
  .folder-item.active { background: var(--hover); color: var(--primary); box-shadow: inset 4px 0 0 var(--primary); }
  .folder-item span { flex-grow: 1; }
  .count { font-size: 0.65rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; opacity: 0.5; }
  .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: var(--space-8); }
  .empty-state { grid-column: 1 / -1; padding: var(--space-16); text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-6); border: 1px dashed var(--border-strong); }
  .empty-state h3 { font-size: var(--font-xl); font-weight: 800; }
  .mt-8 { margin-top: var(--space-8); }
  .selection-bar { position: fixed; bottom: var(--space-12); left: 50%; transform: translateX(-50%); z-index: 1000; padding: var(--space-5) var(--space-12); display: flex; align-items: center; gap: var(--space-12); }
  .selection-info { display: flex; align-items: center; gap: var(--space-4); }
  .selection-actions { display: flex; align-items: center; gap: var(--space-4); }
  @media (max-width: 1200px) { .view-layout { grid-template-columns: 200px 1fr; gap: var(--space-8); } }
  @media (max-width: 900px) { .view-layout { grid-template-columns: 1fr; } .folders-sidebar { display: none; } }
</style>
