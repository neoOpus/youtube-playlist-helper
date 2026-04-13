<script lang="ts">
  import { SmartElement, SimpleButton, SuperToggle } from '@yph/ui-kit';
  import { ClipboardMultiple, InfoIcon, TerminalIcon } from '@yph/ui-kit/components/icons';
  import { actionLogger } from '@yph/core';

  let format = $state<'markdown' | 'json' | 'pdf'>('markdown');
  let template = $state<'minimal' | 'academic' | 'showcase'>('showcase');
  let includeMetadata = $state(true);
  let isExporting = $state(false);

  async function handleExport() {
    isExporting = true;
    actionLogger.log({
      type: 'Portfolio Architect',
      status: 'Pending',
      metadata: { format, template }
    });

    await new Promise(r => setTimeout(r, 2500));

    isExporting = false;
    actionLogger.log({
      type: 'Portfolio Architect',
      status: 'Success',
      metadata: { detail: `SOTA Portfolio (${format.toUpperCase()}) Generated` }
    });
  }
</script>

<SmartElement class="portfolio-card">
  <div class="card-header">
    <ClipboardMultiple size={20} color="var(--accent-color)" />
    <h4>Portfolio Architect</h4>
  </div>

  <p class="desc">Generate professional, SEO-optimized documentation for your curated infrastructure nodes.</p>

  <div class="config-grid">
    <div class="config-row">
      <label>Architectural Template</label>
      <div class="template-selector">
        {#each ['minimal', 'academic', 'showcase'] as t}
          <button
            class="template-btn {template === t ? 'active' : ''}"
            onclick={() => template = t as any}
          >
            {t}
          </button>
        {/each}
      </div>
    </div>

    <div class="config-row">
      <label>Export Format</label>
      <div class="format-selector">
        {#each ['markdown', 'json', 'pdf'] as f}
          <button
            class="format-btn {format === f ? 'active' : ''}"
            onclick={() => format = f as any}
          >
            {f.toUpperCase()}
          </button>
        {/each}
      </div>
    </div>

    <div class="toggle-row">
      <div class="label-group">
        <span>Deep Metadata</span>
        <p class="tiny-desc">Include timestamps, tags, and AI analysis</p>
      </div>
      <SuperToggle bind:checked={includeMetadata} />
    </div>
  </div>

  <SimpleButton
    variant="primary"
    class="export-btn"
    disabled={isExporting}
    onclick={handleExport}
  >
    <TerminalIcon size={16} />
    <span>{isExporting ? 'Architecting...' : 'Deploy Portfolio'}</span>
  </SimpleButton>

  <div class="info-tip">
    <InfoIcon size={12} />
    <span>Nodes will be formatted for optimal readability and sharing.</span>
  </div>
</SmartElement>

<style>
  :global(.portfolio-card) {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card-header { display: flex; align-items: center; gap: 12px; }
  h4 { margin: 0; color: var(--text-primary); font-weight: 700; }

  .desc {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .config-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    border: 1px solid var(--border-subtle);
  }

  .config-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }

  .template-selector, .format-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    background: rgba(255, 255, 255, 0.02);
    padding: 4px;
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
  }

  .template-btn, .format-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 700;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: capitalize;
  }

  .template-btn.active, .format-btn.active {
    background: var(--accent-color);
    color: white;
    box-shadow: 0 2px 8px var(--accent-glow);
  }

  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label-group span { font-size: 0.85rem; color: var(--text-primary); font-weight: 600; }
  .tiny-desc { margin: 2px 0 0; font-size: 0.7rem; color: var(--text-muted); }

  .export-btn { width: 100%; gap: 10px; }

  .info-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    color: var(--text-muted);
    font-style: italic;
  }
</style>
