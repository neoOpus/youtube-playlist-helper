<script lang="ts">
  import { onMount } from "svelte";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import { fade } from "svelte/transition";

  let canvas: HTMLCanvasElement;
  let playlists: Playlist[] = [];
  let nodes = [];
  let links = [];

  onMount(async () => {
    playlists = await storageService.getPlaylists();
    initMap();
    animate();
  });

  function initMap() {
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Center Node (You / Library)
    nodes.push({ x: centerX, y: centerY, label: "Infrastructure", r: 40, color: "var(--primary)" });

    // Playlist Nodes
    playlists.forEach((pl, i) => {
        const angle = (i / playlists.length) * Math.PI * 2;
        const dist = 200 + Math.random() * 50;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;

        nodes.push({ x, y, label: pl.title, r: 25, color: "var(--text)" });
        links.push({ from: 0, to: nodes.length - 1 });
    });
  }

  function animate() {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Links
      ctx.strokeStyle = "rgba(255, 82, 82, 0.1)";
      ctx.lineWidth = 1;
      links.forEach(link => {
          ctx.beginPath();
          ctx.moveTo(nodes[link.from].x, nodes[link.from].y);
          ctx.lineTo(nodes[link.to].x, nodes[link.to].y);
          ctx.stroke();
      });

      // Draw Nodes
      nodes.forEach(node => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(10, 15, 25, 0.8)";
          ctx.fill();
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "white";
          ctx.font = "800 10px 'JetBrains Mono'";
          ctx.textAlign = "center";
          ctx.fillText(node.label.substring(0, 15), node.x, node.y + 4);
      });

      requestAnimationFrame(animate);
  }
</script>

<div class="neural-map pro-glass mt-8" in:fade>
    <div class="map-overlay">
        <span class="badge">LIVE NEURAL INFRASTRUCTURE</span>
    </div>
    <canvas bind:this={canvas} width="800" height="500"></canvas>
</div>

<style>
    .neural-map { position: relative; width: 100%; height: 500px; border: 1px solid var(--border); overflow: hidden; }
    .map-overlay { position: absolute; top: 20px; left: 20px; z-index: 10; }
    canvas { width: 100%; height: 100%; }
    .badge { background: var(--primary); color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; }
</style>
