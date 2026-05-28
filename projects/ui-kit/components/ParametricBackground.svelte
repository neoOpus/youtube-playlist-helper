<svelte:options runes={true} />
<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let { theme = "github-dark", intensity = 1.0 } = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationFrame: number;
  let time = 0;

  const colorConfigs: Record<string, string[]> = {
    "github-light": ["#f8fafc", "#e2e8f0", "#cbd5e1", "#ffffff"],
    "github-dark": ["#020617", "#0f172a", "#1e293b", "#0f172a"],
    "dracula": ["#282a36", "#44475a", "#6272a4", "#bd93f9"],
    "pro-red": ["#080000", "#1a0505", "#2a0a0a", "#ff5252"],
    "default": ["#000000", "#050505", "#0a0a0a", "#111111"]
  };

  let colors = $derived(colorConfigs[theme] || colorConfigs["github-dark"]);

  function draw() {
    if (!ctx || !canvas) return;

    time += 0.0003 * intensity;

    const { width, height } = canvas;
    const diag = Math.sqrt(width * width + height * height);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 8; i++) {
        const t = time * (0.4 + i * 0.08);
        const x = width * (0.5 + 0.45 * Math.sin(t + i * 2.1));
        const y = height * (0.5 + 0.45 * Math.cos(t * 0.7 + i * 1.5));

        const size = diag * (1.5 + 0.8 * Math.sin(t * 0.4 + i));

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        const baseColor = colors[(i % (colors.length - 1)) + 1];

        const alpha = (0.12 + 0.04 * Math.sin(time * 1.5 + i)).toFixed(3);

        gradient.addColorStop(0, `${baseColor}${Math.floor(parseFloat(alpha)*255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.6, `${baseColor}03`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    animationFrame = requestAnimationFrame(draw);
  }

  function handleResize() {
    if (canvas && ctx) {
      const dpr = 1;
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
    <div class="grain-overlay"></div>
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
      filter: blur(160px) contrast(1.1);
      transform: scale(1.4);
      opacity: 0.9;
  }

  .grain-overlay {
      position: absolute;
      inset: -100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.06;
      mix-blend-mode: overlay;
      pointer-events: none;
      animation: grain 8s steps(10) infinite;
  }

  @keyframes grain {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-5%, -10%); }
      20% { transform: translate(-15%, 5%); }
      30% { transform: translate(7%, -25%); }
      40% { transform: translate(-5%, 25%); }
      50% { transform: translate(-15%, 10%); }
      60% { transform: translate(15%, 0%); }
      70% { transform: translate(0%, 15%); }
      80% { transform: translate(3%, 35%); }
      90% { transform: translate(-10%, 10%); }
  }

  .vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%);
      pointer-events: none;
  }
</style>
