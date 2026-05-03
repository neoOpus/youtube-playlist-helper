<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { Search, Command, Home, Zap, LayoutDashboard, Cloud, Shield } from "lucide-svelte";
  import { router } from "../stores/router";

  let { display = $bindable(false) } = $props();
  let query = $state("");
  let selectedIndex = $state(0);

  const actions = [
    { label: 'Go to Collections', icon: Home, path: '/' },
    { label: 'Create New Intake', icon: Zap, path: '/new' },
    { label: 'System Control Panel', icon: LayoutDashboard, path: '/manage' },
    { label: 'Cloud Node Sync', icon: Cloud, path: '/sync' },
    { label: 'Security Protocol', icon: Shield, path: '/support' },
  ];

  let filteredActions = $derived(
    actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
  );

  function close() { display = false; query = ""; }
  function navigate(path: string) { router.push(path); close(); }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
    if (e.key === "Enter" && filteredActions[selectedIndex]) navigate(filteredActions[selectedIndex].path);
    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % (filteredActions.length || 1);
    }
    if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredActions.length) % (filteredActions.length || 1);
    }
  }

  function autofocus(node: HTMLInputElement) {
      node.focus();
  }

  onMount(() => {
    const handleGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); display = !display; }
    };
    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  });
</script>

{#if display}
  <div class="overlay" transition:fade onclick={close} aria-hidden="true">
    <div
        class="modal surface-1"
        onclick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        onkeydown={handleKeyDown}
    >
      <div class="search">
        <Search size="18" class="text-primary" />
        <input
            type="text"
            placeholder="Type a command..."
            bind:value={query}
            use:autofocus
        />
        <kbd>ESC</kbd>
      </div>
      <div class="results">
        {#each filteredActions as action, i}
          <button class="item" class:active={selectedIndex === i} onclick={() => navigate(action.path)}>
            <action.icon size="16" />
            <span>{action.label}</span>
            {#if selectedIndex === i}<span class="enter">ENTER</span>{/if}
          </button>
        {/each}
      </div>
      <div class="footer">
        <div class="k-shortcut"><Command size="12" /> K</div>
        <span>to toggle</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 3000; display: flex; justify-content: center; padding-top: 15vh; }
  .modal { width: 100%; max-width: 600px; height: fit-content; box-shadow: var(--shadow-lg); overflow: hidden; border-radius: 12px; outline: none; }

  .search { display: flex; align-items: center; padding: 16px; gap: 12px; border-bottom: 1px solid var(--border-base); }
  input { flex: 1; background: transparent; border: none; color: var(--text-main); font-size: 1rem; font-weight: 600; outline: none; }
  kbd { font-size: 0.65rem; background: var(--bg-surface-2); padding: 2px 6px; border-radius: 4px; color: var(--text-muted); }

  .results { padding: 8px; max-height: 400px; overflow-y: auto; }
  .item {
      width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 6px;
      border: none; background: transparent; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
  }
  .item:hover, .item.active { background: var(--border-subtle); color: var(--text-main); }
  .item.active { border: 1px solid var(--primary); background: rgba(var(--primary-rgb), 0.05); }

  .enter { margin-left: auto; font-size: 0.6rem; font-weight: 800; color: var(--primary); opacity: 0.6; }

  .footer { padding: 12px 16px; background: var(--bg-surface-2); display: flex; align-items: center; gap: 8px; font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
  .k-shortcut { display: flex; align-items: center; gap: 4px; background: var(--bg-app); padding: 2px 6px; border-radius: 4px; }
</style>
