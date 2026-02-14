<script lang="ts">
  export let width = 300;
  export let minWidth = 100;
  export let maxWidth = 600;

  let resizing = false;

  function startResize(e: MouseEvent) {
    resizing = true;
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  }

  function resize(e: MouseEvent) {
    if (resizing) {
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        width = newWidth;
      }
    }
  }

  function stopResize() {
    resizing = false;
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  }
</script>

<div class="panel" style="width: {width}px">
  <slot />
  <div class="resizer" on:mousedown={startResize}></div>
</div>

<style>
  .panel {
    position: relative;
    height: 100%;
    border-right: 1px solid var(--border-color);
    background: var(--background-color);
  }

  .resizer {
    position: absolute;
    top: 0;
    right: -5px;
    width: 10px;
    height: 100%;
    cursor: col-resize;
    z-index: 5;
  }

  .resizer:hover {
    background: rgba(0,0,0,0.1);
  }
</style>
