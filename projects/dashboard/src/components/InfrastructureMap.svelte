<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import { fade } from "svelte/transition";

  let canvas: HTMLCanvasElement;
  let playlists = $state<Playlist[]>([]);
  let nodes: any[] = [];
  let links: any[] = [];

  onMount(async () => {
    playlists = await storageService.getPlaylists();
    initMap();
    animate();
  });

  function initMap() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    nodes = [];
    links = [];

    // Core Node
    nodes.push({
        x: centerX,
        y: centerY,
        label: "PRO CORE",
        r: 35,
        color: "var(--primary)",
        vx: 0, vy: 0,
        originX: centerX, originY: centerY
    });

    // Node Clusters
    playlists.forEach((pl, i) => {
        const angle = (i / playlists.length) * Math.PI * 2;
        const dist = 180 + Math.random() * 40;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;

        nodes.push({
            x, y,
            label: pl.title,
            r: 20,
            color: "var(--text)",
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            originX: x,
            originY: y
        });
        links.push({ from: 0, to: nodes.length - 1 });
    });
  }

  function animate() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
          if (i === 0) return;
          const dx = node.originX - node.x;
          const dy = node.originY - node.y;
          node.vx += dx * 0.005;
          node.vy += dy * 0.005;
          node.vx *= 0.96;
          node.vy *= 0.96;
          node.x += node.vx;
          node.y += node.vy;
      });

      // Connections
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 82, 82, 0.1)";
      ctx.lineWidth = 1;
      links.forEach(link => {
          ctx.beginPath();
          ctx.moveTo(nodes[link.from].x, nodes[link.from].y);
          ctx.lineTo(nodes[link.to].x, nodes[link.to].y);
          ctx.stroke();
      });

      // Nodes
      nodes.forEach((node, i) => {
          ctx.shadowBlur = i === 0 ? 30 : 10;
          ctx.shadowColor = i === 0 ? "var(--primary)" : "rgba(255,255,255,0.1)";

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fillStyle = i === 0 ? "var(--primary)" : "rgba(10, 15, 25, 0.95)";
          ctx.fill();

          ctx.strokeStyle = i === 0 ? "white" : "rgba(255,255,255,0.15)";
          ctx.lineWidth = i === 0 ? 3 : 1;
          ctx.stroke();

          ctx.shadowBlur = 0;
          ctx.fillStyle = "white";
          ctx.font = i === 0 ? "900 11px 'Inter'" : "700 8px 'Inter'";
          ctx.textAlign = "center";
          ctx.fillText(node.label.toUpperCase().substring(0, 15), node.x, node.y + 4);
      });

      requestAnimationFrame(animate);
  }
</script>

<div class="infrastructure-map pro-glass mt-8" in:fade>
    <div class="map-overlay">
        <div class="status-indicator">
            <div class="dot pulse"></div>
            <span class="badge">PROCORE LIVE MAPPING</span>
        </div>
    </div>
    <canvas bind:this={canvas} width="1000" height="500"></canvas>
</div>

<style>
    .infrastructure-map { position: relative; width: 100%; height: 500px; border: 1px solid var(--border); overflow: hidden; background: rgba(0,0,0,0.2); }
    .map-overlay { position: absolute; top: 20px; left: 20px; z-index: 10; }
    .status-indicator { display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.6); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border); }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }
    .dot.pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }
    canvas { width: 100%; height: 100%; }
    .badge { color: white; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
</style>
