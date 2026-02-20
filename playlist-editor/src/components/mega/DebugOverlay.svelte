<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { healthService } from "../../services/mega/health-service";
  import Fa from "svelte-fa";
  import { faBug, faHdd, faSync, faExclamationTriangle, faMemory } from "@fortawesome/free-solid-svg-icons";

  export let visible = false;
  const report = healthService.reportStore;

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  onMount(() => {
    const interval = setInterval(() => healthService.updateHealth(), 5000);
    const handleKey = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            visible = !visible;
        }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
        clearInterval(interval);
        window.removeEventListener('keydown', handleKey);
    };
  });
</script>

{#if visible}
  <div class="debug-overlay" transition:fade>
    <div class="header">
      <Fa icon={faBug} />
      <span>System Health Monitor</span>
      <div class="shortcut-hint">CTRL+SHIFT+D to toggle</div>
    </div>

    <div class="metrics">
      <div class="metric">
        <Fa icon={faHdd} />
        <span class="label">Storage:</span>
        <div class="progress-bar">
          <div class="progress" style="width: {($report.storageUsage / $report.storageLimit) * 100}%"></div>
        </div>
        <span class="value">{formatSize($report.storageUsage)}</span>
      </div>

      {#if $report.memoryUsage}
      <div class="metric">
        <Fa icon={faMemory} />
        <span class="label">Memory:</span>
        <span class="value">{formatSize($report.memoryUsage)}</span>
      </div>
      {/if}

      <div class="metric">
        <Fa icon={faSync} />
        <span class="label">Sync:</span>
        <span class="value status-{$report.lastSyncStatus}">{$report.lastSyncStatus.toUpperCase()}</span>
      </div>

      <div class="metric">
        <Fa icon={faSync} />
        <span class="label">Pending Ops:</span>
        <span class="value">{$report.pendingOps}</span>
      </div>
    </div>

    {#if $report.errors.length > 0}
      <div class="errors-section">
        <div class="section-title">
          <Fa icon={faExclamationTriangle} />
          <span>Recent Logs</span>
        </div>
        <div class="error-list">
          {#each $report.errors as error}
            <div class="error-item">{error}</div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .debug-overlay {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 16px;
    color: #e2e8f0;
    font-family: 'Inter', monospace;
    font-size: 12px;
    z-index: 10000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-weight: bold;
    color: #38bdf8;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 8px;
  }

  .shortcut-hint {
    margin-left: auto;
    font-size: 9px;
    opacity: 0.5;
  }

  .metrics {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .metric {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label { color: #94a3b8; width: 80px; }
  .value { font-weight: 600; }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background: #38bdf8;
    transition: width 0.3s;
  }

  .status-success { color: #10b981; }
  .status-failure { color: #ef4444; }
  .status-idle { color: #94a3b8; }

  .errors-section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f59e0b;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .error-list {
    max-height: 100px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .error-item {
    padding: 4px 8px;
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
    font-size: 10px;
    color: #cbd5e1;
  }
</style>
