<script lang="ts">
  import SmartElement from "./SmartElement.svelte";
  export let className = "";
  export let title = "";
</script>

<SmartElement className="simple-btn {className}" {title} on:click>
  <slot />
</SmartElement>

<style>
  :global(.simple-btn) {
    padding: 4px;
    border-radius: 4px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
