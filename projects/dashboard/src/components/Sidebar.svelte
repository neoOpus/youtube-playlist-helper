<script lang="ts">
  import { router } from '../stores/router';
  import { SmartElement } from '@yph/ui-kit';
  import {
    PlaylistPlayIcon,
    PlaylistPlusIcon,
    SaveIcon,
    TerminalIcon,
    SupportIcon,
    DnaIcon
  } from '@yph/ui-kit/components/icons';

  const navItems = [
    { id: 'gallery', label: 'Gallery', path: '#/', icon: PlaylistPlayIcon },
    { id: 'new', label: 'Nodes', path: '#/new', icon: PlaylistPlusIcon },
    { id: 'saved', label: 'Library', path: '#/saved', icon: SaveIcon },
    { id: 'manage', label: 'System', path: '#/manage', icon: TerminalIcon },
    { id: 'support', label: 'Sector', path: '#/support', icon: SupportIcon }
  ];

  const currentPath = router;
</script>

<aside class="sota-sidebar">
  <div class="sidebar-top">
    <div class="logo-group">
      <DnaIcon size={24} color="var(--accent-color)" />
      <span class="logo-text">YPH-SOTA</span>
    </div>
  </div>

  <nav class="sidebar-nav">
    {#each navItems as item}
      <button
        class="nav-btn {$currentPath === item.path ? 'active' : ''}"
        onclick={() => router.navigate(item.path)}
      >
        <item.icon size={20} />
        <span class="btn-label">{item.label}</span>
        {#if $currentPath === item.path}
          <div class="active-indicator"></div>
        {/if}
      </button>
    {/each}
  </nav>

  <div class="sidebar-bottom">
    <div class="system-badge">
      <span class="version">v2.5.0</span>
      <span class="status">ONLINE</span>
    </div>
  </div>
</aside>

<style>
  .sota-sidebar {
    width: 260px;
    height: 100vh;
    background: var(--bg-surface);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    padding: var(--spacing-8) var(--spacing-4);
    position: relative;
    z-index: 10;
  }

  .sidebar-top {
    margin-bottom: var(--spacing-12);
    padding-left: var(--spacing-4);
  }

  .logo-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    flex: 1;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background: none;
    border: none;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--trans-fast);
    position: relative;
    font-weight: 500;
  }

  .nav-btn:hover {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-primary);
  }

  .nav-btn.active {
    background: var(--accent-subtle);
    color: var(--accent-color);
  }

  .active-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background: var(--accent-color);
    border-radius: 0 4px 4px 0;
    box-shadow: 2px 0 10px var(--accent-glow);
  }

  .btn-label {
    font-size: 0.95rem;
  }

  .sidebar-bottom {
    padding-top: var(--spacing-4);
    border-top: 1px solid var(--border-subtle);
  }

  .system-badge {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-4);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .version { color: var(--text-muted); }
  .status { color: #00ff80; }

  @media (max-width: 900px) {
    .sota-sidebar { width: 80px; padding: var(--spacing-8) var(--spacing-2); }
    .btn-label, .logo-text, .system-badge { display: none; }
    .logo-group { justify-content: center; }
    .nav-btn { justify-content: center; padding: 12px; }
  }
</style>
