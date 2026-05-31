<svelte:options runes={true} />
<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let { theme = "dark", intensity = "full" } = $props();

  let canvas = $state<HTMLCanvasElement>();
  let ctx: CanvasRenderingContext2D;
  let animationFrame: number;
  let time = 0;

  const colorConfigs: Record<string, string[]> = {
    "light": ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1"],
    "dark": ["#0f172a", "#1e293b", "#334155", "#0f172a"],
    "black": ["#000000", "#050505", "#0a0a0a", "#111111"]
  };

  let colors = $derived(colorConfigs[theme] || colorConfigs["dark"]);

  function draw() {
    if (!ctx || !canvas || intensity === 'none') return;

    time += intensity === 'low' ? 0.0001 : 0.0004;

    const { width, height } = canvas;
    const diag = Math.sqrt(width * width + height * height);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "screen";

    const count = intensity === 'low' ? 3 : 7;
    for (let i = 0; i < count; i++) {
        const t = time * (0.5 + i * 0.1);
        const x = width * (0.5 + 0.4 * Math.sin(t + i * 2.3));
        const y = height * (0.5 + 0.4 * Math.cos(t * 0.8 + i * 1.7));
        const size = diag * (1.2 + 0.6 * Math.sin(t * 0.5 + i));
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        const baseColor = colors[(i % (colors.length - 1)) + 1];
        const alpha = (0.15 + 0.05 * Math.sin(time * 2 + i)).toFixed(3);
        gradient.addColorStop(0, `${baseColor}${Math.floor(parseFloat(alpha)*255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.5, `${baseColor}05`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    animationFrame = requestAnimationFrame(draw);
  }

  function handleResize() {
    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d")!;
    handleResize();
    window.addEventListener("resize", handleResize);
    if (intensity !== 'none') draw();
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    }
  });

  $effect(() => {
      if (intensity === 'none') {
          if (animationFrame) cancelAnimationFrame(animationFrame);
      } else {
          if (!animationFrame) draw();
      }
  });
</script>

<div class="bg-wrapper">
    {#if intensity !== 'none'}
        <canvas bind:this={canvas} class="canvas-bg"></canvas>
    {/if}
</div>

<style>
  .bg-wrapper {
      position: fixed; inset: 0; z-index: -1; overflow: hidden; background: var(--bg-app);
  }
  .canvas-bg {
      width: 100%; height: 100%; filter: blur(100px); opacity: 0.5; transform: scale(1.1);
  }
</style>
