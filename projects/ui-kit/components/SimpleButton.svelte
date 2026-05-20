<svelte:options runes={true} />
<script lang="ts">
  let { children, onclick, primary, danger, outline, mini, disabled } = $props();
</script>

<button
    class="simple-btn"
    class:primary
    class:danger
    class:outline
    class:mini
    {disabled}
    onclick={onclick}
>
  {@render children?.()}
</button>

<style>
  .simple-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 20px; border-radius: 8px; font-size: var(--font-sm); font-weight: 700;
    border: 1px solid var(--border-base); background: var(--bg-surface-2); color: var(--text-main);
    cursor: pointer; transition: all 0.2s; outline: none; user-select: none;
  }

  .simple-btn:hover:not(:disabled) { border-color: var(--border-strong); background: var(--bg-surface-3); }
  .simple-btn:focus-visible { box-shadow: var(--shadow-focus); border-color: var(--primary); }

  .primary { background: var(--primary); border-color: var(--primary); color: white; }
  .primary:hover:not(:disabled) { background: var(--primary-hover); border-color: var(--primary-hover); }

  .danger { background: var(--danger); border-color: var(--danger); color: white; }
  .outline { background: transparent; border-color: var(--border-strong); }
  .mini { padding: 4px 12px; font-size: 0.75rem; }

  .simple-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
