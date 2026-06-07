<script lang="ts">
  import type { Video } from "@yph/core";
  import { Trash2, ExternalLink, User } from "lucide-svelte";

  let {
    video = $bindable(),
    ondelete = (v: Video) => {},
  }: {
    video: Video;
    ondelete?: (v: Video) => void;
  } = $props();

  function videoClicked() { window.open(video.url, "_blank"); }
  function deleteVideo() { ondelete(video); }
</script>

<div class="video-row">
  <div class="thumbnail" onclick={videoClicked} role="button" tabindex="0" onkeydown={e => e.key === 'Enter' && videoClicked()}>
      <img src={video.thumbnailUrl} alt="" loading="lazy" />
      <div class="duration">{video.duration || '0:00'}</div>
  </div>

  <div class="info" onclick={videoClicked} role="button" tabindex="0" onkeydown={e => e.key === 'Enter' && videoClicked()}>
      <div class="title">{video.title}</div>
      <div class="meta">
          <div class="channel"><User size="12" /> {video.channel}</div>
      </div>
  </div>

  <div class="actions">
      <button class="action-btn" onclick={videoClicked} title="Open in YouTube">
          <ExternalLink size="14" />
      </button>
      <button class="action-btn danger" onclick={deleteVideo} title="Remove from Playlist">
          <Trash2 size="14" />
      </button>
  </div>
</div>

<style>
  .video-row {
    display: flex; align-items: center; padding: 0.75rem 1rem; gap: 1rem;
    border-bottom: 1px solid var(--border-base);
    background: var(--bg-surface-1);
    transition: background 0.1s;
  }
  .video-row:hover { background: var(--surface-hover); }

  .thumbnail {
      width: 100px; height: 56px; border-radius: 4px; overflow: hidden;
      position: relative; cursor: pointer; flex-shrink: 0; background: #000;
  }
  img { width: 100%; height: 100%; object-fit: cover; }

  .duration {
      position: absolute; bottom: 2px; right: 2px;
      background: rgba(0,0,0,0.8); color: white; padding: 1px 4px;
      border-radius: 2px; font-size: 0.65rem; font-weight: 700;
  }

  .info { flex: 1; min-width: 0; cursor: pointer; }
  .title { font-weight: 600; font-size: 0.9rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
  .meta { display: flex; align-items: center; gap: 1rem; font-size: 0.75rem; color: var(--text-secondary); }
  .channel { display: flex; align-items: center; gap: 4px; }

  .actions { display: flex; gap: 0.5rem; }
  .action-btn {
      background: transparent; border: 1px solid var(--border-base); color: var(--text-muted);
      width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
  }
  .action-btn:hover { color: var(--text-main); border-color: var(--border-strong); }
  .action-btn.danger:hover { color: var(--danger); border-color: var(--danger); }
</style>
