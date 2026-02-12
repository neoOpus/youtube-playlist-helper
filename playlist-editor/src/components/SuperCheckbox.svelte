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
</script>

<SmartElement className="super-checkbox-container" {disabled} on:click={toggle}>
  <div class="checkbox" class:is-checked={checked}>
    {#if checked}
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
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
    gap: 8px;
    background: transparent !important;
    padding: 4px;
    border-radius: 4px;
  }

  .checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .checkbox.is-checked {
    background-color: var(--sidebar-bg-color);
    border-color: var(--sidebar-bg-color);
  }

  .label {
    font-size: 0.9rem;
    user-select: none;
  }
</style>
