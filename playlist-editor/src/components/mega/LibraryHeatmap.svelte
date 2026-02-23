<script lang="ts">
  import { onMount } from "svelte";
  import type { Playlist, Video } from "../../types/model";
  import { storage } from "../../services/core/storage-service";
  import { alternativesService } from "../../services/mega/alternatives-service";
  import Fa from "svelte-fa";
  import { faHeartbeat, faVideoSlash, faCheckCircle, faSkull } from "@fortawesome/free-solid-svg-icons";

  let playlists: Playlist[] = [];
  let videoStatuses: { id: string, ok: boolean }[] = [];
  let loading = true;

  onMount(async () => {
    playlists = await storage.getPlaylists();
    // Sample only first 100 videos for heatmap performance
    const allIds = playlists.flatMap(p => p.videos).slice(0, 100);
    videoStatuses = await Promise.all(allIds.map(async id => {
        const res = await alternativesService.checkVideoAvailability(id);
        return { id, ok: res.available };
    }));
    loading = false;
  });

  $: stats = {
      total: videoStatuses.length,
      dead: videoStatuses.filter(v => !v.ok).length,
      alive: videoStatuses.filter(v => v.ok).length
  };
</script>

<div class="heatmap-container">
    <div class="header">
        <h3><Fa icon={faHeartbeat} /> Ecosystem Health Heatmap</h3>
        <div class="legend">
            <span class="pill alive"><Fa icon={faCheckCircle} /> Healthy</span>
            <span class="pill dead"><Fa icon={faSkull} /> Missing</span>
        </div>
    </div>

    {#if loading}
        <div class="shimmer-grid">
            {#each Array(50) as _}
                <div class="cell shimmer"></div>
            {/each}
        </div>
    {:else}
        <div class="grid">
            {#each videoStatuses as status}
                <div class="cell" class:is-dead={!status.ok} title={status.ok ? 'Healthy Node' : 'Corrupted Node (Video Deleted)'}></div>
            {/each}
        </div>
        <div class="summary">
            <p>Scanning <strong>{stats.total}</strong> ecosystem nodes... <strong>{stats.dead}</strong> nodes require manual restoration.</p>
        </div>
    {/if}
</div>

<style>
  .heatmap-container { background: white; padding: 1.5rem; border-radius: 20px; border: 1px solid #eee; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h3 { margin: 0; font-size: 1rem; color: #1e293b; display: flex; align-items: center; gap: 10px; }

  .legend { display: flex; gap: 1rem; }
  .pill { font-size: 0.7rem; font-weight: bold; padding: 2px 8px; border-radius: 20px; display: flex; align-items: center; gap: 4px; }
  .pill.alive { color: #10b981; background: #ecfdf5; }
  .pill.dead { color: #ef4444; background: #fef2f2; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(12px, 1fr)); gap: 4px; }
  .cell { height: 12px; border-radius: 2px; background: #10b981; opacity: 0.8; transition: transform 0.2s; }
  .cell:hover { transform: scale(1.5); z-index: 10; opacity: 1; }
  .cell.is-dead { background: #ef4444; }

  .shimmer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(12px, 1fr)); gap: 4px; }
  .shimmer { background: #f1f5f9; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

  .summary { margin-top: 1.5rem; font-size: 0.85rem; color: #64748b; }
</style>
