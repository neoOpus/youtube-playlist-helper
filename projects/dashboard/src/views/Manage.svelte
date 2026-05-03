<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { storageService, notificationService } from "@yph/core";
  import { SuperButton } from "@yph/ui-kit";
  import {
    Trash2,
    Monitor,
    Activity,
    ShieldCheck,
    Zap,
    Database,
    Bell,
    MousePointer2,
    Palette,
    Compass,
    Settings as SettingsIcon,
    Layers
  } from "lucide-svelte";
  import { appState, updatePreference } from "../stores/theme.svelte";
  import type { Playlist } from "@yph/core";
  import ThemeArchitect from "../components/ThemeArchitect.svelte";

  let playlists = $state<Playlist[]>([]);

  onMount(async () => {
    playlists = await storageService.getPlaylists();
  });

  async function clearAll() {
      if (confirm("CRITICAL: This will irreversibly purge the entire environment. Proceed?")) {
          for (const pl of playlists) await storageService.removePlaylist(pl);
          notificationService.success("Environment decommissioned.");
          window.location.reload();
      }
  }
</script>

<div class="view-container">
    <header class="view-header">
        <h1>System Preferences</h1>
        <p class="text-secondary">Orchestrate the interface foundation and behavioral logic.</p>
    </header>

    <div class="settings-grid">
        <!-- Visual Architecture -->
        <div class="main-column">
            <section class="settings-card surface-1">
                <div class="card-header">
                    <Monitor size="20" class="icon-primary" />
                    <h2>Interface & Appearance</h2>
                </div>

                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">UI Density</span>
                            <p class="desc">Global scale for padding and component spacing.</p>
                        </div>
                        <select value={appState.density} onchange={e => updatePreference('uiDensity', e.currentTarget.value as any)}>
                            <option value="compact">Compact (Tight)</option>
                            <option value="normal">Normal (Standard)</option>
                            <option value="spacious">Spacious (Relaxed)</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Font Magnification</span>
                            <p class="desc">Scaling factor for all textual elements.</p>
                        </div>
                        <div class="control-wrap">
                            <input type="range" min="0.8" max="1.2" step="0.05" value={appState.fontScale}
                                   oninput={e => updatePreference('fontScale', +e.currentTarget.value)} />
                            <span class="val">{(appState.fontScale * 100).toFixed(0)}%</span>
                        </div>
                    </div>

                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Sidebar Orientation</span>
                        </div>
                        <div class="toggle-group">
                            <button class:active={appState.sidebar === 'left'} onclick={() => updatePreference('sidebarPosition', 'left')}>Left-Aligned</button>
                            <button class:active={appState.sidebar === 'right'} onclick={() => updatePreference('sidebarPosition', 'right')}>Right-Aligned</button>
                        </div>
                    </div>

                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Default Landing Plane</span>
                        </div>
                        <select onchange={e => updatePreference('defaultEditorPage', e.currentTarget.value as any)}>
                            <option value="/saved">Saved Collections</option>
                            <option value="/new">New Intake</option>
                        </select>
                    </div>
                </div>

                <div class="divider"></div>
                <ThemeArchitect />
            </section>

            <section class="settings-card surface-1 mt-8">
                <div class="card-header">
                    <Compass size="20" class="icon-primary" />
                    <h2>Workflow Automation</h2>
                </div>
                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Creation Protocol</span>
                            <p class="desc">Immediately open editor after generating a new node.</p>
                        </div>
                        <input type="checkbox" checked onchange={e => updatePreference('openPlaylistEditorAfterCreation', e.currentTarget.checked)} />
                    </div>
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Persistent Auto-Save</span>
                            <p class="desc">Commit changes to local storage every X minutes.</p>
                        </div>
                        <select onchange={e => updatePreference('autoSaveInterval', +e.currentTarget.value)}>
                            <option value="1">1 Minute</option>
                            <option value="5">5 Minutes</option>
                            <option value="15">15 Minutes</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>

        <!-- System & Performance -->
        <div class="side-column">
            <section class="settings-card surface-1">
                <div class="card-header">
                    <Activity size="20" class="icon-primary" />
                    <h2>Performance</h2>
                </div>

                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Animation Dynamics</span>
                        </div>
                        <select value={appState.animation} onchange={e => updatePreference('animationIntensity', e.currentTarget.value as any)}>
                            <option value="full">High-Fidelity Transitions</option>
                            <option value="low">Optimized Performance</option>
                            <option value="none">Disabled (Instant)</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Reduced Motion</span>
                            <p class="desc">Minimize parallax and scale effects.</p>
                        </div>
                        <input type="checkbox" checked={appState.reducedMotion} onchange={e => updatePreference('reducedMotion', e.currentTarget.checked)} />
                    </div>

                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Resource Efficiency</span>
                            <p class="desc">Disable background canvas effects.</p>
                        </div>
                        <input type="checkbox" onchange={e => updatePreference('lowPowerMode', e.currentTarget.checked)} />
                    </div>
                </div>
            </section>

            <section class="settings-card surface-1 mt-6">
                <div class="card-header">
                    <Bell size="20" class="icon-primary" />
                    <h2>Communication</h2>
                </div>
                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Feedback Verbosity</span>
                        </div>
                        <select onchange={e => updatePreference('notificationVerbosity', e.currentTarget.value as any)}>
                            <option value="all">Verbosity: Maximum</option>
                            <option value="minimal">Action-Only</option>
                            <option value="none">Silent Mode</option>
                        </select>
                    </div>
                </div>
            </section>

            <section class="settings-card surface-1 danger-card mt-6">
                <div class="card-header">
                    <ShieldCheck size="20" />
                    <h2>Security & Privacy</h2>
                </div>
                <div class="settings-group">
                    <div class="setting-item">
                        <div class="label-info">
                            <span class="label">Environment Purge</span>
                            <p class="desc">Wipe all local indices and configurations.</p>
                        </div>
                        <button class="danger-btn" onclick={clearAll}><Trash2 size="16" /> Decommission</button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>

<style>
    .view-header { margin-bottom: var(--space-12); }
    h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 4px; }

    .settings-grid { display: grid; grid-template-columns: 1fr 380px; gap: var(--space-10); }
    .main-column, .side-column { display: flex; flex-direction: column; }

    .settings-card { padding: var(--space-10); }
    .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; border-bottom: 1px solid var(--border-base); padding-bottom: 20px; }
    .card-header h2 { font-size: 1.15rem; font-weight: 700; margin: 0; }
    :global(.icon-primary) { color: var(--primary); }

    .settings-group { display: flex; flex-direction: column; gap: 32px; }
    .setting-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; }

    .label-info { flex: 1; }
    .label { display: block; font-weight: 700; font-size: 1rem; margin-bottom: 6px; color: var(--text-main); }
    .desc { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; line-height: 1.5; }

    select {
        background: var(--bg-surface-2); border: 1px solid var(--border-strong);
        color: var(--text-main); padding: 10px 16px; border-radius: 8px;
        font-weight: 600; font-size: 0.9rem; outline: none; cursor: pointer;
        min-width: 180px; transition: border-color 0.2s;
    }
    select:hover { border-color: var(--text-muted); }

    .control-wrap { display: flex; align-items: center; gap: 16px; }
    .val { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 700; color: var(--primary); width: 44px; text-align: right; }

    .toggle-group { display: flex; background: var(--bg-surface-2); padding: 4px; border-radius: 10px; border: 1px solid var(--border-base); }
    .toggle-group button {
        background: transparent; border: none; color: var(--text-secondary);
        padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;
        cursor: pointer; transition: all 0.2s;
    }
    .toggle-group button.active { background: var(--bg-surface-3); color: var(--text-main); box-shadow: var(--shadow-sm); }

    .divider { height: 1px; background: var(--border-base); margin: 32px 0; }

    .danger-card { border-color: rgba(239, 68, 68, 0.3); }
    .danger-btn {
        background: var(--danger); color: white; border: none; padding: 12px 24px;
        border-radius: 8px; font-weight: 700; font-size: 0.9rem;
        cursor: pointer; display: flex; align-items: center; gap: 10px; transition: opacity 0.2s;
    }
    .danger-btn:hover { opacity: 0.95; }

    input[type="checkbox"] {
        appearance: none; width: 22px; height: 22px; border: 2px solid var(--border-strong);
        border-radius: 6px; cursor: pointer; position: relative; transition: all 0.2s;
    }
    input[type="checkbox"]:checked { background: var(--primary); border-color: var(--primary); }
    input[type="checkbox"]:checked::after {
        content: "✓"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 900;
    }

    input[type="range"] { accent-color: var(--primary); }

    .mt-8 { margin-top: 2rem; }
    .mt-6 { margin-top: 1.5rem; }

    @media (max-width: 1200px) {
        .settings-grid { grid-template-columns: 1fr; }
        .side-column { order: 2; }
    }
</style>
