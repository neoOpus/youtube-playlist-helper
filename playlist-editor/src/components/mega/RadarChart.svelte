<script lang="ts">
  import { onMount } from "svelte";

  export let data: Record<string, number> = {};
  export let size = 300;

  const categories = ['Tech', 'Gaming', 'Music', 'News', 'Education'];
  const center = size / 2;
  const radius = (size / 2) * 0.8;

  function getCoordinates(index: number, value: number) {
    const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
    const valRadius = (value / 100) * radius;
    return {
        x: center + valRadius * Math.cos(angle),
        y: center + valRadius * Math.sin(angle)
    };
  }

  $: points = categories.map((cat, i) => {
      const val = data[cat] || 0;
      const coords = getCoordinates(i, val);
      return `${coords.x},${coords.y}`;
  }).join(' ');

  $: axisLines = categories.map((_, i) => {
      const end = getCoordinates(i, 100);
      return { x1: center, y1: center, x2: end.x, y2: end.y };
  });

  $: labels = categories.map((cat, i) => {
      const pos = getCoordinates(i, 115);
      return { text: cat, x: pos.x, y: pos.y };
  });
</script>

<div class="radar-chart">
    <svg width={size} height={size}>
        <!-- Axis circles -->
        {#each [25, 50, 75, 100] as r}
            <circle cx={center} cy={center} r={(r/100)*radius} class="axis-circle" />
        {/each}

        <!-- Axis lines -->
        {#each axisLines as line}
            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} class="axis-line" />
        {/each}

        <!-- Data shape -->
        <polygon {points} class="data-polygon" />

        {#each labels as label}
            <text x={label.x} y={label.y} text-anchor="middle" class="label">{label.text}</text>
        {/each}
    </svg>
</div>

<style>
  .radar-chart { display: flex; justify-content: center; padding: 2rem; background: white; border-radius: 20px; border: 1px solid #eee; }
  .axis-circle { fill: none; stroke: #f1f5f9; stroke-width: 1; }
  .axis-line { stroke: #f1f5f9; stroke-width: 1; }
  .data-polygon { fill: var(--sidebar-bg-color); fill-opacity: 0.3; stroke: var(--sidebar-bg-color); stroke-width: 2; }
  .label { font-size: 10px; font-weight: bold; fill: #64748b; text-transform: uppercase; }
</style>
