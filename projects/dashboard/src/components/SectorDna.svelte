<svelte:options runes={true} />
<script lang="ts">
  import type { Playlist, Video } from "@yph/core";
  import { Activity } from "lucide-svelte";

  let { playlist }: { playlist: Playlist } = $props();

  let tagStats = $derived.by(() => {
    const videos = playlist.loadedVideos || [];
    const counts = new Map<string, number>();
    videos.forEach(v => (v.aiTags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  });

  let vibeStats = $derived.by(() => {
    const videos = playlist.loadedVideos || [];
    const counts = new Map<string, number>();
    videos.forEach(v => { if (v.energyVibe) counts.set(v.energyVibe, (counts.get(v.energyVibe) || 0) + 1); });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  });
</script>

<div class="dna-container">
    {#if (playlist.loadedVideos?.length || 0) > 0}
        <div class="dna-section">
            <span class="label">Top Signals</span>
            <div class="bar-stack">
                {#each tagStats as [tag, count]}
                    <div class="bar-row">
                        <span class="tag-name">#{tag}</span>
                        <div class="bar-bg"><div class="bar-fill" style="width: {(count / (playlist.loadedVideos?.length || 1) * 100)}%"></div></div>
                        <span class="count">{count}</span>
                    </div>
                {/each}
            </div>
        </div>

        <div class="dna-section mt-6">
            <span class="label">Energy Vibe Distribution</span>
            <div class="vibe-grid">
                {#each vibeStats as [vibe, count]}
                    <div class="vibe-chip surface-2">
                        <span class="vibe-name">{vibe}</span>
                        <span class="vibe-val">{count}</span>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="dna-empty">
            <Activity size="20" />
            <span>Awaiting telemetry data...</span>
        </div>
    {/if}
</div>

<style>
    .dna-container { display: flex; flex-direction: column; gap: 20px; }
    .dna-section { display: flex; flex-direction: column; gap: 12px; }
    .label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }

    .bar-stack { display: flex; flex-direction: column; gap: 8px; }
    .bar-row { display: flex; align-items: center; gap: 12px; }
    .tag-name { font-size: 0.75rem; font-weight: 700; width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-secondary); }
    .bar-bg { flex: 1; height: 6px; background: var(--bg-surface-2); border-radius: 3px; overflow: hidden; }
    .bar-fill { height: 100%; background: var(--primary); border-radius: 3px; }
    .count { font-size: 0.7rem; font-weight: 800; color: var(--primary); font-family: monospace; width: 20px; }

    .vibe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .vibe-chip { padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 6px; border: 1px solid var(--border-base); }
    .vibe-name { font-size: 0.75rem; font-weight: 700; }
    .vibe-val { font-size: 0.7rem; font-weight: 800; color: var(--secondary); font-family: monospace; }

    .dna-empty { padding: 40px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-muted); font-size: 0.8rem; font-weight: 600; }
    .mt-6 { margin-top: 1.5rem; }
</style>
