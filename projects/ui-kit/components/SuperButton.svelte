<svelte:options runes={true} />
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    primary?: boolean;
    secondary?: boolean;
    danger?: boolean;
    outline?: boolean;
    link?: boolean;
    mini?: boolean;
    circle?: boolean;
    title?: string;
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    class?: string;
    children?: Snippet;
    ariaLabel?: string;
    style?: string;
    fullWidth?: boolean;
  }

  let {
    primary = false,
    secondary = false,
    danger = false,
    outline = false,
    link = false,
    mini = false,
    circle = false,
    title = "",
    disabled = false,
    onclick = (e: MouseEvent) => {},
    class: className = "",
    children,
    ariaLabel,
    style = "",
    fullWidth = false
  }: Props = $props();

  function handleClick(e: MouseEvent) {
      if (disabled) return;
      onclick(e);
  }
</script>

<button
  class="btn {className}"
  class:full-width={fullWidth}
  class:is-primary={primary}
  class:is-secondary={secondary}
  class:is-danger={danger}
  class:is-outline={outline}
  class:is-link={link}
  class:is-mini={mini}
  class:is-circle={circle}
  {title}
  {disabled}
  {style}
  aria-label={ariaLabel || title}
  onclick={handleClick}
>
  <span class="content">
      {#if children}
        {@render children()}
      {/if}
  </span>
</button>

<style>
  .btn {
    position: relative;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: var(--font-sm);
    font-weight: 700;
    border: 1px solid var(--border-base);
    background: var(--bg-surface-2);
    color: var(--text-main);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-in-out);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    outline: none;
    user-select: none;
  }

  .full-width { width: 100%; }

  .is-mini { padding: 4px 12px; font-size: 0.75rem; }

  .is-circle { border-radius: 50%; width: 40px; height: 40px; padding: 0; }

  .btn:hover:not(:disabled) {
      border-color: var(--border-strong);
      background: var(--bg-surface-3);
  }

  .is-primary {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }
  .is-primary:hover:not(:disabled) {
      background: var(--primary-hover);
      border-color: var(--primary-hover);
  }

  .is-secondary {
    background: var(--secondary);
    border-color: var(--secondary);
    color: white;
  }

  .is-danger {
    background: var(--danger);
    border-color: var(--danger);
    color: white;
  }

  .is-outline {
    background: transparent;
    border-color: var(--border-strong);
  }

  .is-link {
      background: transparent;
      border: none;
      color: var(--primary);
      padding: 0;
  }
  .is-link:hover { text-decoration: underline; background: transparent; }

  .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
  }
</style>
