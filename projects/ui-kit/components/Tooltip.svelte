<svelte:options runes={true} />
<script lang="ts">
  import { fade } from "svelte/transition";

  interface Props {
    text: string;
    position?: "top" | "bottom" | "left" | "right";
    children?: import("svelte").Snippet;
  }

  let { text, position = "top", children }: Props = $props();
  let visible = $state(false);

  function show() { visible = true; }
  function hide() { visible = false; }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="tooltip-wrapper" onmouseenter={show} onmouseleave={hide} onfocusin={show} onfocusout={hide} role="tooltip" aria-label={text}>
  {@render children?.()}
  {#if visible}
    <div class="tooltip-content {position}" transition:fade={{ duration: 150 }}>
      {text}
    </div>
  {/if}
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-block;
  }

  .tooltip-content {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-xs);
    font-size: var(--font-xs);
    font-weight: 800;
    white-space: nowrap;
    z-index: 10000;
    pointer-events: none;
    border: 1px solid var(--border-strong);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .top { bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-8px); }
  .bottom { top: 100%; left: 50%; transform: translateX(-50%) translateY(8px); }
  .left { right: 100%; top: 50%; transform: translateY(-50%) translateX(-8px); }
  .right { left: 100%; top: 50%; transform: translateY(-50%) translateX(8px); }

  .top::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: rgba(0, 0, 0, 0.9); }
  .bottom::after { content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-bottom-color: rgba(0, 0, 0, 0.9); }
  .left::after { content: ''; position: absolute; left: 100%; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-left-color: rgba(0, 0, 0, 0.9); }
  .right::after { content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-right-color: rgba(0, 0, 0, 0.9); }
</style>
