<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import {
    CloudSyncIcon,
    SaveIcon,
    SearchIcon,
    CheckIcon,
    InfoIcon,
    SuperButton,
    Breadcrumbs
  } from "@yph/ui-kit";
  import { storageService, notificationService, syncService } from "@yph/core";
  import type { SyncState } from "@yph/core";
  import { Cloud, Shield, RefreshCw, AlertCircle, CheckCircle2, Lock } from "lucide-svelte";

  let syncEnabled = $state(false);
  let serverUrl = $state("");
  let apiKey = $state("");
  let status = $state<SyncState>("disconnected");
  let testing = $state(false);

  onMount(async () => {
      const config = await syncService.getSyncConfig();
      syncEnabled = config.enabled;
      serverUrl = config.serverUrl;
      apiKey = config.apiKey;
  });

  async function save() {
      await syncService.saveSyncConfig({ enabled: syncEnabled, serverUrl, apiKey });
      notificationService.success("Configuration saved.");
  }

  async function test() {
      testing = true;
      const success = await syncService.performSync("push", (s) => status = s);
      if (success) notificationService.success("Connection established.");
      testing = false;
  }

  async function push() {
      testing = true;
      const success = await syncService.performSync("push", (s) => status = s);
      if (success) notificationService.success("Cloud node updated.");
      testing = false;
  }

  async function pull() {
      testing = true;
      const success = await syncService.performSync("pull", (s) => status = s);
      if (success) notificationService.success("Local state integrated.");
      testing = false;
  }
</script>

<main class="view-container">
    <header class="view-header">
        <h1>Cloud Node Synchronization</h1>
        <p class="text-secondary">Maintain a resilient, decentralized backup of your YouTube intelligence.</p>
    </header>

    <div class="sync-grid">
        <section class="settings-card surface-1">
            <div class="card-header">
                <Lock size="20" class="icon-primary" />
                <h2>Connection Profile</h2>
            </div>

            <div class="form-stack">
                <div class="field">
                    <div class="label-row">
                        <span class="label">Enable Synchronization</span>
                        <input type="checkbox" bind:checked={syncEnabled} />
                    </div>
                </div>

                <div class="field">
                    <label for="url">Sync Node URL</label>
                    <input id="url" type="text" bind:value={serverUrl} placeholder="https://sync.yph-pro.io" />
                </div>

                <div class="field">
                    <label for="key">Security Key (API)</label>
                    <input id="key" type="password" bind:value={apiKey} placeholder="••••••••••••••••" />
                </div>

                <div class="actions mt-4">
                    <SuperButton primary onclick={save}>Save Config</SuperButton>
                    <button class="test-btn" onclick={test} disabled={testing || !syncEnabled}>
                        <RefreshCw size="14" class={testing ? 'spin' : ''} />
                        <span>{testing ? 'Probing...' : 'Test Link'}</span>
                    </button>
                </div>
            </div>
        </section>

        <section class="settings-card surface-1">
            <div class="card-header">
                <Cloud size="20" class="icon-primary" />
                <h2>System Operations</h2>
            </div>

            <div class="ops-grid">
                <div class="op-card surface-2">
                    <div class="op-info">
                        <span class="op-title">Force Cloud Overwrite</span>
                        <p class="desc">Push local collection to the remote node.</p>
                    </div>
                    <button class="op-btn" onclick={push} disabled={testing || !syncEnabled}>Push Now</button>
                </div>

                <div class="op-card surface-2">
                    <div class="op-info">
                        <span class="op-title">Pull & Merge</span>
                        <p class="desc">Retrieve remote changes and integrate state.</p>
                    </div>
                    <button class="op-btn" onclick={pull} disabled={testing || !syncEnabled}>Pull Now</button>
                </div>
            </div>

            <div class="status-box surface-2" class:stable={status === 'stable'}>
                <div class="status-header">
                    <span class="status-label">Operational Status</span>
                    <div class="pulse-dot" class:active={testing}></div>
                </div>
                <div class="status-val">{status.toUpperCase()}</div>
                {#if status === 'stable'}
                    <div class="status-msg" in:fade>
                        <CheckCircle2 size="14" />
                        <span>Nodes synchronized and stable.</span>
                    </div>
                {/if}
            </div>
        </section>
    </div>
</main>

<style>
    .view-header { margin-bottom: var(--space-10); }
    h1 { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }

    .sync-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); }

    .settings-card { padding: var(--space-8); display: flex; flex-direction: column; gap: var(--space-8); }
    .card-header { display: flex; align-items: center; gap: 12px; }
    .card-header h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
    :global(.icon-primary) { color: var(--primary); }

    .form-stack { display: flex; flex-direction: column; gap: var(--space-6); }
    .field { display: flex; flex-direction: column; gap: 8px; }
    .label-row { display: flex; justify-content: space-between; align-items: center; }
    .label { font-weight: 700; font-size: 0.95rem; }

    label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

    input[type="text"], input[type="password"] {
        background: var(--bg-surface-2); border: 1px solid var(--border-strong);
        color: var(--text-main); padding: 12px 16px; border-radius: 8px;
        font-weight: 600; font-size: 0.9rem; outline: none; transition: border-color 0.2s;
    }
    input:focus { border-color: var(--primary); }

    input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--primary); cursor: pointer; }

    .actions { display: flex; gap: 12px; }
    .test-btn {
        background: transparent; border: 1px solid var(--border-strong);
        color: var(--text-main); padding: 0 16px; border-radius: 8px;
        font-weight: 700; font-size: 0.85rem; cursor: pointer;
        display: flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .test-btn:hover:not(:disabled) { background: var(--border-subtle); border-color: var(--text-muted); }
    .test-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .ops-grid { display: grid; gap: 12px; }
    .op-card { padding: 16px; display: flex; justify-content: space-between; align-items: center; gap: 24px; }
    .op-title { display: block; font-weight: 700; font-size: 0.95rem; margin-bottom: 2px; }
    .desc { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }

    .op-btn {
        background: var(--bg-surface-3); color: var(--text-main); border: none;
        padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 0.8rem;
        cursor: pointer; transition: background 0.2s;
    }
    .op-btn:hover:not(:disabled) { background: var(--primary); }
    .op-btn:disabled { opacity: 0.5; }

    .status-box { padding: 24px; margin-top: auto; border-radius: 12px; display: flex; flex-direction: column; gap: 8px; }
    .status-header { display: flex; justify-content: space-between; align-items: center; }
    .status-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }
    .status-val { font-size: 1.75rem; font-weight: 900; color: var(--text-secondary); letter-spacing: -0.01em; }

    .stable .status-val { color: var(--success); }
    .status-msg { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--success); }

    .pulse-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--text-muted); }
    .pulse-dot.active { background: var(--primary); animation: pulse 1.5s infinite; }

    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }

    @media (max-width: 1000px) { .sync-grid { grid-template-columns: 1fr; } }
</style>
