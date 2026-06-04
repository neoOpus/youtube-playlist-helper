<script lang="ts">
    import { storageService, notificationService } from "@yph/core";
    import { Monitor, Activity, Trash2, ShieldCheck, Bell, Compass } from "lucide-svelte";
    import { appState, updatePreference } from "../stores/theme.svelte";
    import ThemeArchitect from "../components/ThemeArchitect.svelte";

    async function clearAll() {
        if (confirm("DANGER: This will permanently wipe all local data and playlists. Continue?")) {
            await chrome.storage.local.clear();
            localStorage.clear();
            notificationService.success("System Reset Complete.");
            setTimeout(() => window.location.reload(), 1000);
        }
    }
</script>

<div class="view-container">
    <header class="view-header">
        <h1>Settings</h1>
        <p class="desc">Configure your experience and manage data.</p>
    </header>

    <div class="settings-grid">
        <div class="main-column">
            <section class="settings-card surface-1">
                <div class="card-header">
                    <Monitor size="20" class="icon-primary" />
                    <h2>Interface</h2>
                </div>

                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Information Density</span>
                        </div>
                        <div class="toggle-group">
                            <button class:active={appState.density === 'compact'} onclick={() => updatePreference('uiDensity', 'compact')}>Compact</button>
                            <button class:active={appState.density === 'normal'} onclick={() => updatePreference('uiDensity', 'normal')}>Normal</button>
                            <button class:active={appState.density === 'spacious'} onclick={() => updatePreference('uiDensity', 'spacious')}>Spacious</button>
                        </div>
                    </div>

                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Sidebar Position</span>
                        </div>
                        <div class="toggle-group">
                            <button class:active={appState.sidebar === 'left'} onclick={() => updatePreference('sidebarPosition', 'left')}>Left</button>
                            <button class:active={appState.sidebar === 'right'} onclick={() => updatePreference('sidebarPosition', 'right')}>Right</button>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>
                <ThemeArchitect />
            </section>

            <section class="settings-card surface-1 mt-8">
                <div class="card-header">
                    <Compass size="20" class="icon-primary" />
                    <h2>Workflow</h2>
                </div>
                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Open Editor after creation</span>
                        </div>
                        <input type="checkbox" checked={appState.openPlaylistEditorAfterCreation} onchange={e => updatePreference('openPlaylistEditorAfterCreation', e.currentTarget.checked)} />
                    </div>
                </div>
            </section>
        </div>

        <div class="side-column">
            <section class="settings-card surface-1">
                <div class="card-header">
                    <Activity size="20" class="icon-primary" />
                    <h2>Performance</h2>
                </div>

                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Animations</span>
                        </div>
                        <select value={appState.animation} onchange={e => updatePreference('animationIntensity', e.currentTarget.value as any)}>
                            <option value="full">Full</option>
                            <option value="low">Low</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
            </section>

            <section class="settings-card surface-1 danger-card mt-6">
                <div class="card-header">
                    <ShieldCheck size="20" />
                    <h2>Data Management</h2>
                </div>
                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Reset All Data</span>
                            <p class="desc">This cannot be undone.</p>
                        </div>
                        <button class="danger-btn" onclick={clearAll}><Trash2 size="16" /> Wipe Data</button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>

<style>
    .view-header { margin-bottom: 2rem; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 4px; }

    .settings-grid { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
    .main-column, .side-column { display: flex; flex-direction: column; }

    .settings-card { padding: 1.5rem; }
    .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-base); padding-bottom: 1rem; }
    .card-header h2 { font-size: 1rem; font-weight: 700; margin: 0; }
    :global(.icon-primary) { color: var(--primary); }

    .settings-group { display: flex; flex-direction: column; gap: 1.5rem; }
    .setting-item { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }

    .label { font-weight: 600; font-size: 0.9rem; color: var(--text-main); }
    .desc { font-size: 0.8rem; color: var(--text-secondary); }

    select {
        background: var(--bg-surface-2); border: 1px solid var(--border-strong);
        color: var(--text-main); padding: 8px; border-radius: 6px;
    }

    .toggle-group { display: flex; background: var(--bg-surface-2); padding: 2px; border-radius: 8px; }
    .toggle-group button {
        background: transparent; border: none; color: var(--text-secondary);
        padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
        cursor: pointer;
    }
    .toggle-group button.active { background: var(--bg-surface-3); color: var(--text-main); }

    .divider { height: 1px; background: var(--border-base); margin: 1.5rem 0; }

    .danger-btn {
        background: var(--danger); color: white; border: none; padding: 10px 16px;
        border-radius: 6px; font-weight: 700; font-size: 0.8rem;
        cursor: pointer; display: flex; align-items: center; gap: 8px;
    }

    .mt-8 { margin-top: 2rem; }
    .mt-6 { margin-top: 1.5rem; }
</style>
