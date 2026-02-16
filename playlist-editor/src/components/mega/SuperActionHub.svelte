<script lang="ts">
  import { actionService, type CustomAction } from "../../services/mega/action-service";
  import SuperButton from "../ui/SuperButton.svelte";
  import Fa from "svelte-fa";
  import * as Icons from "@fortawesome/free-solid-svg-icons";
  import { slide, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  export let scope: 'video' | 'playlist' | 'global';
  export let context: any;

  const actions = actionService.actionsStore;
  $: filteredActions = $actions.filter(a => a.scope === scope);
</script>

<div class="action-hub-container" transition:slide={{ duration: 300, easing: cubicOut }}>
  <div class="header">
      <Fa icon={Icons.faLayerGroup} />
      <span>Recommended Actions</span>
  </div>
  <div class="hub-grid scope-{scope}">
    {#each filteredActions as action (action.id)}
      <div in:fade={{ duration: 200 }}>
          <SuperButton
            on:click={() => actionService.executeAction(action.id, context)}
            bgcolor={action.color}
            title={action.label}
            className="hub-btn"
          >
            <Fa icon={Icons[action.icon] || Icons.faBolt} />
            {#if scope !== 'video'}
              <span class="label">{action.label}</span>
            {/if}
          </SuperButton>
      </div>
    {/each}
  </div>
</div>

<style>
  .action-hub-container {
    background: #fdfdfd;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 1.2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }

  .header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.75rem;
      font-weight: bold;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
  }

  .hub-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .label {
    margin-left: 10px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  :global(.hub-btn) {
      padding: 10px 16px !important;
      border-radius: 10px !important;
  }

  .scope-video {
      background: none;
      padding: 0;
      border: none;
      box-shadow: none;
  }
</style>
