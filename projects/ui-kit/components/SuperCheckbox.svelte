<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SmartElement from "./SmartElement.svelte";

  export let checked = false;
  export let disabled = false;
  export let label = "";

  const dispatch = createEventDispatcher();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    dispatch("change", checked);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }
</script>

<SmartElement
  className="super-checkbox-container"
  {disabled}
  on:click={toggle}
>
  <div
    class="checkbox"
    class:is-checked={checked}
    tabindex={disabled ? -1 : 0}
    role="checkbox"
    aria-checked={checked}
    on:keydown={handleKeydown}
  >
    {#if checked}
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
      </svg>
    {/if}
  </div>
  {#if label}
    <span class="label">{label}</span>
  {/if}
</SmartElement>

<style>
  :global(.super-checkbox-container) {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: transparent !important;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  :global(.super-checkbox-container:hover .checkbox:not(:disabled)) {
    border-color: var(--primary);
  }

  .checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    color: white;
  }

  .checkbox.is-checked {
    background-color: var(--primary);
    border-color: var(--primary);
  }

  .checkbox:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  .label {
    font-size: var(--font-sm);
    user-select: none;
    color: var(--text);
  }
</style>
