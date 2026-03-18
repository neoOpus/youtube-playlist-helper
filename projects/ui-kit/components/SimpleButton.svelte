<script lang="ts">
  import SmartElement from "./SmartElement.svelte";
  export let className = "";
  export let disabled = false;
</script>

<SmartElement className="simple-btn {className}" {disabled} on:click>
  <slot />
</SmartElement>

<style>
  :global(.simple-btn) {
    border: 1px solid var(--border);
    background: transparent;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--text);
    font-size: var(--font-sm);
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }

  :global(.simple-btn:hover:not(:disabled)) {
    background: var(--hover);
    border-color: var(--text-muted);
  }

  :global(.simple-btn:focus-visible) {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
</style>
