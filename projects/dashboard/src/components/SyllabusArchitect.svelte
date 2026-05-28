<svelte:options runes={true} />
<script lang="ts">
  import { syllabusArchitect, notificationService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { TerminalIcon, SuperButton } from "@yph/ui-kit";
  import { fade, slide } from "svelte/transition";

  let { playlist, videos = $bindable(), onoptimized }: {
      playlist: Playlist,
      videos: Video[],
      onoptimized?: (v: Video[], summary: string) => void
  } = $props();

  let isLoading = $state(false);
  let summary = $state("");

  async function runArchitect() {
      isLoading = true;
      try {
          const result = await syllabusArchitect.architectSyllabus(playlist, videos);
          videos = result.optimizedSequence;
          summary = result.summary;
          notificationService.success("Syllabus Architect completed.");
          if (onoptimized) onoptimized(videos, summary);
      } finally {
          isLoading = false;
      }
  }
</script>

<div class="syllabus-architect mt-6">
    {#if summary}
        <div class="summary-box pro-glass-high" transition:slide>
            <span class="label">CURRICULUM_SUMMARY</span>
            <p>{summary}</p>
            <button class="clear-btn" onclick={() => summary = ""}>Dismiss Intelligence</button>
        </div>
    {/if}

    <SuperButton outline fullWidth onclick={runArchitect} disabled={isLoading}>
        {#if isLoading}
            <TerminalIcon size="16" class="spin" />
            <span>Architecting Syllabus...</span>
        {:else}
            <TerminalIcon size="16" />
            <span>AI Syllabus Architect</span>
        {/if}
    </SuperButton>
</div>

<style>
    .summary-box { padding: 1.5rem; margin-bottom: 1rem; border: 1px solid var(--primary); background: rgba(var(--primary-rgb), 0.03); }
    .label { font-size: 0.6rem; font-weight: 900; color: var(--primary); letter-spacing: 1px; display: block; margin-bottom: 0.75rem; }
    p { font-size: 0.85rem; line-height: 1.6; color: var(--text); margin: 0; }
    .clear-btn { background: none; border: none; color: var(--text-dim); font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; margin-top: 1rem; }
    .clear-btn:hover { color: var(--primary); }
    :global(.spin) { animation: spin 1s linear infinite; }
</style>
