<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import { Command, X, Search, Zap, Terminal, Home, Shield, Hash } from "lucide-svelte";

  let { display = $bindable(false) } = $props();

  const shortcutGroups = [
    {
      title: "Navigation",
      shortcuts: [
        { keys: ["S"], label: "Saved Collections", icon: Home },
        { keys: ["N"], label: "Neural Generator", icon: Zap },
        { keys: ["M"], label: "Management Hub", icon: Terminal },
        { keys: ["G"], label: "Component Gallery", icon: Hash },
      ]
    },
    {
      title: "System Actions",
      shortcuts: [
        { keys: ["CMD", "K"], label: "Command Palette", icon: Command },
        { keys: ["/"], label: "Quick Search", icon: Search },
        { keys: ["ESC"], label: "Clear / Close", icon: X },
        { keys: ["CMD", "/"], label: "Toggle Shortcut HUD", icon: Shield },
      ]
    }
  ];

  function close() { display = false; }
</script>

{#if display}
  <div class="hud-overlay" transition:fade onclick={close} aria-hidden="true">
    <div
        class="hud-container surface-1"
        in:fly={{ y: 20, duration: 600, easing: backOut }}
        out:fade={{ duration: 300 }}
        onclick={e => e.stopPropagation()}
        aria-hidden="true"
    >
      <header class="hud-header">
        <div class="header-info">
            <Shield size="20" class="primary-glow" />
            <h2>Tactical Interface Map</h2>
        </div>
        <button class="close-btn" onclick={close}><X size="20" /></button>
      </header>

      <div class="hud-grid">
        {#each shortcutGroups as group}
          <div class="shortcut-group">
            <h3 class="group-title">{group.title}</h3>
            <div class="shortcuts-stack">
              {#each group.shortcuts as shortcut}
                <div class="shortcut-item">
                  <div class="shortcut-info">
                    <div class="shortcut-icon"><shortcut.icon size="14" /></div>
                    <span class="shortcut-label">{shortcut.label}</span>
                  </div>
                  <div class="keys-row">
                    {#each shortcut.keys as key}
                      <kbd>{key}</kbd>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <footer class="hud-footer">
        <div class="status-indicator">
            <div class="dot pulse"></div>
            <span>V3.0_HUD_ACTIVE</span>
        </div>
        <span class="hint">Click anywhere to dismiss</span>
      </footer>
    </div>
  </div>
{/if}

<style>
  .hud-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(15px);
    z-index: 1100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
  }

  .surface-1 {
    width: 100%;
    max-width: 800px;
    background: var(--card-bg-alpha);
    border: 1px solid var(--border-luminous);
    border-radius: var(--radius-xl);
    box-shadow: 0 50px 100px rgba(0,0,0,0.7), var(--shadow-luminous);
    padding: var(--space-10);
    position: relative;
    overflow: hidden;
  }

  .surface-1::before {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--glass-shine);
      pointer-events: none;
      opacity: 0.3;
  }

  .hud-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-10);
    position: relative;
    z-index: 1;
  }

  .header-info { display: flex; align-items: center; gap: var(--space-4); }
  .header-info h2 { font-size: 1.5rem; font-weight: 900; margin: 0; letter-spacing: -0.02em; }
  :global(.primary-glow) { color: var(--primary); filter: drop-shadow(0 0 8px var(--primary)); }

  .close-btn { background: transparent; border: none; color: var(--text-dim); cursor: pointer; transition: color 0.2s; }
  .close-btn:hover { color: var(--text); }

  .hud-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
    position: relative;
    z-index: 1;
  }

  .group-title {
    font-size: 0.65rem;
    font-weight: 900;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: var(--space-6);
  }

  .shortcuts-stack { display: flex; flex-direction: column; gap: var(--space-2); }

  .shortcut-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: all 0.2s;
  }
  .shortcut-item:hover { background: var(--hover); border-color: var(--border-strong); }

  .shortcut-info { display: flex; align-items: center; gap: var(--space-4); }
  .shortcut-icon { color: var(--text-dim); }
  .shortcut-label { font-size: 0.85rem; font-weight: 700; color: var(--text); }

  .keys-row { display: flex; gap: 4px; }
  kbd {
    background: var(--bg-primary);
    border: 1px solid var(--border-strong);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.7rem;
    font-weight: 900;
    font-family: 'JetBrains Mono', monospace;
    color: var(--secondary);
    min-width: 24px;
    text-align: center;
    box-shadow: 0 2px 0 var(--border);
  }

  .hud-footer {
    margin-top: var(--space-12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
    border-top: 1px solid var(--border);
    padding-top: var(--space-6);
  }

  .status-indicator { display: flex; align-items: center; gap: var(--space-3); font-size: 0.6rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
  .dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; }
  .dot.pulse { animation: pulse-anim 2s infinite; }
  @keyframes pulse-anim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }

  .hint { font-size: 0.7rem; color: var(--text-dim); font-style: italic; }

  @media (max-width: 700px) {
    .hud-grid { grid-template-columns: 1fr; gap: var(--space-8); }
  }
</style>
