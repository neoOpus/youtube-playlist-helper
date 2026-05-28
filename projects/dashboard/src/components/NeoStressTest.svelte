<svelte:options runes={true} />
<script lang="ts">
  import { stressTest, notificationService, audioService } from "@yph/core";
  import { TerminalIcon, SuperButton } from "@yph/ui-kit";

  let results = $state<{ nodeCount: number, fetchTime: number, sortTime: number } | null>(null);
  let isRunning = $state(false);

  async function runMassiveIntake() {
      if (confirm("Proceed with Neo-Stress Protocol? This will inject 20,000 nodes into your local database.")) {
          isRunning = true;
          await stressTest.generateMassiveData(20000);
          notificationService.success("Massive intake complete.");
          audioService.playSignal('success');
          isRunning = false;
      }
  }

  async function runBenchmark() {
      isRunning = true;
      results = await stressTest.runBenchmark();
      isRunning = false;
      audioService.playSignal('neutral');
  }
</script>

<div class="neo-stress pro-glass mt-8">
    <div class="header">
        <h3 class="card-title"><TerminalIcon size="18" /> Neo-Stress Benchmark</h3>
        <p class="muted small">Validate system performance against massive infrastructure datasets.</p>
    </div>

    {#if results}
        <div class="results-grid mt-6">
            <div class="stat"><span>Nodes</span> <span class="val">{results.nodeCount}</span></div>
            <div class="stat"><span>Fetch (IndexedDB)</span> <span class="val">{results.fetchTime}ms</span></div>
            <div class="stat"><span>Sort (Natural)</span> <span class="val">{results.sortTime}ms</span></div>
        </div>
    {/if}

    <div class="actions-row mt-8">
        <SuperButton outline onclick={runMassiveIntake} disabled={isRunning}>Generate 20k Nodes</SuperButton>
        <SuperButton primary onclick={runBenchmark} disabled={isRunning}>Execute Benchmark</SuperButton>
    </div>
</div>

<style>
    .neo-stress { padding: var(--space-8); }
    .results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1rem; background: var(--bg); border-radius: 8px; border: 1px solid var(--border); }
    .stat { display: flex; flex-direction: column; gap: 4px; }
    .stat span { font-size: 10px; font-weight: 900; color: var(--text-dim); text-transform: uppercase; }
    .val { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: var(--primary); }
    .actions-row { display: flex; gap: 1rem; }
</style>
