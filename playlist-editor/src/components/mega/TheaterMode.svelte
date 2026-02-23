<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import type { Video } from "../../types/model";
  import Fa from "svelte-fa";
  import { faTimes, faStickyNote, faPlus, faClock, faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
  import SuperButton from "../ui/SuperButton.svelte";

  export let video: Video;
  export let isOpen = false;

  const dispatch = createEventDispatcher();
  let currentTime = 0;
  let duration = 0;
  let player: any;
  let annotations: { time: number, text: string }[] = (video as any).annotations || [];
  let newAnnotation = "";

  function close() {
    isOpen = false;
    dispatch("close");
  }

  function addAnnotation() {
    if (!newAnnotation.trim()) return;
    annotations = [...annotations, { time: Math.floor(currentTime), text: newAnnotation }].sort((a, b) => a.time - b.time);
    newAnnotation = "";
    saveAnnotations();
  }

  async function saveAnnotations() {
      dispatch("saveAnnotations", { videoId: video.videoId, annotations });
  }

  function seekTo(time: number) {
      if (player && player.seekTo) {
          player.seekTo(time, true);
      }
  }

  function formatTime(seconds: number) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return [h, m, s].map(v => v.toString().padStart(2, '0')).filter((v, i) => v !== '00' || i > 0).join(':');
  }

  onMount(() => {
      // YouTube IFrame API initialization would go here
      // For now, we mock the time updates
      const interval = setInterval(() => {
          if (isOpen) currentTime += 1;
      }, 1000);
      return () => clearInterval(interval);
  });
</script>

{#if isOpen}
  <div class="theater-overlay" transition:fade>
    <div class="theater-container" transition:fly={{ y: 50 }}>
        <div class="video-section">
            <header>
                <div class="info">
                    <h2>{video.title}</h2>
                    <span class="channel">{video.channel}</span>
                </div>
                <button class="close-btn" on:click={close}><Fa icon={faTimes} /></button>
            </header>

            <div class="player-mock">
                <!-- In a real app, this is the iframe -->
                <img src={video.thumbnailUrl} alt="Video Mock" />
                <div class="player-controls">
                    <span class="time">{formatTime(currentTime)} / {formatTime(duration || 600)}</span>
                </div>
            </div>
        </div>

        <aside class="annotations-sidebar">
            <div class="sidebar-header">
                <h3><Fa icon={faStickyNote} /> Integrated Annotations</h3>
            </div>

            <div class="annotation-list">
                {#each annotations as note}
                    <div class="note-item" on:click={() => seekTo(note.time)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && seekTo(note.time)}>
                        <span class="timestamp"><Fa icon={faClock} /> {formatTime(note.time)}</span>
                        <p>{note.text}</p>
                    </div>
                {:else}
                    <p class="empty-msg">No annotations yet. Add one at {formatTime(currentTime)}</p>
                {/each}
            </div>

            <div class="annotation-input">
                <textarea bind:value={newAnnotation} placeholder="Add a note at this timestamp..."></textarea>
                <SuperButton on:click={addAnnotation} variant="primary" size="sm">
                    <Fa icon={faPlus} /> Add Annotation
                </SuperButton>
            </div>
        </aside>
    </div>
  </div>
{/if}

<style>
  .theater-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.98);
    z-index: 6000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .theater-container {
    width: 100%;
    height: 100%;
    max-width: 1600px;
    display: flex;
    gap: 1.5rem;
  }

  .video-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #000;
    border-radius: 16px;
    overflow: hidden;
  }

  header {
    padding: 1.5rem;
    background: rgba(255,255,255,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }

  h2 { margin: 0; font-size: 1.25rem; }
  .channel { font-size: 0.85rem; color: #94a3b8; }

  .close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.5rem;
      cursor: pointer;
  }

  .player-mock {
      flex: 1;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .player-mock img { width: 100%; height: 100%; object-fit: contain; }

  .player-controls {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 1rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: white;
  }

  .annotations-sidebar {
    width: 400px;
    background: #1e293b;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    color: white;
  }

  .sidebar-header { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
  h3 { margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 8px; }

  .annotation-list { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 12px; }

  .note-item {
      background: rgba(255,255,255,0.05);
      padding: 1rem;
      border-radius: 10px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
  }
  .note-item:hover { background: rgba(255,255,255,0.1); border-color: #38bdf8; }

  .timestamp { font-size: 0.75rem; color: #38bdf8; font-weight: bold; display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
  .note-item p { margin: 0; font-size: 0.9rem; color: #cbd5e1; }

  .empty-msg { color: #64748b; font-style: italic; text-align: center; margin-top: 2rem; }

  .annotation-input {
      padding: 1.5rem;
      background: rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      gap: 1rem;
  }

  textarea {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 0.75rem;
      color: white;
      resize: none;
      height: 80px;
      font-size: 0.9rem;
  }
</style>
