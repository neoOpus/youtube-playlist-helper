<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { storageService, notificationService } from "@yph/core";
  import {
    SuperSelect,
    SuperInput,
    SuperButton,
    SuperToggle,
    SaveIcon,
    InfoIcon
  } from "@yph/ui-kit";
  import type { AISettings, AIProviderType } from "@yph/core";

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

  const showApiFields = $derived(settings.provider !== 'local-heuristics');
</script>

<section class="pro-glass p-8 mt-8">
    <div class="header mb-8">
        <h3 class="card-title">AI Architect</h3>
        <p class="muted small">Configure the neural engine responsible for content enrichment and semantic analysis.</p>
    </div>

    {#if !isLoading}
        <div class="ai-config-grid">
            <div class="row">
                <SuperToggle bind:checked={settings.enabled} label="Enable AI Enrichment Agent" />
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
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
    .footer-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--border);
        padding-top: var(--space-6);
    }
    .info-note {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-xs);
        font-weight: 700;
        color: var(--text-dim);
        font-style: italic;
    }

    @media (max-width: 768px) {
        .grid-2 { grid-template-columns: 1fr; }
        .footer-actions { flex-direction: column; gap: var(--space-4); align-items: flex-start; }
    }
</style>
