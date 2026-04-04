<svelte:options runes={true} />
<script lang="ts">
  import SmartElement from "./SmartElement.svelte";
  let { bgcolor = "", className = "", children } = $props();
</script>

<SmartElement className="floating-button {className}" style="background-color: {bgcolor}">
  {@render children?.()}
</SmartElement>

<style>
  :global(.floating-button) { position: fixed; bottom: 2rem; right: 2rem; border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 1000; }
</style>
