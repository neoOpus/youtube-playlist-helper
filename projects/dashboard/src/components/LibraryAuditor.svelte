<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { storageService } from "@yph/core";
  import { CheckIcon, SearchIcon, TerminalIcon } from "@yph/ui-kit";

  interface AuditStats {
      totalVideos: number;
      enrichedCount: number;
      avgRating: number;
      qualityScore: number;
      dataDensity: number;
  }

  let stats = $state<AuditStats>({
      totalVideos: 0,
      enrichedCount: 0,
      avgRating: 0,
      qualityScore: 0,
      dataDensity: 0
  });

  let auditing = $state(true);

  onMount(async () => {
      await runAudit();
  });

  async function runAudit() {
      auditing = true;
      const playlists = await storageService.getPlaylists();
      let videos = 0;
      let rated = 0;
      let ratingSum = 0;
      let enriched = 0;

      playlists.forEach(pl => {
          if (pl.loadedVideos) {
              pl.loadedVideos.forEach(v => {
                  videos++;
                  if (v.rating) { ratingSum += v.rating; rated++; }
                  if (v.aiSummary) enriched++;
              });
          }
      });

      stats = {
          totalVideos: videos,
          enrichedCount: enriched,
          avgRating: rated > 0 ? parseFloat((ratingSum / rated).toFixed(1)) : 0,
          qualityScore: videos > 0 ? Math.round((enriched / videos) * 100) : 0,
          dataDensity: videos > 0 ? Math.round((rated / videos) * 100) : 0
      };

      setTimeout(() => auditing = false, 800);
  }
</script>

<div class="auditor pro-glass p-8 mt-8" in:fade>
    <div class="audit-header mb-8">
        <div class="title-group">
            <TerminalIcon size="20" color="var(--primary)" />
            <h3>Infrastructure Integrity Report</h3>
        </div>
        <p class="muted">Real-time analysis of metadata coverage and system density.</p>
    </div>

    {#if auditing}
        <div class="loading-state" in:fade>
            <div class="scanner-bar"></div>
            <p class="small bold">CALIBRATING NEURAL SENSORS...</p>
        </div>
    {:else}
        <div class="audit-dashboard" in:fly={{ y: 20 }}>
            <div class="score-card">
                <div class="radial-score">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" class="bg" />
                        <circle cx="50" cy="50" r="40" class="fg" style="stroke-dasharray: {stats.qualityScore * 2.51}, 251" />
                    </svg>
                    <div class="score-val">
                        <span class="num">{stats.qualityScore}</span>
                        <span class="pct">%</span>
                    </div>
                </div>
                <span class="label">INTEGRITY INDEX</span>
            </div>

            <div class="metrics-grid">
                <div class="metric-box">
                    <span class="m-label">AI ENRICHMENT DEPTH</span>
                    <div class="m-track"><div class="m-fill" style="width: {stats.qualityScore}%"></div></div>
                    <span class="m-status">{stats.enrichedCount} NODES COVERED</span>
                </div>
                <div class="metric-box">
                    <span class="m-label">DATA DENSITY</span>
                    <div class="m-track"><div class="m-fill secondary" style="width: {stats.dataDensity}%"></div></div>
                    <span class="m-status">{stats.dataDensity}% RATED NODES</span>
                </div>
                <div class="metric-box">
                    <span class="m-label">AVERAGE NODE RATING</span>
                    <div class="rating-val">
                        <span class="star">★</span>
                        <span class="val">{stats.avgRating} / 5.0</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="audit-footer mt-8">
            <button class="re-audit-btn" onclick={runAudit}>
                <CheckIcon size="14" />
                <span>Execute Re-Scan</span>
            </button>
        </div>
    {/if}
</div>

<style>
    .auditor { border: 1px solid var(--border); background: var(--card-bg-alpha); }
    .title-group { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
    h3 { margin: 0; font-weight: 900; font-size: var(--font-lg); letter-spacing: -0.03em; color: var(--text); }
    .audit-dashboard { display: grid; grid-template-columns: 180px 1fr; gap: 3rem; align-items: center; }
    .score-card { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .radial-score { position: relative; width: 140px; height: 140px; }
    svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    .bg { fill: none; stroke: var(--hover); stroke-width: 6; }
    .fg { fill: none; stroke: var(--primary); stroke-width: 6; stroke-linecap: round; transition: stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .score-val { position: absolute; inset: 0; display: flex; align-items: baseline; justify-content: center; padding-top: 50px; }
    .score-val .num { font-size: 2.5rem; font-weight: 900; letter-spacing: -2px; color: var(--text); }
    .score-val .pct { font-size: 1rem; font-weight: 800; color: var(--text-muted); margin-left: 2px; }
    .label { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; }
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .metric-box { display: flex; flex-direction: column; gap: 8px; }
    .m-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; }
    .m-track { height: 4px; background: var(--hover); border-radius: 2px; overflow: hidden; }
    .m-fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary); transition: width 1s ease; }
    .m-fill.secondary { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
    .m-status { font-size: 0.65rem; font-weight: 800; color: var(--text); opacity: 0.7; font-family: 'JetBrains Mono'; }
    .rating-val { display: flex; align-items: center; gap: 8px; color: #ffc107; font-weight: 900; font-size: 1.2rem; }
    .star { text-shadow: 0 0 12px rgba(255, 193, 7, 0.5); }
    .loading-state { height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
    .scanner-bar { width: 200px; height: 2px; background: var(--hover); position: relative; overflow: hidden; }
    .scanner-bar::after { content: ''; position: absolute; left: -100%; width: 100%; height: 100%; background: var(--primary); animation: scan 1.5s infinite; }
    @keyframes scan { 0% { left: -100%; } 100% { left: 100%; } }
    .re-audit-btn { width: 100%; padding: 14px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text); font-weight: 800; font-size: var(--font-xs); text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
    .re-audit-btn:hover { background: var(--primary); color: white; border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-primary); }
    @media (max-width: 900px) { .audit-dashboard { grid-template-columns: 1fr; } .metrics-grid { grid-template-columns: 1fr; } }
</style>
