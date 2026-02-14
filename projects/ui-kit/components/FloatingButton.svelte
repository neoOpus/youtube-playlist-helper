<script lang="ts">
  import SmartElement from "./SmartElement.svelte";
  export let bgcolor = "var(--sidebar-bg-color)";
  export let title = "";
</script>

<SmartElement
  className="fab"
  style="background-color: {bgcolor}"
  {title}
  on:click
>
  <slot />
  {#if title}
    <span class="tooltip">{title}</span>
  {/if}
</SmartElement>

<style>
  :global(.fab) {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .tooltip {
    visibility: hidden;
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s;
  }

  :global(.fab:hover) .tooltip {
    visibility: visible;
    opacity: 1;
  }
</style>
