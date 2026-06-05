<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import PlaylistEditor from "../components/PlaylistEditor.svelte";
  import { Zap, Plus, Globe, LayoutList, ScanLine } from "lucide-svelte";
  import { SuperButton } from "@yph/ui-kit";

  let intakeMode = $state<'manual' | 'neural' | 'stream'>('manual');
</script>

<main class="view-container">
  <header class="view-header">
      <h1>New Intake Protocol</h1>
      <p class="text-secondary">Initialize intelligence nodes from YouTube data streams.</p>
  </header>

  <div class="intake-layout">
      <aside class="mode-sidebar surface-1">
          <span class="nav-label">Extraction Method</span>
          <div class="modes-stack">
              <button class="mode-item" class:active={intakeMode === 'manual'} onclick={() => intakeMode = 'manual'}>
                  <Plus size="18" />
                  <div class="m-text">
                      <span class="m-title">Manual</span>
                      <span class="m-desc">Direct identifier input</span>
                  </div>
              </button>

              <button class="mode-item" class:active={intakeMode === 'neural'} onclick={() => intakeMode = 'neural'}>
                  <Zap size="18" />
                  <div class="m-text">
                      <span class="m-title">Neural</span>
                      <span class="m-desc">Semantic discovery</span>
                  </div>
              </button>

              <button class="mode-item" class:active={intakeMode === 'stream'} onclick={() => intakeMode = 'stream'}>
                  <Globe size="18" />
                  <div class="m-text">
                      <span class="m-title">Stream</span>
                      <span class="m-desc">Activity interception</span>
                  </div>
              </button>
          </div>

          <div class="status-panel mt-auto">
              <div class="dot pulse"></div>
              <span>PROBE_ACTIVE</span>
          </div>
      </aside>

      <div class="intake-main surface-1">
          {#if intakeMode === 'manual'}
              <div in:fade={{ duration: 200 }}>
                  <PlaylistEditor onsave={() => {}} />
              </div>
          {:else}
              <div class="locked-state" in:fly={{ y: 20 }}>
                  <div class="lock-icon"><ScanLine size="40" /></div>
                  <h2>Vector Locked</h2>
                  <p>Neural discovery requires advanced clearance level. Please use manual extraction protocol.</p>
                  <SuperButton outline onclick={() => intakeMode = 'manual'}>Revert to Manual</SuperButton>
              </div>
          {/if}
      </div>
  </div>
</main>

<style>
  .view-header { margin-bottom: var(--space-10); }
  h1 { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }

  .intake-layout { display: grid; grid-template-columns: 280px 1fr; gap: var(--space-8); align-items: start; }

  .mode-sidebar { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-6); min-height: 500px; }
  .nav-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; padding-left: 12px; }

  .modes-stack { display: flex; flex-direction: column; gap: 4px; }
  .mode-item {
      display: flex; align-items: center; gap: 16px; padding: 12px 16px; border-radius: 8px; border: none;
      background: transparent; color: var(--text-secondary); cursor: pointer; text-align: left; transition: all 0.2s;
  }
  .mode-item:hover { background: var(--border-subtle); color: var(--text-main); }
  .mode-item.active { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }

  .m-title { display: block; font-weight: 700; font-size: 0.95rem; }
  .m-desc { display: block; font-size: 0.7rem; opacity: 0.6; font-weight: 500; }

  .status-panel {
      margin-top: auto; padding: 12px; background: var(--bg-app); border-radius: 6px;
      display: flex; align-items: center; gap: 10px; font-size: 0.6rem; font-weight: 800; color: var(--text-dim);
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--secondary); }
  .dot.pulse { animation: pulse 2s infinite; }

  .intake-main { padding: var(--space-8); min-height: 500px; }

  .locked-state {
      padding: var(--space-16); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px;
  }
  .lock-icon { width: 80px; height: 80px; background: var(--bg-surface-2); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
  .locked-state h2 { font-size: 1.5rem; font-weight: 800; }
  .locked-state p { max-width: 360px; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; line-height: 1.6; }

  @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

  @media (max-width: 1000px) {
      .intake-layout { grid-template-columns: 1fr; }
      .mode-sidebar { min-height: auto; }
  }
</style>
