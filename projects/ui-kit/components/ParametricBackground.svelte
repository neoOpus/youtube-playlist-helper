<!-- REUSABLE SOTA COMPONENT: High-performance Canvas Mesh Gradient. Adapt colors in colorConfigs. -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let theme: string = "github-light";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationFrame: number;
  let time = 0;

  const colorConfigs: Record<string, string[]> = {
    "github-light": ["#f6f8fa", "#e1e4e8", "#d1d5da", "#ffffff"],
    "github-dark": ["#0d1117", "#161b22", "#30363d", "#1f2937"],
    "dracula": ["#282a36", "#44475a", "#6272a4", "#bd93f9"],
    "sota-red": ["#0f172a", "#1e293b", "#334155", "#ef4444"],
    "default": ["#ffffff", "#f0f0f0", "#e0e0e0", "#d0d0d0"]
  };

  $: colors = colorConfigs[theme] || colorConfigs["default"];

  function draw() {
    if (!ctx) return;

    time += 0.002; // Slower for more fluid feel
    const { width, height } = canvas;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "screen"; // Better for aurora effects

    // Create aurora waves
    for (let i = 0; i < 4; i++) {
        const x = width * (0.5 + 0.4 * Math.sin(time * (0.5 + i * 0.1) + i));
        const y = height * (0.5 + 0.4 * Math.cos(time * (0.4 + i * 0.15) + i * 2));

        const size = Math.max(width, height) * (1.2 + 0.2 * Math.sin(time + i));

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        const baseColor = colors[(i + 1) % colors.length];

        // Use very low alpha for subtle blending
        gradient.addColorStop(0, `${baseColor}33`);
        gradient.addColorStop(0.5, `${baseColor}11`);
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
    z-index: -1;
    pointer-events: none;
    opacity: 0.8;
    filter: blur(60px); /* Heavier blur for smoother gradients */
    transform: scale(1.1); /* Prevent blur edges from showing */
  }
</style>
