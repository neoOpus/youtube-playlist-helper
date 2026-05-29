<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { storageService, embeddingService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { router } from "../stores/router";
  import * as d3 from "d3";

  let container: HTMLDivElement;
  let playlists = $state<Playlist[]>([]);
  let height = 600;

  onMount(async () => {
    playlists = await storageService.getPlaylists();
    initGraph();
  });

  function initGraph() {
    if (!container || playlists.length === 0) return;

    const nodes: any[] = [{ id: "CORE", group: 0, label: "INFRASTRUCTURE CORE", r: 35, type: 'core' }];
    const links: any[] = [];

    playlists.forEach((pl) => {
      nodes.push({
          id: pl.id,
          group: 1,
          label: pl.title,
          r: 20,
          type: 'sector',
          data: pl
      });
      links.push({ source: "CORE", target: pl.id, strength: 0.1 });

      if (pl.loadedVideos) {
        pl.loadedVideos.slice(0, 10).forEach((v, j) => {
          const vId = `${pl.id}-v-${v.videoId}`;
          nodes.push({
              id: vId,
              group: 2,
              label: v.title.substring(0, 15),
              r: 10,
              type: 'node',
              data: v,
              sectorId: pl.id
          });
          links.push({ source: pl.id, target: vId, strength: 0.5 });
        });
      }
    });

    // Semantic Cross-Sector Links (Force attraction between semantically similar sectors)
    // In a world-class implementation, we'd calculate this based on centroids
    // For now, let's establish strong internal sector forces

    const svg = d3.select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [0, 0, 1000, height] as any)
      .style("background", "radial-gradient(circle at center, rgba(255,82,82,0.05) 0%, transparent 80%)");

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
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Glow Filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    node.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => {
          if (d.type === 'core') return "var(--primary)";
          if (d.type === 'sector') return "var(--text)";
          return "var(--bg-tertiary)";
      })
      .attr("stroke", (d: any) => d.type === 'node' ? "rgba(255,255,255,0.2)" : "var(--primary)")
      .attr("stroke-width", 2)
      .style("filter", d => d.type === 'core' ? "url(#glow)" : "none");

    const labels = node.append("text")
      .attr("dy", (d: any) => d.r + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-muted)")
      .attr("font-size", d => d.type === 'core' ? "10px" : "8px")
      .attr("font-weight", "900")
      .attr("font-family", "JetBrains Mono, monospace")
      .style("pointer-events", "none")
      .text((d: any) => d.label.toUpperCase());

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
</script>

<div class="topology-graph pro-glass mt-8" bind:this={container} in:fade>
    <div class="graph-header">
        <div class="header-meta">
            <TerminalIcon size="14" color="var(--primary)" />
            <span>NEURAL_INFRASTRUCTURE_VISUALIZER_V2</span>
        </div>
        <div class="legend">
            <div class="l-item"><div class="dot core"></div> CORE</div>
            <div class="l-item"><div class="dot sector"></div> SECTOR</div>
            <div class="l-item"><div class="dot node"></div> NODE</div>
        </div>
    </div>
</div>

<style>
    .topology-graph {
        position: relative;
        width: 100%;
        height: 600px;
        border: 1px solid var(--border-strong);
        overflow: hidden;
        background: rgba(0,0,0,0.3);
        border-radius: 32px;
    }
    .graph-header { position: absolute; top: 24px; left: 24px; right: 24px; display: flex; justify-content: space-between; align-items: center; z-index: 10; pointer-events: none; }

    .header-meta { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 900; color: var(--primary); letter-spacing: 2px; }

    .legend { display: flex; gap: 1.5rem; }
    .l-item { display: flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 900; color: var(--text-dim); }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.core { background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .dot.sector { background: var(--text); }
    .dot.node { background: var(--bg-tertiary); border: 1px solid var(--border); }

    :global(svg) { cursor: grab; }
    :global(svg:active) { cursor: grabbing; }
</style>
