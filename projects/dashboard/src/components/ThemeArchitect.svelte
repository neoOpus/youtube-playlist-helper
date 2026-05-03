<svelte:options runes={true} />
<script lang="ts">
  import {
    themes,
    appState,
    setTheme
  } from "../stores/theme.svelte";
  import { Check } from "lucide-svelte";
</script>

<section class="theme-architect">
    <div class="header">
        <h3>Base Theme Architecture</h3>
        <p class="text-secondary">Select the fundamental color foundation for your environment.</p>
    </div>

    <div class="theme-grid">
        {#each themes as theme}
            <button
                class="theme-card surface-1"
                class:active={appState.choice === theme.id}
                onclick={() => setTheme(theme.id as any)}
            >
                <div class="swatch" style="background: {theme.bg}">
                    <div class="accent-line" style="background: {theme.primary}"></div>
                </div>
                <div class="theme-info">
                    <span class="theme-name">{theme.name}</span>
                    {#if appState.choice === theme.id}
                        <div class="check-mark"><Check size="12" /></div>
                    {/if}
                </div>
            </button>
        {/each}
    </div>
</section>

<style>
    .theme-architect { display: flex; flex-direction: column; gap: 24px; }
    h3 { font-size: 1rem; font-weight: 700; margin: 0; }
    p { font-size: 0.8rem; margin: 4px 0 0; }

    .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
    }

    .theme-card {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        border: 1px solid var(--border-base);
    }

    .theme-card:hover { border-color: var(--border-strong); transform: translateY(-2px); }
    .theme-card.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }

    .swatch {
        height: 60px;
        border-radius: 6px;
        border: 1px solid var(--border-base);
        position: relative;
        overflow: hidden;
    }

    .accent-line {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 4px;
    }

    .theme-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .theme-name {
        font-weight: 600;
        font-size: 0.85rem;
    }

    .check-mark {
        width: 18px;
        height: 18px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
