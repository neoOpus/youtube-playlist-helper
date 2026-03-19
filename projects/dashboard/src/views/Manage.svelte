<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { storageService, notificationService, actionLogger } from "@yph/core";
  import {
    DeleteIcon,
    SaveIcon,
    TerminalIcon,
    PlusMultiple,
    CheckIcon,
    InfoIcon
  } from "@yph/ui-kit";
  import LibraryAuditor from "../components/LibraryAuditor.svelte";
  import NeuralMap from "../components/NeuralMap.svelte";
  import ThemeArchitect from "../components/ThemeArchitect.svelte";
  import ImportWizard from "../components/ImportWizard.svelte";

  let showImport = false;

  async function exportData() {
      const playlists = await storageService.getPlaylists();
      const blob = new Blob([JSON.stringify(playlists, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `yph-infrastructure-export-${Date.now()}.json`;
      a.click();
      notificationService.success("Infrastructure snapshot exported.");
  }

  async function clearAll() {
      if (confirm("DANGER: This will decommission the entire infrastructure. Proceed?")) {
          const playlists = await storageService.getPlaylists();
          for (const pl of playlists) await storageService.removePlaylist(pl);
          notificationService.success("Infrastructure purged.");
          window.location.reload();
      }
  }
</script>

<div class="manage-view view-container" in:fade>
    <header class="view-header">
        <div class="header-content aura-glow">
            <div class="title-row">
                <div class="icon-blob"><TerminalIcon size="32" /></div>
                <h1>System Management</h1>
            </div>
            <p class="muted">Oversee neural connections, library quality, and global aesthetics.</p>
        </div>
    </header>

    <div class="manage-grid">
        <div class="main-stats">
            <div class="stat-card">
                <NeuralMap />
            </div>
            <div class="stat-card">
                <LibraryAuditor />
            </div>
        </div>

        <aside class="actions-sidebar">
            <div class="action-card pro-glass">
                <h3 class="card-title"><SaveIcon size="18" /> Data Governance</h3>
                <div class="btns-stack mt-6">
                    <button class="action-btn" on:click={() => showImport = true}>
                        <PlusMultiple size="18" /> Import Logic Snapshot
                    </button>
                    <button class="action-btn" on:click={exportData}>
                        <SaveIcon size="18" /> Export Global Map (JSON)
                    </button>
                    <button class="action-btn danger-btn" on:click={clearAll}>
                        <DeleteIcon size="18" /> Decommission System
                    </button>
                </div>
            </div>

            <ThemeArchitect />

            <div class="system-info pro-glass mt-8">
                <h3 class="card-title"><InfoIcon size="18" /> Infrastructure Core</h3>
                <div class="v-list mt-6">
                    <div class="v-row"><span>SOTA Version</span> <span class="v-val">2.2 Quantum</span></div>
                    <div class="v-row"><span>Storage Mode</span> <span class="v-val">IndexedDB / Persistent</span></div>
                    <div class="v-row"><span>AI Engine</span> <span class="v-val">Local Heuristics (Ready)</span></div>
                </div>
            </div>
        </aside>
    </div>
</div>

<ImportWizard bind:display={showImport} on:complete={() => window.location.reload()} />

<style>
    .view-container {
      padding: var(--space-12) var(--space-8);
      max-width: 1600px;
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

    .manage-grid {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: var(--space-12);
        margin-top: var(--space-8);
    }

    .main-stats { display: flex; flex-direction: column; gap: var(--space-8); }

    .stat-card {
        transition: transform 0.3s var(--easing-standard);
    }
    .stat-card:hover {
        transform: translateY(-4px);
    }

    .pro-glass {
        padding: var(--space-8);
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

    .btns-stack { display: flex; flex-direction: column; gap: var(--space-3); }

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

    .action-btn:hover {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 32px rgba(var(--primary-rgb), 0.3);
    }

    .danger-btn {
        color: var(--danger);
        border-color: rgba(239, 68, 68, 0.2);
        margin-top: var(--space-4);
    }

    .danger-btn:hover {
        background: var(--danger);
        color: white;
        border-color: var(--danger);
        box-shadow: 0 12px 32px rgba(239, 68, 68, 0.3);
    }

    .v-list { display: flex; flex-direction: column; gap: var(--space-3); }
    .v-row {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-sm);
        font-weight: 700;
        color: var(--text-muted);
        padding: var(--space-2) 0;
        border-bottom: 1px solid var(--border);
    }
    .v-row:last-child { border-bottom: none; }
    .v-val { color: var(--text); font-family: 'JetBrains Mono', monospace; font-weight: 800; }

    .mt-6 { margin-top: var(--space-6); }
    .mt-8 { margin-top: var(--space-8); }

    @media (max-width: 1200px) {
        .manage-grid { grid-template-columns: 1fr; }
        .actions-sidebar { order: -1; }
        .view-container { padding: var(--space-8) var(--space-4); }
    }
</style>
