<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    ariaLabel?: string;
    children?: any;
    onclick?: (e: MouseEvent) => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    class: className = '',
    ariaLabel = '',
    onclick,
    children
  }: Props = $props();

  function handleClick(e: MouseEvent) {
    if (disabled) return;
    if (onclick) onclick(e);
    dispatch('click', e);
  }
</script>

<button
  {type}
  {disabled}
  class="sota-btn {variant} {size} {className}"
  aria-label={ariaLabel}
  onclick={handleClick}
>
  {@render children?.()}
</button>

<style>
  .sota-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-family: var(--font-main);
    cursor: pointer;
    transition: all var(--trans-fast);
    border: 1px solid transparent;
    outline: none;
    white-space: nowrap;
    user-select: none;
    position: relative;
    overflow: hidden;
  }

  .sota-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(1);
  }

  /* Sizes */
  .sm { padding: var(--spacing-1) var(--spacing-3); font-size: var(--size-xs); height: 32px; }
  .md { padding: var(--spacing-2) var(--spacing-4); font-size: var(--size-sm); height: 40px; }
  .lg { padding: var(--spacing-3) var(--spacing-6); font-size: var(--size-md); height: 56px; border-radius: var(--radius-lg); }

  /* Primary: The Unicorn Blue Glow */
  .primary {
    background: var(--accent-color);
    color: white;
    box-shadow: var(--shadow-sm), 0 0 0 0 var(--accent-glow);
  }
  .primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md), 0 0 15px var(--accent-glow);
    filter: brightness(1.1);
  }
  .primary:active:not(:disabled) {
    transform: translateY(0);
    filter: brightness(0.9);
  }

  /* Secondary: Glassmorphism */
  .secondary {
    background: var(--bg-glass);
    color: var(--text-primary);
    border-color: var(--border-strong);
    backdrop-filter: blur(8px);
  }
  .secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text-muted);
  }

  /* Danger */
  .danger {
    background: rgba(255, 50, 50, 0.1);
    color: #ff3232;
    border-color: rgba(255, 50, 50, 0.2);
  }
  .danger:hover:not(:disabled) {
    background: #ff3232;
    color: white;
  }

  /* Ghost */
  .ghost {
    background: transparent;
    color: var(--text-secondary);
  }
  .ghost:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-primary);
  }

  /* Accessibility Focus */
  .sota-btn:focus-visible {
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
</style>
