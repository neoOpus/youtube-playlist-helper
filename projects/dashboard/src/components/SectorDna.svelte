<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { InfoIcon, TerminalIcon } from "@yph/ui-kit";
  import type { Playlist, Video } from "@yph/core";

  interface Props {
      playlist?: Playlist;
      playlists?: Playlist[];
  }

  let { playlist, playlists = [] }: Props = $props();

  const dna = $derived.by(() => {
    const targetPlaylists = playlist ? [playlist] : playlists;
    const stats = {
      vibe: {} as Record<string, number>,
      tags: {} as Record<string, number>,
      ratings: [0, 0, 0, 0, 0, 0], // 0-5
      totalNodes: 0
    };

    targetPlaylists.forEach(pl => {
      (pl.loadedVideos || []).forEach(v => {
        stats.totalNodes++;
        if (v.energyVibe) stats.vibe[v.energyVibe] = (stats.vibe[v.energyVibe] || 0) + 1;
        if (v.rating) stats.ratings[Math.round(v.rating)]++;
        (v.aiTags || []).forEach(t => stats.tags[t] = (stats.tags[t] || 0) + 1);
      });
    });

    return stats;
  });

  const topTags = $derived(
    Object.entries(dna.tags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
  );

  const vibeColors: Record<string, string> = {
      'Chill': '#10b981',
      'Productive': '#3b82f6',
      'Intense': '#ef4444',
      'Educational': '#8b5cf6'
  };
</script>

<div class="sector-dna pro-glass" in:fade>
    <div class="dna-header">
        <div class="icon-pulse">
            <TerminalIcon size="16" color="var(--primary)" />
        </div>
        <div class="title-row">
            <h4>Sector DNA Analysis</h4>
            <span class="badge">{dna.totalNodes} Nodes Analyzed</span>
        </div>
    </div>

    <div class="dna-body mt-6">
        <div class="dna-section">
            <div class="section-header">
                <span class="section-label">Energy Resonance</span>
                <div class="header-line"></div>
            </div>
            <div class="vibe-grid mt-4">
                {#each Object.entries(dna.vibe) as [vibe, count]}
                    <div class="vibe-item" in:fly={{ y: 10 }}>
                        <div class="vibe-meta">
                            <span class="v-label" style="color: {vibeColors[vibe] || 'var(--text)'}">{vibe}</span>
                            <span class="v-count">{count}</span>
                        </div>
                        <div class="vibe-bar">
                            <div class="fill" style="width: {(count / dna.totalNodes) * 100}%; background: {vibeColors[vibe] || 'var(--primary)'}"></div>
                        </div>
                    </div>
                {:else}
                    <p class="muted small text-center p-4">No energy signals detected in this sector.</p>
                {/each}
            </div>
        </div>

        <div class="dna-section mt-8">
            <div class="section-header">
                <span class="section-label">Metadata Density (Tags)</span>
                <div class="header-line"></div>
            </div>
            <div class="tag-cloud mt-4">
                {#each topTags as [tag, count]}
                    <div class="dna-tag luminous-hover">
                        <span class="t-name">#{tag}</span>
                        <div class="t-divider"></div>
                        <span class="t-count">{count}</span>
                    </div>
                {:else}
                    <p class="muted small text-center p-4">No metadata tags found in this node.</p>
                {/each}
            </div>
        </div>
    </div>

    <div class="dna-footer mt-8">
        <div class="status-indicator">
            <div class="dot pulse"></div>
            <span>LOCAL HEURISTICS ACTIVE</span>
        </div>
    </div>
</div>

<style>
    .sector-dna { padding: var(--space-8); border: 1px solid var(--border); border-radius: 20px; position: relative; overflow: hidden; }
    .dna-header { display: flex; align-items: center; gap: 14px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }

    .icon-pulse {
        width: 32px; height: 32px; border-radius: 8px; background: rgba(var(--primary-rgb), 0.1);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.2);
    }

    .title-row { display: flex; flex-direction: column; }
    h4 { margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .badge { font-size: 0.6rem; color: var(--primary); font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8; }

    .dna-section { display: flex; flex-direction: column; }
    .section-header { display: flex; align-items: center; gap: 12px; }
    .section-label { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: var(--text-dim); letter-spacing: 1px; flex-shrink: 0; }
    .header-line { height: 1px; background: var(--border); flex-grow: 1; opacity: 0.5; }

    .vibe-grid { display: flex; flex-direction: column; gap: 14px; }
    .vibe-item { display: flex; flex-direction: column; gap: 6px; }
    .vibe-meta { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; }
    .v-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .v-count { color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; }
    .vibe-bar { height: 6px; background: var(--hover); border-radius: 3px; overflow: hidden; }
    .fill { height: 100%; transition: width 1.5s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: 0 0 8px currentColor; }

    .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .dna-tag {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        padding: 5px 12px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
    }
    .dna-tag:hover { border-color: var(--primary); transform: translateY(-2px); }
    .t-name { font-size: 0.75rem; font-weight: 800; color: var(--text); }
    .t-divider { width: 1px; height: 10px; background: var(--border); }
    .t-count { font-size: 0.65rem; font-weight: 900; color: var(--primary); font-family: 'JetBrains Mono', monospace; }

    .dna-footer { border-top: 1px solid var(--border); padding-top: 16px; display: flex; justify-content: center; }
    .status-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.6rem; color: var(--text-dim); font-weight: 800; letter-spacing: 1px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); }
    .dot.pulse { animation: dotPulse 2s infinite; }
    @keyframes dotPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .text-center { text-align: center; }
    .p-4 { padding: 1rem; }
</style>
