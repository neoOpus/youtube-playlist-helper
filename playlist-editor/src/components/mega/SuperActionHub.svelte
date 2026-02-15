<script lang="ts">
  import { actionService, type CustomAction } from "../../services/mega/action-service";
  import SuperButton from "../ui/SuperButton.svelte";
  import Fa from "svelte-fa";
  import * as Icons from "@fortawesome/free-solid-svg-icons";

  export let scope: 'video' | 'playlist' | 'global';
  export let context: any;

  const actions = actionService.actionsStore;

  $: filteredActions = $actions.filter(a => a.scope === scope);
</script>

<div class="action-hub scope-{scope}">
  {#each filteredActions as action}
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
  {/each}
</div>

<style>
  .action-hub {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding: 10px;
    background: rgba(0,0,0,0.02);
    border-radius: 12px;
  }

  .label {
    margin-left: 8px;
    font-size: 0.9rem;
  }

  :global(.hub-btn) {
      padding: 8px 12px !important;
  }

  .scope-video {
      background: none;
      padding: 0;
  }
</style>
