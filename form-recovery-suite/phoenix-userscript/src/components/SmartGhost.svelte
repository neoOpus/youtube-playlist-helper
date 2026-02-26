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

  function acceptGhost() {
    targetEl.value = ghostText;
    visible = false;
    targetEl.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab' && visible) {
      e.preventDefault();
      acceptGhost();
    }
  }
</script>

{#if visible && ghostText}
  <button
    class="ghost"
    onclick={acceptGhost}
    onkeydown={handleKeydown}
    aria-label="Suggested form completion"
    type="button"
  >
    {ghostText.slice(0, 100)} <span class="hint">(Tab to restore)</span>
  </button>
{/if}

<style>
  .ghost {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.3);
    font-family: inherit;
    font-size: inherit;
    padding: 0;
    margin: 0;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 12px;
    cursor: pointer;
    pointer-events: auto;
    z-index: 10;
    display: block;
    width: calc(100% - 24px);
  }
  .hint { font-size: 0.8em; opacity: 0.6; margin-left: 8px; }
  .ghost:hover { color: rgba(255, 255, 255, 0.5); }
  .ghost:focus { outline: none; color: rgba(255, 255, 255, 0.6); }
</style>
