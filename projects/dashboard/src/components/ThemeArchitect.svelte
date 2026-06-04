<script lang="ts">
    import { Palette, Sun, Moon, Laptop } from "lucide-svelte";
    import { appState, setTheme } from "../stores/theme.svelte";

    const choices = [
        { id: "device", name: "System", icon: Laptop },
        { id: "light", name: "Light", icon: Sun },
        { id: "dark", name: "Dark", icon: Moon },
        { id: "black", name: "OLED", icon: Moon }
    ];
</script>

<div class="theme-architect">
    <div class="header">
        <Palette size="16" />
        <h3>Appearance</h3>
    </div>

    <div class="theme-grid">
        {#each choices as choice}
            <button
                class="theme-btn"
                class:active={appState.choice === choice.id}
                onclick={() => setTheme(choice.id as any)}
            >
                <svelte:component this={choice.icon} size="14" />
                <span>{choice.name}</span>
            </button>
        {/each}
    </div>
</div>

<style>
    .theme-architect { display: flex; flex-direction: column; gap: 1rem; }
    .header { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); }
    .header h3 { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

    .theme-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .theme-btn {
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        padding: 12px 8px; border-radius: 10px; border: 1px solid var(--border-base);
        background: var(--bg-surface-2); color: var(--text-secondary); cursor: pointer;
        transition: all 0.2s;
    }
    .theme-btn span { font-size: 0.75rem; font-weight: 600; }
    .theme-btn:hover { border-color: var(--border-strong); background: var(--bg-surface-3); }
    .theme-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
</style>
