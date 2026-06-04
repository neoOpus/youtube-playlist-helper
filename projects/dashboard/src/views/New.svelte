<script lang="ts">
  import { storageService, notificationService } from "@yph/core";
  import { router } from "../stores/router";
  import { Plus, List, Save } from "lucide-svelte";

  let title = $state("");
  let videoList = $state("");

  async function createPlaylist() {
      if (!title) {
          notificationService.error("Please provide a title.");
          return;
      }

      const videos = videoList.split('\n').map(v => v.trim()).filter(v => v !== "");
      const newPlaylist = {
          id: "",
          title,
          videos,
          timestamp: Date.now(),
          saved: true
      };

      const id = await storageService.savePlaylist(newPlaylist as any);
      notificationService.success("Playlist created.");
      router.push(`/edit/${id}`);
  }
</script>

<main class="view-container">
  <header class="page-header">
      <h1>Create New Playlist</h1>
      <p class="text-secondary">Start a new collection by adding a title and some videos.</p>
  </header>

  <div class="create-card surface-1">
      <div class="form-group">
          <label for="title">Playlist Title</label>
          <input id="title" type="text" bind:value={title} placeholder="e.g. My Favorite Music" />
      </div>

      <div class="form-group">
          <label for="videos">Videos (YouTube URLs or IDs)</label>
          <p class="desc">Enter one per line.</p>
          <textarea id="videos" bind:value={videoList} placeholder="https://youtube.com/watch?v=..."></textarea>
      </div>

      <div class="actions">
          <button class="primary-btn" onclick={createPlaylist}>
              <Plus size="18" /> Create Playlist
          </button>
      </div>
  </div>
</main>

<style>
  .page-header { margin-bottom: 2rem; }
  h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }
  .text-secondary { font-size: 0.9rem; color: var(--text-secondary); }

  .create-card { padding: 2rem; max-width: 600px; }

  .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
  label { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
  .desc { font-size: 0.8rem; color: var(--text-muted); }

  input, textarea {
      padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-base);
      background: var(--bg-surface-2); color: var(--text-main); outline: none; font-size: 0.95rem;
  }
  input:focus, textarea:focus { border-color: var(--primary); }
  textarea { height: 200px; resize: none; font-family: monospace; }

  .actions { margin-top: 1rem; display: flex; justify-content: flex-end; }
  .primary-btn {
      background: var(--primary); color: white; border: none; padding: 12px 24px;
      border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px;
  }
</style>
