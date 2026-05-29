<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { storageService, notificationService, audioService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { CheckIcon, TerminalIcon, PlusMultiple, InfoIcon, SuperButton, Breadcrumbs } from "@yph/ui-kit";

  let { params }: { params: { id: string } } = $props();
  let playlist = $state<Playlist | null>(null);
  let activeVideoIndex = $state(0);
  let loading = $state(true);
  let isNarrating = $state(false);

  onMount(async () => {
      playlist = await storageService.getPlaylist(params.id);
      if (playlist && playlist.loadedVideos) {
          const firstUnwatched = playlist.loadedVideos.findIndex(v => !v.watched);
          if (firstUnwatched !== -1) activeVideoIndex = firstUnwatched;
      }
      loading = false;
  });

  const activeVideo = $derived(playlist?.loadedVideos?.[activeVideoIndex]);
  const progress = $derived.by(() => {
      if (!playlist?.loadedVideos) return 0;
      const watched = playlist.loadedVideos.filter(v => v.watched).length;
      return Math.round((watched / playlist.loadedVideos.length) * 100);
  });

  async function markWatched() {
      if (playlist?.loadedVideos?.[activeVideoIndex]) {
          playlist.loadedVideos[activeVideoIndex].watched = true;
          await storageService.savePlaylist(playlist);
          notificationService.success("Milestone achieved.");
          audioService.playSignal('milestone');

          if (activeVideoIndex < playlist.loadedVideos.length - 1) {
              activeVideoIndex++;
          }
      }
  }

  function selectVideo(index: number) {
      activeVideoIndex = index;
  }

  function toggleNarration() {
      if (isNarrating) {
          window.speechSynthesis.cancel();
          isNarrating = false;
          return;
      }

      if (activeVideo?.notes) {
          const text = `Key takeaways for ${activeVideo.title}. ${activeVideo.notes}`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.05;
          utterance.pitch = 1;
          utterance.onend = () => isNarrating = false;
          window.speechSynthesis.speak(utterance);
          isNarrating = true;
      }
  }
</script>

<div class="curriculum-view view-container" in:fade>
    {#if loading}
        <div class="loader">Aligning Syllabus...</div>
    {:else if playlist}
        <header class="path-header">
            <div class="header-main">
                <Breadcrumbs items={[{label: 'PROTOCOL'}, {label: 'CURRICULUM', active: true}]} />
                <h1>{playlist.title}</h1>
                <div class="progress-meta">
                    <div class="progress-bar-wrap">
                        <div class="progress-fill" style="width: {progress}%"></div>
                    </div>
                    <span class="pct">{progress}% Mastery</span>
                </div>
            </div>
        </header>

        <div class="curriculum-grid">
            <div class="player-sector">
                {#if activeVideo}
                    <div class="stage pro-glass" in:fly={{y: 20}}>
                        <iframe
                            title={activeVideo.title}
                            src="https://www.youtube.com/embed/{activeVideo.videoId}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                    <div class="node-info mt-6">
                        <div class="node-header-row">
                            <h2>{activeVideo.title}</h2>
                            {#if activeVideo.notes}
                                <button class="narrate-btn" onclick={toggleNarration} class:active={isNarrating} title="Narrate Takeaways">
                                    <TerminalIcon size="14" />
                                    <span>{isNarrating ? 'STOP_NARRATION' : 'NARRATE_TAKEAWAYS'}</span>
                                </button>
                            {/if}
                        </div>
                        <p class="channel">{activeVideo.channel}</p>

                        {#if activeVideo.notes}
                            <div class="takeaways pro-glass mt-4" in:slide>
                                <span class="label">Key Takeaways</span>
                                <pre class="notes-pre">{activeVideo.notes}</pre>
                            </div>
                        {/if}

                        <div class="vibe-tags mt-6">
                            {#if activeVideo.energyVibe}
                                <span class="vibe-badge">{activeVideo.energyVibe}</span>
                            {/if}
                            {#each (activeVideo.aiTags || []) as tag}
                                <span class="tag">#{tag}</span>
                            {/each}
                        </div>
                        <div class="actions mt-8">
                            <SuperButton primary onclick={markWatched}>
                                <CheckIcon size="18" /> Complete Milestone
                            </SuperButton>
                        </div>
                    </div>
                {/if}
            </div>

            <aside class="syllabus-sidebar pro-glass">
                <h3>Path Sequence</h3>
                <div class="syllabus-list mt-6">
                    {#each (playlist.loadedVideos || []) as video, i}
                        <button
                            class="syllabus-item"
                            class:active={activeVideoIndex === i}
                            class:completed={video.watched}
                            onclick={() => selectVideo(i)}
                        >
                            <div class="idx">{i + 1}</div>
                            <span class="title">{video.title}</span>
                            {#if video.watched}
                                <CheckIcon size="14" color="var(--success)" />
                            {/if}
                        </button>
                    {/each}
                </div>
            </aside>
        </div>
    {:else}
        <div class="error">Path identity lost or inaccessible.</div>
    {/if}
</div>

<style>
    .curriculum-view { padding: var(--space-8); }
    .path-header { margin-bottom: var(--space-12); border-bottom: 1px solid var(--border); padding-bottom: var(--space-8); }
    .progress-meta { display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; }
    .progress-bar-wrap { flex-grow: 1; height: 8px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden; border: 1px solid var(--border); }
    .progress-fill { height: 100%; background: var(--primary); transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
    .pct { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 900; color: var(--primary); }

    .curriculum-grid { display: grid; grid-template-columns: 1fr 360px; gap: var(--space-10); }

    .stage { aspect-ratio: 16 / 9; overflow: hidden; border-radius: 24px; border: 1px solid var(--border-strong); }
    iframe { width: 100%; height: 100%; }

    .node-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .narrate-btn { display: flex; align-items: center; gap: 8px; background: rgba(var(--primary-rgb), 0.1); border: 1px solid var(--primary); padding: 4px 10px; border-radius: 6px; color: var(--primary); font-size: 10px; font-weight: 900; font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s; }
    .narrate-btn:hover { background: var(--primary); color: white; }
    .narrate-btn.active { animation: narrate-pulse 1s infinite alternate; }
    @keyframes narrate-pulse { from { opacity: 0.7; } to { opacity: 1; } }

    .takeaways { padding: 1.5rem; border: 1px dashed var(--border-strong); background: rgba(255,255,255,0.02); }
    .label { font-size: 0.65rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem; display: block; }
    .notes-pre { white-space: pre-wrap; font-family: inherit; font-size: 0.9rem; line-height: 1.6; color: var(--text); margin: 0; }

    .syllabus-sidebar { padding: var(--space-6); display: flex; flex-direction: column; }
    .syllabus-list { display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 60vh; }
    .syllabus-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; border-radius: 12px; cursor: pointer; text-align: left; color: var(--text-muted); transition: all 0.2s; }
    .syllabus-item:hover { background: var(--hover); color: var(--text); }
    .syllabus-item.active { background: var(--hover); color: var(--primary); font-weight: 800; box-shadow: inset 3px 0 0 var(--primary); }
    .syllabus-item.completed .title { opacity: 0.5; text-decoration: line-through; }
    .idx { width: 24px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 900; opacity: 0.4; }
    .title { flex-grow: 1; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .vibe-badge { padding: 4px 10px; background: var(--primary); color: white; border-radius: 6px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; }
    .tag { font-size: 0.75rem; color: var(--text-dim); font-weight: 700; margin-left: 8px; }

    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
</style>
