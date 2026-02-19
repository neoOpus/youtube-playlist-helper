<script lang="ts">
  export let width = 300;
  export let minWidth = 100;
  export let maxWidth = 800;

  let isResizing = false;

  function startResize(e: MouseEvent) {
    isResizing = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResize);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      width = newWidth;
    }
  }

  function stopResize() {
    isResizing = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', stopResize);
  }
</script>

<div class="panel" style="width: {width}px">
  <slot />
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="resizer"
    role="separator"
    aria-valuenow={width}
    aria-valuemin={minWidth}
    aria-valuemax={maxWidth}
    aria-label="Resize panel"
    on:mousedown={startResize}
  ></div>
</div>

<style>
  .panel {
    position: relative;
    height: 100%;
    background: var(--sidebar-bg-color, #f8f9fa);
    border-right: 1px solid var(--border-color, #dee2e6);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .resizer {
    position: absolute;
    top: 0;
    right: -3px;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    z-index: 10;
    transition: background 0.2s;
  }

  .resizer:hover {
    background: var(--sidebar-bg-color-active, rgba(0, 0, 0, 0.1));
  }
</style>
