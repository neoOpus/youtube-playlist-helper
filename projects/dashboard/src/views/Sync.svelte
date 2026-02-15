<script lang="ts">
  import { onMount } from "svelte";
  import { storageService, webdavService, notificationService } from "@yph/core";

  let url = "";
  let username = "";
  let password = "";
  let enabled = false;
  let autoSync = true;
  let testing = false;
  let syncing = false;

  onMount(async () => {
    const config = await webdavService.getConfig();
    url = config.url || "";
    username = config.username || "";
    password = config.password || "";
    enabled = config.enabled || false;
    autoSync = config.autoSync ?? true;
  });

  async function save() {
    await webdavService.saveConfig({ url, username, password, enabled, autoSync, fileName: "yph_backup.json" });
    notificationService.success("Configuration saved.");
  }

  async function test() {
    testing = true;
    const ok = await webdavService.testConnection();
    testing = false;
    if (ok) {
        notificationService.success("Connection successful!");
    } else {
        notificationService.error("Connection failed. Check your settings.");
    }
  }

  async function syncNow() {
      syncing = true;
      const ok = await webdavService.sync();
      syncing = false;
      if (ok) notificationService.success("Sync complete (Local -> Remote)");
      else notificationService.error("Sync failed.");
  }

  async function restoreNow() {
      if (confirm("This will overwrite local playlists with the remote backup. Continue?")) {
          syncing = true;
          const ok = await webdavService.downloadAndRestore();
          syncing = false;
          if (ok) {
              notificationService.success("Restore complete. Refreshing...");
              setTimeout(() => window.location.reload(), 1500);
          } else {
              notificationService.error("Restore failed.");
          }
      }
  }
</script>

<main>
  <h1>Cloud Sync Settings (WebDAV)</h1>
  <p class="subtitle">Keep your playlists synchronized across devices using your own server.</p>

  <div class="form">
    <section class="config-section">
        <h3>Connection Settings</h3>
        <label>
          Server URL
          <input type="text" bind:value={url} placeholder="https://example.com/webdav/" />
        </label>
        <label>
          Username
          <input type="text" bind:value={username} />
        </label>
        <label>
          Password
          <input type="password" bind:value={password} />
        </label>
    </section>

    <section class="config-section">
        <h3>Behavior</h3>
        <label class="checkbox-label">
            <input type="checkbox" bind:checked={enabled} />
            <span>Enable Cloud Sync</span>
        </label>
        <label class="checkbox-label">
            <input type="checkbox" bind:checked={autoSync} />
            <span>Auto-sync on changes (Upload)</span>
        </label>
    </section>

    <div class="btns">
        <button class="primary-btn" on:click={save}>Save Configuration</button>
        <button on:click={test} disabled={testing}>{testing ? 'Testing...' : 'Test Connection'}</button>
    </div>

    <hr />

    <section class="actions-section">
        <h3>Sync Actions</h3>
        <div class="action-grid">
            <div class="action-card">
                <h4>Manual Backup</h4>
                <p>Upload your current local data to the server immediately.</p>
                <button on:click={syncNow} disabled={syncing}>Upload Now</button>
            </div>
            <div class="action-card">
                <h4>Restore Data</h4>
                <p>Download your data from the server and replace local playlists.</p>
                <button on:click={restoreNow} disabled={syncing} class="danger-btn">Download & Restore</button>
            </div>
        </div>
    </section>
  </div>
</main>

<style>
  .subtitle {
      color: #666;
      margin-bottom: 2rem;
  }
  .form {
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .config-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
  }
  label {
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-weight: bold;
      font-size: 0.9rem;
  }
  .checkbox-label {
      flex-direction: row;
      align-items: center;
      gap: 10px;
  }
  .btns {
      display: flex;
      gap: 10px;
  }
  .action-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
  }
  .action-card {
      border: 1px solid var(--border-color);
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
  }
  .action-card h4 { margin: 0; }
  .action-card p { font-size: 0.85rem; color: #555; }

  button {
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 500;
  }
  .primary-btn {
      background: var(--sidebar-bg-color);
      color: white;
      border: none;
  }
  .danger-btn {
      background: #dc3545;
      color: white;
      border: none;
  }
</style>
