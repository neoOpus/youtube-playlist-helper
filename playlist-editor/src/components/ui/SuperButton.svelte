<script lang="ts">
  import { spring } from 'svelte/motion';
  import { createEventDispatcher } from 'svelte';
  import Fa from 'svelte-fa';

  export let icon: any = null;
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let loading = false;
  export let disabled = false;
  export let className = "";
  export let title = "";
  export let bgcolor = "";

  const dispatch = createEventDispatcher();

  const scale = spring(1, {
    stiffness: 0.2,
    damping: 0.3
  });

  function handleMouseDown() { if (!disabled) scale.set(0.95); }
  function handleMouseUp() { if (!disabled) scale.set(1); }
</script>

<button
  class="super-button {variant} {size} {className}"
  class:loading
  class:disabled
  style="transform: scale({$scale}); {bgcolor ? `background-color: ${bgcolor}` : ''}"
  {title}
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
  on:click={(e) => !disabled && !loading && dispatch('click', e)}
>
  {#if loading}
    <div class="spinner"></div>
  {:else}
    {#if icon}<Fa {icon} />{/if}
    <slot />
  {/if}
</button>

<style>
  .super-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, filter 0.2s;
    user-select: none;
    white-space: nowrap;
  }

  .primary { background: var(--sidebar-bg-color); color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .secondary { background: #f4f4f5; color: #27272a; }
  .danger { background: #ef4444; color: white; }
  .ghost { background: transparent; color: #71717a; }
  .glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); color: white; border: 1px solid rgba(255,255,255,0.2); }

  .primary:hover { filter: brightness(1.1); }
  .secondary:hover { background: #e4e4e7; }
  .danger:hover { filter: brightness(1.1); }
  .ghost:hover { background: #f4f4f5; color: #18181b; }

  .sm { padding: 6px 12px; font-size: 0.85rem; border-radius: 8px; }
  .md { padding: 10px 20px; font-size: 0.95rem; }
  .lg { padding: 14px 28px; font-size: 1.1rem; border-radius: 16px; }

  .disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>
