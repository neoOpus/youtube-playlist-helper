<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import {
    CloudSyncIcon,
    SaveIcon,
    SearchIcon,
    CheckIcon,
    InfoIcon
  } from "@yph/ui-kit";
  import { storageService, notificationService } from "@yph/core";

  let syncEnabled = false;
  let serverUrl = "";
  let apiKey = "";
  let status = "disconnected";
  let testing = false;

  onMount(async () => {
      const settings = await storageService.getSettings();
      syncEnabled = settings.syncEnabled || false;
      serverUrl = settings.syncServerUrl || "";
      apiKey = settings.syncApiKey || "";
  });

  async function save() {
      await storageService.updateSettings({
          syncEnabled,
          syncServerUrl: serverUrl,
          syncApiKey: apiKey
      });
      notificationService.success("Sync configuration locked.");
  }

  async function test() {
      testing = true;
      try {
          // Mocking a probe
          await new Promise(r => setTimeout(r, 1500));
          status = "connected";
          notificationService.success("Neural link established.");
      } catch (err) {
          status = "error";
          notificationService.error("Sync probe failed.");
      } finally {
          testing = false;
      }
  }
</script>

<div class="sync-view view-container" in:fade>
    <header class="view-header">
        <div class="header-content aura-glow">
            <div class="title-row">
                <div class="icon-blob"><CloudSyncIcon size="32" /></div>
                <h1>Cloud Infrastructure</h1>
            </div>
            <p class="muted">Maintain a decentralized backup of your YouTube intelligence across all nodes.</p>
        </div>
    </header>

    <div class="sync-grid">
        <section class="config-pane pro-glass" in:fly={{ x: -20, delay: 100 }}>
            <h3 class="card-title"><SaveIcon size="18" /> Connection Profile</h3>
            <div class="form-group mt-8">
                <label class="toggle-row">
                    <span class="label-text">Enable Global Synchronization</span>
                    <input type="checkbox" bind:checked={syncEnabled} class="quantum-check" />
                </label>
            </div>

            <div class="field mt-8">
                <label for="server-url">Sync Node URL</label>
                <input id="server-url" type="text" bind:value={serverUrl} placeholder="https://sync.yph-pro.io" />
            </div>

            <div class="field mt-6">
                <label for="api-key">Security Key (API)</label>
                <input id="api-key" type="password" bind:value={apiKey} placeholder="••••••••••••••••" />
            </div>

            <div class="btns mt-10">
                <button class="action-btn primary-btn sota-glow flex-1" on:click={save}><CheckIcon size="18" /> Lock Config</button>
                <button class="action-btn secondary-btn" on:click={test} disabled={testing}>{testing ? 'Testing...' : 'Probe Connection'}</button>
            </div>
        </section>

        <section class="operations-pane pro-glass" in:fly={{ x: 20, delay: 200 }}>
            <h3 class="card-title"><SearchIcon size="18" /> System Operations</h3>

            <div class="op-card mt-8">
                <div class="op-info">
                    <span class="bold">Force Cloud Overwrite</span>
                    <p class="small muted">Push local collection to the cloud node. Destructive.</p>
                </div>
                <button class="action-btn mini-btn">Push Now</button>
            </div>

            <div class="op-card mt-4">
                <div class="op-info">
                    <span class="bold">Pull & Merge</span>
                    <p class="small muted">Retrieve remote changes and integrate with local state.</p>
                </div>
                <button class="action-btn mini-btn">Pull Now</button>
            </div>

            <div class="status-box mt-10" class:connected={status === 'connected'}>
                <div class="pulse-indicator"></div>
                <div class="status-text">
                    <span class="small bold uppercase">Current Status</span>
                    <span class="status-val">{status.toUpperCase()}</span>
                </div>

                {#if status === 'connected'}
                    <div class="diff-status mt-4">
                        <InfoIcon size="14" color="var(--primary)" />
                        <span>Ready to merge collections.</span>
                    </div>
                {/if}
            </div>
        </section>
    </div>
</div>

<style>
    .view-container {
      padding: var(--space-12) var(--space-8);
      max-width: 1400px;
      margin: 0 auto;
    }

    .view-header { margin-bottom: var(--space-12); }
    .header-content { display: flex; flex-direction: column; gap: var(--space-3); }
    .header-content h1 { font-size: 3rem; margin: 0; }

    .title-row { display: flex; align-items: center; gap: var(--space-5); }

    .icon-blob {
        background: var(--primary);
        color: white;
        padding: var(--space-3);
        border-radius: var(--radius-lg);
        box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.4);
    }

    .sync-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-10);
        margin-top: var(--space-8);
    }

    .pro-glass {
        padding: var(--space-10);
        border-radius: var(--radius-xl);
    }

    .card-title {
        margin: 0;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-size: var(--font-lg);
        color: var(--text);
    }

    .field { display: flex; flex-direction: column; gap: var(--space-2); }
    label { font-size: var(--font-xs); font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }

    .toggle-row { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
    .label-text { font-weight: 700; color: var(--text); }

    .quantum-check {
        width: 44px;
        height: 22px;
        accent-color: var(--primary);
        cursor: pointer;
    }

    .btns { display: flex; gap: var(--space-4); }

    .action-btn {
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        font-weight: 800;
        cursor: pointer;
        border: 1px solid var(--border);
        transition: all 0.3s var(--easing-standard);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        color: var(--text);
        background: var(--bg-secondary);
        font-size: var(--font-sm);
    }

    .action-btn:hover:not(:disabled) {
        background: var(--hover);
        transform: translateY(-4px);
        box-shadow: 0 10px 24px -5px var(--shadow);
    }

    .primary-btn { background: var(--primary); color: white; border-color: var(--primary); }
    .primary-btn:hover:not(:disabled) { background: var(--primary-hover); border-color: var(--primary-hover); }

    .mini-btn { padding: var(--space-2) var(--space-4); font-size: var(--font-xs); border-radius: var(--radius-md); }

    .op-card { background: var(--hover); padding: var(--space-5); border-radius: var(--radius-lg); border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .op-info { display: flex; flex-direction: column; gap: var(--space-1); }

    .status-box { background: rgba(0, 0, 0, 0.3); padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--border); position: relative; overflow: hidden; }
    .status-text { display: flex; flex-direction: column; gap: 4px; }
    .status-val { font-weight: 900; font-size: var(--font-xl); letter-spacing: 0.05em; color: var(--text-muted); }

    .connected .status-val { color: var(--success); }
    .connected .pulse-indicator { background: var(--success); box-shadow: 0 0 15px var(--success); }

    .pulse-indicator { position: absolute; top: var(--space-6); right: var(--space-6); width: 12px; height: 12px; border-radius: 50%; background: var(--text-muted); }

    .diff-status { display: flex; align-items: center; gap: 10px; font-size: var(--font-sm); color: var(--text); }

    .flex-1 { flex: 1; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mt-10 { margin-top: 2.5rem; }
    .bold { font-weight: 800; }
    .uppercase { text-transform: uppercase; }

    @media (max-width: 1000px) { .sync-grid { grid-template-columns: 1fr; } .view-container { padding: var(--space-8) var(--space-4); } }
</style>
