<script lang="ts">
  import SmartElement from "./SmartElement.svelte";

  export let title = "";
  export let bgcolor = "#007bff";
  export let disabled = false;
  export let loading = false;
  export let className = "";
  export let circle = false;
</script>

<SmartElement
  className="super-button {className} {circle ? 'is-circle' : ''}"
  {disabled}
  {loading}
  style="background-color: {bgcolor}"
  on:click
>
  <slot />
  {#if !!title}
    <span class="tooltip" style="background-color: {bgcolor}">{title}</span>
  {/if}
</SmartElement>

<style>
  :global(.super-button) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.1s ease-in-out;
    position: relative;
  }

  :global(.super-button.is-circle) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 0;
  }

  :global(.super-button:hover) {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }

  :global(.super-button:active) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .tooltip {
    visibility: hidden;
    width: 120px;
    opacity: 0.9;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    line-height: initial;
    position: absolute;
    z-index: 100;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    pointer-events: none;
    font-size: 0.8rem;
  }

  :global(.super-button:hover) .tooltip {
    visibility: visible;
  }
</style>
