<script lang="ts">
  export let display = false;

  function handleModalClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      display = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
          display = false;
      }
  }
</script>

{#if display}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    on:click={handleModalClick}
    on:keydown={handleKeyDown}
    class="modal"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="modal-content" role="document">
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
  }
</style>
