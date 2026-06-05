<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import PlaylistsFilters from "../components/PlaylistsFilters.svelte";
  import PlaylistPreview from "../components/PlaylistPreview.svelte";
  import PlaylistCardSkeleton from "../components/PlaylistCardSkeleton.svelte";
  import EmptyState from "../components/EmptyState.svelte";
  import { SuperButton } from "@yph/ui-kit";
  import { router } from "../stores/router";
  import { Star, Hash, Layers, ListFilter, Trash2 } from "lucide-svelte";
  import { appState } from "../stores/theme.svelte";

  let playlists = $state<Playlist[]>([]);
  let filteredPlaylists = $state<Playlist[]>([]);
  let selectedFolder = $state("all");
  let selectedIds = $state(new Set<string>());
  let loading = $state(true);

  let virtualFolders = $derived.by(() => {
      const tagMap = new Map<string, number>();
      let highCount = 0;
      playlists.forEach(pl => {
          (pl.loadedVideos || []).forEach(v => {
              (v.aiTags || []).forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1));
              if (v.rating && v.rating >= 4) highCount++;
          });
      });
      return [
          { title: "High Resonance", count: highCount, icon: Star },
          ...Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([tag, count]) => ({ title: `#${tag}`, count, icon: Hash }))
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
            if (selectedFolder === "High Resonance") {
                return (pl.loadedVideos || []).some(v => v.rating && v.rating >= 4);
            }
            return true;
        })
  );

  onMount(async () => {
    try {
        const data = await storageService.getPlaylists();
        playlists = data || [];
    } finally {
        setTimeout(() => loading = false, 500);
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

  function clearSelection() { selectedIds = new Set(); }

  async function deleteSelected() {
      if (confirm(`Purge ${selectedIds.size} nodes?`)) {
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
  <header class="page-header">
      <div class="header-info">
          <h1>Saved Collections</h1>
          <p class="text-secondary">Manage and modulate your curated YouTube intelligence nodes.</p>
      </div>
      <div class="header-actions">
          <SuperButton primary onclick={() => router.push('/new')}>New Intake</SuperButton>
      </div>
  </header>

  <div class="main-layout">
      <aside class="sidebar-nav surface-1">
          <span class="nav-label">Virtual Sectors</span>
          <button
            class="sidebar-item"
            class:active={selectedFolder === 'all'}
            onclick={() => selectedFolder = 'all'}
          >
            <Layers size="16" />
            <span>All Nodes</span>
            <span class="badge">{playlists.length}</span>
          </button>

          <div class="sidebar-divider"></div>

          {#each virtualFolders as folder}
            <button
              class="sidebar-item"
              class:active={selectedFolder === folder.title}
              onclick={() => selectedFolder = folder.title}
            >
              <folder.icon size="16" />
              <span>{folder.title}</span>
              <span class="badge">{folder.count}</span>
            </button>
          {/each}
      </aside>

      <div class="content-view">
          <PlaylistsFilters {playlists} bind:filteredPlaylists />

          <div class="grid-container mt-6">
              {#if loading}
                  {#each Array(4) as _}
                      <PlaylistCardSkeleton />
                  {/each}
              {:else if displayedPlaylists.length > 0}
                  {#each displayedPlaylists as pl (pl.id)}
                      <div animate:flip={{ duration: 300 }}>
                          <PlaylistPreview
                            playlist={pl}
                            selected={selectedIds.has(pl.id)}
                            ondeleted={handleDeleted}
                            onselect={(val) => handleSelection(pl.id, val)}
                          />
                      </div>
                  {/each}
              {:else}
                  <div class="empty-wrap">
                      <EmptyState
                        title="Empty Sector"
                        message="No curated nodes found in this coordinate."
                        actionLabel="Begin Intake"
                        actionClick={() => router.push('/new')}
                      />
                  </div>
              {/if}
          </div>
      </div>
  </div>

  {#if selectedIds.size > 0}
    <div class="selection-fab surface-2" in:fly={{ y: 20 }} out:fade>
        <span class="sel-info"><b>{selectedIds.size}</b> Nodes Selected</span>
        <div class="fab-actions">
            <button class="ghost-btn" onclick={clearSelection}>Cancel</button>
            <button class="danger-btn" onclick={deleteSelected}><Trash2 size="16" /> Purge</button>
        </div>
    </div>
  {/if}
</main>

<style>
  .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: var(--space-8);
      padding-bottom: var(--space-8);
      border-bottom: 1px solid var(--border-base);
  }

  h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }

  .main-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: var(--space-8);
      align-items: start;
  }

  .sidebar-nav {
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: 2px;
  }

  .nav-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; padding: 8px 12px; }

  .sidebar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all var(--duration-fast);
      text-align: left;
  }

  .sidebar-item:hover { background: var(--border-subtle); color: var(--text-main); }
  .sidebar-item.active { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }

  .badge { margin-left: auto; font-size: 0.7rem; opacity: 0.5; font-family: 'JetBrains Mono', monospace; }

  .sidebar-divider { height: 1px; background: var(--border-base); margin: 8px; }

  .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-6);
  }

  .empty-wrap { grid-column: 1 / -1; padding: var(--space-16); }

  .selection-fab {
      position: fixed;
      bottom: var(--space-8);
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      border: 1px solid var(--primary);
  }

  .sel-info { font-size: 0.9rem; }
  .fab-actions { display: flex; gap: 12px; }

  .ghost-btn { background: transparent; border: none; color: var(--text-secondary); font-weight: 700; cursor: pointer; }
  .danger-btn { background: var(--danger); color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }

  .mt-6 { margin-top: 1.5rem; }

  @media (max-width: 1000px) {
      .main-layout { grid-template-columns: 1fr; }
      .sidebar-nav { display: none; }
  }
</style>
