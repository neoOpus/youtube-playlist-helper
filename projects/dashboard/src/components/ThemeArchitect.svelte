<svelte:options runes={true} />
<script lang="ts">
  import {
    themes,
    themeState,
    setTheme
  } from "../stores/theme.svelte";
</script>

<section class="pro-glass">
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
    .pro-glass {
        padding: var(--space-6);
        background: var(--card-bg-alpha);
        backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid var(--border);
        border-radius: var(--radius-xl);
    }

    .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-5);
    }

    .theme-card {
        background: var(--hover);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        cursor: pointer;
        transition: all var(--duration-standard) var(--easing-standard);
        text-align: left;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        overflow: hidden;
    }

    .theme-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--border-strong);
        transform: translateY(-2px);
    }

    .theme-card.active {
        background: rgba(var(--primary-rgb), 0.05);
        border-color: var(--primary);
        box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.1);
    }

    .swatch-container {
        height: 60px;
        border-radius: var(--radius-xs);
        overflow: hidden;
        display: flex;
        border: 1px solid var(--border);
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
        font-size: var(--font-sm);
        color: var(--text);
    }

    .badge {
        font-size: var(--font-xs);
        font-weight: 700;
        padding: var(--space-1) var(--space-2);
        background: var(--primary);
        color: white;
        border-radius: var(--radius-xs);
        letter-spacing: 0.02em;
    }

    .check-mark {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        width: 20px;
        height: 20px;
        background: var(--primary);
        color: white;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-xs);
        font-weight: 800;
    }

    .mb-6 { margin-bottom: var(--space-6); }
    .muted { color: var(--text-muted); }
    .small { font-size: var(--font-xs); }
    .card-title { margin: 0; font-weight: 800; font-size: var(--font-lg); color: var(--text); }
</style>
