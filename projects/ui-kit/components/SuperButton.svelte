<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SmartElement from "./SmartElement.svelte";

  export let primary = false;
  export let danger = false;
  export let circle = false;
  export let bgcolor = "";
  export let className = "";
  export let disabled = false;
  export let title = "";
  export let ariaLabel = "";

  const dispatch = createEventDispatcher();

  function handleClick(e: any) {
    if (!disabled) dispatch("click", e.detail);
  }
</script>

<SmartElement
  className="super-button {className} {primary ? 'is-primary' : ''} {danger ? 'is-danger' : ''} {circle ? 'is-circle' : ''}"
  {disabled}
  {title}
  {ariaLabel}
  style={bgcolor ? "background-color: " + bgcolor : ""}
  on:click={handleClick}
>
  <div class="button-content">
    <slot />
  </div>
</SmartElement>

<style>
  :global(.super-button) {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    background-color: var(--hover);
    color: var(--text);
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: var(--font-base);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }

  :global(.super-button:hover:not(:disabled)) {
    background-color: var(--border);
    border-color: var(--text-muted);
    box-shadow: var(--shadow-md);
  }

  :global(.super-button.is-primary) {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  :global(.super-button.is-primary:hover:not(:disabled)) {
    background-color: var(--primary-hover);
    border-color: var(--primary-hover);
  }
  :global(.super-button.is-primary:active:not(:disabled)) {
    background-color: var(--primary-active);
  }

  :global(.super-button.is-danger) {
    background-color: var(--danger);
    color: white;
    border-color: var(--danger);
  }
  :global(.super-button.is-danger:hover:not(:disabled)) {
    background-color: #ef4444ee;
  }

  :global(.super-button.is-circle) {
    padding: var(--space-2);
    border-radius: var(--radius-full);
    aspect-ratio: 1/1;
    width: 42px;
    height: 42px;
  }

  :global(.super-button:focus-visible) {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  .button-content { display: flex; align-items: center; justify-content: center; gap: var(--space-2); }
</style>
