<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import { TerminalIcon, InfoIcon } from "@yph/ui-kit";

  let canvas = $state<HTMLCanvasElement | null>(null);
  let playlists = $state<Playlist[]>([]);
  let loading = $state(true);

  onMount(async () => {
      playlists = await storageService.getPlaylists();
      loading = false;
      draw();
  });

  function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Simple radial layout for demonstration
      const centerX = w / 2;
      const centerY = h / 2;
      const radius = Math.min(w, h) * 0.35;

      // Draw Connections (based on shared tags)
      ctx.strokeStyle = 'rgba(255, 82, 82, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i < playlists.length; i++) {
          for (let j = i + 1; j < playlists.length; j++) {
              const p1 = playlists[i];
              const p2 = playlists[j];
              const tags1 = new Set((p1.loadedVideos || []).flatMap(v => v.aiTags || []));
              const tags2 = new Set((p2.loadedVideos || []).flatMap(v => v.aiTags || []));
              const common = [...tags1].filter(t => tags2.has(t));

              if (common.length > 0) {
                  const x1 = centerX + radius * Math.cos((i / playlists.length) * 2 * Math.PI);
                  const y1 = centerY + radius * Math.sin((i / playlists.length) * 2 * Math.PI);
                  const x2 = centerX + radius * Math.cos((j / playlists.length) * 2 * Math.PI);
                  const y2 = centerY + radius * Math.sin((j / playlists.length) * 2 * Math.PI);

                  ctx.beginPath();
                  ctx.moveTo(x1, y1);
                  ctx.lineTo(x2, y2);
                  ctx.stroke();
              }
          }
      }

      // Draw Nodes
      playlists.forEach((p, i) => {
          const angle = (i / playlists.length) * 2 * Math.PI;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          // Aura
          ctx.fillStyle = 'rgba(255, 82, 82, 0.2)';
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, 2 * Math.PI);
          ctx.fill();

          // Core
          ctx.fillStyle = '#ff5252';
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();

          // Label
          ctx.fillStyle = 'white';
          ctx.font = '800 10px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(p.title.toUpperCase(), x, y + 25);
      });
  }

  $effect(() => {
      if (playlists.length > 0) draw();
  });
</script>

<div class="topology-container pro-glass mt-8" in:fade>
    <div class="graph-header">
        <h3 class="card-title"><TerminalIcon size="18" /> Sector Topology</h3>
        <p class="muted">Inter-node connectivity via metadata signatures.</p>
    </div>

    <div class="canvas-wrapper mt-6">
        <canvas bind:this={canvas} width="800" height="400"></canvas>
    </div>

    <div class="graph-footer mt-4">
        <div class="legend">
            <div class="l-item"><div class="dot red"></div> <span>Infrastructure Node</span></div>
            <div class="l-item"><div class="line"></div> <span>Shared DNA Thread</span></div>
        </div>
    </div>
</div>

<style>
    .topology-container { padding: var(--space-8); border-radius: var(--radius-2xl); }
    .canvas-wrapper { background: rgba(0,0,0,0.2); border-radius: var(--radius-xl); border: 1px solid var(--border); overflow: hidden; display: flex; justify-content: center; }
    canvas { max-width: 100%; height: auto; }

    .graph-footer { display: flex; justify-content: center; }
    .legend { display: flex; gap: 2rem; }
    .l-item { display: flex; align-items: center; gap: 8px; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
    .dot.red { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 8px var(--primary); }
    .line { width: 20px; height: 1px; background: rgba(255, 82, 82, 0.4); }
</style>
