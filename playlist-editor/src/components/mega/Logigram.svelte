<script lang="ts">
  import type { Video } from "../../types/model";
  import { spring } from "svelte/motion";

  export let data: Video[] = [];
  export let title = "Playlist Intelligence Map";

  // Calculate nodes and connections
  $: nodes = data.map((v, i) => ({
      id: v.videoId,
      title: v.title,
      x: 100 + (i % 4) * 200,
      y: 80 + Math.floor(i / 4) * 100,
      watched: v.watched
  }));

  $: connections = nodes.slice(0, -1).map((n, i) => ({
      x1: n.x + 75,
      y1: n.y + 30,
      x2: nodes[i+1].x - 25, // Adjusted to point to start of next node
      y2: nodes[i+1].y + 30,
      active: n.watched
  }));
</script>

<div class="logigram-container">
  <div class="header">
      <h4>{title}</h4>
      <span class="badge">Experimental</span>
  </div>
  <div class="canvas-wrapper">
    <svg width="900" height={Math.max(400, (Math.ceil(data.length / 4)) * 120)} viewBox="0 0 900 600">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
        </marker>
        <filter id="shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.1"/>
        </filter>
      </defs>

      {#each connections as conn}
        <path
            d="M {conn.x1} {conn.y1} C {conn.x1 + 50} {conn.y1}, {conn.x2 - 50} {conn.y2}, {conn.x2} {conn.y2}"
            stroke={conn.active ? 'var(--sidebar-bg-color)' : '#ddd'}
            stroke-width="2"
            fill="none"
            marker-end="url(#arrowhead)"
            class="flow-line"
            class:is-active={conn.active}
        />
      {/each}

      {#each nodes as node}
        <g class="node" class:is-watched={node.watched} filter="url(#shadow)">
          <rect x={node.x - 75} y={node.y} width="150" height="60" rx="12" class="node-bg" />
          <text x={node.x} y={node.y + 35} text-anchor="middle" class="node-text">
            {node.title?.substring(0, 18)}...
          </text>
          {#if node.watched}
            <circle cx={node.x + 65} cy={node.y + 10} r="6" fill="#28a745" />
          {/if}
        </g>
      {/each}
    </svg>
  </div>
</div>

<style>
  .logigram-container {
    background: white;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 24px;
    margin-top: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }

  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  h4 { margin: 0; font-size: 1.1rem; color: #333; }
  .badge { font-size: 0.7rem; background: #eee; padding: 2px 8px; border-radius: 10px; color: #666; }

  .canvas-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    background: #fafafa;
  }

  .node-bg { fill: white; stroke: #eee; stroke-width: 1; transition: all 0.3s; }
  .is-watched .node-bg { stroke: #28a745; stroke-width: 2; }
  .node-text { font-size: 10px; fill: #444; font-weight: 500; }

  .flow-line { transition: stroke 0.5s; stroke-dasharray: 5; animation: dash 10s linear infinite; }
  .flow-line.is-active { stroke-dasharray: none; animation: none; stroke-width: 3; }

  @keyframes dash {
    to { stroke-dashoffset: 100; }
  }

  .node:hover .node-bg { fill: #f0f0f0; transform: translateY(-2px); }
</style>
