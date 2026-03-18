<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let width = 300;
  export let minWidth = 100;
  export let maxWidth = 1000;

  const dispatch = createEventDispatcher();

  function startResize(e: MouseEvent) {
    const startX = e.clientX;
    const startWidth = width;

    function onMouseMove(e: MouseEvent) {
      const deltaX = e.clientX - startX;
      width = Math.min(Math.max(startWidth + deltaX, minWidth), maxWidth);
      dispatch("resize", width);
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") width = Math.min(width + 10, maxWidth);
      if (e.key === "ArrowLeft") width = Math.max(width - 10, minWidth);
      dispatch("resize", width);
  }
</script>

<div class="panel" style="width: {width}px">
  <slot />
  <div
    class="resizer"
    on:mousedown={startResize}
    on:keydown={handleKeydown}
    role="slider"
    aria-valuenow={width}
    aria-valuemin={minWidth}
    aria-valuemax={maxWidth}
    aria-label="Resize panel"
    tabindex="0"
  ></div>
</div>

<style>
  .panel {
    position: relative;
    height: 100%;
    border-right: 1px solid var(--border);
    flex-shrink: 0;
  }

  .resizer {
    position: absolute;
    top: 0;
    right: -3px;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    z-index: 5;
    transition: background 0.2s;
  }

  .resizer:hover, .resizer:focus {
    background: var(--primary);
  }
</style>
