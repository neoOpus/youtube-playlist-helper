<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { storageService } from "@yph/core";
  import { ShieldCheck, Database, Zap, Activity } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";

  let totalNodes = $state(0);
  let activeClusters = $state(0);
  let neuralDensity = $state(0);
  let status = $state("Stable");

  onMount(async () => {
      const playlists = await storageService.getPlaylists();
      activeClusters = playlists.length;

      let nodes = 0;
      let enriched = 0;

      playlists.forEach(pl => {
          if (pl.loadedVideos) {
              pl.loadedVideos.forEach(v => {
                  nodes++;
                  if (v.aiSummary) enriched++;
              });
          }
      });

      totalNodes = nodes;
      neuralDensity = nodes > 0 ? Math.round((enriched / nodes) * 100) : 0;
  });
</script>

<div class="system-health pro-glass p-8 mt-8" in:fade>
    <div class="health-header">
        <Activity size="18" color="var(--success)" />
        <h3 class="card-title">Infrastructure Health</h3>
    </div>

    <div class="health-stats mt-6">
        <div class="health-item" in:fly={{ y: 10, delay: 100 }}>
            <div class="icon-wrapper primary"><Database size="16" /></div>
            <div class="info">
                <span class="label">Total Nodes</span>
                <span class="val">{totalNodes}</span>
            </div>
        </div>

        <div class="health-item" in:fly={{ y: 10, delay: 200 }}>
            <div class="icon-wrapper info"><Zap size="16" /></div>
            <div class="info">
                <span class="label">Neural Density</span>
                <span class="val">{neuralDensity}%</span>
            </div>
        </div>

        <div class="health-item" in:fly={{ y: 10, delay: 300 }}>
            <div class="icon-wrapper success"><ShieldCheck size="16" /></div>
            <div class="info">
                <span class="label">System State</span>
                <span class="val success-text">{status}</span>
            </div>
        </div>
    </div>

    <div class="progress-bar mt-6">
        <div class="fill" style="width: {neuralDensity}%"></div>
    </div>
</div>

<style>
    .system-health { border: 1px solid var(--border); }
    .health-header { display: flex; align-items: center; gap: 12px; }
    .card-title { margin: 0; font-weight: 800; font-size: var(--font-sm); text-transform: uppercase; letter-spacing: 1px; }

    .health-stats { display: flex; flex-direction: column; gap: 16px; }
    .health-item { display: flex; align-items: center; gap: 14px; }

    .icon-wrapper {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--hover);
        color: var(--text-muted);
    }

    .icon-wrapper.primary { color: var(--primary); background: rgba(var(--primary-rgb), 0.1); }
    .icon-wrapper.info { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
    .icon-wrapper.success { color: var(--success); background: rgba(var(--success-rgb), 0.1); }

    .info { display: flex; flex-direction: column; gap: 2px; }
    .label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
    .val { font-size: 1.1rem; font-weight: 900; font-family: 'JetBrains Mono', monospace; color: var(--text); }
    .success-text { color: var(--success); }

    .progress-bar { height: 4px; background: var(--hover); border-radius: 2px; overflow: hidden; }
    .fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary); transition: width 1.5s cubic-bezier(0.23, 1, 0.32, 1); }
</style>
