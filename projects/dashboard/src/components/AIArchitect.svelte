<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { storageService, notificationService, AI_PRESETS, aiService } from "@yph/core";
  import {
    SuperSelect,
    SuperInput,
    SuperButton,
    SuperToggle,
    SaveIcon,
    InfoIcon,
    TerminalIcon,
    PlusMultiple
  } from "@yph/ui-kit";
  import type { AISettings, AIProviderType } from "@yph/core";
  import { fade } from "svelte/transition";

  let settings = $state<AISettings>({
      provider: 'local-heuristics',
      model: 'default',
      enabled: true,
      apiKey: '',
      baseUrl: '',
      temperature: 0.7
  });

  let useLocalEmbeddings = $state(false);
  let isLoading = $state(true);
  let isVerifying = $state(false);
  let connectionStatus = $state<'idle' | 'success' | 'failed'>('idle');

  const providerOptions = [
      { value: 'local-heuristics', label: 'Local Heuristics (Free/Offline)' },
      { value: 'openai', label: 'OpenAI (GPT-4o/3.5)' },
      { value: 'openrouter', label: 'OpenRouter (Unified Access)' },
      { value: 'anthropic', label: 'Anthropic (Claude)' },
      { value: 'custom-openai-compatible', label: 'Custom OpenAI Compatible' }
  ];

  onMount(async () => {
      const state = await aiService.getSettings();
      settings = { ...settings, ...state.ai };
      // Try to fetch real key if available
      const realKey = await aiService.getSecureKey(settings.provider);
      if (realKey) settings.apiKey = realKey;

      useLocalEmbeddings = state.useLocalEmbeddings;
      isLoading = false;
  });

  async function saveAIConfig() {
      // Logic for secure storage
      if (settings.apiKey && settings.apiKey !== '********') {
          await aiService.setSecureKey(settings.provider, settings.apiKey);
      }

      // Strip key before saving to general settings
      const toSave = { ...settings };
      delete toSave.apiKey;

      await storageService.updateSettings({ ai: toSave, useLocalEmbeddings });
      notificationService.success("AI Visual Architecture updated.");
  }

  function applyPreset(presetId: string) {
      const preset = AI_PRESETS[presetId];
      if (preset) {
          settings = { ...settings, ...preset };
          notificationService.info(`Applied preset: ${presetId}`);
      }
  }

  async function verifyConnection() {
      isVerifying = true;
      connectionStatus = 'idle';
      const success = await aiService.testConnection(settings);
      connectionStatus = success ? 'success' : 'failed';
      isVerifying = false;
      if (success) notificationService.success("Neural Link established.");
      else notificationService.error("Neural Link failed. Check parameters.");
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
            <div class="row items-center justify-between mb-6">
                <div class="toggles-col">
                    <SuperToggle bind:checked={settings.enabled} label="Enable AI Enrichment Agent" />
                    <SuperToggle bind:checked={useLocalEmbeddings} label="Enable Local Semantic Mapping (WebGPU)" />
                </div>
                <div class="presets-row">
                    <span class="preset-label">PRESETS:</span>
                    <button class="preset-btn" onclick={() => applyPreset('openrouter-free')}>OpenRouter Free</button>
                    <button class="preset-btn" onclick={() => applyPreset('openai-gpt-4o')}>GPT-4o</button>
                    <button class="preset-btn" onclick={() => applyPreset('ollama-local')}>Ollama (Local)</button>
                </div>
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
                    <div class="input-with-action">
                        <SuperInput
                            label="Custom Base URL (Optional)"
                            placeholder="https://..."
                            bind:value={settings.baseUrl}
                        />
                        <button
                            class="verify-btn"
                            onclick={verifyConnection}
                            disabled={isVerifying}
                            class:success={connectionStatus === 'success'}
                            class:failed={connectionStatus === 'failed'}
                        >
                            {#if isVerifying}
                                <TerminalIcon size="14" class="spin" />
                            {:else}
                                {connectionStatus === 'success' ? 'Link OK' : (connectionStatus === 'failed' ? 'Retry Link' : 'Verify Link')}
                            {/if}
                        </button>
                    </div>
                </div>
            {/if}

            <div class="footer-actions mt-8">
                <div class="info-note">
                    <InfoIcon size="14" />
                    <span>Local heuristics require zero configuration. WebGPU mapping enables frictionless semantic search without API calls. Credentials are stored securely.</span>
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
        max-width: 60%;
    }

    .presets-row { display: flex; align-items: center; gap: 8px; }
    .preset-label { font-size: 0.6rem; font-weight: 900; color: var(--text-dim); letter-spacing: 1px; }
    .preset-btn {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.65rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
    }
    .preset-btn:hover { background: var(--hover); border-color: var(--primary); color: var(--primary); }

    .toggles-col { display: flex; flex-direction: column; gap: 8px; }

    .input-with-action { position: relative; }
    .verify-btn {
        position: absolute;
        right: 8px;
        bottom: 8px;
        padding: 4px 10px;
        background: var(--primary);
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s;
    }
    .verify-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .verify-btn.success { background: var(--success); }
    .verify-btn.failed { background: var(--danger); }

    .mb-6 { margin-bottom: 1.5rem; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    @media (max-width: 900px) {
        .row.justify-between { flex-direction: column; align-items: flex-start; gap: 1rem; }
    }

    @media (max-width: 768px) {
        .grid-2 { grid-template-columns: 1fr; }
        .footer-actions { flex-direction: column; gap: var(--space-4); align-items: flex-start; }
        .info-note { max-width: 100%; }
    }
</style>
