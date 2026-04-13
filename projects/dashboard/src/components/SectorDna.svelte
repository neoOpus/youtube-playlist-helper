<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { DnaIcon, InfoIcon } from "@yph/ui-kit";
  import type { Playlist, Video } from "@yph/core";

  let { playlist }: { playlist: Playlist } = $props();

  let stats = $derived.by(() => {
    const videos = playlist.loadedVideos || [];
    if (videos.length === 0) return null;

    const tagCounts: Record<string, number> = {};
    const channelCounts: Record<string, number> = {};
    let totalRating = 0;
    let ratedCount = 0;
    let watchedCount = 0;

    videos.forEach(v => {
        if (v.watched) watchedCount++;
        if (v.rating) { totalRating += v.rating; ratedCount++; }
        if (v.channel) channelCounts[v.channel] = (channelCounts[v.channel] || 0) + 1;
        (v.aiTags || []).forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
    });

    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topChannels = Object.entries(channelCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : "N/A";
    const completeness = ((watchedCount / videos.length) * 100).toFixed(0);

    return { topTags, topChannels, avgRating, completeness, total: videos.length };
  });
</script>

{#if stats}
<div class="sector-dna pro-glass mt-8" in:fade>
    <div class="dna-header">
        <div class="icon-pulse"><DnaIcon size="20" color="var(--primary)" /></div>
        <div class="title-group">
            <h3>Sector DNA Analysis</h3>
            <p class="muted">Intelligent metadata distribution for this node.</p>
        </div>
    </div>

    <div class="dna-grid mt-6">
        <div class="dna-card">
            <span class="l">Quality Frequency</span>
            <div class="v-group">
                <span class="v">{stats.avgRating}</span>
                <span class="s">/ 5.0</span>
            </div>
            <div class="mini-bar"><div class="fill" style:width="{Number(stats.avgRating) * 20}%"></div></div>
        </div>

        <div class="dna-card">
            <span class="l">Node Completeness</span>
            <div class="v-group">
                <span class="v">{stats.completeness}%</span>
                <span class="s">WATCHED</span>
            </div>
            <div class="mini-bar"><div class="fill primary" style:width="{stats.completeness}%"></div></div>
        </div>
    </div>

    <div class="dna-sections mt-6">
        <div class="dna-section">
            <span class="section-label">Dominant Signatures (Tags)</span>
            <div class="tag-cloud mt-2">
                {#each stats.topTags as [tag, count]}
                    <div class="dna-tag">
                        <span class="t-name">#{tag}</span>
                        <span class="t-count">{count}</span>
                    </div>
                {/each}
            </div>
        </div>

        <div class="dna-section mt-4">
            <span class="section-label">Primary Channels</span>
            <div class="channel-list mt-2">
                {#each stats.topChannels as [chan, count]}
                    <div class="dna-row">
                        <span class="c-name">{chan}</span>
                        <span class="c-val">{((count / stats.total) * 100).toFixed(0)}%</span>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .sector-dna { padding: var(--space-8); border-radius: var(--radius-2xl); position: relative; overflow: hidden; }
    .sector-dna::after { content: ''; position: absolute; top: -50%; right: -20%; width: 200px; height: 400px; background: radial-gradient(circle, rgba(var(--primary-rgb), 0.05), transparent 70%); transform: rotate(30deg); pointer-events: none; }

    .dna-header { display: flex; align-items: center; gap: 1rem; }
    .icon-pulse { background: var(--hover); padding: 12px; border-radius: 12px; animation: pulse-border 3s infinite; }
    @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.2); } 70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); } 100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); } }

    .title-group h3 { margin: 0; font-size: 1.1rem; font-weight: 900; }
    .title-group p { margin: 0; font-size: 0.7rem; font-weight: 700; }

    .dna-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .dna-card { background: rgba(255,255,255,0.02); padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--border); }
    .l { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }
    .v-group { display: flex; align-items: baseline; gap: 4px; }
    .v { font-size: 1.25rem; font-weight: 900; font-family: 'JetBrains Mono', monospace; }
    .s { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); opacity: 0.6; }

    .mini-bar { height: 3px; background: var(--border); border-radius: 2px; margin-top: 10px; overflow: hidden; }
    .fill { height: 100%; background: var(--text-muted); transition: width 1s var(--easing-standard); }
    .fill.primary { background: var(--primary); }

    .section-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.6; }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
    .dna-tag { background: var(--hover); padding: 4px 10px; border-radius: 6px; display: flex; gap: 8px; align-items: center; border: 1px solid var(--border); }
    .t-name { font-size: 0.7rem; font-weight: 800; color: var(--primary); }
    .t-count { font-size: 0.65rem; font-weight: 900; opacity: 0.4; font-family: 'JetBrains Mono', monospace; }

    .channel-list { display: flex; flex-direction: column; gap: 6px; }
    .dna-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; font-weight: 700; color: var(--text); padding-bottom: 4px; border-bottom: 1px dashed var(--border); }
    .c-val { font-family: 'JetBrains Mono', monospace; color: var(--primary); font-weight: 800; }
</style>
