<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let active = false;
  export let selected = false;
  export let disabled = false;
  export let loading = false;
  export let error = false;
  export let className = "";
  export let style = "";
  export let title = "";
  export let ariaLabel = "";

  const dispatch = createEventDispatcher();

  function handleClick(e: MouseEvent) {
    if (!disabled && !loading) dispatch("click", e);
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loading) {
      e.preventDefault();
      dispatch("click", e);
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
  {title}
  on:click={handleClick}
  on:keydown={handleKeydown}
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-label={ariaLabel || title}
  aria-disabled={disabled}
>
  <slot />
</div>

<style>
  .smart-element {
    display: flex;
    transition: all 0.2s;
    user-select: none;
    cursor: pointer;
    outline: none;
  }

  .smart-element.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .smart-element.is-loading {
    cursor: wait;
  }

  .smart-element:focus-visible {
    box-shadow: 0 0 0 2px var(--primary);
  }
</style>
