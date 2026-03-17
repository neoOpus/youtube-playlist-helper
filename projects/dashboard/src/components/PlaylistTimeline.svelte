<script lang="ts">
  import type { Video } from "@yph/core";
  import { fade } from "svelte/transition";

  export let videos: Video[] = [];

  $: sortedVideos = [...videos].sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));

  function formatDate(ts: number | undefined) {
    if (!ts) return "Temporal Drift Detected";
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="timeline-container" in:fade>
  <div class="timeline-v-line"></div>
  {#each sortedVideos as video (video.videoId)}
    <div class="timeline-item pro-glass">
      <div class="timeline-marker"></div>
      <div class="time-stamp">{formatDate(video.dateAdded)}</div>
      <div class="node-content">
        <img src={video.thumbnailUrl} alt={video.title} class="node-thumb" />
        <div class="node-details">
          <span class="node-title">{video.title}</span>
          <span class="node-channel">{video.channel}</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-timeline">
      <p>No historical nodes detected in this sequence.</p>
    </div>
  {/each}
</div>

<style>
  .timeline-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }

  .timeline-v-line {
    position: absolute;
    left: 45px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, transparent, var(--primary), transparent);
    opacity: 0.3;
  }

  .timeline-item {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
    border-radius: 12px;
    position: relative;
    border: 1px solid var(--border);
    transition: transform 0.2s;
  }

  .timeline-item:hover {
    transform: translateX(10px);
    border-color: var(--primary);
  }

  .timeline-marker {
    position: absolute;
    left: -13px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 0 10px var(--primary);
    z-index: 2;
  }

  .time-stamp {
    font-family: 'JetBrains Mono';
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--primary);
    min-width: 120px;
    text-transform: uppercase;
  }

  .node-content {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-grow: 1;
  }

  .node-thumb {
    width: 80px;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .node-details {
    display: flex;
    flex-direction: column;
  }

  .node-title {
    font-weight: 900;
    font-size: 0.95rem;
    color: var(--text);
    line-height: 1.2;
  }

  .node-channel {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .empty-timeline {
    text-align: center;
    padding: 4rem;
    color: var(--text-muted);
    font-weight: 800;
  }
</style>
