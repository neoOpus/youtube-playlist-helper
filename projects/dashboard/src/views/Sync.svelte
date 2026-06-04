<script lang="ts">
  import { notificationService, syncService } from "@yph/core";
  import { Save, RefreshCw, Database } from "lucide-svelte";
  import { onMount } from "svelte";

  let config = $state({
      enabled: false,
      serverUrl: "",
      apiKey: ""
  });

  let status = $state("idle");

  onMount(async () => {
      const saved = await syncService.getSyncConfig();
      if (saved) config = saved;
  });

  async function saveConfig() {
      await syncService.saveSyncConfig(config);
      notificationService.success("Configuration saved.");
  }

  async function triggerSync() {
      if (!config.enabled) return;
      const success = await syncService.performSync("push", (s) => status = s);
      if (success) {
          notificationService.success("Sync successful.");
          setTimeout(() => status = "idle", 2000);
      }
  }
</script>

<div class="view-container">
  <header class="page-header">
      <h1>Cloud Sync</h1>
      <p class="text-secondary">Keep your playlists synchronized across devices.</p>
  </header>

  <div class="sync-grid">
      <div class="sync-card surface-1">
          <div class="card-header">
              <Database size="20" class="icon-primary" />
              <h2>Settings</h2>
          </div>

          <div class="form-group">
              <label for="enable-sync">Enable Cloud Sync</label>
              <input id="enable-sync" type="checkbox" bind:checked={config.enabled} />
          </div>

          <div class="form-group">
              <label for="server-url">Server URL</label>
              <input id="server-url" type="text" bind:value={config.serverUrl} placeholder="https://api.yph-cloud.com" />
          </div>

          <div class="form-group">
              <label for="api-key">API Key</label>
              <input id="api-key" type="password" bind:value={config.apiKey} placeholder="your-api-key" />
          </div>

          <div class="actions">
              <button class="outline-btn" onclick={saveConfig}><Save size="16" /> Save Settings</button>
              <button class="primary-btn" onclick={triggerSync} disabled={!config.enabled || status === 'syncing'}>
                  {#if status === 'syncing'}
                    <RefreshCw size="16" class="spin" /> Syncing...
                  {:else}
                    <RefreshCw size="16" /> Sync Now
                  {/if}
              </button>
          </div>
      </div>

      <div class="sync-info surface-1">
          <h3>Status: <span class="status {status}">{status.toUpperCase()}</span></h3>
          <p class="desc">Synchronize your local collection with a remote server for cross-device access.</p>
      </div>
  </div>
</div>

<style>
  .page-header { margin-bottom: 2rem; }
  h1 { font-size: 1.75rem; font-weight: 800; }
  .text-secondary { font-size: 0.9rem; color: var(--text-secondary); }

  .sync-grid { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }

  .sync-card { padding: 1.5rem; }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-base); padding-bottom: 1rem; }
  .card-header h2 { font-size: 1rem; margin: 0; }

  .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
  label { font-weight: 700; font-size: 0.85rem; color: var(--text-main); }
  input[type="text"], input[type="password"] {
      padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-base);
      background: var(--bg-surface-2); color: var(--text-main); outline: none;
  }

  .actions { display: flex; gap: 1rem; justify-content: flex-end; }
  .primary-btn { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .outline-btn { background: transparent; border: 1px solid var(--border-strong); color: var(--text-main); padding: 10px 20px; border-radius: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px; }

  .sync-info { padding: 1.5rem; }
  .status { font-weight: 900; font-size: 0.8rem; }
  .status.idle { color: var(--text-muted); }
  .status.syncing { color: var(--primary); }
  .status.stable { color: var(--success); }
  .status.error { color: var(--danger); }

  .desc { font-size: 0.8rem; color: var(--text-secondary); margin-top: 1rem; line-height: 1.5; }

  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  :global(.icon-primary) { color: var(--primary); }
</style>
