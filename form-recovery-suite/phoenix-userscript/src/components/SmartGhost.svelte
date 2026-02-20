<script lang="ts">
  import { db } from '../lib/db';

  let { fieldId, targetEl } = $props();
  let ghostText = $state('');
  let visible = $state(false);

  $effect(() => {
    if (targetEl.value === '') {
      db.entries.where({ domain: window.location.hostname, fieldId }).reverse().first().then(res => {
        if (res) {
          ghostText = res.value;
          visible = true;
        }
      });
    } else {
      visible = false;
    }
  });
</script>

{#if visible && ghostText}
  <div class="ghost" onclick={() => { targetEl.value = ghostText; visible = false; targetEl.dispatchEvent(new Event('input', { bubbles: true })); }}>
    {ghostText.slice(0, 100)} (Tab to restore)
  </div>
{/if}

<style>
  .ghost {
    color: #ccc;
    pointer-events: none;
    font-family: sans-serif;
    font-size: 14px;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    pointer-events: auto;
    cursor: pointer;
  }
</style>
