<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SmartElement from "./SmartElement.svelte";

  export let primary = false;
  export let danger = false;
  export let circle = false;
  export let outline = false;
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
  className="super-button {className} {primary ? 'is-primary' : ''} {danger ? 'is-danger' : ''} {circle ? 'is-circle' : ''} {outline ? 'is-outline' : ''} luminous-hover"
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
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background-color: var(--bg-secondary);
    color: var(--text);
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: var(--font-sm);
    transition: all var(--duration-standard) var(--easing-gentle);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
  }

  :global(.super-button:hover:not(:disabled)) {
    background-color: var(--hover);
    border-color: var(--border-strong);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  :global(.super-button.is-primary) {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
  }

  :global(.super-button.is-primary:hover:not(:disabled)) {
    background-color: var(--primary-hover);
    border-color: var(--primary-hover);
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4);
  }

  :global(.super-button.is-outline) {
      background: transparent;
      border: 1px solid var(--border-strong);
      color: var(--text);
  }

  :global(.super-button.is-outline:hover:not(:disabled)) {
      background: var(--hover);
      border-color: var(--primary);
      color: var(--primary);
  }

  :global(.super-button.is-danger) {
    background-color: var(--danger);
    color: white;
    border-color: var(--danger);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }
  :global(.super-button.is-danger:hover:not(:disabled)) {
    background-color: #ef4444ee;
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }

  :global(.super-button.is-circle) {
    padding: var(--space-2);
    border-radius: var(--radius-full);
    aspect-ratio: 1/1;
    width: 42px;
    height: 42px;
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    z-index: 2;
    position: relative;
  }
</style>
