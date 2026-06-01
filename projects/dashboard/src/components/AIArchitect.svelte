<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { storageService, notificationService, AI_PRESETS } from "@yph/core";
  import {
    SuperSelect,
    SuperInput,
    SuperButton,
    SuperToggle
  } from "@yph/ui-kit";
  import { SaveIcon, InfoIcon } from "@yph/ui-kit";
  import type { AISettings } from "@yph/core";
  import { BrainCircuit, Sparkles } from "lucide-svelte";

  let settings = $state<AISettings>({
      provider: 'local-heuristics',
      model: 'default',
      enabled: true,
      apiKey: '',
      baseUrl: '',
      temperature: 0.7
  });

  let isLoading = $state(true);

  const providerOptions = [
      { value: 'local-heuristics', label: 'Local Heuristics (Free/Offline)' },
      { value: 'openai', label: 'OpenAI (GPT-4o/3.5)' },
      { value: 'openrouter', label: 'OpenRouter (Unified Access)' },
      { value: 'anthropic', label: 'Anthropic (Claude)' },
      { value: 'custom-openai-compatible', label: 'Custom OpenAI Compatible' }
  ];

  onMount(async () => {
      const allSettings = await storageService.getSettings();
      if (allSettings.ai) {
          settings = { ...settings, ...allSettings.ai };
      }
      isLoading = false;
  });

  async function saveAIConfig() {
      await storageService.updateSettings({ ai: settings });
      notificationService.success("AI Visual Architecture updated.");
  }

  function applyPreset(presetId: string) {
      const preset = AI_PRESETS[presetId];
      if (preset) {
          settings = { ...settings, ...preset };
          notificationService.info(`Applied preset: ${presetId}`);
      }
  }

  const showApiFields = $derived(settings.provider !== 'local-heuristics');
</script>

<section class="settings-card surface-1 mt-8">
    <div class="card-header justify-between">
        <div class="flex items-center gap-4">
            <BrainCircuit size="20" class="icon-primary" />
            <h2>AI Architect</h2>
        </div>
        <div class="presets-row">
            <Sparkles size="14" class="text-primary" />
            <button class="preset-btn" onclick={() => applyPreset('openrouter-free')}>OpenRouter</button>
            <button class="preset-btn" onclick={() => applyPreset('openai-gpt-4o')}>GPT-4o</button>
            <button class="preset-btn" onclick={() => applyPreset('ollama-local')}>Ollama</button>
        </div>
    </div>
    <p class="desc mb-8">Configure the neural engine responsible for content enrichment and semantic analysis.</p>

    {#if !isLoading}
        <div class="ai-config-grid">
            <div class="setting-item">
                <div class="label-info">
                    <span class="label">Enrichment Protocol</span>
                    <p class="desc">Enable background AI agent to automatically scan and tag nodes.</p>
                </div>
                <SuperToggle bind:checked={settings.enabled} />
            </div>

            <div class="grid-2 mt-6">
                <SuperSelect
                    label="Neural Provider"
                    options={providerOptions}
                    bind:value={settings.provider}
                />
                <SuperInput
                    label="Model Identifier"
                    placeholder={settings.provider === 'local-heuristics' ? 'N/A' : 'e.g. gpt-4o'}
                    bind:value={settings.model}
                    disabled={settings.provider === 'local-heuristics'}
                />
            </div>

            {#if showApiFields}
                <div class="grid-2 mt-6">
                    <SuperInput
                        label="API Key"
                        type="password"
                        placeholder="sk-..."
                        bind:value={settings.apiKey}
                    />
                    <SuperInput
                        label="Custom Base URL (Optional)"
                        placeholder="https://..."
                        bind:value={settings.baseUrl}
                    />
                </div>
            {/if}

            <div class="footer-actions mt-8">
                <div class="info-note">
                    <InfoIcon size="14" />
                    <span>Local heuristics require zero configuration and run entirely in-browser.</span>
                </div>
                <SuperButton primary onclick={saveAIConfig}>
                    <SaveIcon size="18" /> Commit AI Parameters
                </SuperButton>
            </div>
        </div>
    {/if}
</section>

<style>
    .ai-config-grid { display: flex; flex-direction: column; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .footer-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--border-base);
        padding-top: 24px;
    }
    .info-note {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-dim);
        font-style: italic;
    }

    .flex { display: flex; }
    .items-center { align-items: center; }
    .gap-4 { gap: 16px; }
    .justify-between { justify-content: space-between; }

    .presets-row { display: flex; align-items: center; gap: 8px; background: var(--bg-surface-2); padding: 4px 12px; border-radius: 20px; border: 1px solid var(--border-subtle); }
    .preset-btn { background: transparent; border: none; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; transition: color 0.2s; }
    .preset-btn:hover { color: var(--primary); }

    @media (max-width: 900px) {
        .grid-2 { grid-template-columns: 1fr; }
        .footer-actions { flex-direction: column; gap: 16px; align-items: flex-start; }
        .presets-row { display: none; }
    }
</style>
