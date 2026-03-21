<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    primary = false,
    secondary = false,
    danger = false,
    outline = false,
    mini = false,
    title = "",
    disabled = false,
    onclick = (e: MouseEvent) => {},
    class: className = "",
    children
  }: {
    primary?: boolean;
    secondary?: boolean;
    danger?: boolean;
    outline?: boolean;
    mini?: boolean;
    title?: string;
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    class?: string;
    children?: Snippet;
  } = $props();

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }
</script>

<button
  class="super-button luminous-hover {className}"
  class:primary
  class:secondary
  class:danger
  class:outline
  class:mini
  {title}
  {disabled}
  onclick={(e) => !disabled && onclick(e)}
  onmousemove={handleMouseMove}
>
  <div class="glow-container"></div>
  <span class="content">
      {#if children}
        {@render children()}
      {/if}
  </span>
</button>

<style>
  .super-button {
    position: relative;
    padding: 12px 24px;
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
    gap: 8px;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  .super-button.mini {
      padding: 6px 12px;
      font-size: 0.65rem;
      border-radius: var(--radius-sm);
  }

  .super-button:hover:not(:disabled) {
      border-color: var(--border-strong);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -10px var(--shadow);
  }

  .super-button:active:not(:disabled) {
      transform: scale(0.96) translateY(0);
  }

  .primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
    border-color: var(--primary);
    color: white;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
  }

  .primary:hover:not(:disabled) {
      box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.4);
      border-color: white;
  }

  .danger {
    background: linear-gradient(135deg, var(--danger) 0%, #ff6b6b 100%);
    border-color: var(--danger);
    color: white;
  }

  .outline {
    background: transparent;
    border: 2px solid var(--border-strong);
  }

  .outline:hover:not(:disabled) {
      background: var(--hover);
      border-color: var(--primary);
  }

  .content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: inherit;
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

  .primary::after {
      background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
  }

  .super-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
  }
</style>
