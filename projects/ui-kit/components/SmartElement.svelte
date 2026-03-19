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

  function handleMouseMove(e: MouseEvent) {
    if (disabled || loading) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    (e.currentTarget as HTMLElement).style.setProperty('--x', `${x}px`);
    (e.currentTarget as HTMLElement).style.setProperty('--y', `${y}px`);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
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
  on:mousemove={handleMouseMove}
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
    transition: all var(--duration-standard) var(--easing-gentle);
    user-select: none;
    cursor: pointer;
    outline: none;
    position: relative;
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
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  .smart-element.is-selected {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.1);
      box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.15);
  }
</style>
