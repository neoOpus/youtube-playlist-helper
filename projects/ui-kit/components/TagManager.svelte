<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CloseIcon, PlusMultiple } from "./icons";

  let { tags = $bindable([]), editable = false } = $props();
  const dispatch = createEventDispatcher();
  let newTag = $state("");

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      tags = [...tags, newTag.trim()];
      newTag = "";
      dispatch("change", tags);
    }
  }

  function removeTag(tag: string) {
    tags = tags.filter(t => t !== tag);
    dispatch("change", tags);
  }
</script>

<div class="tag-manager">
  {#each tags as tag}
    <span class="tag">
      {tag}
      {#if editable}
        <button onclick={() => removeTag(tag)} aria-label="Remove tag"><CloseIcon size="12" /></button>
      {/if}
    </span>
  {/each}
  {#if editable}
    <div class="add-tag">
      <input bind:value={newTag} placeholder="Add tag..." onkeydown={e => e.key === 'Enter' && addTag()} />
      <button onclick={addTag}><PlusMultiple size="14" /></button>
    </div>
  {/if}
</div>

<style>
  .tag-manager { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .tag { background: var(--hover); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; border: 1px solid var(--border); }
  .tag button { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0; display: flex; }
  .tag button:hover { color: var(--danger); }
  .add-tag { display: flex; align-items: center; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; }
  input { background: transparent; border: none; color: var(--text); font-size: 0.75rem; width: 80px; outline: none; }
  button { background: none; border: none; color: var(--primary); cursor: pointer; display: flex; }
</style>
