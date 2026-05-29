<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { globalHeartbeat, heartbeatService } from "@yph/core";
  import { TerminalIcon, InfoIcon } from "@yph/ui-kit";
  import { fade, fly, slide } from "svelte/transition";

  let agents = $state<Record<string, any>>({});
  let metrics = $state(heartbeatService.getSystemMetrics());

  onMount(() => {
      const unsubscribe = globalHeartbeat.subscribe(v => agents = v);
      const interval = setInterval(() => {
          metrics = heartbeatService.getSystemMetrics();
      }, 2000);
      return () => {
          unsubscribe();
          clearInterval(interval);
      };
  });
</script>

<div class="system-health pro-glass p-6">
    <div class="health-header">
        <h3 class="card-title"><TerminalIcon size="18" /> System Heartbeat</h3>
        <div class="uptime">UP: {metrics.uptime}s</div>
    </div>

    <div class="metrics-grid mt-6">
        <div class="metric-box">
            <span class="m-label">Memory</span>
            <span class="m-val">{metrics.memory}MB</span>
        </div>
        <div class="metric-box">
            <span class="m-label">Agents</span>
            <span class="m-val">{metrics.agentCount}</span>
        </div>
        <div class="metric-box">
            <span class="m-label">Status</span>
            <span class="m-val success">NOMINAL</span>
        </div>
    </div>

    <div class="agents-list mt-8">
        {#each Object.values(agents) as agent (agent.id)}
            <div class="agent-row" in:fade>
                <div class="agent-info">
                    <div class="agent-name-row">
                        <span class="agent-name">{agent.name}</span>
                        <div class="pulse-dot {agent.state}"></div>
                    </div>
                    <p class="agent-msg">{agent.message || 'Waiting for protocol...'}</p>
                </div>
                {#if agent.progress !== undefined}
                    <div class="agent-progress">
                        <div class="p-fill" style="width: {agent.progress}%"></div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .health-header { display: flex; justify-content: space-between; align-items: center; }
    .uptime { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: var(--text-dim); }
    .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .metric-box { background: var(--bg); padding: 8px; border-radius: 8px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 2px; }
    .m-label { font-size: 8px; font-weight: 900; color: var(--text-dim); text-transform: uppercase; }
    .m-val { font-size: 11px; font-weight: 800; color: var(--primary); font-family: 'JetBrains Mono', monospace; }
    .m-val.success { color: var(--success); }

    .agents-list { display: flex; flex-direction: column; gap: 12px; }
    .agent-row { display: flex; flex-direction: column; gap: 6px; }
    .agent-name-row { display: flex; align-items: center; gap: 8px; }
    .agent-name { font-size: 0.7rem; font-weight: 900; color: var(--text); text-transform: uppercase; letter-spacing: 0.5px; }
    .agent-msg { margin: 0; font-size: 10px; color: var(--text-muted); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim); }
    .pulse-dot.working { background: var(--primary); box-shadow: 0 0 8px var(--primary); animation: agent-pulse 1s infinite alternate; }
    .pulse-dot.idle { background: var(--success); }

    .agent-progress { height: 2px; background: var(--hover); width: 100%; border-radius: 1px; overflow: hidden; }
    .p-fill { height: 100%; background: var(--primary); transition: width 0.4s ease; }

    @keyframes agent-pulse { from { opacity: 0.4; } to { opacity: 1; } }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
</style>
