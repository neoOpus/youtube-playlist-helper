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
    InfoIcon,
    CloudSyncIcon
  } from "@yph/ui-kit";
  import LibraryAuditor from "../components/LibraryAuditor.svelte";
  import NeuralMap from "../components/NeuralMap.svelte";
  import ThemeArchitect from "../components/ThemeArchitect.svelte";
  import ImportWizard from "../components/ImportWizard.svelte";
  import QuickActions from "../components/QuickActions.svelte";
  import BookmarkImporter from "../components/BookmarkImporter.svelte";

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

<div class="manage-view p-8" in:fade>
    <header class="mb-12">
        <h1 class="row items-center gap-4">
            <div class="icon-blob"><TerminalIcon size="32" /></div>
            <span>System Management Hub</span>
        </h1>
        <p class="muted mt-2">Oversee neural connections, library quality, and global aesthetics.</p>
    </header>

    <div class="manage-grid">
        <div class="main-stats">
            <div class="pro-glass p-6 mb-8">
                <h3><TerminalIcon size="18" /> Quick Neural Actions</h3>
                <QuickActions />
            </div>

            <div class="pro-glass p-6 mb-8">
                <h3><CloudSyncIcon size="18" /> Neural Bookmark Ingestion</h3>
                <p class="muted mb-4">Automatically detect and import YouTube video folders from your browser bookmarks.</p>
                <BookmarkImporter />
            </div>

            <NeuralMap />
            <LibraryAuditor />
        </div>

        <aside class="actions-sidebar">
            <div class="action-section pro-glass p-6">
                <h3><SaveIcon size="18" /> Data Governance</h3>
                <div class="btns-stack mt-6">
                    <button class="btn secondary w-full" onclick={() => showImport = true}>
                        <PlusMultiple size="18" /> Import Logic Snapshot
                    </button>
                    <button class="btn secondary w-full" onclick={exportData}>
                        <SaveIcon size="18" /> Export Global Map (JSON)
                    </button>
                    <button class="btn danger-outline w-full mt-4" onclick={clearAll}>
                        <DeleteIcon size="18" /> Decommission System
                    </button>
                </div>
            </div>

            <ThemeArchitect />

            <div class="system-info pro-glass p-6 mt-8">
                <h3><InfoIcon size="18" /> Infrastructure Core</h3>
                <div class="v-list mt-4">
                    <div class="v-row"><span>SOTA Version</span> <span class="v-val">3.0.0-alpha (V3)</span></div>
                    <div class="v-row"><span>Storage Mode</span> <span class="v-val">IndexedDB / Persistent</span></div>
                    <div class="v-row"><span>AI Engine</span> <span class="v-val">Local Heuristics (Ready)</span></div>
                </div>
            </div>
        </aside>
    </div>
</div>

<ImportWizard bind:display={showImport} on:complete={() => window.location.reload()} />

<style>
    .manage-view { max-width: 1400px; margin: 0 auto; }
    h1 { font-weight: 900; letter-spacing: -2px; font-size: 3rem; margin: 0; }

    .icon-blob { background: var(--primary); color: white; padding: 12px; border-radius: 18px; box-shadow: 0 8px 24px rgba(255, 82, 82, 0.3); }

    .manage-grid { display: grid; grid-template-columns: 1fr 350px; gap: 3rem; margin-top: 2rem; }

    .main-stats { display: flex; flex-direction: column; gap: 1rem; }

    .pro-glass { background: var(--card-bg-alpha, rgba(20, 25, 35, 0.6)); backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 24px; }
    h3 { margin: 0; font-weight: 800; display: flex; align-items: center; gap: 10px; font-size: 1.1rem; }

    .btns-stack { display: flex; flex-direction: column; gap: 12px; }
    .btn { padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--text); background: var(--hover); }
    .btn:hover { background: var(--primary); color: white; border-color: var(--primary); transform: translateY(-2px); }
    .btn.danger-outline { color: #dc3545; border-color: rgba(220, 53, 69, 0.3); }
    .btn.danger-outline:hover { background: #dc3545; color: white; }

    .v-list { display: flex; flex-direction: column; gap: 8px; }
    .v-row { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
    .v-val { color: var(--text); font-family: 'JetBrains Mono'; }

    .row { display: flex; }
    .items-center { align-items: center; }
    .gap-4 { gap: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-12 { margin-bottom: 3rem; }
    .p-3 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    .w-full { width: 100%; }

    @media (max-width: 1100px) { .manage-grid { grid-template-columns: 1fr; } .actions-sidebar { order: -1; } }
</style>
