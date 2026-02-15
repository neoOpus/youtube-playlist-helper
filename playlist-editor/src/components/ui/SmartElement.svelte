<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let active = false;
  export let selected = false;
  export let disabled = false;
  export let loading = false;
  export let error = false;
  export let tooltip = "";
  export let className = "";
  export let style = "";
  export let ripple = true;

  const dispatch = createEventDispatcher();
  let element: HTMLElement;
  let showTooltip = false;
  let tooltipTimeout: any;

  function handleClick(event: MouseEvent) {
    if (disabled || loading) return;
    if (ripple) createRipple(event);
    dispatch("click", event);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled || loading) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dispatch("click", event);
    }
  }

  function createRipple(event: MouseEvent) {
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const rippleElement = element.getElementsByClassName("ripple")[0];
    if (rippleElement) {
      rippleElement.remove();
    }

    element.appendChild(circle);
  }

  function handleMouseEnter() {
    if (tooltip) {
      tooltipTimeout = setTimeout(() => {
        showTooltip = true;
      }, 500);
    }
  }

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    showTooltip = false;
  }
</script>

<div
  bind:this={element}
  class="smart-element ${className}"
  class:is-active={active}
  class:is-selected={selected}
  class:is-disabled={disabled}
  class:is-loading={loading}
  class:is-error={error}
  {style}
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleKeyDown}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <slot />

  {#if showTooltip && tooltip}
    <div class="tooltip" transition:fade={{ duration: 100 }}>
      {tooltip}
    </div>
  {/if}

  {#if loading}
    <div class="loader-overlay">
       <div class="loader"></div>
    </div>
  {/if}
</div>

<style>
  .smart-element {
    position: relative;
    display: flex;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    outline: none;
    overflow: hidden;
    user-select: none;
  }

  .smart-element:hover {
    background-color: var(--hover-color, rgba(0, 0, 0, 0.05));
  }

  .smart-element:active {
    transform: scale(0.98);
  }

  .smart-element:focus-visible {
    box-shadow: 0 0 0 2px var(--sidebar-bg-color);
  }

  .smart-element.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .smart-element.is-loading {
    cursor: wait;
  }

  .smart-element.is-error {
    border: 1px solid #dc3545;
  }

  .smart-element.is-active {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
  }

  .smart-element.is-selected {
    border-left: 4px solid var(--sidebar-bg-color);
  }

  .tooltip {
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .loader-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .loader {
    width: 16px;
    height: 16px;
    border: 2px solid var(--sidebar-bg-color);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  :global(.ripple) {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
</style>
