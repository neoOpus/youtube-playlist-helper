<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let active = false;
  export let selected = false;
  export let disabled = false;
  export let loading = false;
  export let error = false;
  export let className = "";
  export let style = "";

  const dispatch = createEventDispatcher();

  function handleClick(event: MouseEvent) {
    if (disabled || loading) return;
    dispatch("click", event);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled || loading) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dispatch("click", event);
    }
  }
</script>

<div
  class="smart-element {className}"
  class:is-active={active}
  class:is-selected={selected}
  class:is-disabled={disabled}
  class:is-loading={loading}
  class:is-error={error}
  {style}
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleKeyDown}
>
  <slot />
</div>

<style>
  .smart-element {
    display: flex;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    outline: none;
  }

  .smart-element:hover {
    background-color: var(--hover-color);
  }

  .smart-element:focus-visible {
    box-shadow: 0 0 0 2px var(--sidebar-bg-color);
  }

  .smart-element.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .smart-element.is-loading {
    cursor: wait;
  }

  .smart-element.is-error {
    border: 1px solid #dc3545;
  }

  .smart-element.is-active {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
  }

  .smart-element.is-selected {
    border-left: 4px solid var(--sidebar-bg-color);
  }
</style>
