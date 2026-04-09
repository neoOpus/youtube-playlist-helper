<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import type { Playlist } from "@yph/core";
  import { storageService } from "@yph/core";
  import { fade } from "svelte/transition";
  import { MergeIcon, Breadcrumbs, SuperButton } from "@yph/ui-kit";

  let leftPlaylist = $state<Playlist | null>(null);
  let rightPlaylist = $state<Playlist | null>(null);
  let playlists = $state<Playlist[]>([]);

  onMount(async () => {
    playlists = await storageService.getPlaylists();
  });
</script>

<main class="view-container" in:fade>
    <header class="view-header">
        <div class="header-content aura-glow">
            <Breadcrumbs items={[{label: 'INFRASTRUCTURE'}, {label: 'COLLISION TOOL', active: true}]} />
            <h1>Infrastructure Collision</h1>
            <p class="muted">Analyze and resolve overlaps between separate data nodes.</p>
        </div>
    </header>

    <div class="comparison-grid">
        <div class="pl-select pro-glass">
            <h3>Left Node</h3>
            <select bind:value={leftPlaylist}>
                <option value={null}>Select Infrastructure...</option>
                {#each playlists as pl}
                    <option value={pl}>{pl.title}</option>
                {/each}
            </select>
        </div>

        <div class="center-actions">
            <div class="icon-orb"><MergeIcon size="32" /></div>
            <SuperButton primary disabled={!leftPlaylist || !rightPlaylist}>Merge Protocols</SuperButton>
        </div>

        <div class="pl-select pro-glass">
            <h3>Right Node</h3>
            <select bind:value={rightPlaylist}>
                <option value={null}>Select Infrastructure...</option>
                {#each playlists as pl}
                    <option value={pl}>{pl.title}</option>
                {/each}
            </select>
        </div>
    </div>
</main>

<style>
    .view-container { padding: var(--space-8); max-width: 1200px; margin: 0 auto; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 120px 1fr; gap: var(--space-8); align-items: center; margin-top: var(--space-12); }
    .pl-select { padding: var(--space-8); display: flex; flex-direction: column; gap: var(--space-4); }
    .center-actions { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
    .icon-orb { width: 64px; height: 64px; background: var(--bg-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2); }
    select { width: 100%; padding: var(--space-3); background: var(--bg-secondary); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius-md); font-weight: 700; }
</style>
