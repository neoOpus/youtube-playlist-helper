<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import {
      TerminalIcon,
      MergeIcon,
      InfoIcon,
      SuperButton
  } from "@yph/ui-kit";
  import { storageService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";

  let playlists = $state<Playlist[]>([]);
  let selectedA = $state<string>("");
  let selectedB = $state<string>("");

  onMount(async () => {
      playlists = await storageService.getPlaylists();
  });

  const comparison = $derived.by(() => {
      const plA = playlists.find(p => p.id === selectedA);
      const plB = playlists.find(p => p.id === selectedB);
      if (!plA || !plB) return null;

      const vidsA = plA.loadedVideos || [];
      const vidsB = plB.loadedVideos || [];

      const setA = new Set(vidsA.map(v => v.videoId));
      const duplicates = vidsB.filter(v => setA.has(v.videoId));

      const tagsA = new Set(vidsA.flatMap(v => v.aiTags || []));
      const tagsB = new Set(vidsB.flatMap(v => v.aiTags || []));
      const sharedTags = [...tagsA].filter(t => tagsB.has(t));

      return {
          duplicateCount: duplicates.length,
          collisionDensity: ((duplicates.length / Math.max(vidsA.length, vidsB.length, 1)) * 100).toFixed(1),
          sharedTags,
          uniqueTagsA: [...tagsA].filter(t => !tagsB.has(t)),
          uniqueTagsB: [...tagsB].filter(t => !tagsA.has(t))
      };
  });

  import { onMount } from "svelte";
</script>

<div class="sector-comparison pro-glass mt-8" in:fade>
    <div class="comp-header">
        <MergeIcon size="20" color="var(--primary)" />
        <div class="title-meta">
            <h3>Sector Collision Analysis</h3>
            <p>Identify overlap density and tag resonance between infrastructure sectors.</p>
        </div>
    </div>

    <div class="comp-selectors mt-6">
        <div class="select-block">
            <span class="label">Primary Sector</span>
            <select bind:value={selectedA} class="pro-select">
                <option value="">Select Sector A</option>
                {#each playlists as pl}
                    <option value={pl.id}>{pl.title}</option>
                {/each}
            </select>
        </div>
        <div class="collision-orb">
            <MergeIcon size="16" />
        </div>
        <div class="select-block">
            <span class="label">Comparison Target</span>
            <select bind:value={selectedB} class="pro-select">
                <option value="">Select Sector B</option>
                {#each playlists as pl}
                    <option value={pl.id}>{pl.title}</option>
                {/each}
            </select>
        </div>
    </div>

    {#if comparison}
        <div class="results mt-8" transition:fly={{ y: 20 }}>
            <div class="stats-grid">
                <div class="stat-card luminous-hover">
                    <span class="s-val">{comparison.duplicateCount}</span>
                    <span class="s-label">Duplicate Nodes</span>
                </div>
                <div class="stat-card luminous-hover">
                    <span class="s-val">{comparison.collisionDensity}%</span>
                    <span class="s-label">Collision Density</span>
                </div>
            </div>

            <div class="resonance mt-6">
                <span class="label">Tag Resonance (Shared)</span>
                <div class="tag-row mt-2">
                    {#each comparison.sharedTags as tag}
                        <span class="r-tag">#{tag}</span>
                    {:else}
                        <span class="muted small">No shared tag resonance detected.</span>
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <div class="empty-state mt-8">
            <InfoIcon size="24" />
            <p>Select two infrastructure sectors to initiate collision analysis.</p>
        </div>
    {/if}
</div>

<style>
    .sector-comparison { padding: var(--space-8); border: 1px solid var(--border); }
    .comp-header { display: flex; align-items: center; gap: 16px; }
    .title-meta h3 { margin: 0; font-size: var(--font-lg); font-weight: 800; }
    .title-meta p { margin: 0; font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; }

    .comp-selectors { display: flex; align-items: center; gap: 12px; }
    .select-block { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .label { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; color: var(--text-dim); }
    .pro-select { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; outline: none; }
    .collision-orb { width: 32px; height: 32px; background: var(--hover); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 1px solid var(--border); margin-top: 14px; }

    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .stat-card { background: var(--bg-secondary); padding: 16px; border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; }
    .s-val { font-size: 1.5rem; font-weight: 900; color: var(--primary); font-family: 'JetBrains Mono', monospace; }
    .s-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }

    .r-tag { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--border); }
    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; }

    .empty-state { padding: 2rem; text-align: center; color: var(--text-dim); display: flex; flex-direction: column; align-items: center; gap: 12px; border: 1px dashed var(--border); border-radius: 12px; }
    .empty-state p { font-size: 0.75rem; font-weight: 700; margin: 0; }

    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
</style>
