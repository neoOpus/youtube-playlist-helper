<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { InfoIcon, TerminalIcon } from "@yph/ui-kit";
  import type { Playlist, Video } from "@yph/core";
  import { onMount } from "svelte";

  interface Props {
      playlist?: Playlist;
      playlists?: Playlist[];
  }

  let { playlist, playlists = [] }: Props = $props();
  let container: SVGSVGElement;

  const dna = $derived.by(() => {
    const targetPlaylists = playlist ? [playlist] : playlists;
    const stats = {
      vibe: { 'Chill': 0, 'Productive': 0, 'Intense': 0, 'Educational': 0 } as Record<string, number>,
      tags: {} as Record<string, number>,
      totalNodes: 0
    };

    targetPlaylists.forEach(pl => {
      (pl.loadedVideos || []).forEach(v => {
        stats.totalNodes++;
        if (v.energyVibe && stats.vibe[v.energyVibe] !== undefined) stats.vibe[v.energyVibe]++;
        (v.aiTags || []).forEach(t => stats.tags[t] = (stats.tags[t] || 0) + 1);
      });
    });

    return stats;
  });

  const topTags = $derived(
    Object.entries(dna.tags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
  );

  const vibeLabels = ['Chill', 'Productive', 'Intense', 'Educational'];

  // SOTA: D3-style Radar Chart Logic (simplified for SVG reactivity)
  const radarPoints = $derived.by(() => {
      const center = 100;
      const radius = 70;
      return vibeLabels.map((vibe, i) => {
          const angle = (i / vibeLabels.length) * Math.PI * 2 - Math.PI / 2;
          const value = dna.totalNodes > 0 ? dna.vibe[vibe] / dna.totalNodes : 0;
          const r = 10 + radius * value;
          return {
              x: center + r * Math.cos(angle),
              y: center + r * Math.sin(angle),
              labelX: center + (radius + 20) * Math.cos(angle),
              labelY: center + (radius + 20) * Math.sin(angle)
          };
      });
  });

  const radarPath = $derived(`M ${radarPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`);
</script>

<div class="sector-dna pro-glass" in:fade>
    <div class="dna-header">
        <div class="icon-pulse">
            <TerminalIcon size="16" color="var(--primary)" />
        </div>
        <div class="title-row">
            <h4>Neural DNA Architecture</h4>
            <span class="badge">{dna.totalNodes} Nodes Analyzed</span>
        </div>
    </div>

    <div class="dna-visual mt-8">
        <svg viewBox="0 0 200 200" class="radar-chart">
            <!-- Grid Lines -->
            {#each [0.25, 0.5, 0.75, 1] as level}
                <circle cx="100" cy="100" r={70 * level} class="grid-line" />
            {/each}

            <!-- Axes -->
            {#each radarPoints as p, i}
                <line x1="100" y1="100" x2={p.labelX} y2={p.labelY} class="axis-line" />
                <text x={p.labelX} y={p.labelY} class="radar-label" text-anchor="middle" dy="4">
                    {vibeLabels[i].toUpperCase()}
                </text>
            {/each}

            <!-- Data Path -->
            {#if dna.totalNodes > 0}
                <path d={radarPath} class="radar-path" />
                {#each radarPoints as p}
                    <circle cx={p.x} cy={p.y} r="3" class="data-dot" />
                {/each}
            {/if}
        </svg>
    </div>

    <div class="dna-body mt-8">
        <div class="dna-section">
            <div class="section-header">
                <span class="section-label">Top Conceptual Tags</span>
                <div class="header-line"></div>
            </div>
            <div class="tag-cloud mt-4">
                {#each topTags as [tag, count]}
                    <div class="dna-tag luminous-hover" in:fly={{ x: -10 }}>
                        <span class="t-name">#{tag}</span>
                        <div class="t-divider"></div>
                        <span class="t-count">{count}</span>
                    </div>
                {:else}
                    <p class="muted small text-center p-4">No significant metadata resonance found.</p>
                {/each}
            </div>
        </div>
    </div>

    <div class="dna-footer mt-8">
        <div class="status-indicator">
            <div class="dot pulse"></div>
            <span>MULTIDIMENSIONAL_VIBE_ANALYSIS_ACTIVE</span>
        </div>
    </div>
</div>

<style>
    .sector-dna { padding: var(--space-8); border: 1px solid var(--border-strong); position: relative; overflow: hidden; background: rgba(0,0,0,0.2); }
    .dna-header { display: flex; align-items: center; gap: 14px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
    .icon-pulse { width: 32px; height: 32px; border-radius: 8px; background: rgba(var(--primary-rgb), 0.1); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.2); }
    h4 { margin: 0; font-size: 0.95rem; font-weight: 900; letter-spacing: -0.01em; color: var(--text); }
    .badge { font-size: 0.6rem; color: var(--primary); font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8; }

    .dna-visual { display: flex; justify-content: center; align-items: center; }
    .radar-chart { width: 220px; height: 220px; overflow: visible; }
    .grid-line { fill: none; stroke: var(--border); stroke-width: 1; stroke-dasharray: 2, 2; }
    .axis-line { stroke: var(--border); stroke-width: 1; opacity: 0.3; }
    .radar-label { font-size: 7px; font-weight: 900; fill: var(--text-dim); font-family: 'JetBrains Mono', monospace; }
    .radar-path { fill: rgba(var(--primary-rgb), 0.15); stroke: var(--primary); stroke-width: 2; transition: all 1s var(--easing-standard); }
    .data-dot { fill: var(--primary); stroke: white; stroke-width: 1; box-shadow: 0 0 8px var(--primary); }

    .dna-section { display: flex; flex-direction: column; }
    .section-header { display: flex; align-items: center; gap: 12px; }
    .section-label { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: var(--text-dim); letter-spacing: 1px; flex-shrink: 0; }
    .header-line { height: 1px; background: var(--border); flex-grow: 1; opacity: 0.5; }

    .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
    .dna-tag { background: var(--bg-secondary); border: 1px solid var(--border); padding: 5px 12px; border-radius: 10px; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
    .dna-tag:hover { border-color: var(--primary); transform: scale(1.05); }
    .t-name { font-size: 0.7rem; font-weight: 800; color: var(--text); }
    .t-count { font-size: 0.65rem; font-weight: 900; color: var(--primary); font-family: 'JetBrains Mono', monospace; }

    .dna-footer { border-top: 1px solid var(--border); padding-top: 16px; display: flex; justify-content: center; }
    .status-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.55rem; color: var(--text-dim); font-weight: 900; letter-spacing: 1px; }
    .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 5px var(--primary); }
    .dot.pulse { animation: dotPulse 2s infinite; }
    @keyframes dotPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .mt-4 { margin-top: 1rem; }
    .mt-8 { margin-top: 2rem; }
</style>
