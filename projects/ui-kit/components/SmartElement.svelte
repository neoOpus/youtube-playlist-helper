<script lang="ts">
  interface Props {
    tag?: string;
    class?: string;
    interactive?: boolean;
    glass?: boolean;
    children?: any;
    onclick?: (e: MouseEvent) => void;
  }

  let {
    tag = 'div',
    class: className = '',
    interactive = false,
    glass = true,
    onclick,
    children
  }: Props = $props();
</script>

<svelte:element
  this={tag}
  class="sota-element {glass ? 'glass' : ''} {interactive ? 'interactive' : ''} {className}"
  on:click={onclick}
  role={interactive ? 'button' : undefined}
  tabindex={interactive ? 0 : undefined}
>
  {@render children?.()}
</svelte:element>

<style>
  .sota-element {
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    transition: all var(--trans-normal);
    position: relative;
    box-sizing: border-box;
  }

  .glass {
    background: var(--bg-glass);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border-color: var(--border-strong);
  }

  .interactive {
    cursor: pointer;
    user-select: none;
  }

  .interactive:hover {
    border-color: var(--text-muted);
    background: rgba(255, 255, 255, 0.03);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .interactive:active {
    transform: translateY(0);
    filter: brightness(0.9);
  }

  /* Focus states for accessibility */
  .interactive:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 4px;
  }
</style>
