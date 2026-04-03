<script lang="ts">
  import { themeChoice, themes, type ThemeName } from "../stores/theme.store";
  import { InfoIcon, SaveIcon, CheckIcon } from "@yph/ui-kit";
  import { fade, fly } from "svelte/transition";
  import { notificationService } from "@yph/core";

  function applyTheme(id: ThemeName) {
      themeChoice.set(id);
      notificationService.success("Neural aesthetics updated.");
  }
</script>

<div class="theme-architect pro-glass p-6 mt-8" in:fade>
    <div class="arch-header mb-6">
        <h3><InfoIcon size="20" color="var(--primary)" /> Theme Architect</h3>
        <p class="muted">Tune the visual resonance of your interface.</p>
    </div>

    <div class="theme-grid">
        {#each themes as theme}
            <button
                class="theme-card"
                class:active={$themeChoice === theme.id}
                on:click={() => applyTheme(theme.id)}
            >
                <div class="swatch" style="background: {theme.primary}">
                    <div class="accent" style="background: {theme.accent}"></div>
                </div>
                <span class="t-name">{theme.name}</span>
                {#if $themeChoice === theme.id}
                    <div class="check"><CheckIcon size="14" /></div>
                {/if}
            </button>
        {/each}
    </div>

    <div class="arch-actions mt-8">
        <button class="btn primary sota-glow w-full" on:click={() => notificationService.success("Parameters committed.")}>
            <SaveIcon size="18" /> Commit Visual Parameters
        </button>
    </div>
</div>

<style>
    .theme-architect { border: 1px solid var(--border); }
    h3 { margin: 0; font-weight: 900; letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }

    .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; }

    .theme-card { background: var(--hover); border: 2px solid transparent; border-radius: 16px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s; position: relative; width: 100%; border: none; }
    .theme-card:hover { transform: translateY(-4px); border-color: var(--border); }
    .theme-card.active { border: 2px solid var(--primary); background: var(--card-bg); }

    .swatch { width: 50px; height: 50px; border-radius: 12px; position: relative; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border: 1px solid var(--border); }
    .accent { position: absolute; bottom: 0; right: 0; width: 50%; height: 50%; border-radius: 12px 0 0 0; }

    .t-name { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text); }

    .check { position: absolute; top: -5px; right: -5px; background: var(--primary); color: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }

    .btn { padding: 12px; border-radius: 10px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
    .btn.primary { background: var(--primary); color: white; border-color: var(--primary); }
    .sota-glow { box-shadow: 0 0 15px rgba(255, 82, 82, 0.4); }

    .p-6 { padding: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .w-full { width: 100%; }
</style>
