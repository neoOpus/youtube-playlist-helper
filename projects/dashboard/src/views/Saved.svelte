<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import PlaylistsFilters from "../components/PlaylistsFilters.svelte";
  import PlaylistPreview from "../components/PlaylistPreview.svelte";
  import PlaylistCardSkeleton from "../components/PlaylistCardSkeleton.svelte";
  import EmptyState from "../components/EmptyState.svelte";
  import { SearchIcon, PlaylistPlayIcon, DeleteIcon, SuperButton, Breadcrumbs, InfoIcon } from "@yph/ui-kit";
  import { router } from "../stores/router";

  let playlists = $state<Playlist[]>([]);
  let filteredPlaylists = $state<Playlist[]>([]);
  let selectedFolder = $state("all");
  let selectedIds = $state(new Set<string>());
  let loading = $state(true);

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
    try {
        const data = await storageService.getPlaylists();
        if (data && data.length > 0) {
            playlists = data;
        }
    } finally {
        setTimeout(() => loading = false, 800); // Visual breathing room for skeleton
    }
  });

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

<main in:fade class="view-container">
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
          <button
            class="folder-item luminous-hover"
            class:active={selectedFolder === 'all'}
            onclick={() => selectedFolder = 'all'}
          >
              <PlaylistPlayIcon size="16" />
              <span>All Infrastructure</span>
              <span class="count">{playlists.length}</span>
          </button>

          {#each virtualFolders as folder (folder.title)}
              <button
                class="folder-item luminous-hover"
                class:active={selectedFolder === folder.title}
                onclick={() => selectedFolder = folder.title}
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

          <div class="results-grid mt-8">
              {#if loading}
                  {#each Array(4) as _}
                      <PlaylistCardSkeleton />
                  {/each}
              {:else if displayedPlaylists.length > 0}
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
                  <div class="full-width" in:fade>
                      <EmptyState
                        title="Intelligence Grid Offline"
                        message="No curated nodes found in this sector. Start a new intake to populate your infrastructure."
                        actionLabel="Begin New Intake"
                        actionClick={() => router.push('/new')}
                      />
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
  .view-header { margin-bottom: var(--space-8); padding-bottom: var(--space-6); border-bottom: 1px solid var(--border); }
  .header-content { display: flex; flex-direction: column; gap: var(--space-4); }

  .view-layout {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    gap: var(--space-12);
    align-items: start;
  }

  .folders-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    position: sticky;
    top: var(--space-12);
  }

  .section-label {
    font-size: 0.65rem;
    font-weight: 900;
    color: var(--text-muted);
    letter-spacing: 0.15em;
    padding-left: var(--space-4);
    margin-bottom: var(--space-4);
    text-transform: uppercase;
    opacity: 0.6;
  }

  .folder-item {
    border: none;
    background: transparent;
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    gap: var(--space-4);
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.3s var(--easing-standard);
    text-align: left;
    font-weight: 700;
  }

  .folder-item:hover { background: var(--hover); color: var(--text); transform: translateX(6px); }
  .folder-item.active { background: var(--hover); color: var(--primary); box-shadow: inset 4px 0 0 var(--primary); font-weight: 800; }
  .folder-item span { flex-grow: 1; }

  .count {
    font-size: 0.65rem;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    opacity: 0.5;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-8);
  }

  .full-width { grid-column: 1 / -1; }
  .mt-8 { margin-top: var(--space-8); }

  .selection-bar {
    position: fixed;
    bottom: var(--space-12);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: var(--space-5) var(--space-12);
    display: flex;
    align-items: center;
    gap: var(--space-12);
    border-radius: var(--radius-xl);
  }

  .selection-info { display: flex; align-items: center; gap: var(--space-4); }
  .selection-actions { display: flex; align-items: center; gap: var(--space-4); }

  @media (max-width: 1200px) {
    .view-layout { grid-template-columns: 200px 1fr; gap: var(--space-8); }
  }

  @media (max-width: 900px) {
    .view-layout { grid-template-columns: 1fr; }
    .folders-sidebar { display: none; }
    .view-container { padding: var(--space-4); }
  }
</style>
