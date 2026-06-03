<script lang="ts">
    import { Brain, Cpu, Key, Layers, Save, CheckCircle2 } from "lucide-svelte";
    import { appState, updatePreference } from "../stores/theme.svelte";
    import { notificationService } from "@yph/core";

    let ai = $derived(appState.ai);
    let isSaving = $state(false);

    async function saveAIConfig() {
        isSaving = true;
        await updatePreference('ai', ai);
        setTimeout(() => {
            isSaving = false;
            notificationService.success("AI Architect: Configuration Locked.");
        }, 600);
    }

    function updateField<K extends keyof typeof ai>(key: K, value: any) {
        const updated = { ...ai, [key]: value };
        updatePreference('ai', updated);
    }
</script>

<section class="ai-architect surface-1 mt-8">
    <div class="card-header">
        <Brain size="20" class="icon-primary" />
        <h2>AI Architect</h2>
        <div class="status-badge" class:enabled={ai.enabled}>
            {ai.enabled ? 'ONLINE' : 'SUSPENDED'}
        </div>
    </div>

    <div class="settings-group">
        <div class="setting-item">
            <div class="label-info">
                <span class="label">Intelligence Provider</span>
                <p class="desc">Select the neural engine for node enrichment.</p>
            </div>
            <select value={ai.provider} onchange={e => updateField('provider', e.currentTarget.value)}>
                <option value="local">Local Heuristics (Standard)</option>
                <option value="openai">OpenAI GPT-4o (Pro)</option>
                <option value="openrouter">OpenRouter Multi-Model</option>
            </select>
        </div>

        {#if ai.provider !== 'local'}
            <div class="setting-item">
                <div class="label-info">
                    <span class="label">Access Key</span>
                    <p class="desc">Encryption-secured API credentials.</p>
                </div>
                <div class="input-wrap">
                    <Key size="14" class="input-icon" />
                    <input
                        type="password"
                        placeholder="sk-..."
                        value={ai.apiKey}
                        oninput={e => updateField('apiKey', e.currentTarget.value)}
                    />
                </div>
            </div>

            <div class="setting-item">
                <div class="label-info">
                    <span class="label">Model Architecture</span>
                </div>
                <div class="input-wrap">
                    <Layers size="14" class="input-icon" />
                    <input
                        type="text"
                        placeholder="gpt-4o"
                        value={ai.model}
                        oninput={e => updateField('model', e.currentTarget.value)}
                    />
                </div>
            </div>
        {/if}

        <div class="setting-item">
            <div class="label-info">
                <span class="label">Autonomous Enrichment</span>
                <p class="desc">Allow background agents to optimize infrastructure.</p>
            </div>
            <input
                type="checkbox"
                checked={ai.enabled}
                onchange={e => updateField('enabled', e.currentTarget.checked)}
            />
        </div>
    </div>

    <div class="card-actions">
        <button class="save-btn" onclick={saveAIConfig} disabled={isSaving}>
            {#if isSaving}
                <Cpu size="16" class="spin" /> Synchronizing...
            {:else}
                <Save size="16" /> Commit Configuration
            {/if}
        </button>
    </div>
</section>

<style>
    .ai-architect { padding: var(--space-10); border-left: 4px solid var(--primary); }
    .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; border-bottom: 1px solid var(--border-base); padding-bottom: 20px; position: relative; }
    .card-header h2 { font-size: 1.15rem; font-weight: 700; margin: 0; }

    .status-badge {
        position: absolute; right: 0; top: 0; font-size: 0.65rem; font-weight: 900;
        padding: 4px 10px; border-radius: 20px; background: var(--bg-surface-2);
        color: var(--text-muted); border: 1px solid var(--border-base); letter-spacing: 0.1em;
    }
    .status-badge.enabled { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }

    .input-wrap { position: relative; width: 240px; }
    .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
    input[type="text"], input[type="password"] {
        width: 100%; padding: 10px 16px 10px 36px; background: var(--bg-surface-2);
        border: 1px solid var(--border-strong); border-radius: 8px; color: var(--text-main);
        font-weight: 500; outline: none; font-size: 0.9rem;
    }
    input:focus { border-color: var(--primary); box-shadow: var(--shadow-focus); }

    .card-actions { margin-top: 40px; display: flex; justify-content: flex-end; }
    .save-btn {
        background: var(--bg-surface-2); color: var(--text-main); border: 1px solid var(--border-strong);
        padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
        cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s;
    }
    .save-btn:hover:not(:disabled) { background: var(--bg-surface-3); border-color: var(--primary); }

    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .mt-8 { margin-top: 2rem; }
</style>
