<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide, fly } from "svelte/transition";
  import { storageService, aiService } from "@yph/core";
  import { InfoIcon, CheckIcon, SearchIcon } from "@yph/ui-kit";

  interface AuditStats {
      totalVideos: number;
      enrichedCount: number;
      avgRating: number;
      topChannels: [string, number][];
      qualityScore: number;
  }

  let stats: AuditStats = {
      totalVideos: 0,
      enrichedCount: 0,
      avgRating: 0,
      topChannels: [],
      qualityScore: 0
  };

  let auditing = true;

  onMount(async () => {
      await runAudit();
  });

  async function runAudit() {
      auditing = true;
      const playlists = await storageService.getPlaylists();
      const allVideos = [];
      const channels = new Map<string, number>();
      let ratingSum = 0;
      let ratedCount = 0;
      let enriched = 0;

      for (const pl of playlists) {
          if (pl.loadedVideos) {
              for (const v of pl.loadedVideos) {
                  allVideos.push(v);
                  channels.set(v.channel, (channels.get(v.channel) || 0) + 1);
                  if (v.rating) { ratingSum += v.rating; ratedCount++; }
                  if (v.aiSummary) enriched++;
              }
          }
      }

      stats.totalVideos = allVideos.length;
      stats.enrichedCount = enriched;
      stats.avgRating = ratedCount > 0 ? parseFloat((ratingSum / ratedCount).toFixed(1)) : 0;
      stats.topChannels = Array.from(channels.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);

      // Quality Score: (Enriched % * 0.4) + (Rated % * 0.3) + (Availability % * 0.3)
      const enrichedFactor = (enriched / allVideos.length) || 0;
      const ratedFactor = (ratedCount / allVideos.length) || 0;
      stats.qualityScore = Math.round((enrichedFactor * 40) + (ratedFactor * 30) + 30);

      auditing = false;
  }
</script>

<div class="auditor pro-glass p-6 mt-8" in:fade>
    <div class="audit-header mb-6">
        <div class="title-row">
            <h3><SearchIcon size="20" color="var(--primary)" /> Infrastructure Audit</h3>
            <span class="badge secondary">Pro v2.1</span>
        </div>
        <p class="muted">Automated quality assessment of your local collection.</p>
    </div>

    {#if auditing}
        <div class="loading-state" in:fade>
            <div class="pulse-ring"></div>
            <p>Scanning Neural Pathways...</p>
        </div>
    {:else}
        <div class="audit-grid" in:fly={{ y: 20 }}>
            <div class="quality-hex">
                <svg viewBox="0 0 100 100" class="score-svg">
                    <circle cx="50" cy="50" r="45" class="bg" />
                    <circle cx="50" cy="50" r="45" class="fg" style="stroke-dasharray: {stats.qualityScore * 2.82}, 282" />
                    <text x="50" y="55" text-anchor="middle" class="score-text">{stats.qualityScore}%</text>
                </svg>
                <span class="label">OVERALL QUALITY</span>
            </div>

            <div class="metrics-list">
                <div class="metric-item">
                    <span class="m-label">AI ENRICHMENT DEPTH</span>
                    <div class="m-bar"><div class="m-fill" style="width: {(stats.enrichedCount / stats.totalVideos) * 100}%"></div></div>
                    <span class="m-val">{stats.enrichedCount} / {stats.totalVideos}</span>
                </div>
                <div class="metric-item">
                    <span class="m-label">AVERAGE INFRA RATING</span>
                    <div class="m-stars">
                        {#each Array(5) as _, i}
                            <span class:active={i < Math.round(stats.avgRating)}>★</span>
                        {/each}
                        <span class="m-val ml-2">{stats.avgRating}</span>
                    </div>
                </div>
                <div class="metric-item">
                    <span class="m-label">NODE DENSITY (TOP CHANNELS)</span>
                    <div class="channel-chips">
                        {#each stats.topChannels as [name, count]}
                            <div class="chip">
                                <span class="c-name">{name}</span>
                                <span class="c-count">{count}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <div class="audit-actions mt-6">
            <button class="btn primary pro-glow w-full" on:click={runAudit}>
                <CheckIcon size="18" /> Re-Validate Collection
            </button>
        </div>
    {/if}
</div>

<style>
    .auditor { border: 1px solid var(--border); position: relative; overflow: hidden; }
    .title-row { display: flex; align-items: center; gap: 12px; }
    h3 { margin: 0; font-weight: 900; letter-spacing: -1px; }

    .audit-grid { display: grid; grid-template-columns: 140px 1fr; gap: 2rem; align-items: center; }

    .quality-hex { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .score-svg { width: 120px; height: 120px; transform: rotate(-90deg); }
    .score-svg .bg { fill: none; stroke: var(--hover); stroke-width: 8; }
    .score-svg .fg { fill: none; stroke: var(--primary); stroke-width: 8; stroke-linecap: round; transition: stroke-dasharray 1s ease-out; }
    .score-text { fill: var(--text); font-weight: 900; font-size: 20px; transform: rotate(90deg); transform-origin: center; }

    .metrics-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .metric-item { display: flex; flex-direction: column; gap: 6px; }
    .m-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1.5px; }
    .m-bar { height: 6px; background: var(--hover); border-radius: 3px; overflow: hidden; }
    .m-fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary); }
    .m-val { font-size: 0.75rem; font-weight: 900; font-family: 'JetBrains Mono'; color: var(--text); }

    .m-stars { display: flex; align-items: center; color: var(--text-muted); font-size: 1.1rem; }
    .m-stars span.active { color: #ffc107; text-shadow: 0 0 8px rgba(255, 193, 7, 0.4); }

    .channel-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip { background: var(--hover); border: 1px solid var(--border); padding: 4px 10px; border-radius: 8px; display: flex; gap: 8px; align-items: center; }
    .c-name { font-size: 0.75rem; font-weight: 700; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .c-count { font-size: 0.65rem; font-weight: 900; background: var(--primary); color: white; padding: 1px 5px; border-radius: 4px; }

    .loading-state { height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
    .pulse-ring { width: 40px; height: 40px; border: 3px solid var(--primary); border-radius: 50%; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }

    .p-6 { padding: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    .w-full { width: 100%; }

    @media (max-width: 600px) { .audit-grid { grid-template-columns: 1fr; } }
</style>
