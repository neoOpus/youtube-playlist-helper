<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import {
      SaveIcon,
      TerminalIcon,
      CheckIcon,
      SuperButton,
      RadioGroup,
      InfoIcon,
      PlaylistPlayIcon
  } from "@yph/ui-kit";
  import { storageService, formatExporter, notificationService } from "@yph/core";
  import type { ExportTemplate } from "@yph/core";

  interface Props {
      onComplete?: () => void;
  }

  let { onComplete = () => {} }: Props = $props();

  let exporting = $state(false);
  let copying = $state(false);
  let template = $state<ExportTemplate>('showcase');
  let format = $state<'md' | 'json' | 'csv'>('md');

  const templates = [
      { value: 'minimal', label: 'Minimalist', description: 'Just the essentials. Fast and clean.' },
      { value: 'academic', label: 'Academic', description: 'Structured tables for research and analysis.' },
      { value: 'showcase', label: 'Showcase', description: 'Rich metadata and stylistic presentation.' }
  ];

  const formats = [
      { value: 'md', label: 'Markdown', icon: PlaylistPlayIcon },
      { value: 'csv', label: 'Data (CSV)', icon: TerminalIcon },
      { value: 'json', label: 'System (JSON)', icon: SaveIcon }
  ];

  async function performExport() {
      exporting = true;
      try {
          const playlists = await storageService.getPlaylists();
          const { content, extension, mime } = getExportData(playlists);

          const blob = new Blob([content], { type: mime });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `yph-portfolio-${Date.now()}.${extension}`;
          a.click();

          notificationService.success("Portfolio Architect: Export successful.");
          onComplete();
      } catch (err) {
          notificationService.error("Export failed. See console for details.");
          console.error(err);
      } finally {
          setTimeout(() => exporting = false, 1500);
      }
  }

  async function copyToClipboard() {
      copying = true;
      try {
          const playlists = await storageService.getPlaylists();
          const { content } = getExportData(playlists);
          await navigator.clipboard.writeText(content);
          notificationService.success("Copied to clipboard.");
      } catch (err) {
          notificationService.error("Copy failed.");
      } finally {
          setTimeout(() => copying = false, 1000);
      }
  }

  function getExportData(playlists: any) {
      if (format === 'md') {
          return { content: formatExporter.toMarkdown(playlists, template), extension: "md", mime: "text/markdown" };
      } else if (format === 'csv') {
          return { content: formatExporter.toCSV(playlists), extension: "csv", mime: "text/csv" };
      } else {
          return { content: formatExporter.toJSON(playlists), extension: "json", mime: "application/json" };
      }
  }
</script>

<div class="portfolio-architect pro-glass" in:fade>
    <div class="architect-header">
        <div class="icon-orb"><PlaylistPlayIcon size="24" /></div>
        <div class="title-meta">
            <h3>Portfolio Architect</h3>
            <p>Generate high-fidelity documentation from your infrastructure.</p>
        </div>
    </div>

    <div class="architect-body mt-6">
        <div class="field-section">
            <span class="field-label">Export Format</span>
            <div class="format-grid">
                {#each formats as f}
                    <button
                        class="format-btn luminous-hover"
                        class:active={format === f.value}
                        onclick={() => format = f.value as any}
                    >
                        <f.icon size="18" />
                        <span>{f.label}</span>
                    </button>
                {/each}
            </div>
        </div>

        {#if format === 'md'}
            <div class="field-section mt-6" transition:fly={{ y: 10, duration: 300 }}>
                <span class="field-label">Template Persona</span>
                <div class="template-list">
                    {#each templates as t}
                        <button
                            class="template-card luminous-hover"
                            class:active={template === t.value}
                            onclick={() => template = t.value as any}
                        >
                            <div class="check-box">
                                {#if template === t.value}<CheckIcon size="14" />{/if}
                            </div>
                            <div class="t-info">
                                <span class="t-label">{t.label}</span>
                                <span class="t-desc">{t.description}</span>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    <div class="architect-footer mt-8">
        <div class="main-btns">
            <SuperButton
                primary
                disabled={exporting}
                onclick={performExport}
            >
                {#if exporting}
                    <TerminalIcon size="18" class="spin" />
                    Processing...
                {:else}
                    <SaveIcon size="18" />
                    Save File
                {/if}
            </SuperButton>
            {#if format === 'md' || format === 'json'}
                <SuperButton outline disabled={copying} onclick={copyToClipboard}>
                    <CheckIcon size="18" />
                    {copying ? 'Copied' : 'Copy'}
                </SuperButton>
            {/if}
        </div>
        <div class="footer-hint">
            <InfoIcon size="12" />
            <span>Files will be saved to your local downloads directory.</span>
        </div>
    </div>
</div>

<style>
    .portfolio-architect { padding: var(--space-8); border: 1px solid var(--border); }
    .architect-header { display: flex; align-items: center; gap: var(--space-4); padding-bottom: var(--space-4); border-bottom: 1px solid var(--border); }
    .icon-orb { width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3); }
    .title-meta h3 { margin: 0; font-size: var(--font-lg); font-weight: 800; }
    .title-meta p { margin: 0; font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; }
    .field-label { display: block; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: var(--space-3); }
    .format-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
    .format-btn { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-muted); padding: var(--space-3); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; gap: var(--space-2); cursor: pointer; transition: all 0.2s; font-size: var(--font-xs); font-weight: 700; }
    .format-btn.active { background: rgba(var(--primary-rgb), 0.1); border-color: var(--primary); color: var(--primary); }
    .template-list { display: flex; flex-direction: column; gap: var(--space-2); }
    .template-card { background: transparent; border: 1px solid var(--border); padding: var(--space-3) var(--space-4); border-radius: var(--radius-lg); display: flex; align-items: flex-start; gap: var(--space-4); cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
    .template-card.active { background: var(--hover); border-color: var(--primary); }
    .check-box { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-top: 2px; transition: all 0.2s; flex-shrink: 0; }
    .template-card.active .check-box { background: var(--primary); border-color: var(--primary); color: white; }
    .t-info { display: flex; flex-direction: column; }
    .t-label { font-weight: 800; font-size: var(--font-sm); color: var(--text); }
    .t-desc { font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; }
    .architect-footer { display: flex; flex-direction: column; gap: var(--space-4); }
    .main-btns { display: grid; grid-template-columns: 1fr auto; gap: var(--space-3); }
    .footer-hint { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-xs); color: var(--text-dim); font-weight: 600; justify-content: center; }
    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .mt-6 { margin-top: var(--space-6); }
    .mt-8 { margin-top: var(--space-8); }
</style>
