<script lang="ts">
  import { storage } from '../services/core/storage-service';
  import Fa from "svelte-fa";
  import {
    faFileExport, faFileImport, faTriangleExclamation, faHistory, faCloud, faSave,
    faUser, faSignOutAlt, faKey, faCogs, faPlusCircle, faTerminal, faMagic, faRobot, faTrash
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
  import { aiService } from "../services/mega/ai-service";

  let playlists: (Playlist & { selected?: boolean })[] = [];
  let trashPlaylists: any[] = [];
  let backups: any[] = [];
  let syncConfig: SyncConfig = { enabled: false, type: "supabase" };
  let settings: Settings;
  let loading = true;
  let user: any = null;

  let showActionModal = false;
  let newAction = { label: '', handlerStr: '', color: '#6f42c1' };
  let aiPrompt = "";
  let generatingCode = false;

  onMount(async () => {
    settings = await storage.getSettings();
    await refreshData();
    if (supabaseService.isConfigured) {
        user = await supabaseService.getUser();
    }
  });

  async function refreshData() {
    loading = true;
    playlists = await storage.getPlaylists();
    trashPlaylists = await storage.getTrash();
    backups = await backupService.getBackups();
    syncConfig = await syncService.getSyncConfig();
    loading = false;
  }

  async function saveProjectSettings() {
      await storage.set('viewMode', settings.viewMode);
      await storage.set('privacyMode', settings.privacyMode);
      window.success("Preferences synchronized.");
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
      await storage.restoreFromTrash(id);
      window.success("Playlist restored!");
      await refreshData();
  }

  async function manualBackup() {
    await backupService.performAutoBackup();
    window.success("Manual backup created");
    await refreshData();
  }
</script>

<Sidebar />

<main>
  <header>
    <h1><Fa icon={faCogs} /> System Management</h1>
    <p class="subtitle">Orchestrate your YouTube Companion ecosystem.</p>
  </header>

  <div class="grid">
    <section class="card">
        <div class="card-header">
            <h2>Project Configuration</h2>
        </div>
        <div class="card-content">
            <div class="form-group">
                <label for="view-mode">Experience Mode</label>
                <select id="view-mode" bind:value={settings.viewMode} on:change={saveProjectSettings}>
                    <option value="simple">Core (Standard Management)</option>
                    <option value="advanced">Mega (Intelligent Dashboard)</option>
                </select>
            </div>
            <div class="form-group">
                <SuperCheckbox bind:checked={settings.privacyMode} on:change={saveProjectSettings} label="Stealth Mode (Blur metadata)" />
            </div>
        </div>
    </section>

    <section class="card">
        <div class="card-header">
            <h2><Fa icon={faTerminal} /> Action Marketplace</h2>
            <SuperButton on:click={() => showActionModal = true} variant="primary">
                <Fa icon={faPlusCircle} /> New Action
            </SuperButton>
        </div>
        <div class="card-content">
            <p class="hint">Extend the dashboard with custom logic or AI-generated scripts.</p>
        </div>
    </section>

    <section class="card wide-card">
        <div class="card-header">
            <h2><Fa icon={faUser} /> Cloud Sync (Supabase)</h2>
        </div>
        <div class="card-content">
            {#if !user}
                <div class="auth-box">
                    <p>Unlock real-time synchronization across all your devices.</p>
                    <SuperButton on:click={loginWithGoogle} bgcolor="#4285F4">Connect Google Account</SuperButton>
                </div>
            {:else}
                <div class="user-profile">
                    <div class="user-details">
                        <img src={user.user_metadata?.avatar_url} alt="Avatar" class="avatar" />
                        <span class="email">{user.email}</span>
                    </div>
                    <SuperButton on:click={() => supabaseService.signOut()} variant="danger">Disconnect</SuperButton>
                </div>
            {/if}
        </div>
    </section>

    <section class="card">
        <div class="card-header">
            <h2><Fa icon={faTrash} /> Trash Bin</h2>
            <SuperButton variant="ghost" on:click={refreshData}>Refresh</SuperButton>
        </div>
        <div class="card-content">
            {#if trashPlaylists.length === 0}
                <p class="hint">No items in trash.</p>
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

    <section class="card">
      <div class="card-header">
        <h2><Fa icon={faHistory} /> Local Backups</h2>
        <SuperButton on:click={manualBackup} bgcolor="#28a745">Snapshot</SuperButton>
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

    <section class="card danger-card">
      <div class="card-header">
        <h2 class="danger-text"><Fa icon={faTriangleExclamation} /> Danger Zone</h2>
      </div>
      <div class="card-content">
        <SuperButton on:click={() => window.removeSavedPlaylists()} variant="danger" className="wide-btn">
          Purge All Data
        </SuperButton>
      </div>
    </section>
  </div>

  <Modal bind:display={showActionModal}>
      <div class="action-form">
          <h3><Fa icon={faRobot} /> AI Action Architect</h3>
          <div class="ai-generator-box">
              <label for="ai-prompt">Describe your action</label>
              <div class="prompt-input">
                  <input id="ai-prompt" bind:value={aiPrompt} placeholder="e.g. Export to Notion..." />
                  <SuperButton on:click={generateAiAction} loading={generatingCode} disabled={!aiPrompt} bgcolor="#6f42c1">
                      Architect
                  </SuperButton>
              </div>
          </div>
          <div class="divider"><span>MANUAL OVERRIDE</span></div>
          <SuperInput label="Action Label" bind:value={newAction.label} />
          <div class="form-group">
              <label for="action-handler">JavaScript Handler</label>
              <textarea id="action-handler" bind:value={newAction.handlerStr}></textarea>
          </div>
          <SuperButton on:click={addCustomAction} variant="primary" className="wide">Deploy to Hub</SuperButton>
      </div>
  </Modal>
</main>

<style>
  main { padding: 2rem 4rem; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
  header h1 { font-size: 2.2rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem; }
  .subtitle { color: #888; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  .card { background: white; border: 1px solid #eee; border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
  .wide-card { grid-column: span 2; }
  .card-header h2 { margin: 0; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
  .form-group label { font-weight: bold; font-size: 0.75rem; color: #999; text-transform: uppercase; }
  select, textarea { padding: 12px; border: 1px solid #eee; border-radius: 10px; background: #fafafa; outline: none; }
  textarea { height: 100px; font-family: 'Fira Code', monospace; font-size: 0.8rem; }
  .user-profile { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 1rem; border-radius: 12px; width: 100%; }
  .user-details { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; }
  .ai-generator-box { background: #f3e5f5; padding: 1rem; border-radius: 12px; border: 1px solid #e1bee7; }
  .prompt-input { display: flex; gap: 10px; margin-top: 8px; }
  .prompt-input input { flex: 1; border: 1px solid #ce93d8; border-radius: 8px; padding: 0 10px; }
  .divider { text-align: center; margin: 1rem 0; border-bottom: 1px solid #eee; height: 8px; }
  .divider span { background: white; padding: 0 10px; font-size: 0.6rem; color: #ccc; }
  .backup-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #fafafa; border-radius: 8px; }
  .text-btn { background: none; border: none; color: var(--sidebar-bg-color); cursor: pointer; font-weight: bold; }
  .hint { color: #aaa; font-size: 0.85rem; font-style: italic; }
  :global(.wide-btn) { width: 100%; }
</style>
