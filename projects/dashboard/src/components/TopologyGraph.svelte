<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { storageService, embeddingService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { router } from "../stores/router";
  import { TerminalIcon } from "@yph/ui-kit";
  import * as d3 from "d3";

  let container: HTMLDivElement;
  let canvas = $state<HTMLCanvasElement>();
  let playlists = $state<Playlist[]>([]);
  let height = 600;
  let useCanvas = $state(false);

  onMount(async () => {
    playlists = await storageService.getPlaylists();
    const totalNodes = playlists.reduce((acc, pl) => acc + (pl.loadedVideos?.length || 0), 0);
    if (totalNodes > 300) useCanvas = true;

    if (useCanvas) initCanvasGraph();
    else initSVGGraph();
  });

  function initSVGGraph() {
    if (!container || playlists.length === 0) return;

    const nodes: any[] = [{ id: "CORE", group: 0, label: "INFRASTRUCTURE CORE", r: 35, type: 'core' }];
    const links: any[] = [];

    playlists.forEach((pl) => {
      nodes.push({ id: pl.id, group: 1, label: pl.title, r: 20, type: 'sector', data: pl });
      links.push({ source: "CORE", target: pl.id, strength: 0.1 });

      if (pl.loadedVideos) {
        pl.loadedVideos.slice(0, 10).forEach((v) => {
          const vId = `${pl.id}-v-${v.videoId}`;
          nodes.push({ id: vId, group: 2, label: v.title.substring(0, 15), r: 10, type: 'node', data: v, sectorId: pl.id });
          links.push({ source: pl.id, target: vId, strength: 0.5 });
        });
      }
    });

    const svg = d3.select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [0, 0, 1000, height] as any);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(d => d.type === 'node' ? 40 : 120))
      .force("charge", d3.forceManyBody().strength(d => d.type === 'core' ? -1000 : -200))
      .force("center", d3.forceCenter(500, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.r + 10));

    const link = svg.append("g")
      .attr("stroke", "var(--primary)")
      .attr("stroke-opacity", 0.15)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => d.strength * 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (event, d: any) => {
          if (d.type === 'sector') router.push(`/edit/${d.id}`);
          if (d.type === 'node') router.push(`/edit/${d.sectorId}?videoId=${d.data.videoId}`);
      });

    node.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => d.type === 'core' ? "var(--primary)" : (d.type === 'sector' ? "var(--text)" : "var(--bg-tertiary)"))
      .attr("stroke", "var(--primary)")
      .attr("stroke-width", 2);

    simulation.on("tick", () => {
      link.attr("x1", d => (d.source as any).x).attr("y1", d => (d.source as any).y).attr("x2", d => (d.target as any).x).attr("y2", d => (d.target as any).y);
      node.attr("transform", d => `translate(${(d as any).x},${(d as any).y})`);
    });
  }

  function initCanvasGraph() {
      // world-class canvas simulation for high node counts
      const ctx = canvas.getContext("2d")!;
      const nodes: any[] = [{ id: "CORE", x: 500, y: height/2, r: 30, type: 'core' }];
      const links: any[] = [];

      playlists.forEach(pl => {
          nodes.push({ id: pl.id, r: 15, type: 'sector' });
          links.push({ source: "CORE", target: pl.id });
          (pl.loadedVideos || []).forEach(v => {
              nodes.push({ id: v.videoId, r: 5, type: 'node' });
              links.push({ source: pl.id, target: v.videoId });
          });
      });

      const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id((d: any) => d.id))
          .force("charge", d3.forceManyBody().strength(-50))
          .force("center", d3.forceCenter(500, height / 2));

      simulation.on("tick", () => {
          ctx.clearRect(0, 0, 1000, height);
          ctx.strokeStyle = "rgba(255, 82, 82, 0.1)";
          ctx.beginPath();
          links.forEach(d => {
              ctx.moveTo(d.source.x, d.source.y);
              ctx.lineTo(d.target.x, d.target.y);
          });
          ctx.stroke();

          nodes.forEach(d => {
              ctx.fillStyle = d.type === 'core' ? "#ff5252" : (d.type === 'sector' ? "#fff" : "#444");
              ctx.beginPath();
              ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
              ctx.fill();
          });
      });
  }
</script>

<div class="topology-graph pro-glass mt-8" bind:this={container} in:fade>
    <div class="graph-header">
        <div class="header-meta">
            <TerminalIcon size="14" color="var(--primary)" />
            <span>NEURAL_INFRASTRUCTURE_VISUALIZER_V2</span>
        </div>
        {#if useCanvas}<span class="mode-tag">CANVAS_PERFORMANCE_MODE</span>{/if}
    </div>
    {#if useCanvas}
        <canvas bind:this={canvas} width="1000" height={height}></canvas>
    {/if}
</div>

<style>
    .topology-graph { position: relative; width: 100%; height: 600px; border: 1px solid var(--border-strong); overflow: hidden; background: rgba(0,0,0,0.3); border-radius: 32px; }
    .graph-header { position: absolute; top: 24px; left: 24px; right: 24px; display: flex; justify-content: space-between; align-items: center; z-index: 10; pointer-events: none; }
    .header-meta { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 900; color: var(--primary); letter-spacing: 2px; }
    .mode-tag { font-size: 8px; font-weight: 900; color: var(--success); opacity: 0.8; }
    canvas { width: 100%; height: 100%; }
</style>
