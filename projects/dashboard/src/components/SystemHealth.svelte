<svelte:options runes={true} />
<script lang="ts">
  import { Activity, Database, Cpu, Zap } from "lucide-svelte";
  import { onMount } from "svelte";

  let stats = $state({
      memory: "0 MB",
      nodes: 0,
      heartbeat: "STABLE",
      uptime: "00:00:00"
  });

  onMount(() => {
      const start = Date.now();
      const interval = setInterval(() => {
          const diff = Date.now() - start;
          const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
          const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
          const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
          stats.uptime = `${h}:${m}:${s}`;
          // Simulated metrics
          stats.memory = (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) + " MB" : "N/A";
      }, 1000);
      return () => clearInterval(interval);
  });
</script>

<div class="system-health surface-1">
    <div class="health-header">
        <Activity size="16" class="text-primary" />
        <span class="label">Telemetry Dashboard</span>
    </div>

    <div class="stats-stack">
        <div class="stat-row">
            <span class="s-label"><Database size="12" /> STORAGE_USAGE</span>
            <span class="s-val">{stats.memory}</span>
        </div>
        <div class="stat-row">
            <span class="s-label"><Cpu size="12" /> ENGINE_STATUS</span>
            <span class="s-val text-success">{stats.heartbeat}</span>
        </div>
        <div class="stat-row">
            <span class="s-label"><Zap size="12" /> SESSION_UPTIME</span>
            <span class="s-val mono">{stats.uptime}</span>
        </div>
    </div>

    <div class="health-footer">
        <div class="pulse-dot active"></div>
        <span>CORE_V4_RUNNING</span>
    </div>
</div>

<style>
    .system-health { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
    .health-header { display: flex; align-items: center; gap: 10px; }
    .label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }

    .stats-stack { display: flex; flex-direction: column; gap: 12px; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; }
    .s-label { display: flex; align-items: center; gap: 8px; font-size: 0.6rem; font-weight: 800; color: var(--text-dim); }
    .s-val { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .text-success { color: var(--success); }

    .health-footer { border-top: 1px solid var(--border-base); padding-top: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.15em; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); }
    .pulse-dot.active { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }
</style>
