<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { storageService, notificationService, audioService } from "@yph/core";
  import {
    DeleteIcon,
    SaveIcon,
    TerminalIcon,
    PlusMultiple,
    InfoIcon,
    SuperButton,
    MergeIcon
  } from "@yph/ui-kit";
  import LibraryAuditor from "../components/LibraryAuditor.svelte";
  import InfrastructureMap from "../components/InfrastructureMap.svelte";
  import TopologyGraph from "../components/TopologyGraph.svelte";
  import ThemeArchitect from "../components/ThemeArchitect.svelte";
  import ImportWizard from "../components/ImportWizard.svelte";
  import SystemHealth from "../components/SystemHealth.svelte";
  import PortfolioExporter from "../components/PortfolioExporter.svelte";
  import SmartRules from "../components/SmartRules.svelte";
  import SectorDna from "../components/SectorDna.svelte";
  import BulkOperations from "../components/BulkOperations.svelte";
  import AIArchitect from "../components/AIArchitect.svelte";
  import NeoStressTest from "../components/NeoStressTest.svelte";
  import SystemHistory from "../components/SystemHistory.svelte";
  import RelinkWizard from "../components/RelinkWizard.svelte";
  import type { Playlist } from "@yph/core";

  let playlists = $state<Playlist[]>([]);
  let showImport = $state(false);
  let advancedMode = $state(false);
  let vizMode = $state<'map' | 'topology'>('map');

  onMount(async () => {
    playlists = await storageService.getPlaylists();
  });

  async function clearAll() {
      if (confirm("DANGER: This will decommission the entire infrastructure. Proceed?")) {
          for (const pl of playlists) await storageService.removePlaylist(pl);
          notificationService.success("Infrastructure purged.");
          audioService.playSignal('error');
          window.location.reload();
      }
  }
</script>

<div class="manage-view view-container" in:fade>
    <header class="view-header">
        <div class="header-content aura-glow">
            <div class="title-row">
                <div class="icon-blob"><TerminalIcon size="32" /></div>
                <h1>Intelligence Hub</h1>
            </div>
            <p class="muted">Monitor neural agents, infrastructure integrity, and visual protocols.</p>
        </div>
    </header>

    <div class="command-dashboard">
        <div class="dashboard-main">
            <!-- Level 1: Visualization & Triage -->
            <div class="dashboard-row">
                <div class="viz-widget-col">
                    <div class="visualization-container pro-glass">
                        <div class="viz-header">
                            <div class="viz-meta">
                                <MergeIcon size="16" color="var(--primary)" />
                                <span>NEURAL_MAPPING_ENGINE</span>
                            </div>
                            <div class="viz-switcher">
                                <button class:active={vizMode === 'map'} onclick={() => vizMode = 'map'}>Live Map</button>
                                <button class:active={vizMode === 'topology'} onclick={() => vizMode = 'topology'}>D3 Topology</button>
                            </div>
                        </div>
                        <div class="viz-content">
                            {#if vizMode === 'map'}
                                <div in:fade={{duration: 400}}><InfrastructureMap /></div>
                            {:else}
                                <div in:fade={{duration: 400}}><TopologyGraph /></div>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="relink-widget-col">
                    <RelinkWizard />
                </div>
            </div>

            <!-- Level 2: Analytics & Maintenance -->
            <div class="dashboard-grid-3 mt-8">
                <SectorDna {playlists} />
                <LibraryAuditor />
                <SystemHistory />
            </div>

            <!-- Level 3: Advanced Protocols -->
            <div class="mt-8">
                <SmartRules />
            </div>

            <div class="mt-8">
                <BulkOperations />
            </div>

            <div class="mt-8">
                <AIArchitect />
            </div>

            {#if advancedMode}
                <NeoStressTest />
            {/if}
        </div>

        <aside class="dashboard-sidebar">
            <SystemHealth />

            <div class="mt-8">
                <PortfolioExporter />
            </div>

            <div class="action-card pro-glass mt-8">
                <h3 class="card-title"><SaveIcon size="18" /> Core Protocols</h3>
                <div class="btns-stack mt-6">
                    <SuperButton primary onclick={() => showImport = true}>
                        <PlusMultiple size="18" /> Import Logic Snapshot
                    </SuperButton>
                    <SuperButton danger onclick={clearAll} class="mt-4">
                        <DeleteIcon size="18" /> Decommission System
                    </SuperButton>
                </div>
            </div>

            <ThemeArchitect />

            <div class="system-info pro-glass mt-8">
                <h3 class="card-title"><InfoIcon size="18" /> Infrastructure Core</h3>
                <div class="v-list mt-6">
                    <div class="v-row"><span>Pro Version</span> <span class="v-val">2.5.0 Elite</span></div>
                    <div class="v-row"><span>Storage Mode</span> <span class="v-val">IndexedDB / Vector-Enabled</span></div>
                    <div class="v-row"><span>Neural Agents</span> <span class="v-val">Protocol: HEARTBEAT Active</span></div>

                    {#if advancedMode}
                      <div in:fly={{ y: -10, duration: 300 }}>
                        <div class="v-row"><span>Data Density</span> <span class="v-val">SOTA (Vectorized)</span></div>
                        <div class="v-row"><span>E2EE Status</span> <span class="val success">Active</span></div>
                      </div>
                    {/if}

                    <button class="toggle-advanced" onclick={() => advancedMode = !advancedMode}>
                        {advancedMode ? 'Hide Detailed Params' : 'Show Advanced Params'}
                    </button>
                </div>
            </div>
        </aside>
    </div>
</div>

<ImportWizard bind:display={showImport} on:complete={() => window.location.reload()} />

<style>
    .view-header { margin-bottom: var(--space-12); }
    .header-content h1 { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.05em; }

    .command-dashboard { display: grid; grid-template-columns: 1fr 380px; gap: var(--space-10); margin-top: var(--space-8); }
    .dashboard-main { display: flex; flex-direction: column; }

    .dashboard-row { display: grid; grid-template-columns: 1fr 450px; gap: var(--space-8); }
    .dashboard-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-8); }

    .visualization-container { border: 1px solid var(--border-strong); border-radius: 32px; overflow: hidden; background: rgba(0,0,0,0.3); height: 100%; min-height: 500px; }
    .viz-header { padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.03); }
    .viz-meta { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 900; color: var(--text-dim); }
    .viz-switcher { display: flex; gap: 6px; background: var(--bg-secondary); padding: 4px; border-radius: 12px; border: 1px solid var(--border); }
    .viz-switcher button { background: transparent; border: none; color: var(--text-dim); padding: 8px 16px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
    .viz-switcher button.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }

    .pro-glass { padding: var(--space-8); border-radius: var(--radius-xl); }
    .card-title { margin: 0; font-weight: 800; display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-lg); color: var(--text); }
    .btns-stack { display: flex; flex-direction: column; gap: var(--space-3); }

    .v-list { display: flex; flex-direction: column; gap: var(--space-3); }
    .v-row { display: flex; justify-content: space-between; font-size: var(--font-sm); font-weight: 700; color: var(--text-muted); padding: var(--space-2) 0; border-bottom: 1px solid var(--border); }
    .v-row:last-child { border-bottom: none; }
    .v-val { color: var(--text); font-family: 'JetBrains Mono', monospace; font-weight: 800; }

    .toggle-advanced { margin-top: var(--space-2); font-size: var(--font-xs); font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; text-align: center; background: none; border: none; padding: var(--space-2); }
    .toggle-advanced:hover { opacity: 1; text-decoration: underline; }

    .mt-4 { margin-top: 1rem; }
    .mt-8 { margin-top: 2rem; }

    @media (max-width: 1600px) { .dashboard-row { grid-template-columns: 1fr; } .dashboard-grid-3 { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 1200px) { .command-dashboard { grid-template-columns: 1fr; } .dashboard-sidebar { order: -1; } .dashboard-grid-3 { grid-template-columns: 1fr; } }
</style>
