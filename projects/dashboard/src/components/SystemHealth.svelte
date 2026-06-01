<svelte:options runes={true} />
<script lang="ts">
  import { Activity, Database, Cpu, Zap, Terminal } from "lucide-svelte";
  import { onMount } from "svelte";
  import { globalHeartbeat, heartbeatService } from "@yph/core";

  let stats = $state({
      memory: "0 MB",
      uptime: "00:00:00",
      agentCount: 0
  });

  let agents = $state<any>({});

  onMount(() => {
      const unsubscribe = globalHeartbeat.subscribe(v => agents = v);
      const interval = setInterval(() => {
          const metrics = heartbeatService.getSystemMetrics();
          stats.memory = `${metrics.memory} MB`;
          stats.agentCount = metrics.agentCount;

          const h = Math.floor(metrics.uptime / 3600).toString().padStart(2, '0');
          const m = Math.floor((metrics.uptime % 3600) / 60).toString().padStart(2, '0');
          const s = Math.floor(metrics.uptime % 60).toString().padStart(2, '0');
          stats.uptime = `${h}:${m}:${s}`;
      }, 1000);

      return () => {
          unsubscribe();
          clearInterval(interval);
      };
  });

  const activeAgents = $derived(Object.values(agents));
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
            <span class="s-label"><Zap size="12" /> SESSION_UPTIME</span>
            <span class="s-val mono">{stats.uptime}</span>
        </div>
        <div class="stat-row">
            <span class="s-label"><Cpu size="12" /> ACTIVE_AGENTS</span>
            <span class="s-val">{stats.agentCount}</span>
        </div>
    </div>

    {#if activeAgents.length > 0}
        <div class="divider"></div>
        <div class="agents-list">
            {#each activeAgents as agent}
                <div class="agent-item" class:working={agent.state === 'working'}>
                    <div class="agent-info">
                        <span class="agent-name">{agent.name}</span>
                        <span class="agent-msg">{agent.message || agent.state}</span>
                    </div>
                    <div class="status-indicator" class:pulse={agent.state === 'working'}></div>
                </div>
            {/each}
        </div>
    {/if}

    <div class="health-footer">
        <div class="pulse-dot active"></div>
        <span>CORE_V4_RUNNING</span>
    </div>
</div>

<style>
    .system-health { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .health-header { display: flex; align-items: center; gap: 10px; }
    .label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }

    .stats-stack { display: flex; flex-direction: column; gap: 10px; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; }
    .s-label { display: flex; align-items: center; gap: 8px; font-size: 0.6rem; font-weight: 800; color: var(--text-dim); }
    .s-val { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
    .mono { font-family: 'JetBrains Mono', monospace; }

    .divider { height: 1px; background: var(--border-base); margin: 4px 0; }

    .agents-list { display: flex; flex-direction: column; gap: 8px; }
    .agent-item { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-surface-2); border-radius: 6px; border: 1px solid var(--border-subtle); }
    .agent-info { display: flex; flex-direction: column; gap: 2px; }
    .agent-name { font-size: 0.6rem; font-weight: 800; color: var(--text-main); }
    .agent-msg { font-size: 0.55rem; color: var(--text-muted); font-weight: 600; }

    .status-indicator { width: 4px; height: 4px; border-radius: 50%; background: var(--text-dim); }
    .agent-item.working .status-indicator { background: var(--primary); box-shadow: 0 0 6px var(--primary); }
    .pulse { animation: agent-pulse 1.5s infinite; }
    @keyframes agent-pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

    .health-footer { border-top: 1px solid var(--border-base); padding-top: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.15em; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); }
    .pulse-dot.active { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }
</style>
