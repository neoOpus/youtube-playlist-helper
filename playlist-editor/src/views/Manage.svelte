<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faFileExport, faFileImport, faTriangleExclamation, faHistory, faCloud, faSave,
    faUser, faSignOutAlt, faKey, faCogs, faPlusCircle, faTerminal, faMagic, faRobot, faTrash
  } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import LibraryHeatmap from "../components/mega/LibraryHeatmap.svelte";
  import Sidebar from "../components/core/Sidebar.svelte";
  import SuperButton from "../components/ui/SuperButton.svelte";
  import SuperCheckbox from "../components/ui/SuperCheckbox.svelte";
  import SuperInput from "../components/ui/SuperInput.svelte";
  import Modal from "../components/ui/Modal.svelte";
  import type { Playlist, PlaylistExport, Settings } from "../types/model.js";
  import { syncService, type SyncConfig } from "../services/mega/sync-service";
  import { backupService } from "../services/mega/backup-service";
  import { supabaseService } from "../services/mega/supabase-service";
  import { archiveAgent, type ArchiveTask } from "../services/mega/archive-agent";
  import { actionService } from "../services/mega/action-service";
  import { aiService } from "../services/mega/ai-service";
  import { storage } from "../services/core/storage-service";
  import { soundService } from "../services/mega/sound-service";

  let playlists: (Playlist & { selected?: boolean })[] = [];
  let trashPlaylists: any[] = [];
  let backups: any[] = [];
  let syncConfig: SyncConfig = { enabled: false, type: "supabase" };
  let settings: Settings;
  let loading = true;
  let user: any = null;
  let archiveTasks: ArchiveTask[] = [];
  let soundsEnabled = false;

  let showActionModal = false;
  let newAction = { label: '', handlerStr: '', color: '#6f42c1' };
  let aiPrompt = "";
  let generatingCode = false;

  onMount(async () => {
    settings = await window.getSettings();
    await refreshData();
    if (supabaseService.isConfigured) {
        user = await supabaseService.getUser();
      archiveTasks = await archiveAgent.getTasks();
      soundsEnabled = await storage.get("ui_sounds_enabled", false);
    }
  });

  async function refreshData() {
    loading = true;
    playlists = await window.getPlaylists();
    trashPlaylists = await window.getTrash();
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

  async function generateAiAction() {
      if (!aiPrompt) return;
      generatingCode = true;
      try {
          const code = await aiService.generateActionHandler(aiPrompt);
          newAction.handlerStr = code;
          if (!newAction.label) newAction.label = aiPrompt.substring(0, 20);
          window.success("AI Agent has architected your action!");
      } finally {
          generatingCode = false;
      }
  }

  async function addCustomAction() {
      await actionService.registerAction({
          id: 'custom-' + Date.now(),
          label: newAction.label || 'Unnamed Action',
          icon: 'faBolt',
          color: newAction.color,
          scope: 'playlist',
          handlerStr: newAction.handlerStr
      });
      showActionModal = false;
      newAction = { label: '', handlerStr: '', color: '#6f42c1' };
      aiPrompt = "";
      window.success("Custom action registered to Marketplace");
  }

  async function restorePlaylist(id: string) {
      await window.restoreFromTrash(id);
      window.success("Playlist restored!");
      await refreshData();
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
            </div>
        </div>
    </section>

  <section class="mega-section">
      <LibraryHeatmap />
  </section>

    <!-- Action Marketplace Section -->
    <section class="card">
        <div class="card-header">
            <h2><Fa icon={faTerminal} /> Action Marketplace</h2>
            <SuperButton on:click={() => showActionModal = true} variant="primary">
                <Fa icon={faPlusCircle} /> Register Action
            </SuperButton>
        </div>
        <div class="card-content">
            <p>Register custom scripts and buttons to the global Action Hub.</p>
        </div>
    </section>

  <section class="mega-section">
      <LibraryHeatmap />
  </section>

    <!-- Trash Bin Section -->
    <section class="card">
        <div class="card-header">
            <h2><Fa icon={faTrash} /> Trash Bin</h2>
            <SuperButton variant="ghost" on:click={refreshData}>Refresh</SuperButton>
        </div>
        <div class="card-content">
            {#if trashPlaylists.length === 0}
                <p class="hint">Trash is empty.</p>
            {:else}
                <div class="backup-list">
                    {#each trashPlaylists as p}
                        <div class="backup-item">
                            <span class="label">{p.title}</span>
                            <button class="text-btn" on:click={() => restorePlaylist(p.id)}>Restore</button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </section>

  <section class="mega-section">
      <LibraryHeatmap />
  </section>

    <!-- Backups Section -->
    <section class="card">
      <div class="card-header">
        <h2><Fa icon={faHistory} /> Snapshots</h2>
        <SuperButton on:click={manualBackup} bgcolor="#28a745">New Backup</SuperButton>
      </div>
      <div class="backup-list">
          {#each backups.slice(0, 3) as backup}
            <div class="backup-item">
              <span>{new Date(backup.timestamp).toLocaleDateString()}</span>
              <button class="text-btn" on:click={() => backupService.restoreBackup(backup.key)}>Restore</button>
            </div>
          {/each}
      </div>
    </section>

  <section class="mega-section">
      <LibraryHeatmap />
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
                    <div class="user-details">
                        <img src={user.user_metadata?.avatar_url} alt="Avatar" class="avatar" />
                        <span class="email">{user.email}</span>
                    </div>
                    <SuperButton on:click={() => supabaseService.signOut()} variant="danger">Sign Out</SuperButton>
                </div>
            {/if}
        </div>
    </section>

  <section class="mega-section">
      <LibraryHeatmap />
  </section>

    <!-- Danger Zone -->
    <section class="card danger-card">
      <div class="card-header">
        <h2 class="danger-text"><Fa icon={faTriangleExclamation} /> Danger Zone</h2>
      </div>
      <div class="card-content">
        <SuperButton on:click={() => window.removeSavedPlaylists()} variant="danger" className="wide-btn">
          Wipe All Saved Data
        </SuperButton>
      </div>
    </section>

  <section class="mega-section">
      <LibraryHeatmap />
  </section>
  </div>

  <Modal bind:display={showActionModal}>
      <div class="action-form">
          <h3><Fa icon={faRobot} /> AI Action Architect</h3>

          <div class="ai-generator-box">
              <label for="ai-prompt">Describe your action (e.g. "Export to Notion")</label>
              <div class="prompt-input">
                  <input id="ai-prompt" bind:value={aiPrompt} placeholder="Type a prompt..." />
                  <SuperButton on:click={generateAiAction} loading={generatingCode} disabled={!aiPrompt} bgcolor="#6f42c1">
                      <Fa icon={faMagic} /> Generate
                  </SuperButton>
              </div>
          </div>

          <div class="divider"><span>OR CONFIGURE MANUALLY</span></div>

          <SuperInput label="Button Label" bind:value={newAction.label} placeholder="e.g. My Custom Tool" />

          <div class="form-group">
              <label for="action-handler">Handler Logic (JavaScript Code)</label>
              <textarea id="action-handler" bind:value={newAction.handlerStr} placeholder="const logic = context.videos..."></textarea>
          </div>

          <div class="modal-footer">
              <SuperButton on:click={addCustomAction} variant="primary" className="wide">
                  Register to Global Marketplace
              </SuperButton>
          </div>
      </div>
  </Modal>
  <section class="mega-section">
      <div class="section-header">
          <h2>Proactive Archiver Agent</h2>
          <SuperButton variant="secondary" size="sm" on:click={async () => { await archiveAgent.processQueue(); archiveTasks = await archiveAgent.getTasks(); }}>
              Run Archiver Now
          </SuperButton>
      </div>
      <div class="archive-list">
          {#each archiveTasks as task}
              <div class="archive-item status-{task.status}">
                  <span class="title">{task.title}</span>
                  <span class="status-badge">{task.status.toUpperCase()}</span>
              </div>
          {:else}
              <p class="empty-msg">No videos scheduled for archival.</p>
          {/each}
      </div>
  </section>

  <section class="mega-section">
      <div class="section-header">
          <h2>UI Experience</h2>
      </div>
      <div class="setting-row">
          <div class="text">
              <h3>System Audio Feedback</h3>
              <p>Subtle auditory cues for interface interactions.</p>
          </div>
          <SuperCheckbox checked={soundsEnabled} on:change={(e) => { soundsEnabled = e.detail; soundService.setEnabled(e.detail); }} />
      </div>
  </section>

</main>

<style>
  main { padding: 2rem 4rem; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
  header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem; }
  .subtitle { color: #888; font-size: 1.1rem; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  .card { background: white; border: 1px solid #eee; border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
  .wide-card { grid-column: span 2; }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
  .card-header h2 { margin: 0; font-size: 1.3rem; display: flex; align-items: center; gap: 0.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
  .form-group label { font-weight: bold; font-size: 0.8rem; color: #666; }
  select, textarea { padding: 12px; border: 1px solid #eee; border-radius: 12px; background: #f9f9f9; outline: none; transition: border-color 0.2s; }
  select:focus, textarea:focus { border-color: var(--sidebar-bg-color); }
  textarea { height: 120px; font-family: 'Fira Code', monospace; font-size: 0.85rem; }

  .user-profile { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 1rem; border-radius: 12px; width: 100%; }
  .user-details { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; }

  .ai-generator-box { background: #f3e5f5; padding: 1.5rem; border-radius: 16px; border: 1px solid #e1bee7; }
  .prompt-input { display: flex; gap: 10px; margin-top: 10px; }
  .prompt-input input { flex: 1; border: 1px solid #ce93d8; border-radius: 8px; padding: 0 12px; outline: none; }

  .divider { position: relative; text-align: center; margin: 1rem 0; border-bottom: 1px solid #eee; height: 10px; }
  .divider span { background: white; padding: 0 10px; font-size: 0.7rem; color: #aaa; font-weight: bold; }

  .backup-list { display: flex; flex-direction: column; gap: 8px; }
  .backup-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #fafafa; border-radius: 8px; }
  .text-btn { background: none; border: none; color: var(--sidebar-bg-color); cursor: pointer; font-weight: bold; }
  .label { font-size: 0.9rem; font-weight: 600; }
  .danger-text { color: #dc3545; }
  :global(.wide-btn) { width: 100%; }
  .action-form { min-width: 500px; display: flex; flex-direction: column; gap: 1.5rem; }
  :global(.wide) { width: 100%; }
  .archive-list { display: flex; flex-direction: column; gap: 8px; }
  .archive-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #cbd5e1; }
  .archive-item.status-archived { border-left-color: #10b981; }
  .archive-item.status-pending { border-left-color: #f59e0b; }
  .status-badge { font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: #e2e8f0; color: #475569; }
  .status-archived .status-badge { background: #d1fae5; color: #065f46; }

  .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
  .setting-row:last-child { border-bottom: none; }
  .setting-row h3 { margin: 0; font-size: 1rem; color: #1e293b; }
  .setting-row p { margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b; }

</style>
