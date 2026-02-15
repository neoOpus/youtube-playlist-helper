<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SmartElement from "./SmartElement.svelte";

  export let title = "";
  export let primary = false;
  export let danger = false;
  export let circle = false;
  export let bgcolor = "";
  export let className = "";
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function handleClick(e: MouseEvent) {
    if (!disabled) dispatch("click", e);
  }
</script>

<SmartElement
  className="super-button {className} {primary ? 'is-primary' : ''} {danger ? 'is-danger' : ''} {circle ? 'is-circle' : ''}"
  {disabled}
  style={bgcolor ? `background-color: ${bgcolor}` : ""}
  on:click={handleClick}
>
  <div class="button-content" {title}>
    <slot />
  </div>
</SmartElement>

<style>
  :global(.super-button) {
    padding: 0.5em 1em;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    background-color: var(--background-color);
    color: var(--text-color);
    justify-content: center;
    align-items: center;
    font-weight: 500;
  }

  :global(.super-button.is-primary) {
    background-color: var(--sidebar-bg-color);
    color: white;
    border-color: transparent;
  }

  :global(.super-button.is-danger) {
    background-color: #dc3545;
    color: white;
    border-color: transparent;
  }

  :global(.super-button.is-circle) {
    padding: 0.5em;
    border-radius: 50%;
    aspect-ratio: 1/1;
  }

  .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
  }
</style>
