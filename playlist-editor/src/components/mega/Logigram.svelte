<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Video } from "../../types/model";
  import { spring } from "svelte/motion";
  import Fa from "svelte-fa";
  import { faCogs, faCodeBranch, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

  export let data: Video[] = [];
  export let title = "Visual Playlist Logic Weaver";

  const dispatch = createEventDispatcher();

  $: nodes = data.map((v, i) => ({
      video: v,
      id: v.videoId,
      title: v.title,
      x: 100 + (i % 4) * 200,
      y: 100 + Math.floor(i / 4) * 220,
      watched: v.watched
  }));

  // Add virtual "Logic" nodes between rows
  $: logicNodes = Array.from({ length: Math.ceil(data.length / 4) - 1 }).map((_, i) => ({
      id: `logic-${i}`,
      x: 450,
      y: 250 + i * 220,
      label: "AI FILTER: QUALITY > 4.0"
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
      <h4><Fa icon={faCogs} /> {title}</h4>
      <span class="badge">Node-Based Flow</span>
  </div>
  <div class="canvas-wrapper">
    <svg width="900" height={Math.max(400, (Math.ceil(data.length / 4)) * 250)} viewBox="0 0 900 800">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
        </marker>
      </defs>

      {#each connections as conn}
        <path
            d="M {conn.x1} {conn.y1} C {conn.x1 + 50} {conn.y1}, {conn.x2 - 50} {conn.y2}, {conn.x2} {conn.y2}"
            stroke={conn.active ? '#10b981' : '#e2e8f0'}
            stroke-width={conn.active ? '3' : '2'}
            fill="none"
            marker-end="url(#arrowhead)"
            class="flow-line"
            class:is-active={conn.active}
        />
      {/each}

      {#each logicNodes as logic}
          <g class="logic-node">
              <rect x={logic.x - 100} y={logic.y - 20} width="200" height="40" rx="20" fill="#f5f3ff" stroke="#ddd6fe" />
              <text x={logic.x} y={logic.y + 5} text-anchor="middle" class="logic-text">{logic.label}</text>
          </g>
      {/each}

      {#each nodes as node}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <g
            class="node"
            class:is-watched={node.watched}
            on:click={() => handleNodeClick(node.video)}
            on:keydown={(e) => e.key === 'Enter' && handleNodeClick(node.video)}
            tabindex="0"
            role="button"
        >
          <rect x={node.x - 85} y={node.y} width="170" height="70" rx="16" class="node-bg" />
          <text x={node.x} y={node.y + 35} text-anchor="middle" class="node-text">
            {node.title?.substring(0, 20)}...
          </text>
          <text x={node.x} y={node.y + 55} text-anchor="middle" class="node-sub">ID: {node.id.substring(0,6)}</text>
          {#if node.watched}
            <circle cx={node.x + 75} cy={node.y + 10} r="8" fill="#10b981" />
          {/if}
        </g>
      {/each}
    </svg>
  </div>
</div>

<style>
  .logigram-container { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 2rem; margin-top: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
  h4 { margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800; }
  .badge { font-size: 0.7rem; background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 30px; font-weight: bold; text-transform: uppercase; }

  .canvas-wrapper { overflow-x: auto; border-radius: 16px; background: #f8fafc; border: 1px solid #f1f5f9; }

  .node { cursor: pointer; outline: none; transition: transform 0.2s; }
  .node:hover { transform: scale(1.02); }
  .node-bg { fill: white; stroke: #e2e8f0; stroke-width: 2; transition: all 0.3s; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.02)); }
  .is-watched .node-bg { stroke: #10b981; }
  .node:hover .node-bg { stroke: var(--sidebar-bg-color); fill: #f8fafc; }

  .node-text { font-size: 11px; fill: #1e293b; font-weight: bold; pointer-events: none; }
  .node-sub { font-size: 9px; fill: #94a3b8; pointer-events: none; }

  .logic-node { font-size: 9px; font-weight: 800; fill: #6d28d9; letter-spacing: 0.5px; }

  .flow-line { transition: all 0.5s; stroke-dasharray: 6; animation: dash 15s linear infinite; }
  .flow-line.is-active { stroke-dasharray: none; animation: none; }

  @keyframes dash { to { stroke-dashoffset: 200; } }
</style>
