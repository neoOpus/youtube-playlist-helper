<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher, type Snippet } from "svelte";

  interface Props {
    active?: boolean;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
    style?: string;
    children?: Snippet;
    onclick?: (e: MouseEvent) => void;
    title?: string;
  }

  let {
    active = false,
    selected = false,
    disabled = false,
    className = "",
    ariaLabel = "",
    style = "",
    children,
    onclick,
    title
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleClick(e: MouseEvent) {
      if (disabled) return;
      if (onclick) {
          onclick(e);
      } else {
          dispatch("click", e);
      }
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
  {title}
>
  {@render children?.()}
</div>

<style>
  .smart-element { display: flex; width: 100%; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
  .smart-element.active { background: var(--hover); }
  .smart-element.selected { background: rgba(var(--primary-rgb), 0.1); border-color: var(--primary); }
  .smart-element.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
</style>
