<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faFileExport, faFileImport, faTriangleExclamation, faHistory, faCloud, faSave,
    faUser, faSignOutAlt, faKey, faCogs, faPlusCircle, faTerminal
  } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import Sidebar from "../components/core/Sidebar.svelte";
  import SuperButton from "../components/ui/SuperButton.svelte";
  import SuperCheckbox from "../components/ui/SuperCheckbox.svelte";
  import SuperInput from "../components/ui/SuperInput.svelte";
  import Modal from "../components/ui/Modal.svelte";
  import type { Playlist, PlaylistExport, Settings } from "../types/model.js";
  import { syncService, type SyncConfig } from "../services/mega/sync-service";
  import { backupService } from "../services/mega/backup-service";
  import { supabaseService } from "../services/mega/supabase-service";
  import { actionService } from "../services/mega/action-service";

  let playlists: (Playlist & { selected?: boolean })[] = [];
  let backups: any[] = [];
  let syncConfig: SyncConfig = { enabled: false, type: "supabase" };
  let settings: Settings;
  let loading = true;
  let user: any = null;

  let showActionModal = false;
  let newAction = { label: '', handlerStr: '', color: '#007bff' };

  onMount(async () => {
    settings = await window.getSettings();
    await refreshData();
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

  async function saveProjectSettings() {
      await window.storeObject('viewMode', settings.viewMode);
      window.success("Project settings saved.");
  }

  async function loginWithGoogle() {
      await supabaseService.signInWithGoogle();
  }

  async function addCustomAction() {
      await actionService.registerAction({
          id: 'custom-' + Date.now(),
          label: newAction.label,
          icon: 'faBolt',
          color: newAction.color,
          scope: 'playlist',
          handlerStr: newAction.handlerStr
      });
      showActionModal = false;
      newAction = { label: '', handlerStr: '', color: '#007bff' };
      window.success("Custom action registered to Marketplace");
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
    <h1><Fa icon={faCogs} /> System Management</h1>
    <p class="subtitle">Orchestrate your YouTube Companion ecosystem.</p>
  </header>

  <div class="grid">
    <!-- Project Mode Section -->
    <section class="card">
        <div class="card-header">
            <h2>Project Configuration</h2>
        </div>
        <div class="card-content">
            <div class="form-group">
                <label for="view-mode">Active Experience</label>
                <select id="view-mode" bind:value={settings.viewMode} on:change={saveProjectSettings}>
                    <option value="simple">Core (Lite Management)</option>
                    <option value="advanced">Mega (Power-User Dashboard)</option>
                </select>
                <p class="hint">Mega mode enables AI agents, logigrams, and advanced analytics.</p>
            </div>
        </div>
    </section>

    <!-- Action Marketplace Section -->
    <section class="card">
        <div class="card-header">
            <h2><Fa icon={faTerminal} /> Action Marketplace</h2>
            <SuperButton on:click={() => showActionModal = true} variant="ghost">
                <Fa icon={faPlusCircle} /> Register Action
            </SuperButton>
        </div>
        <div class="card-content">
            <p>Register custom scripts and buttons to the global Action Hub.</p>
        </div>
    </section>

    <!-- Supabase & Cloud Section -->
    <section class="card wide-card">
        <div class="card-header">
            <h2><Fa icon={faUser} /> Account & Cloud Sync</h2>
        </div>
        <div class="card-content">
            {#if !user}
                <div class="auth-box">
                    <p>Connect to Supabase for real-time synchronization and backup.</p>
                    <SuperButton on:click={loginWithGoogle} bgcolor="#4285F4">Sign in with Google</SuperButton>
                </div>
            {:else}
                <div class="user-profile">
                    <span class="email">{user.email}</span>
                    <SuperButton on:click={() => supabaseService.signOut()} variant="danger">Sign Out</SuperButton>
                </div>
            {/if}
        </div>
    </section>

    <!-- Backups Section -->
    <section class="card">
      <div class="card-header">
        <h2><Fa icon={faHistory} /> Snapshots</h2>
        <SuperButton on:click={manualBackup} bgcolor="#28a745">New Backup</SuperButton>
      </div>
      <div class="backup-list">
          {#each backups.slice(0, 5) as backup}
            <div class="backup-item">
              <span>{new Date(backup.timestamp).toLocaleDateString()}</span>
              <button class="text-btn" on:click={() => backupService.restoreBackup(backup.key)}>Restore</button>
            </div>
          {/each}
      </div>
    </section>

    <!-- Danger Zone -->
    <section class="card danger-card">
      <div class="card-header">
        <h2 class="danger-text"><Fa icon={faTriangleExclamation} /> Danger Zone</h2>
      </div>
      <div class="card-content">
        <SuperButton on:click={() => window.removeSavedPlaylists()} bgcolor="#dc3545" className="wide-btn">
          Wipe All Saved Data
        </SuperButton>
      </div>
    </section>
  </div>

  <Modal bind:display={showActionModal}>
      <div class="action-form">
          <h3>Register New Action</h3>
          <SuperInput label="Button Label" bind:value={newAction.label} placeholder="e.g. Export to Notion" />
          <div class="form-group">
              <label for="action-handler">Handler Logic (JavaScript)</label>
              <textarea id="action-handler" bind:value={newAction.handlerStr} placeholder="const logic = context.videos..."></textarea>
          </div>
          <div class="modal-footer">
              <SuperButton on:click={addCustomAction} variant="primary">Add to Marketplace</SuperButton>
          </div>
      </div>
  </Modal>
</main>

<style>
  main { padding: 2rem 4rem; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
  header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem; }
  .subtitle { color: #888; font-size: 1.1rem; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  .card { background: white; border: 1px solid #eee; border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
  .wide-card { grid-column: span 2; }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
  .card-header h2 { margin: 0; font-size: 1.3rem; display: flex; align-items: center; gap: 0.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
  .form-group label { font-weight: bold; font-size: 0.8rem; color: #666; }
  select, textarea { padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9; outline: none; }
  textarea { height: 120px; font-family: monospace; }
  .hint { font-size: 0.8rem; color: #999; }
  .backup-list { display: flex; flex-direction: column; gap: 8px; }
  .backup-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #fafafa; border-radius: 8px; }
  .text-btn { background: none; border: none; color: var(--sidebar-bg-color); cursor: pointer; font-weight: bold; }
  .danger-text { color: #dc3545; }
  :global(.wide-btn) { width: 100%; }
  .action-form { min-width: 400px; display: flex; flex-direction: column; gap: 1.5rem; }
</style>
