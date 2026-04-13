<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ParametricBackground,
    CollapsibleSidebar,
    LoadingSpinner
  } from '@yph/ui-kit';
  import {
    playlistsSearch,
    initFilters
  } from './stores/playlists-filters';
  import {
    themeState,
    initTheme
  } from './stores/theme.svelte';
  import {
    audioState,
    soundProfile
  } from './stores/audio.svelte';
  import { enrichmentAgent } from '@yph/core';
  import { actionLogger } from '@yph/core';
  import Sidebar from './components/Sidebar.svelte';
  import CommandPalette from './components/CommandPalette.svelte';
  import ProErrorBoundary from './components/ProErrorBoundary.svelte';
  import ActionToast from './components/ActionToast.svelte';
  import BulkOpsOverlay from './components/BulkOpsOverlay.svelte';
  import { router } from './stores/router';

  let isLoading = $state(true);

  onMount(async () => {
    try {
      await initTheme();
      await initFilters();
      // Simulate Infrastructure Boot
      await new Promise(r => setTimeout(r, 800));
      isLoading = false;
      actionLogger.log({ type: 'Infrastructure Boot', status: 'Success' });
    } catch (e) {
      console.error('Boot Failure:', e);
      actionLogger.log({ type: 'Infrastructure Boot', status: 'Failure' });
    }
  });

  const currentView = $derived(router.currentView);
</script>

<div class="sota-app-container {themeState.current}">
  <ParametricBackground />

  <ProErrorBoundary>
    {#if isLoading}
      <div class="boot-screen">
        <LoadingSpinner size="xl" />
        <p class="boot-text">Synchronizing Infrastructure Nodes...</p>
      </div>
    {:else}
      <Sidebar />
      <main class="view-portal">
        <svelte:component this={currentView} />
      </main>
      <CommandPalette />
      <ActionToast />
      <BulkOpsOverlay selectedCount={0} onClose={() => {}} onApply={() => {}} />
    {/if}
  </ProErrorBoundary>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: var(--bg-deep);
    color: var(--text-primary);
    font-family: var(--font-main);
    overflow: hidden;
  }

  .sota-app-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .view-portal {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-8) var(--spacing-12);
    position: relative;
    z-index: 1;
  }

  .boot-screen {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-6);
    background: var(--bg-deep);
    z-index: 10000;
  }

  .boot-text {
    font-size: var(--size-sm);
    color: var(--text-secondary);
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
</style>
