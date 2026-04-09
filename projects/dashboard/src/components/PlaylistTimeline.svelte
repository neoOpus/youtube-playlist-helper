<svelte:options runes={true} />
<script lang="ts">
  import type { Video } from "@yph/core";
  let { videos = [] }: { videos: Video[] } = $props();
  let sortedVideos = $derived([...videos].sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)));
</script>

<div class="timeline">
  {#each sortedVideos as video}
    <div class="timeline-item">
      <div class="dot"></div>
      <div class="content">
        <span class="date">{video.dateAdded ? new Date(video.dateAdded).toLocaleDateString() : 'Unknown'}</span>
        <span class="title">{video.title}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline { display: flex; flex-direction: column; gap: 1rem; border-left: 1px solid var(--border); padding-left: 1.5rem; margin-left: 0.5rem; }
  .timeline-item { position: relative; display: flex; flex-direction: column; gap: 4px; }
  .dot { position: absolute; left: -1.85rem; top: 0.4rem; width: 10px; height: 10px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 8px var(--primary); }
  .date { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
  .title { font-weight: 700; font-size: 0.9rem; }
</style>
