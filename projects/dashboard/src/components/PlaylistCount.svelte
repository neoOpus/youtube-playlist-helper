<svelte:options runes={true} />
<script lang="ts">
  let { count = 0, className = "" } = $props();
</script>
<span class="playlist-count {className}">{count}</span>
