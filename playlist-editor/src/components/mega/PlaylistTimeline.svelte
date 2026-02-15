<script lang="ts">
  import type { Video } from "../../types/model";

  export let videos: Video[];

  $: sortedVideos = [...videos].sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));

  function formatDate(ts: number | undefined) {
    if (!ts) return "Unknown date";
    return new Date(ts).toLocaleString();
  }
</script>

<div class="timeline">
  {#each sortedVideos as video}
    <div class="timeline-item">
      <div class="time">{formatDate(video.dateAdded)}</div>
      <div class="content">
        <img src={video.thumbnailUrl} alt={video.title} />
        <div class="details">
          <span class="title">{video.title}</span>
          <span class="channel">{video.channel}</span>
        </div>
      </div>
    </div>
  {:else}
    <p>No videos with timeline data.</p>
  {/each}
</div>

<style>
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-left: 2px solid var(--border-color);
    margin-left: 1rem;
  }

  .timeline-item {
    display: flex;
    gap: 1rem;
    position: relative;
  }

  .timeline-item::before {
    content: "";
    position: absolute;
    left: -1.4rem;
    top: 0.5rem;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background-color: var(--sidebar-bg-color);
  }

  .time {
    font-size: 0.8rem;
    color: #666;
    min-width: 150px;
  }

  .content {
    display: flex;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    padding: 0.5rem;
    border-radius: 4px;
    flex-grow: 1;
  }

  img {
    width: 60px;
    height: 34px;
    object-fit: cover;
  }

  .details {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-weight: bold;
    font-size: 0.9rem;
  }

  .channel {
    font-size: 0.8rem;
    opacity: 0.8;
  }
</style>
