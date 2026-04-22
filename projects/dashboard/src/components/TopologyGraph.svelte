<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import * as d3 from "d3";

  let container: HTMLDivElement;
  let playlists = $state<Playlist[]>([]);
  let height = 500;

  onMount(async () => {
    playlists = await storageService.getPlaylists();
    initGraph();
  });

  function initGraph() {
    if (!container || playlists.length === 0) return;

    const nodes: any[] = [{ id: "CORE", group: 0, label: "PRO CORE", r: 30 }];
    const links: any[] = [];

    playlists.forEach((pl, i) => {
      nodes.push({ id: pl.id, group: 1, label: pl.title, r: 15 });
      links.push({ source: "CORE", target: pl.id });

      if (pl.loadedVideos) {
        pl.loadedVideos.slice(0, 3).forEach((v, j) => {
          const vId = `${pl.id}-v-${j}`;
          nodes.push({ id: vId, group: 2, label: v.title.substring(0, 10), r: 8 });
          links.push({ source: pl.id, target: vId });
        });
      }
    });

    const svg = d3.select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [0, 0, 1000, height] as any);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(500, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.r + 5));

    const link = svg.append("g")
      .attr("stroke", "rgba(255, 82, 82, 0.2)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => d.group === 0 ? "var(--primary)" : (d.group === 1 ? "var(--text)" : "var(--bg-secondary)"))
      .attr("stroke", "var(--border)")
      .attr("stroke-width", 2)
      .attr("class", "luminous-hover");

    node.append("text")
      .attr("dy", (d: any) => d.r + 12)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-muted)")
      .attr("font-size", "8px")
      .attr("font-weight", "800")
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

<div class="topology-graph surface-1 mt-8" bind:this={container} in:fade>
    <div class="graph-overlay">
        <span class="badge">D3 TOPOLOGY ENGINE</span>
    </div>
</div>

<style>
    .topology-graph {
        position: relative;
        width: 100%;
        height: 500px;
        border: 1px solid var(--border);
        overflow: hidden;
        background: rgba(0,0,0,0.1);
        border-radius: 24px;
    }
    .graph-overlay { position: absolute; top: 20px; right: 20px; z-index: 10; pointer-events: none; }
    .badge {
        background: rgba(0,0,0,0.6);
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid var(--border);
        color: var(--primary);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1px;
    }
    :global(svg) { cursor: grab; }
    :global(svg:active) { cursor: grabbing; }
</style>
