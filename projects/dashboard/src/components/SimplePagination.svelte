<svelte:options runes={true} />
<script lang="ts">
  let { totalItems, pageSize, currentPage = $bindable(1), onchange } = $props();
  let totalPages = $derived(Math.ceil(totalItems / pageSize));

  function setPage(p: number) {
    if (p < 1 || p > totalPages) return;
    currentPage = p;
    if (onchange) onchange(p);
  }
</script>

{#if totalPages > 1}
  <div class="pagination">
    <button onclick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
    <span class="info">Page {currentPage} of {totalPages}</span>
    <button onclick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
  </div>
{/if}

<style>
  .pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; margin-top: 2rem; }
  button { padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 6px; color: var(--text); font-weight: 700; cursor: pointer; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  .info { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
</style>
