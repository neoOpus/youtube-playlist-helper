<script lang="ts">
  import { onMount } from "svelte";
  import { diagnosticService, type DiagnosticResult } from "../../services/mega/diagnostic-service";
  import { storage } from "../../services/core/storage-service";
  import Fa from "svelte-fa";
  import { faExclamationTriangle, faWrench } from "@fortawesome/free-solid-svg-icons";

  let storageUsage = "0 KB";
  let statusText = "Ready";
  let issues: DiagnosticResult[] = [];

  onMount(() => {
    const init = async () => { await updateStats(); }; init();
    const interval = setInterval(updateStats, 10000);
    return () => clearInterval(interval);
  });

  async function updateStats() {
    const all = await storage.getAll();
    const bytes = JSON.stringify(all).length * 2;
    storageUsage = (bytes / 1024).toFixed(1) + " KB";

    issues = await diagnosticService.runDiagnostics();
    if (issues.length > 0) {
        statusText = `${issues.length} System Issues Detected`;
    } else {
        statusText = "System Healthy";
    }
  }
</script>

<footer class="status-bar" class:has-issues={issues.length > 0}>
  <div class="left">
    <span class="dot" class:active={issues.length === 0} class:warning={issues.length > 0}></span>
    <span class="status-text">{statusText}</span>

    {#if issues.length > 0}
        <div class="issue-pill">
            <Fa icon={faExclamationTriangle} />
            {issues[0].message}
            <button class="repair-btn" on:click={() => issues[0].action()}>
                <Fa icon={faWrench} /> {issues[0].actionLabel}
            </button>
        </div>
    {/if}
  </div>

  <div class="right">
    <span class="usage">Persistence: {storageUsage}</span>
    <span class="version">v2.0.0-mega</span>
  </div>
</footer>

<style>
  .status-bar {
    height: 32px;
    background: #0f172a;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    font-size: 0.7rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    transition: background 0.3s;
  }

  .status-bar.has-issues {
      background: #450a0a;
      color: #fecaca;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #334155;
  }

  .dot.active {
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
  }

  .dot.warning {
    background: #f59e0b;
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
  }

  .issue-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.1);
      padding: 2px 8px;
      border-radius: 4px;
      margin-left: 12px;
  }

  .repair-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 0.65rem;
      font-weight: bold;
      cursor: pointer;
      margin-left: 8px;
  }

  .repair-btn:hover {
      background: #059669;
  }

  .right {
    display: flex;
    gap: 2rem;
    font-weight: 500;
  }
</style>
