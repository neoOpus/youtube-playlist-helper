<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CloseIcon, PencilIcon } from "./icons/index.js";

  export let tags: string[] = [];
  export let placeholder = "Add tag...";

  const dispatch = createEventDispatcher();
  let newTag = "";

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      tags = [...tags, newTag.trim()];
      newTag = "";
      dispatch("change", tags);
    }
  }

  function removeTag(tag: string) {
    tags = tags.filter((t) => t !== tag);
    dispatch("change", tags);
  }
</script>

<div class="tag-manager">
  <div class="tags-list">
    {#each tags as tag}
      <span class="tag">
        {tag}
        <button on:click={() => removeTag(tag)} aria-label="Remove {tag}">
          <CloseIcon size="12" />
        </button>
      </span>
    {/each}
  </div>
  <div class="input-area">
    <input
      type="text"
      bind:value={newTag}
      {placeholder}
      on:keydown={(e) => e.key === "Enter" && addTag()}
    />
    <button on:click={addTag}><PencilIcon size="16" /></button>
  </div>
</div>

<style>
  .tag-manager { display: flex; flex-direction: column; gap: 10px; }
  .tags-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { background: var(--hover); border: 1px solid var(--border); padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
  .tag button { background: transparent; border: none; cursor: pointer; color: var(--text-muted); display: flex; }
  .input-area { display: flex; gap: 8px; }
  input { flex-grow: 1; background: var(--hover); border: 1px solid var(--border); color: var(--text); padding: 8px 12px; border-radius: 8px; outline: none; }
  button { background: var(--hover); border: 1px solid var(--border); border-radius: 8px; padding: 4px 8px; cursor: pointer; color: var(--text); }
</style>
