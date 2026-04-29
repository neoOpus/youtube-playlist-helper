<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { storageService, videoService, notificationService } from "@yph/core";
  import type { Playlist, Video, CurriculumStep } from "@yph/core";
  import {
    ChevronLeft,
    CheckCircle2,
    Circle,
    PlayCircle,
    BookOpen,
    Clock,
    Trophy,
    ArrowRight
  } from "lucide-svelte";
  import { router } from "../stores/router";
  import { appState } from "../stores/theme.svelte";

  let { params = { id: "" } } = $props();

  let playlist = $state<Playlist | null>(null);
  let videos = $state<Video[]>([]);
  let loading = $state(true);

  let currentStepIdx = $derived(playlist?.curriculum?.currentStepIndex ?? 0);
  let currentVideo = $derived(videos[currentStepIdx]);

  let progress = $derived.by(() => {
      if (!playlist?.curriculum?.steps) return 0;
      const completed = playlist.curriculum.steps.filter(s => s.completed).length;
      return Math.round((completed / playlist.curriculum.steps.length) * 100);
  });

  onMount(async () => {
      if (params.id) {
          const data = await storageService.getPlaylist(params.id);
          if (data && data.curriculum?.enabled) {
              playlist = data;
              const loaded = [];
              for (const step of data.curriculum.steps) {
                  loaded.push(await videoService.fetchVideo(step.videoId));
              }
              videos = loaded.filter(v => v) as Video[];
          }
      }
      loading = false;
  });

  async function toggleComplete(index: number) {
      if (!playlist?.curriculum) return;
      playlist.curriculum.steps[index].completed = !playlist.curriculum.steps[index].completed;

      // Auto-advance if completing current
      if (playlist.curriculum.steps[index].completed && index === currentStepIdx) {
          if (currentStepIdx < playlist.curriculum.steps.length - 1) {
              playlist.curriculum.currentStepIndex++;
          }
      }

      await storageService.savePlaylist(playlist);
      notificationService.success(playlist.curriculum.steps[index].completed ? "Milestone reached." : "Step reverted.");
  }

  function setStep(index: number) {
      if (!playlist?.curriculum) return;
      playlist.curriculum.currentStepIndex = index;
      storageService.savePlaylist(playlist);
  }
</script>

<main class="curriculum-view">
    {#if loading}
        <div class="loader">Synchronizing Learning Path...</div>
    {:else if playlist && playlist.curriculum}
        <header class="header surface-1">
            <div class="header-left">
                <button class="back-btn" onclick={() => router.push(`/edit/${playlist.id}`)}><ChevronLeft size="18" /></button>
                <div class="title-info">
                    <span class="label">LEARNING_PATH_ACTIVE</span>
                    <h1>{playlist.title}</h1>
                </div>
            </div>

            <div class="progress-section">
                <div class="progress-text">
                    <span class="val">{progress}%</span>
                    <span class="label">COMPLETE</span>
                </div>
                <div class="progress-bar">
                    <div class="fill" style="width: {progress}%"></div>
                </div>
            </div>
        </header>

        <div class="layout-grid">
            <section class="focus-column">
                {#if currentVideo}
                    <div class="player-card surface-1">
                        <div class="video-container">
                            <img src={currentVideo.thumbnailUrl.replace('mqdefault', 'maxresdefault')} alt="" class="hero-thumb" />
                            <div class="overlay">
                                <button class="play-btn" onclick={() => window.open(currentVideo.url, '_blank')}>
                                    <PlayCircle size="64" />
                                    <span>RESUME_LEARNING</span>
                                </button>
                            </div>
                        </div>
                        <div class="video-meta">
                            <div class="meta-main">
                                <h2>{currentVideo.title}</h2>
                                <span class="channel">{currentVideo.channel}</span>
                            </div>
                            <div class="meta-side">
                                <div class="badge-v3"><Clock size="12" /> {currentVideo.duration}</div>
                                <button
                                    class="complete-btn"
                                    class:is-done={playlist.curriculum.steps[currentStepIdx].completed}
                                    onclick={() => toggleComplete(currentStepIdx)}
                                >
                                    {#if playlist.curriculum.steps[currentStepIdx].completed}
                                        <CheckCircle2 size="18" /> <span>COMPLETED</span>
                                    {:else}
                                        <Circle size="18" /> <span>MARK_COMPLETE</span>
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="notes-card surface-1 mt-6">
                        <div class="card-header"><BookOpen size="18" /> <span>CURRICULUM_INSIGHTS</span></div>
                        <p>{currentVideo.aiSummary || "Neural analysis in progress for this module..."}</p>
                    </div>
                {/if}
            </section>

            <aside class="syllabus-column surface-1">
                <div class="syllabus-header">
                    <span class="label">Syllabus</span>
                    <span class="count">{playlist.curriculum.steps.length} Modules</span>
                </div>

                <div class="steps-stack">
                    {#each playlist.curriculum.steps as step, i}
                        <button
                            class="step-item"
                            class:active={i === currentStepIdx}
                            class:done={step.completed}
                            onclick={() => setStep(i)}
                        >
                            <div class="step-indicator">
                                {#if step.completed}
                                    <CheckCircle2 size="16" class="text-success" />
                                {:else if i === currentStepIdx}
                                    <PlayCircle size="16" class="text-primary" />
                                {:else}
                                    <span class="index">{i + 1}</span>
                                {/if}
                            </div>
                            <div class="step-info">
                                <span class="step-title">{step.title}</span>
                                {#if step.milestone}
                                    <span class="milestone-label"><Trophy size="10" /> {step.milestone}</span>
                                {/if}
                            </div>
                        </button>
                    {/each}
                </div>
            </aside>
        </div>
    {:else}
        <div class="error-state surface-1">
            <Trophy size="48" class="text-muted" />
            <h2>Protocol Inactive</h2>
            <p>This collection has not been promoted to a Learning Path yet.</p>
            <SuperButton outline onclick={() => router.push('/')}>Return to Library</SuperButton>
        </div>
    {/if}
</main>

<style>
    .curriculum-view { display: flex; flex-direction: column; gap: 24px; padding: 24px; max-width: 1600px; margin: 0 auto; height: 100vh; overflow: hidden; }

    .header { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-radius: 16px; flex-shrink: 0; }
    .header-left { display: flex; align-items: center; gap: 24px; }
    .back-btn { background: var(--bg-surface-2); border: 1px solid var(--border-base); color: var(--text-main); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

    .title-info { display: flex; flex-direction: column; gap: 4px; }
    .label { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.15em; }
    h1 { font-size: 1.5rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }

    .progress-section { width: 300px; display: flex; flex-direction: column; gap: 8px; }
    .progress-text { display: flex; justify-content: space-between; align-items: flex-end; }
    .progress-text .val { font-size: 1.25rem; font-weight: 900; color: var(--primary); font-family: monospace; line-height: 1; }

    .progress-bar { height: 8px; background: var(--bg-surface-2); border-radius: 4px; overflow: hidden; border: 1px solid var(--border-base); }
    .progress-bar .fill { height: 100%; background: var(--primary); transition: width 0.5s var(--ease-in-out); box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.3); }

    .layout-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; flex: 1; overflow: hidden; }

    .focus-column { display: flex; flex-direction: column; gap: 24px; overflow-y: auto; padding-bottom: 40px; }

    .player-card { border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
    .video-container { position: relative; aspect-ratio: 16/9; background: #000; overflow: hidden; }
    .hero-thumb { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }

    .overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .play-btn { background: transparent; border: none; color: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: transform 0.3s; }
    .play-btn:hover { transform: scale(1.05); }
    .play-btn span { font-weight: 900; font-size: 0.8rem; letter-spacing: 0.2em; background: rgba(0,0,0,0.5); padding: 4px 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); }

    .video-meta { padding: 32px; display: flex; justify-content: space-between; align-items: center; gap: 40px; border-top: 1px solid var(--border-base); }
    .meta-main { flex: 1; }
    .meta-main h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 8px; }
    .channel { font-size: 1rem; color: var(--text-secondary); font-weight: 600; }

    .meta-side { display: flex; flex-direction: column; align-items: flex-end; gap: 16px; }
    .badge-v3 { background: var(--bg-surface-2); padding: 4px 12px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; border: 1px solid var(--border-base); }

    .complete-btn {
        background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px;
        font-weight: 800; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 10px;
        transition: all 0.2s; box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
    }
    .complete-btn.is-done { background: var(--success); box-shadow: 0 4px 15px rgba(var(--secondary-rgb), 0.3); }

    .notes-card { padding: 32px; }
    .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-weight: 900; font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; }
    .notes-card p { font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); font-weight: 500; }

    .syllabus-column { display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; }
    .syllabus-header { padding: 24px; border-bottom: 1px solid var(--border-base); display: flex; justify-content: space-between; align-items: center; }
    .syllabus-header .count { font-weight: 800; font-size: 0.75rem; color: var(--primary); }

    .steps-stack { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 2px; }
    .step-item {
        display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid transparent;
        background: transparent; border-radius: 12px; cursor: pointer; transition: all 0.2s; text-align: left;
    }
    .step-item:hover { background: var(--bg-surface-2); }
    .step-item.active { background: rgba(var(--primary-rgb), 0.05); border-color: rgba(var(--primary-rgb), 0.2); }
    .step-item.done { opacity: 0.7; }

    .step-indicator { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-2); border-radius: 8px; flex-shrink: 0; }
    .index { font-weight: 900; font-size: 0.8rem; color: var(--text-dim); }

    .step-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .step-title { font-weight: 700; font-size: 0.9rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .milestone-label { font-size: 0.6rem; font-weight: 900; color: var(--secondary); text-transform: uppercase; display: flex; align-items: center; gap: 4px; }

    :global(.text-success) { color: var(--success); }
    :global(.text-primary) { color: var(--primary); }

    .loader { padding: 100px; text-align: center; font-weight: 800; color: var(--primary); }
    .error-state { padding: 100px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 24px; border-radius: 24px; }
    .error-state h2 { font-size: 2rem; font-weight: 900; }

    .mt-6 { margin-top: 1.5rem; }

    @media (max-width: 1200px) {
        .layout-grid { grid-template-columns: 1fr; }
        .syllabus-column { height: 400px; }
    }
</style>
