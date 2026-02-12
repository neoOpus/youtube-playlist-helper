<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let active = false;
  export let selected = false;
  export let className = "";
  export let style = "";

  const dispatch = createEventDispatcher();

  function handleClick(event: MouseEvent) {
    dispatch("click", event);
  }

  function handleKeyDown(event: KeyboardEvent) {
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

  .smart-element.is-active {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
  }

  .smart-element.is-selected {
    border-left: 4px solid var(--sidebar-bg-color);
  }
</style>
