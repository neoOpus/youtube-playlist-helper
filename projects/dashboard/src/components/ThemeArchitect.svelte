<svelte:options runes={true} />
<script lang="ts">
  import {
    initTheme,
    themes,
    themeState,
    setTheme
  } from "../stores/theme.svelte";
  import { SuperButton, TerminalIcon, SaveIcon } from "@yph/ui-kit";
  import { slide } from "svelte/transition";
  import { storageService, notificationService } from "@yph/core";
  import { onMount } from "svelte";

  let showNeuralConfig = $state(false);
  let customPrimary = $state("#ff5252");
  let glassBlur = $state(40);
  let grainIntensity = $state(0.06);

  async function applyNeuralTuning() {
      if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--primary', customPrimary);
          document.documentElement.style.setProperty('--glass-blur', `${glassBlur}px`);
          document.documentElement.style.setProperty('--grain-opacity', String(grainIntensity));

          await storageService.storeObject('neural-tuning', { customPrimary, glassBlur, grainIntensity });
      }
  }

  onMount(async () => {
      const tuned = await storageService.fetchObject('neural-tuning', null);
      if (tuned) {
          customPrimary = tuned.customPrimary;
          glassBlur = tuned.glassBlur;
          grainIntensity = tuned.grainIntensity;
          applyNeuralTuning();
      }
  });

  async function commitNeuralTuning() {
      await applyNeuralTuning();
      notificationService.success("Neural Aesthetic Tuning synchronized.");
  }
</script>

<section class="pro-glass p-6 mt-8">
    <div class="header mb-6">
        <h3 class="card-title">Professional Theme Engine</h3>
        <p class="muted small">Customize the visual architecture of your intelligence hub.</p>
    </div>

    <div class="theme-grid">
        {#each themes as theme}
            <button
                class="theme-card"
                class:active={themeState.choice === theme.id}
                onclick={() => setTheme(theme.id)}
            >
                <div class="swatch-container">
                    <div class="swatch main" style="background: {theme.primary}"></div>
                    <div class="swatch accent" style="background: {theme.accent}"></div>
                </div>
                <div class="theme-info">
                    <span class="theme-name">{theme.name}</span>
                </div>
                {#if themeState.choice === theme.id}
                    <div class="check-mark">✓</div>
                {/if}
            </button>
        {/each}
    </div>

    <div class="neural-architect mt-8">
        <SuperButton outline fullWidth onclick={() => showNeuralConfig = !showNeuralConfig}>
            <TerminalIcon size="16" />
            <span>Neural Aesthetic Tuning</span>
        </SuperButton>

        {#if showNeuralConfig}
            <div class="tuning-pane mt-6" transition:slide>
                <div class="control-row">
                    <label for="neural-primary">Neural Primary</label>
                    <input id="neural-primary" type="color" bind:value={customPrimary} oninput={applyNeuralTuning} />
                </div>
                <div class="control-row mt-4">
                    <label for="glass-blur">Glass Blur Intensity ({glassBlur}px)</label>
                    <input id="glass-blur" type="range" min="0" max="100" bind:value={glassBlur} oninput={applyNeuralTuning} />
                </div>
                <div class="control-row mt-4">
                    <label for="grain-density">Grain Density ({(grainIntensity * 100).toFixed(0)}%)</label>
                    <input id="grain-density" type="range" min="0" max="0.2" step="0.01" bind:value={grainIntensity} oninput={applyNeuralTuning} />
                </div>
                <div class="mt-6">
                    <SuperButton primary fullWidth onclick={commitNeuralTuning}>
                        <SaveIcon size="16" /> Commit Neural State
                    </SuperButton>
                </div>
            </div>
        {/if}
    </div>
</section>

<style>
    .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
    }

    .theme-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 0.75rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: left;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .theme-card:hover { background: rgba(255, 255, 255, 0.06); transform: translateY(-2px); }
    .theme-card.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }

    .swatch-container { height: 40px; border-radius: 6px; overflow: hidden; display: flex; border: 1px solid rgba(255, 255, 255, 0.05); }
    .swatch.main { flex: 7; }
    .swatch.accent { flex: 3; }

    .theme-name { font-weight: 800; font-size: 0.75rem; color: var(--text); text-transform: uppercase; letter-spacing: 1px; }

    .check-mark { position: absolute; top: 0.5rem; right: 0.5rem; width: 16px; height: 16px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 900; }

    .tuning-pane { padding: 1.5rem; background: var(--bg-tertiary); border: 1px solid var(--border-strong); border-radius: 16px; }
    .control-row { display: flex; justify-content: space-between; align-items: center; }
    .control-row label { font-size: 11px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
    input[type="color"] { background: none; border: none; padding: 0; width: 32px; height: 32px; cursor: pointer; }
    input[type="range"] { flex-grow: 0; width: 150px; accent-color: var(--primary); }

    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
</style>
