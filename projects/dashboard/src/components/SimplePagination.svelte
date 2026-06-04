<script lang="ts">
  interface Props {
    totalItems: number;
    pageSize: number;
    currentPage?: number;
  }

  let { totalItems, pageSize, currentPage = $bindable(1) }: Props = $props();
  let totalPages = $derived(Math.ceil(totalItems / pageSize));

  function setPage(p: number) {
    if (p < 1 || p > totalPages) return;
    currentPage = p;
  }
</script>

{#if totalPages > 1}
  <div class="pagination">
    <button onclick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <span class="info">Page {currentPage} of {totalPages}</span>
    <button onclick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
  </div>
{/if}

<style>
  .pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; padding: 2rem 0; }
  button {
      padding: 6px 12px; background: var(--bg-surface-2); border: 1px solid var(--border-base);
      border-radius: 6px; color: var(--text-main); font-weight: 600; cursor: pointer; font-size: 0.85rem;
  }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  .info { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); }
</style>
