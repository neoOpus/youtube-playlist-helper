<script lang="ts">
  export let display = false;

  function handleModalClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains("modal")) {
      display = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      display = false;
    }
  }
</script>

{#if display}
  <div
    on:click={handleModalClick}
    on:keydown={handleKeydown}
    class="modal"
    role="presentation"
  >
    <div class="modal-content" role="dialog" aria-modal="true">
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--background-color);
    padding: 20px;
    border: 1px solid #888;
    width: auto;
    max-width: 90%;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }

  .modal:hover {
    cursor: pointer;
  }

  .modal-content:hover {
    cursor: auto;
  }
</style>
