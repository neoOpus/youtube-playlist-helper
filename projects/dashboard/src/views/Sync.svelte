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

<div class="sync-view p-8" in:fade>
    <header class="mb-12">
        <h2 class="row items-center gap-4">
            <div class="icon-blob"><CloudSyncIcon size="32" /></div>
            <span>Cloud Infrastructure & Sync</span>
        </h2>
        <p class="muted mt-2">Maintain a decentralized backup of your YouTube intelligence across all nodes.</p>
    </header>

    <div class="sync-grid">
        <section class="config-pane pro-glass" in:fly={{ x: -20, delay: 100 }}>
            <h3><SaveIcon size="18" /> Connection Profile</h3>
            <div class="form-group mt-6">
                <label class="toggle-row">
                    <span>Enable Global Synchronization</span>
                    <input type="checkbox" bind:checked={syncEnabled} />
                </label>
            </div>

            <div class="field mt-6">
                <label for="server-url">Sync Node URL</label>
                <input id="server-url" type="text" bind:value={serverUrl} placeholder="https://sync.yph-pro.io" />
            </div>

            <div class="field mt-4">
                <label for="api-key">Security Key (API)</label>
                <input id="api-key" type="password" bind:value={apiKey} placeholder="••••••••••••••••" />
            </div>

            <div class="btns mt-8">
                <button class="btn primary-sota sota-glow flex-1" on:click={save}><CheckIcon size="18" /> Lock Configuration</button>
                <button class="btn secondary" on:click={test} disabled={testing}>{testing ? 'Testing...' : 'Probe Connection'}</button>
            </div>
        </section>

        <section class="operations-pane pro-glass" in:fly={{ x: 20, delay: 200 }}>
            <h3><SearchIcon size="18" /> System Operations</h3>

            <div class="op-card mt-6">
                <div class="op-info">
                    <span class="bold">Force Cloud Overwrite</span>
                    <p class="small muted">Push local collection to the cloud node. Destructive.</p>
                </div>
                <button class="btn secondary mini">Push Now</button>
            </div>

            <div class="op-card mt-4">
                <div class="op-info">
                    <span class="bold">Pull & Merge</span>
                    <p class="small muted">Retrieve remote changes and integrate with local state.</p>
                </div>
                <button class="btn secondary mini">Pull Now</button>
            </div>

            <div class="status-box mt-8" class:connected={status === 'connected'}>
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
    .sync-view { max-width: 1200px; margin: 0 auto; }
    h2 { font-weight: 900; letter-spacing: -1.5px; font-size: 2.5rem; margin: 0; }
    .icon-blob { background: var(--primary); color: white; padding: 12px; border-radius: 18px; box-shadow: 0 8px 24px rgba(255, 82, 82, 0.3); }

    .sync-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; }

    .pro-glass { background: var(--card-bg-alpha, rgba(20, 25, 35, 0.6)); backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 24px; padding: 2.5rem; }
    h3 { margin: 0; font-weight: 800; display: flex; align-items: center; gap: 10px; font-size: 1.1rem; color: var(--text); }

    .field { display: flex; flex-direction: column; gap: 8px; }
    label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

    .toggle-row { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
    .toggle-row span { font-weight: 700; color: var(--text); }
    input[type="checkbox"] { width: 40px; height: 20px; accent-color: var(--primary); cursor: pointer; }

    input[type="text"], input[type="password"] { background: var(--hover); border: 1px solid var(--border); color: var(--text); padding: 14px; border-radius: 12px; font-weight: 700; outline: none; transition: border-color 0.2s; }
    input:focus { border-color: var(--primary); }

    .btns { display: flex; gap: 1rem; }
    .btn { padding: 14px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
    .btn.primary-sota { background: var(--primary); color: white; border-color: var(--primary); }
    .btn.secondary { background: var(--hover); color: var(--text); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .sota-glow { box-shadow: 0 0 20px rgba(255, 82, 82, 0.4); }

    .op-card { background: var(--hover); padding: 1rem; border-radius: 16px; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .op-info { display: flex; flex-direction: column; }
    .btn.mini { padding: 8px 16px; font-size: 0.75rem; }

    .status-box { background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); position: relative; overflow: hidden; }
    .status-text { display: flex; flex-direction: column; gap: 4px; }
    .status-val { font-weight: 900; font-size: 1.2rem; letter-spacing: 1px; color: var(--text-muted); }

    .connected .status-val { color: #28a745; }
    .connected .pulse-indicator { background: #28a745; box-shadow: 0 0 15px #28a745; }

    .pulse-indicator { position: absolute; top: 1.5rem; right: 1.5rem; width: 12px; height: 12px; border-radius: 50%; background: var(--text-muted); }

    .diff-status { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text); }

    .flex-1 { flex: 1; }
    .items-center { align-items: center; }
    .gap-4 { gap: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-12 { margin-bottom: 3rem; }
    .p-8 { padding: 2rem; }
    .bold { font-weight: 800; }
    .uppercase { text-transform: uppercase; }
</style>
