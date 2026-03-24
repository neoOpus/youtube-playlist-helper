<svelte:options runes={true} />
<script lang="ts">
  let { bgcolor = "#007bff", children, ...props } = $props();
</script>
<button style="background-color: {bgcolor}" {...props}>
  {@render children?.()}
</button>
