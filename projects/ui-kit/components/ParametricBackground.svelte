<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let theme: string = "github-dark";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationFrame: number;
  let time = 0;

  const colorConfigs: Record<string, string[]> = {
    "github-light": ["#f6f8fa", "#e1e4e8", "#d1d5da", "#ffffff"],
    "github-dark": ["#0d1117", "#161b22", "#30363d", "#1f2937"],
    "dracula": ["#282a36", "#44475a", "#6272a4", "#bd93f9"],
    "pro-red": ["#0f172a", "#1e293b", "#334155", "#ff5252"],
    "default": ["#000000", "#111111", "#222222", "#333333"]
  };

  $: colors = colorConfigs[theme] || colorConfigs["github-dark"];

  function draw() {
    if (!ctx) return;

    time += 0.001;
    const { width, height } = canvas;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 5; i++) {
        const x = width * (0.5 + 0.45 * Math.sin(time * (0.3 + i * 0.1) + i * 1.5));
        const y = height * (0.5 + 0.45 * Math.cos(time * (0.2 + i * 0.12) + i * 3));

        const size = Math.max(width, height) * (1.5 + 0.5 * Math.sin(time * 0.5 + i));

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        const baseColor = colors[(i + 1) % colors.length];

        gradient.addColorStop(0, `${baseColor}44`);
        gradient.addColorStop(0.4, `${baseColor}11`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    animationFrame = requestAnimationFrame(draw);
  }

  function handleResize() {
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
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

<canvas bind:this={canvas} class="parametric-bg"></canvas>

<style>
  .parametric-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -2;
    pointer-events: none;
    opacity: 0.9;
    filter: blur(100px);
    transform: scale(1.2);
  }
</style>
