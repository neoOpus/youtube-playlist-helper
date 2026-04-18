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
  let hoveredNodeIndex = $state<number | null>(null);

  onMount(async () => {
    playlists = await storageService.getPlaylists();
    initMap();
    animate();
  });

  function initMap() {
    if (!canvas) return;
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
            originY: y,
            id: pl.id
        });
        links.push({ from: 0, to: nodes.length - 1 });
    });
  }

  function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

      let foundIndex = null;
      for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const dx = node.x - mouseX;
          const dy = node.y - mouseY;
          const distSq = dx * dx + dy * dy;
          const radiusSq = (node.r + 5) * (node.r + 5);

          if (distSq < radiusSq) {
              foundIndex = i;
              break;
          }
      }
      hoveredNodeIndex = foundIndex;
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

          if (hoveredNodeIndex === i) {
              node.vx += (Math.random() - 0.5) * 0.5;
              node.vy += (Math.random() - 0.5) * 0.5;
          }

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
          const isHovered = hoveredNodeIndex === link.to || hoveredNodeIndex === 0;
          ctx.strokeStyle = isHovered ? "rgba(255, 82, 82, 0.4)" : "rgba(255, 82, 82, 0.1)";
          ctx.lineWidth = isHovered ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(nodes[link.from].x, nodes[link.from].y);
          ctx.lineTo(nodes[link.to].x, nodes[link.to].y);
          ctx.stroke();
      });

      // Nodes
      nodes.forEach((node, i) => {
          const isHovered = hoveredNodeIndex === i;
          ctx.shadowBlur = i === 0 ? 30 : (isHovered ? 20 : 10);
          ctx.shadowColor = i === 0 ? "var(--primary)" : (isHovered ? "var(--primary)" : "rgba(255,255,255,0.1)");

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + (isHovered ? 4 : 0), 0, Math.PI * 2);
          ctx.fillStyle = i === 0 ? "var(--primary)" : (isHovered ? "rgba(255, 82, 82, 0.2)" : "rgba(10, 15, 25, 0.95)");
          ctx.fill();

          ctx.strokeStyle = i === 0 ? "white" : (isHovered ? "var(--primary)" : "rgba(255,255,255,0.15)");
          ctx.lineWidth = i === 0 ? 3 : (isHovered ? 2 : 1);
          ctx.stroke();

          ctx.shadowBlur = 0;
          ctx.fillStyle = "white";
          ctx.font = i === 0 ? "900 11px 'Inter'" : (isHovered ? "900 9px 'Inter'" : "700 8px 'Inter'");
          ctx.textAlign = "center";
          ctx.fillText(node.label.toUpperCase().substring(0, 15), node.x, node.y + 4);

          if (isHovered && i !== 0) {
              ctx.font = "800 7px 'JetBrains Mono'";
              ctx.fillStyle = "rgba(255,255,255,0.6)";
              ctx.fillText("NODE ACTIVE", node.x, node.y + 14);
          }
      });

      requestAnimationFrame(animate);
  }
</script>

<div class="infrastructure-map" in:fade>
    <canvas
        bind:this={canvas}
        width="1000"
        height="500"
        onmousemove={handleMouseMove}
        onmouseleave={() => hoveredNodeIndex = null}
    ></canvas>
</div>

<style>
    .infrastructure-map { position: relative; width: 100%; height: 500px; overflow: hidden; }
    canvas { width: 100%; height: 100%; cursor: crosshair; }
</style>
