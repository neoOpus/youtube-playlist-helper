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
    padding: 0.5em 1em;
    border-radius: 10px;
    border: 1px solid var(--border);
    background-color: var(--hover);
    color: var(--text);
    justify-content: center;
    align-items: center;
    font-weight: 700;
  }
  :global(.super-button.is-primary) { background-color: var(--primary); color: white; border-color: var(--primary); }
  :global(.super-button.is-danger) { background-color: #dc3545; color: white; border-color: #dc3545; }
  :global(.super-button.is-circle) { padding: 0.5em; border-radius: 50%; aspect-ratio: 1/1; width: 38px; height: 38px; }
  .button-content { display: flex; align-items: center; justify-content: center; }
</style>
