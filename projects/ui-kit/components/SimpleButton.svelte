<svelte:options runes={true} />
<script lang="ts">
  import SmartElement from "./SmartElement.svelte";
  let { bgcolor = "", className = "", children } = $props();
</script>

<SmartElement className="simple-button {className}" style="background-color: {bgcolor}">
  {@render children?.()}
</SmartElement>
