<svelte:options runes={true} />
<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let { theme = "github-dark" } = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationFrame: number;
  let time = 0;

  const colorConfigs: Record<string, string[]> = {
    "github-light": ["#f8fafc", "#e2e8f0", "#cbd5e1", "#ffffff"],
    "github-dark": ["#030712", "#0f172a", "#1e293b", "#0f172a"],
    "dracula": ["#282a36", "#44475a", "#6272a4", "#bd93f9"],
    "pro-red": ["#050000", "#1a0505", "#2a0a0a", "#ff5252"],
    "default": ["#000000", "#050505", "#0a0a0a", "#111111"]
  };

  let colors = $derived(colorConfigs[theme] || colorConfigs["github-dark"]);

  function draw() {
    if (!ctx || !canvas) return;

    // Slower, more majestic movement
    time += 0.0004;

    const { width, height } = canvas;
    const diag = Math.sqrt(width * width + height * height);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "screen";

    // Draw 7 orbital light nodes
    for (let i = 0; i < 7; i++) {
        const t = time * (0.5 + i * 0.1);
        const x = width * (0.5 + 0.4 * Math.sin(t + i * 2.3));
        const y = height * (0.5 + 0.4 * Math.cos(t * 0.8 + i * 1.7));

        const size = diag * (1.2 + 0.6 * Math.sin(t * 0.5 + i));

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        const baseColor = colors[(i % (colors.length - 1)) + 1];

        // Dynamic opacity pulsing
        const alpha = (0.15 + 0.05 * Math.sin(time * 2 + i)).toFixed(3);

        gradient.addColorStop(0, `${baseColor}${Math.floor(parseFloat(alpha)*255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.5, `${baseColor}05`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    // Add subtle scanline/noise effect by drawing directly to canvas
    // (Actual noise is handled via CSS overlay for performance)

    animationFrame = requestAnimationFrame(draw);
  }

  function handleResize() {
    if (canvas && ctx) {
      const dpr = 1; // Keep resolution low for better blur performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    }
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    handleResize();
    window.addEventListener("resize", handleResize);
    draw();
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<div class="bg-wrapper">
    <canvas bind:this={canvas} class="parametric-bg"></canvas>
    <div class="noise-overlay"></div>
    <div class="vignette"></div>
</div>

<style>
  .bg-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -2;
      overflow: hidden;
      background: #000;
  }

  .parametric-bg {
      width: 100%;
      height: 100%;
      filter: blur(140px);
      transform: scale(1.3);
      opacity: 0.8;
  }

  .noise-overlay {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.04;
      mix-blend-mode: overlay;
      pointer-events: none;
  }

  .vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.4) 100%);
      pointer-events: none;
  }
</style>
