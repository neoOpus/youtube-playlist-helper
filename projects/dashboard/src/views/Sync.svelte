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
      await syncService.saveSyncConfig({
          enabled: syncEnabled,
          serverUrl,
          apiKey
      });
      notificationService.success("Sync configuration locked.");
  }

  async function test() {
      testing = true;
      const success = await syncService.performSync("push", (s) => status = s);
      if (success) {
          notificationService.success("Infrastructure link established.");
      } else {
          notificationService.error("Sync probe failed.");
      }
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

<main class="view-container" in:fade>
    <header class="view-header">
        <div class="header-content aura-glow">
            <Breadcrumbs items={[{label: 'INFRASTRUCTURE'}, {label: 'CLOUD SYNC', active: true}]} />
            <h1>Cloud Infrastructure</h1>
            <p class="muted">Maintain a decentralized backup of your YouTube intelligence across all nodes.</p>
        </div>
    </header>

    <div class="sync-grid">
        <section class="config-pane pro-glass" in:fly={{ x: -20, delay: 100 }}>
            <h3 class="card-title"><SaveIcon size="18" /> Connection Profile</h3>

            <div class="form-group mt-8">
                <label class="toggle-row">
                    <span class="label-text">Enable Global Synchronization</span>
                    <input type="checkbox" bind:checked={syncEnabled} class="pro-check" />
                </label>
            </div>

            <div class="field mt-8">
                <label for="server-url">Sync Node URL</label>
                <input id="server-url" type="text" bind:value={serverUrl} placeholder="https://sync.yph-pro.io" class="pro-input" />
            </div>

            <div class="field mt-6">
                <label for="api-key">Security Key (API)</label>
                <input id="api-key" type="password" bind:value={apiKey} placeholder="••••••••••••••••" class="pro-input" />
            </div>

            <div class="btns mt-10">
                <SuperButton onclick={save} >
                    <CheckIcon size="18" /> Lock Config
                </SuperButton>
                <SuperButton outline onclick={test} disabled={testing || !syncEnabled}>
                    {testing ? 'Probing...' : 'Probe Connection'}
                </SuperButton>
            </div>
        </section>

        <section class="operations-pane pro-glass" in:fly={{ x: 20, delay: 200 }}>
            <h3 class="card-title"><SearchIcon size="18" /> System Operations</h3>

            <div class="op-card mt-8">
                <div class="op-info">
                    <span class="bold">Force Cloud Overwrite</span>
                    <p class="small muted">Push local collection to the cloud node. Destructive.</p>
                </div>
                <SuperButton outline mini onclick={push} disabled={testing || !syncEnabled}>Push Now</SuperButton>
            </div>

            <div class="op-card mt-4">
                <div class="op-info">
                    <span class="bold">Pull & Merge</span>
                    <p class="small muted">Retrieve remote changes and integrate with local state.</p>
                </div>
                <SuperButton outline mini onclick={pull} disabled={testing || !syncEnabled}>Pull Now</SuperButton>
            </div>

            <div class="status-box mt-10" class:connected={status === 'stable'}>
                <div class="pulse-indicator" class:pulse={testing}></div>
                <div class="status-text">
                    <span class="small bold uppercase">Current Status</span>
                    <span class="status-val">{status.toUpperCase()}</span>
                </div>

                {#if status === 'stable'}
                    <div class="diff-status mt-4" in:fade>
                        <InfoIcon size="14" color="var(--primary)" />
                        <span>Ready to merge collections.</span>
                    </div>
                {/if}
            </div>
        </section>
    </div>
</main>

<style>
    .view-container { padding: var(--space-8); max-width: 1400px; margin: 0 auto; }
    .view-header { margin-bottom: var(--space-12); }
    .sync-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-10); }
    .pro-glass { padding: var(--space-10); border: 1px solid var(--border); }
    .card-title { margin: 0; font-weight: 900; display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-lg); color: var(--text); }
    .field { display: flex; flex-direction: column; gap: var(--space-2); }
    label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
    .toggle-row { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
    .label-text { font-weight: 800; color: var(--text); font-size: var(--font-sm); }
    .pro-check { width: 44px; height: 22px; accent-color: var(--primary); cursor: pointer; }
    .pro-input { background: var(--bg-secondary); border: 1px solid var(--border); padding: var(--space-4); border-radius: var(--radius-md); color: var(--text); font-weight: 600; }
    .pro-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1); outline: none; }
    .btns { display: flex; gap: var(--space-4); }
    .op-card { background: rgba(var(--primary-rgb), 0.02); padding: var(--space-5); border-radius: var(--radius-lg); border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .op-info { display: flex; flex-direction: column; gap: var(--space-1); }
    .status-box { background: var(--bg-secondary); padding: var(--space-8); border-radius: var(--radius-xl); border: 1px solid var(--border); position: relative; overflow: hidden; min-height: 140px; }
    .status-text { display: flex; flex-direction: column; gap: 4px; }
    .status-val { font-weight: 900; font-size: 2rem; letter-spacing: 0.05em; color: var(--text-muted); font-family: 'Inter', sans-serif; transition: color 0.3s; }
    .connected .status-val { color: var(--success); }
    .connected .pulse-indicator { background: var(--success); box-shadow: 0 0 20px var(--success); }
    .pulse-indicator { position: absolute; top: var(--space-8); right: var(--space-8); width: 16px; height: 16px; border-radius: 50%; background: var(--text-muted); transition: all 0.3s; }
    .pulse-indicator.pulse { background: var(--primary); animation: pulse-anim 1s infinite; }
    @keyframes pulse-anim { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
    .diff-status { display: flex; align-items: center; gap: 10px; font-size: var(--font-sm); color: var(--text); font-weight: 700; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mt-10 { margin-top: 2.5rem; }
    .bold { font-weight: 900; }
    .uppercase { text-transform: uppercase; }
    @media (max-width: 1000px) { .sync-grid { grid-template-columns: 1fr; } }
</style>
