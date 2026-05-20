<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import { Search, Command, Home, Zap, LayoutDashboard, Cloud, Shield, ChevronRight, Hash } from "lucide-svelte";
  import { router } from "../stores/router";

  let { display = $bindable(false) } = $props();
  let query = $state("");
  let selectedIndex = $state(0);

  const actions = [
    { label: 'Go to Collections', icon: Home, path: '/', hint: 'NAV_LIBRARY' },
    { label: 'Create New Intake', icon: Zap, path: '/new', hint: 'INIT_NODE' },
    { label: 'System Control Panel', icon: LayoutDashboard, path: '/manage', hint: 'SYS_PREF' },
    { label: 'Cloud Node Sync', icon: Cloud, path: '/sync', hint: 'CLOUD_SYNC' },
    { label: 'Security Protocol', icon: Shield, path: '/support', hint: 'SUPP_INFRA' },
    { label: 'Component Gallery', icon: Hash, path: '/gallery', hint: 'DEV_TOOLS' },
  ];

  let filteredActions = $derived(
    actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
  );

  function close() { display = false; query = ""; }
  function navigate(path: string) { router.push(path); close(); }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
    if (e.key === "Enter" && filteredActions[selectedIndex]) navigate(filteredActions[selectedIndex].path);
    if (e.key === "ArrowDown") { e.preventDefault(); selectedIndex = (selectedIndex + 1) % (filteredActions.length || 1); }
    if (e.key === "ArrowUp") { e.preventDefault(); selectedIndex = (selectedIndex - 1 + filteredActions.length) % (filteredActions.length || 1); }
  }

  function autofocus(node: HTMLInputElement) { node.focus(); }

  onMount(() => {
    const handleGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); display = !display; }
    };
    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  });
</script>

{#if display}
  <div class="overlay" transition:fade={{ duration: 200 }} onclick={close} aria-hidden="true">
    <div
        class="modal surface-1"
        onclick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        onkeydown={handleKeyDown}
        in:fly={{ y: -20, duration: 400, easing: backOut }}
    >
      <div class="search">
        <Search size={20} class="text-primary" />
        <input
            type="text"
            placeholder="Search commands and infrastructure..."
            bind:value={query}
            use:autofocus
        />
        <div class="esc-kbd">ESC</div>
      </div>
      <div class="results">
        {#each filteredActions as action, i}
          <button class="item" class:active={selectedIndex === i} onclick={() => navigate(action.path)}>
            <div class="icon-box"><action.icon size={16} /></div>
            <div class="label-box">
                <span class="main-lab">{action.label}</span>
                <span class="hint-lab">{action.hint}</span>
            </div>
            {#if selectedIndex === i}
                <div class="enter-icon" in:fade><ChevronRight size={14} /></div>
            {/if}
          </button>
        {/each}

        {#if filteredActions.length === 0}
            <div class="no-results">
                <p>No results matching "{query}"</p>
            </div>
        {/if}
      </div>
      <div class="footer">
        <div class="meta-status">
            <div class="dot active"></div>
            <span>V4_NEURAL_BUS_READY</span>
        </div>
        <div class="k-hint"><Command size={10} /> K to close</div>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); z-index: 3000; display: flex; justify-content: center; padding-top: 12vh; }
  .modal { width: 100%; max-width: 680px; height: fit-content; box-shadow: var(--shadow-lg); overflow: hidden; border-radius: 16px; outline: none; border: 1px solid var(--border-strong); }

  .search { display: flex; align-items: center; padding: 24px 32px; gap: 20px; border-bottom: 1px solid var(--border-base); background: var(--bg-surface-1); }
  input { flex: 1; background: transparent; border: none; color: var(--text-main); font-size: 1.15rem; font-weight: 700; outline: none; letter-spacing: -0.01em; }

  .esc-kbd { font-size: 0.6rem; font-weight: 900; background: var(--bg-surface-2); padding: 4px 10px; border-radius: 6px; color: var(--text-muted); border: 1px solid var(--border-base); font-family: monospace; }

  .results { padding: 12px; max-height: 500px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; background: var(--bg-app); }
  .item {
      width: 100%; display: flex; align-items: center; gap: 20px; padding: 14px 20px; border-radius: 12px;
      border: 1px solid transparent; background: transparent; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
  }
  .item:hover { background: var(--surface-hover); color: var(--text-main); }
  .item.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); color: var(--text-main); }

  .icon-box { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-2); border-radius: 10px; border: 1px solid var(--border-base); flex-shrink: 0; }
  .item.active .icon-box { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }

  .label-box { flex: 1; display: flex; flex-direction: column; text-align: left; }
  .main-lab { font-weight: 700; font-size: 1rem; }
  .hint-lab { font-size: 0.6rem; font-weight: 800; opacity: 0.4; font-family: 'JetBrains Mono', monospace; margin-top: 2px; letter-spacing: 0.05em; }

  .enter-icon { color: var(--primary); }

  .no-results { padding: 40px; text-align: center; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; }

  .footer { padding: 14px 32px; background: var(--bg-surface-2); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-base); }

  .meta-status { display: flex; align-items: center; gap: 10px; font-size: 0.6rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; font-family: monospace; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim); }
  .dot.active { background: var(--primary); box-shadow: 0 0 8px var(--primary); }

  .k-hint { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
</style>
