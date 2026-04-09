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
    style = ""
  }: Props = $props();

  let ripples = $state<{id: number, x: number, y: number}[]>([]);
  let rippleId = 0;

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }

  function createRipple(e: MouseEvent) {
      if (disabled || link) return;
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const id = rippleId++;
      ripples = [...ripples, { id, x, y }];

      setTimeout(() => {
          ripples = ripples.filter(r => r.id !== id);
      }, 600);
  }

  function handleClick(e: MouseEvent) {
      if (disabled) return;
      createRipple(e);
      onclick(e);
  }
</script>

<button
  class="super-button luminous-hover {className}"
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
  onmousemove={handleMouseMove}
>
  <div class="ripple-container">
      {#each ripples as ripple (ripple.id)}
          <span class="ripple" style="left: ${ripple.x}px; top: ${ripple.y}px;"></span>
      {/each}
  </div>
  <span class="content">
      {#if children}
        {@render children()}
      {/if}
  </span>
</button>

<style>
  .super-button {
    position: relative;
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
    font-weight: 800;
    letter-spacing: 0.02em;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    text-transform: uppercase;
    font-family: inherit;
    outline: none;
    box-shadow: var(--shadow-sm);
    user-select: none;
  }

  .super-button.is-mini {
      padding: var(--space-1) var(--space-3);
      font-size: 0.65rem;
      border-radius: var(--radius-sm);
  }

  .super-button.is-circle {
    padding: var(--space-2);
    border-radius: var(--radius-full);
    aspect-ratio: 1/1;
    width: 42px;
    height: 42px;
  }

  .super-button:hover:not(:disabled) {
      border-color: var(--border-strong);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
  }

  .super-button:active:not(:disabled) {
      transform: scale(0.96) translateY(0);
  }

  .super-button:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  .is-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
    border-color: var(--primary);
    color: white;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
  }

  .is-primary:hover:not(:disabled) {
      box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.4);
      border-color: white;
  }

  .is-danger {
    background: linear-gradient(135deg, var(--danger) 0%, #ff6b6b 100%);
    border-color: var(--danger);
    color: white;
  }

  .is-outline {
    background: transparent;
    border: 2px solid var(--border-strong);
  }

  .is-outline:hover:not(:disabled) {
      background: var(--hover);
      border-color: var(--primary);
  }

  .is-link {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: var(--space-1) var(--space-2);
      color: var(--primary);
      text-transform: none;
      font-weight: 700;
      min-height: auto;
  }

  .is-link:hover:not(:disabled) {
      transform: none;
      text-decoration: underline;
      background: rgba(var(--primary-rgb), 0.05);
  }

  .content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: inherit;
  }

  .ripple-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
  }

  .ripple {
      position: absolute;
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple-effect 0.6s ease-out;
  }

  @keyframes ripple-effect {
      to {
          transform: translate(-50%, -50%) scale(4);
          opacity: 0;
      }
  }

  .luminous-hover::after {
      content: '';
      position: absolute;
      top: var(--y, 0);
      left: var(--x, 0);
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
  }

  .luminous-hover:hover::after {
      opacity: 1;
  }

  .is-primary::after {
      background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
  }

  .super-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
  }
</style>
