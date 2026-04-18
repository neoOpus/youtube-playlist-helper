<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { TerminalIcon, SearchIcon, PlaylistPlayIcon, SaveIcon, InfoIcon } from "@yph/ui-kit";

  let { display = $bindable(false) } = $props();

  const shortcuts = [
      { key: "Ctrl + K", label: "Command Palette", icon: SearchIcon },
      { key: "Ctrl + /", label: "Toggle Shortcut HUD", icon: InfoIcon },
      { key: "G", label: "Component Gallery", icon: TerminalIcon },
      { key: "M", label: "System Management", icon: SaveIcon },
      { key: "S", label: "Saved Infrastructure", icon: PlaylistPlayIcon },
      { key: "N", label: "New Intelligence", icon: SearchIcon },
      { key: "/", label: "Quick Filter", icon: TerminalIcon },
      { key: "Esc", label: "Clear / Close", icon: InfoIcon }
  ];

  function close() { display = false; }

  onMount(() => {
      const handler = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === '/') {
              e.preventDefault();
              display = !display;
          }
          if (e.key === 'Escape' && display) {
              display = false;
          }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
  });
</script>

{#if display}
  <div class="hud-overlay" transition:fade onclick={close} role="button" tabindex="0" onkeydown={e => e.key === 'Enter' && close()} aria-label="Close Shortcut HUD">
      <div
        class="hud-content pro-glass-high"
        transition:fly={{ y: 20 }}
        onclick={e => e.stopPropagation()}
        onkeydown={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hud-title"
        tabindex="-1"
      >
          <header class="hud-header">
              <InfoIcon size="24" color="var(--primary)" />
              <h2 id="hud-title">System Navigation HUD</h2>
          </header>
          <div class="shortcut-grid mt-8">
              {#each shortcuts as s}
                  <div class="shortcut-item luminous-hover">
                      <div class="s-icon"><s.icon size="18" /></div>
                      <span class="s-label">{s.label}</span>
                      <kbd class="s-key">{s.key}</kbd>
                  </div>
              {/each}
          </div>
          <footer class="hud-footer mt-12">
              <p>Pro Version 2.2 • Obsidian Depth v2 Engine</p>
          </footer>
      </div>
  </div>
{/if}

<style>
    .hud-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 7000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(20px); }
    .hud-content { width: 700px; max-width: 90vw; padding: 3rem; border: 1px solid var(--border-strong); outline: none; border-radius: 24px; }
    .hud-header { display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
    h2 { margin: 0; font-weight: 900; letter-spacing: -1px; color: var(--text); }
    .shortcut-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
    .shortcut-item { background: var(--bg-secondary); padding: 1rem 1.5rem; border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: center; gap: 1.5rem; }
    .s-icon { color: var(--primary); opacity: 0.8; }
    .s-label { flex-grow: 1; font-weight: 800; font-size: 0.9rem; color: var(--text); }
    .s-key { background: var(--bg); color: var(--primary); padding: 4px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 900; border: 1px solid var(--border-strong); box-shadow: 0 4px 0 var(--border); }
    .hud-footer { text-align: center; opacity: 0.4; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--text-dim); }
    .mt-8 { margin-top: 2rem; }
    .mt-12 { margin-top: 3rem; }
</style>
