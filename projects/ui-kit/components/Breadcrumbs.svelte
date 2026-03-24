<svelte:options runes={true} />
<script lang="ts">
  let { items = [] }: { items: { label: string, active?: boolean }[] } = $props();
</script>

<nav class="breadcrumbs">
  {#each items as item, i}
    <span class="crumb" class:active={item.active}>{item.label}</span>
    {#if i < items.length - 1}
      <span class="separator">/</span>
    {/if}
  {/each}
</nav>

<style>
    .breadcrumbs { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .crumb { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; }
    .crumb.active { color: var(--primary); }
    .separator { font-size: 0.6rem; color: var(--border-strong); }
</style>
