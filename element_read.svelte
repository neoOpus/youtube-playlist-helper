<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let {
    active = false,
    selected = false,
    disabled = false,
    className = "",
    ariaLabel = "",
    style = "",
    children
  } = $props();

  const dispatch = createEventDispatcher();

  function handleClick(e: MouseEvent) {
      if (disabled) return;
      dispatch("click", e);
  }
</script>

<div
  class="smart-element {className}"
  class:active
  class:selected
  class:disabled
  {style}
  role="presentation"
  aria-label={ariaLabel}
  onclick={handleClick}
>
  {@render children?.()}
</div>

<style>
  .smart-element { display: flex; width: 100%; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
  .smart-element.active { background: var(--hover); }
  .smart-element.selected { background: rgba(var(--primary-rgb), 0.1); border-color: var(--primary); }
  .smart-element.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
</style>
