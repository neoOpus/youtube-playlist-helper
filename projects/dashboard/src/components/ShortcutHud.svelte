<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import { onMount } from "svelte";
  import { TerminalIcon, InfoIcon, CloseIcon } from "@yph/ui-kit";

  let { display = $bindable(false) } = $props();

  const shortcuts = [
      { key: "S", label: "Saved Infrastructure", category: "Navigation" },
      { key: "N", label: "New Intelligence Intake", category: "Navigation" },
      { key: "M", label: "System Management Hub", category: "Navigation" },
      { key: "G", label: "Infrastructure Topology", category: "Navigation" },
      { key: "/", label: "Focus Global Search", category: "Actions" },
      { key: "CTRL+K", label: "Open SOTA Command Palette", category: "Actions" },
      { key: "ESC", label: "Clear Filters / Close Modal", category: "Actions" },
      { key: "ENTER", label: "Initialize Primary Action", category: "Actions" },
      { key: "DEL", label: "Decommission Selected Node", category: "Editor" },
      { key: "CMD+/", label: "Toggle Shortcut Interface", category: "Meta" }
  ];

  function close() { display = false; }

  onMount(() => {
      const handler = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === '/') {
              e.preventDefault();
              display = !display;
          }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
  });
</script>

{#if display}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="hud-overlay" transition:fade onclick={close}>
      <div class="hud-container pro-glass-high" transition:scale={{ start: 0.95 }} onclick={e => e.stopPropagation()}>
          <div class="hud-header">
              <div class="h-title">
                  <InfoIcon size="20" color="var(--primary)" />
                  <h3>Infrastructure Hotkeys</h3>
              </div>
              <button class="close-btn" onclick={close}><CloseIcon size="16" /></button>
          </div>

          <div class="hud-grid mt-8">
              {#each shortcuts as s}
                <div class="s-row">
                    <div class="s-key"><kbd>{s.key}</kbd></div>
                    <div class="s-meta">
                        <span class="s-label">{s.label}</span>
                        <span class="s-cat">{s.category}</span>
                    </div>
                </div>
              {/each}
          </div>

          <div class="hud-footer mt-8">
              <TerminalIcon size="14" />
              <span>SOTA ARCHITECT v2.2 PRO ACTIVE</span>
          </div>
      </div>
  </div>
{/if}

<style>
    .hud-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 11000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); }
    .hud-container { width: 550px; padding: 2.5rem; border-radius: var(--radius-2xl); border: 1px solid var(--border-strong); box-shadow: var(--shadow-2xl); }

    .hud-header { display: flex; justify-content: space-between; align-items: center; }
    .h-title { display: flex; align-items: center; gap: 12px; }
    .h-title h3 { margin: 0; font-size: 1.25rem; font-weight: 900; letter-spacing: -0.02em; }

    .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
    .close-btn:hover { opacity: 1; }

    .hud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .s-row { display: flex; align-items: center; gap: 1rem; }

    .s-key kbd {
        background: var(--hover);
        border: 1px solid var(--border-strong);
        padding: 4px 8px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        font-weight: 800;
        color: var(--primary);
        box-shadow: 0 2px 0 var(--border-strong);
        min-width: 40px;
        text-align: center;
        display: inline-block;
    }

    .s-meta { display: flex; flex-direction: column; }
    .s-label { font-size: 0.85rem; font-weight: 700; color: var(--text); }
    .s-cat { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; }

    .hud-footer { border-top: 1px solid var(--border); padding-top: 1.5rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.6rem; font-weight: 900; color: var(--text-muted); letter-spacing: 0.2em; }

    @media (max-width: 600px) {
        .hud-grid { grid-template-columns: 1fr; }
        .hud-container { width: 90vw; padding: 1.5rem; }
    }
</style>
