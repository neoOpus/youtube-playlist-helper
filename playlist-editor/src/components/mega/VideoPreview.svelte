<script lang="ts">
  import { fade } from "svelte/transition";
  import { themeOrchestrator } from "../../services/mega/theme-orchestrator";

  export let videoId: string = "";
  export let thumbnailUrl: string;

  let isHovered = false;
  let previewIndex = 0;
  let interval: any;

  async function handleMouseEnter() {
    isHovered = true;
    console.log("Peeking at node:", videoId);
    themeOrchestrator.extractDominantColor(thumbnailUrl).then(color => {
        if (color) themeOrchestrator.applyDynamicAccent(color);
    });

    interval = setInterval(() => {
        previewIndex = (previewIndex + 1) % 4;
    }, 800);
  }

  function handleMouseLeave() {
    isHovered = false;
    clearInterval(interval);
    themeOrchestrator.resetAccent();
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="preview-container"
    class:hovered={isHovered}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
>
    <img src={thumbnailUrl} alt="Thumbnail" class="base-thumb" />

    {#if isHovered}
        <div class="peek-overlay" transition:fade={{ duration: 200 }}>
            <div class="animated-frame frame-{previewIndex}"></div>
            <div class="live-badge">LIVE PEEK</div>
        </div>
    {/if}
</div>

<style>
  .preview-container {
    position: relative;
    width: 120px;
    height: 68px;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .preview-container.hovered {
    transform: scale(1.2) translateY(-5px);
    z-index: 100;
    box-shadow: 0 12px 24px rgba(0,0,0,0.3);
  }

  .base-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .peek-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.2);
  }

  .animated-frame {
    width: 100%;
    height: 100%;
    background-image: var(--dynamic-accent-subtle);
    mix-blend-mode: overlay;
    animation: pulse 2s infinite;
  }

  .live-badge {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: #ef4444;
    color: white;
    font-size: 8px;
    font-weight: bold;
    padding: 2px 4px;
    border-radius: 2px;
    letter-spacing: 0.5px;
  }

  @keyframes pulse {
    0% { opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { opacity: 0.3; }
  }

  .frame-1 { transform: scale(1.1) translate(2px, 2px); }
  .frame-2 { transform: scale(1.15) translate(-2px, -1px); }
  .frame-3 { transform: scale(1.05) translate(1px, -2px); }
</style>
