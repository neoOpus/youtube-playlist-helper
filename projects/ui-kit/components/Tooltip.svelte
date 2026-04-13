<svelte:options runes={true} />
<script lang="ts">
  import { fade, scale } from "svelte/transition";

  interface Props {
    text: string;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
    children?: import("svelte").Snippet;
  }

  let { text, position = "top", delay = 300, children }: Props = $props();
  let visible = $state(false);
  let timer: any;

  function show() {
    timer = setTimeout(() => {
      visible = true;
    }, delay);
  }

  function hide() {
    clearTimeout(timer);
    visible = false;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="tooltip-wrapper"
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
  role="tooltip"
  aria-label={text}
>
  {@render children?.()}
  {#if visible}
    <div
        class="tooltip-content {position} pro-glass-high"
        in:scale={{ start: 0.9, duration: 150, opacity: 0 }}
        out:fade={{ duration: 100 }}
    >
      <span class="tooltip-text">{text}</span>
      <div class="arrow"></div>
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
    color: var(--text);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    font-size: 0.7rem;
    font-weight: 800;
    white-space: nowrap;
    z-index: 10000;
    pointer-events: none;
    box-shadow: var(--shadow-xl);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 1px solid var(--border);
  }

  .tooltip-text {
    position: relative;
    z-index: 2;
  }

  .top { bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-10px); }
  .bottom { top: 100%; left: 50%; transform: translateX(-50%) translateY(10px); }
  .left { right: 100%; top: 50%; transform: translateY(-50%) translateX(-10px); }
  .right { left: 100%; top: 50%; transform: translateY(-50%) translateX(10px); }

  .arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    border: inherit;
    z-index: 1;
  }

  .top .arrow { bottom: -5px; left: 50%; transform: translateX(-50%) rotate(45deg); border-top: none; border-left: none; }
  .bottom .arrow { top: -5px; left: 50%; transform: translateX(-50%) rotate(45deg); border-bottom: none; border-right: none; }
  .left .arrow { right: -5px; top: 50%; transform: translateY(-50%) rotate(45deg); border-bottom: none; border-left: none; }
  .right .arrow { left: -5px; top: 50%; transform: translateY(-50%) rotate(45deg); border-top: none; border-right: none; }
</style>
