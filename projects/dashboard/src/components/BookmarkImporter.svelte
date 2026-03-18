<script lang="ts">
  import { onMount } from 'svelte';
  import { bookmarkService, videoService, storageService, notificationService } from '@yph/core';
  import PlaylistPlusIcon from '@yph/ui-kit/components/icons/PlaylistPlusIcon.svelte';
  import SearchIcon from '@yph/ui-kit/components/icons/SearchIcon.svelte';

  let folders: any[] = [];
  let loading = true;
  let searchTerm = "";

  onMount(async () => {
    try {
      folders = await bookmarkService.getYoutubeFolderBookmarks();
    } catch (e) {
      console.error("Failed to load bookmarks", e);
    } finally {
      loading = false;
    }
  });

  async function importFolder(folder: any) {
    try {
      const playlist = await videoService.generatePlaylist(folder.videoIds, folder.folderName.replace(/\/$/, ""));
      await storageService.savePlaylist(playlist);
      notificationService.success(`Imported ${folder.videoIds.length} videos from bookmarks.`);
    } catch (e: any) {
      notificationService.error("Import failed: " + e.message);
    }
  }

  $: filteredFolders = folders.filter(f =>
    f.folderName.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<div class="bookmark-importer">
    <div class="search-bar mb-4">
        <SearchIcon size="16" />
        <input type="text" placeholder="Filter bookmark folders..." bind:value={searchTerm} />
    </div>

    {#if loading}
        <div class="p-4 text-center">Scanning browser bookmarks...</div>
    {:else if filteredFolders.length === 0}
        <div class="p-4 text-center muted">No YouTube bookmark folders found.</div>
    {:else}
        <div class="folders-list">
            {#each filteredFolders as folder}
                <div class="folder-row sota-glass p-3 mb-2">
                    <div class="info">
                        <span class="name">{folder.folderName}</span>
                        <span class="count">{folder.videoIds.length} videos</span>
                    </div>
                    <button class="btn-import" onclick={() => importFolder(folder)}>
                        <PlaylistPlusIcon size="18" /> Import
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .bookmark-importer { max-height: 400px; overflow-y: auto; padding-right: 8px; }

    .search-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: 1px solid var(--border);
    }

    input {
        background: transparent;
        border: none;
        color: white;
        width: 100%;
        outline: none;
        font-size: 0.85rem;
    }

    .folder-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .info { display: flex; flex-direction: column; gap: 2px; }
    .name { font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
    .count { font-size: 0.7rem; color: var(--text-secondary); opacity: 0.7; }

    .btn-import {
        background: rgba(255, 82, 82, 0.1);
        color: var(--primary);
        border: 1px solid rgba(255, 82, 82, 0.2);
        padding: 6px 12px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }

    .btn-import:hover {
        background: var(--primary);
        color: white;
        transform: scale(1.05);
    }
</style>
