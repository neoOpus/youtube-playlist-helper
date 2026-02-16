<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Video } from "../../types/model";
  import { spring } from "svelte/motion";

  export let data: Video[] = [];
  export let title = "Playlist Intelligence Map";

  const dispatch = createEventDispatcher();

  $: nodes = data.map((v, i) => ({
      video: v,
      id: v.videoId,
      title: v.title,
      x: 100 + (i % 4) * 200,
      y: 80 + Math.floor(i / 4) * 120,
      watched: v.watched
  }));

  $: connections = nodes.slice(0, -1).map((n, i) => ({
      x1: n.x + 75,
      y1: n.y + 30,
      x2: nodes[i+1].x - 75,
      y2: nodes[i+1].y + 30,
      active: n.watched
  }));

  function handleNodeClick(video: Video) {
      dispatch("selectVideo", video);
  }
</script>

<div class="logigram-container">
  <div class="header">
      <h4>{title}</h4>
      <span class="badge">Interactive</span>
  </div>
  <div class="canvas-wrapper">
    <svg width="900" height={Math.max(400, (Math.ceil(data.length / 4)) * 140)} viewBox="0 0 900 600">
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
            stroke={conn.active ? '#28a745' : '#ddd'}
            stroke-width={conn.active ? '3' : '2'}
            fill="none"
            marker-end="url(#arrowhead)"
            class="flow-line"
            class:is-active={conn.active}
        />
      {/each}

      {#each nodes as node}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <g
            class="node"
            class:is-watched={node.watched}
            filter="url(#shadow)"
            on:click={() => handleNodeClick(node.video)}
            on:keydown={(e) => e.key === 'Enter' && handleNodeClick(node.video)}
            tabindex="0"
            role="button"
        >
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
  .badge { font-size: 0.7rem; background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 10px; }

  .canvas-wrapper {
    overflow-x: auto;
    border-radius: 12px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
  }

  .node { cursor: pointer; outline: none; }
  .node-bg { fill: white; stroke: #eee; stroke-width: 1; transition: all 0.3s; }
  .is-watched .node-bg { stroke: #28a745; stroke-width: 2; }
  .node:hover .node-bg { fill: #f8f9fa; stroke: var(--sidebar-bg-color); transform: translateY(-2px); }

  .node-text { font-size: 10px; fill: #444; font-weight: 500; pointer-events: none; }

  .flow-line { transition: all 0.5s; stroke-dasharray: 5; animation: dash 10s linear infinite; }
  .flow-line.is-active { stroke-dasharray: none; animation: none; }

  @keyframes dash {
    to { stroke-dashoffset: 100; }
  }
</style>
