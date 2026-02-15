<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faFileExport,
    faFileImport,
    faTriangleExclamation,
    faHistory,
    faCloud,
    faSave,
    faUser,
    faSignOutAlt,
    faKey
  } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import Sidebar from "../components/core/Sidebar.svelte";
  import SuperButton from "../components/ui/SuperButton.svelte";
  import SuperCheckbox from "../components/ui/SuperCheckbox.svelte";
  import Modal from "../components/ui/Modal.svelte";
  import type { Playlist, PlaylistExport } from "../types/model.js";
  import { syncService, type SyncConfig } from "../services/mega/sync-service";
  import { backupService } from "../services/mega/backup-service";
  import { supabaseService } from "../services/mega/supabase-service";

  let playlists: (Playlist & { selected?: boolean })[] = [];
  let backups: any[] = [];
  let syncConfig: SyncConfig = { enabled: false, type: "webdav" };
  let syncing = false;
  let loading = true;

  let supabaseUrl = "";
  let supabaseAnonKey = "";
  let user: any = null;

  let importPreviewModal = false;
  let playlistsToImport: PlaylistExport[] = [];

  onMount(async () => {
    await refreshData();
    supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || await window.fetchObject("supabase_url", "");
    supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || await window.fetchObject("supabase_key", "");
    if (supabaseService.isConfigured) {
        user = await supabaseService.getUser();
    }
  });

  async function refreshData() {
    loading = true;
    playlists = await window.getPlaylists();
    backups = await backupService.getBackups();
    syncConfig = await syncService.getSyncConfig();
    loading = false;
  }

  async function saveSupabaseConfig() {
    await window.storeObject("supabase_url", supabaseUrl);
    await window.storeObject("supabase_key", supabaseAnonKey);
    window.success("Supabase configuration saved. Please reload to apply.");
  }

  async function loginWithGoogle() {
    try {
        await supabaseService.signInWithGoogle();
    } catch (e) {
        window.error("Login failed: " + e.message);
    }
  }

  async function logout() {
    await supabaseService.signOut();
    user = null;
    window.success("Signed out");
  }

  async function saveSync() {
    await syncService.saveSyncConfig(syncConfig);
    window.success("Sync settings saved");
  }

  async function syncNow() {
    syncing = true;
    try {
      await syncService.syncNow();
      window.success("Data pushed to cloud");
      await refreshData();
    } catch (e) {
      window.error(e.message);
    } finally {
      syncing = false;
    }
  }

  async function pullFromCloud() {
    if (confirm("This will overwrite local data with cloud data for conflicting items. Continue?")) {
      syncing = true;
      try {
        await syncService.pullFromCloud();
        window.success("Data pulled from cloud and merged");
        await refreshData();
      } catch (e) {
        window.error(e.message);
      } finally {
        syncing = false;
      }
    }
  }

  async function supabaseSync() {
      if (!supabaseService.isConfigured || !user) {
          window.error("Supabase not configured or not logged in");
          return;
      }
      syncing = true;
      try {
          await supabaseService.syncPlaylists(playlists);
          window.success("Synced with Supabase Cloud");
      } catch (e) {
          window.error("Supabase sync failed: " + e.message);
      } finally {
          syncing = false;
      }
  }

  function exportFile(content: string, filename?: string) {
    const textToSaveAsBlob = new Blob([content], { type: "application/json" });
    const textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    const downloadLink = document.createElement("a");
    downloadLink.download = filename || "export.json";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = () => downloadLink.remove();
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  async function exportSelected() {
    const selected = playlists.filter(p => p.selected);
    if (selected.length === 0) {
      window.info("Please select at least one playlist to export");
      return;
    }
    const exports: PlaylistExport[] = selected.map(({ title, videos, timestamp }) => ({
      title,
      videos,
      timestamp,
    }));
    exportFile(JSON.stringify(exports), `playlists-export-${new Date().toISOString().split('T')[0]}.json`);
  }

  async function handleImportClick() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (re) => {
        try {
          playlistsToImport = JSON.parse(re.target.result as string);
          importPreviewModal = true;
        } catch (err) {
          window.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  }

  async function confirmImport() {
    await window.importPlaylists(playlistsToImport);
    importPreviewModal = false;
    window.success(`Successfully imported ${playlistsToImport.length} playlists`);
    await refreshData();
  }

  async function restoreBackup(key: string) {
    if (confirm("This will merge backup playlists with your current ones. Continue?")) {
      await backupService.restoreBackup(key);
      window.success("Backup restored");
      await refreshData();
    }
  }

  async function deleteBackup(key: string) {
    if (confirm("Delete this backup?")) {
      await backupService.deleteBackup(key);
      await refreshData();
    }
  }

  async function removeAllPlaylists() {
    if (confirm("ALL saved playlists will be permanently deleted. This cannot be undone unless you have a backup. Continue?")) {
      await window.removeSavedPlaylists();
      window.success("All playlists removed");
      await refreshData();
    }
  }

  async function manualBackup() {
    await backupService.performAutoBackup();
    window.success("Manual backup created");
    await refreshData();
  }

  function toggleAll(checked: boolean) {
    playlists = playlists.map(p => ({ ...p, selected: checked }));
  }

  $: allSelected = playlists.length > 0 && playlists.every(p => p.selected);
</script>

<Sidebar />

<main>
  <header>
    <h1>Import / Export Hub</h1>
    <p class="subtitle">Manage your data, cloud sync, and backups with precision.</p>
  </header>

  <div class="grid">
    <!-- Supabase & Google Section -->
    <section class="card supabase-card">
        <div class="card-header">
            <h2><Fa icon={faUser} /> Account & Cloud</h2>
        </div>
        <div class="card-content">
            {#if !user}
                <p>Connect your Google account for seamless cross-device synchronization.</p>
                <div class="supabase-setup">
                    <div class="form-group">
                        <label for="supabase-url">Supabase URL</label>
                        <input id="supabase-url" type="text" placeholder="https://your-project.supabase.co" bind:value={supabaseUrl} />
                    </div>
                    <div class="form-group">
                        <label for="supabase-key">Supabase Anon Key</label>
                        <input id="supabase-key" type="password" placeholder="your-anon-key" bind:value={supabaseAnonKey} />
                    </div>
                    <SuperButton on:click={saveSupabaseConfig}><Fa icon={faSave} /> Save Configuration</SuperButton>
                </div>
                <hr />
                <SuperButton on:click={loginWithGoogle} className="google-btn" bgcolor="#4285F4">
                    Connect with Google
                </SuperButton>
            {:else}
                <div class="user-info">
                    <div class="avatar">
                        {#if user.user_metadata?.avatar_url}
                            <img src={user.user_metadata.avatar_url} alt="Avatar" />
                        {:else}
                            <Fa icon={faUser} />
                        {/if}
                    </div>
                    <div class="details">
                        <span class="name">{user.user_metadata?.full_name || user.email}</span>
                        <span class="email">{user.email}</span>
                    </div>
                    <SuperButton on:click={logout} bgcolor="#dc3545" title="Sign Out">
                        <Fa icon={faSignOutAlt} />
                    </SuperButton>
                </div>
                <div class="supabase-actions">
                    <SuperButton on:click={supabaseSync} bgcolor="#28a745" disabled={syncing}>
                        {syncing ? 'Syncing...' : 'Sync Now (Supabase)'}
                    </SuperButton>
                </div>
            {/if}
        </div>
    </section>

    <!-- Playlists Section -->
    <section class="card playlists-card">
      <div class="card-header">
        <h2>Saved Playlists</h2>
        <div class="card-actions">
           <SuperButton on:click={exportSelected} disabled={!playlists.some(p => p.selected)}>
             <Fa icon={faFileExport} /> Export Selected
           </SuperButton>
           <SuperButton on:click={handleImportClick} bgcolor="var(--sidebar-bg-color)">
             <Fa icon={faFileImport} /> Import
           </SuperButton>
        </div>
      </div>

      <div class="playlist-list-container">
        {#if loading}
          <p>Loading playlists...</p>
        {:else if playlists.length === 0}
          <p class="empty-msg">No saved playlists found.</p>
        {:else}
          <div class="list-header">
            <SuperCheckbox checked={allSelected} on:change={(e) => toggleAll(e.detail.checked)} label="Select All" />
            <span>Title</span>
            <span>Videos</span>
          </div>
          <div class="list-body">
            {#each playlists as playlist}
              <div class="list-item" class:selected={playlist.selected}>
                <SuperCheckbox bind:checked={playlist.selected} />
                <span class="title">{playlist.title}</span>
                <span class="count">{playlist.videos.length}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>

    <!-- Cloud Sync Section (WebDAV) -->
    <section class="card sync-card">
      <div class="card-header">
        <h2><Fa icon={faCloud} /> WebDAV Sync (Legacy)</h2>
      </div>
      <div class="card-content">
        <label class="toggle-label">
          <input type="checkbox" bind:checked={syncConfig.enabled} /> Enable WebDAV Synchronization
        </label>

        {#if syncConfig.enabled}
          <div class="form-group">
            <input type="text" placeholder="WebDAV Server URL" bind:value={syncConfig.url} />
            <input type="text" placeholder="Username" bind:value={syncConfig.username} />
            <input type="password" placeholder="Password" bind:value={syncConfig.password} />
          </div>
        {/if}

        <div class="sync-footer">
          <SuperButton on:click={saveSync}><Fa icon={faSave} /> Save Settings</SuperButton>
          <SuperButton on:click={syncNow} disabled={syncing || !syncConfig.enabled} bgcolor="#6c757d" title="Upload to Cloud">
            {syncing ? 'Pushing...' : 'Push to Cloud'}
          </SuperButton>
          <SuperButton on:click={pullFromCloud} disabled={syncing || !syncConfig.enabled} bgcolor="#6c757d" title="Download from Cloud">
            {syncing ? 'Pulling...' : 'Pull from Cloud'}
          </SuperButton>
        </div>
      </div>
    </section>

    <!-- Backups Section -->
    <section class="card backup-card">
      <div class="card-header">
        <h2><Fa icon={faHistory} /> Local Backups</h2>
        <SuperButton on:click={manualBackup} bgcolor="#28a745">Create Snapshot</SuperButton>
      </div>
      <div class="backup-list">
        {#if backups.length === 0}
          <p class="empty-msg">No backups available.</p>
        {:else}
          {#each backups as backup}
            <div class="backup-item">
              <div class="backup-info">
                <span class="date">{new Date(backup.timestamp).toLocaleString()}</span>
                <span class="details">{backup.playlists.length} playlists</span>
              </div>
              <div class="backup-actions">
                <button class="text-btn restore" on:click={() => restoreBackup(backup.key)}>Restore</button>
                <button class="text-btn delete" on:click={() => deleteBackup(backup.key)}>Delete</button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </section>

    <!-- Danger Zone -->
    <section class="card danger-card">
      <div class="card-header">
        <h2 class="danger-text"><Fa icon={faTriangleExclamation} /> Danger Zone</h2>
      </div>
      <div class="card-content">
        <p>Permanently remove all your saved data from this device.</p>
        <SuperButton on:click={removeAllPlaylists} bgcolor="#dc3545" className="wide-btn">
          Delete All Saved Playlists
        </SuperButton>
      </div>
    </section>
  </div>

  <Modal bind:display={importPreviewModal}>
    <div class="import-preview">
      <h3>Import Preview</h3>
      <p>The following {playlistsToImport.length} playlists will be imported:</p>
      <div class="preview-list">
        {#each playlistsToImport as p}
          <div class="preview-item">
            <strong>{p.title}</strong> ({p.videos.length} videos)
          </div>
        {/each}
      </div>
      <div class="modal-actions">
        <SuperButton on:click={confirmImport} bgcolor="#28a745">Confirm Import</SuperButton>
        <SuperButton on:click={() => importPreviewModal = false} bgcolor="#6c757d">Cancel</SuperButton>
      </div>
    </div>
  </Modal>
</main>

<style>
  main {
    padding: 2rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #888;
    font-size: 1.1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .card {
    background: var(--card-bg, #fff);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header h2 {
    margin: 0;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .playlists-card {
    grid-column: span 2;
  }

  .supabase-card {
      grid-column: span 2;
  }

  .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(0,0,0,0.05);
      border-radius: 8px;
  }

  .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
  }

  .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }

  .details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
  }

  .name { font-weight: bold; }
  .email { font-size: 0.85rem; color: #666; }

  .supabase-setup {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-group label {
      font-size: 0.8rem;
      font-weight: bold;
      color: #666;
  }

  .form-group input {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: transparent;
    color: inherit;
  }

  .card-actions {
    display: flex;
    gap: 10px;
  }

  .playlist-list-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 8px;
  }

  .list-header {
    display: grid;
    grid-template-columns: 50px 1fr 100px;
    padding: 10px;
    background: rgba(0,0,0,0.05);
    font-weight: bold;
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .list-body .list-item {
    display: grid;
    grid-template-columns: 50px 1fr 100px;
    padding: 10px;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.2s;
  }

  .list-item:hover {
    background: rgba(0,0,0,0.02);
  }

  .list-item.selected {
    background: rgba(var(--sidebar-bg-rgb), 0.05);
  }

  .empty-msg {
    text-align: center;
    color: #888;
    padding: 2rem;
  }

  .sync-footer {
    display: flex;
    gap: 1rem;
    margin-top: auto;
  }

  .backup-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .backup-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
  }

  .backup-info {
    display: flex;
    flex-direction: column;
  }

  .date {
    font-weight: bold;
  }

  .details {
    font-size: 0.85rem;
    color: #888;
  }

  .backup-actions {
    display: flex;
    gap: 10px;
  }

  .text-btn {
    background: none;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 4px;
  }

  .restore { color: #28a745; }
  .restore:hover { background: rgba(40, 167, 69, 0.1); }
  .delete { color: #dc3545; }
  .delete:hover { background: rgba(220, 53, 69, 0.1); }

  .danger-text { color: #dc3545; }

  :global(.wide-btn) { width: 100%; }

  :global(.google-btn) { width: 100%; margin-top: 1rem; }

  .import-preview {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 400px;
  }

  .preview-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    padding: 10px;
    border-radius: 8px;
  }

  .preview-item {
    padding: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
</style>
