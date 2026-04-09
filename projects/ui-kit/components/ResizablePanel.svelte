<svelte:options runes={true} />
<script lang="ts">
  let { width = $bindable(300), children } = $props();
</script>

<div class="resizable-panel" style="width: {width}px">
  {@render children?.()}
</div>
