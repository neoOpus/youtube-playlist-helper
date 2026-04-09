<svelte:options runes={true} />
<script lang="ts">
  import {
    initTheme,
    themes,
    themeState,
    setTheme
  } from "../stores/theme.svelte";
</script>

<section class="pro-glass p-6">
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
                    {#if theme.id === 'pro-red'}
                        <span class="badge">SIGNATURE</span>
                    {/if}
                </div>
                {#if themeState.choice === theme.id}
                    <div class="check-mark">✓</div>
                {/if}
            </button>
        {/each}
    </div>
</section>

<style>
    .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.25rem;
    }

    .theme-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: left;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        overflow: hidden;
    }

    .theme-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
    }

    .theme-card.active {
        background: rgba(255, 82, 82, 0.05);
        border-color: var(--primary);
        box-shadow: 0 0 20px rgba(255, 82, 82, 0.1);
    }

    .swatch-container {
        height: 60px;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .swatch {
        height: 100%;
    }

    .swatch.main { flex: 7; }
    .swatch.accent { flex: 3; }

    .theme-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .theme-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text);
    }

    .badge {
        font-size: 0.65rem;
        font-weight: 700;
        padding: 0.2rem 0.4rem;
        background: var(--primary);
        color: white;
        border-radius: 4px;
        letter-spacing: 0.02em;
    }

    .check-mark {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 20px;
        height: 20px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 800;
    }
</style>
