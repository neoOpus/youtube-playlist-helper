<svelte:options runes={true} />
<script lang="ts">
  let { expanded = true, children } = $props();
</script>

<aside class="collapsible-sidebar" class:expanded>
  {@render children?.()}
</aside>

<style>
  .collapsible-sidebar { width: 60px; transition: width 0.3s; }
  .collapsible-sidebar.expanded { width: 260px; }
</style>
