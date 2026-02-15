<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "./icons/CloseIcon.svelte";
  import PlusMultiple from "./icons/PlusMultiple.svelte";
  import SimpleButton from "./SimpleButton.svelte";

  export let tags: string[] = [];
  export let placeholder = "Add tag...";
  let newTag = "";

  const dispatch = createEventDispatcher();

  function addTag() {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      tags = [...tags, trimmed];
      newTag = "";
      dispatch("change", tags);
    }
  }

  function removeTag(tag: string) {
    tags = tags.filter(t => t !== tag);
    dispatch("change", tags);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  }
</script>

<div class="tag-manager">
  <div class="tags-list">
    {#each tags as tag}
      <span class="tag">
        {tag}
        <button class="remove-btn" on:click={() => removeTag(tag)}>
          <CloseIcon size="12" />
        </button>
      </span>
    {/each}
  </div>
  <div class="input-group">
    <input
      type="text"
      bind:value={newTag}
      {placeholder}
      on:keydown={handleKeydown}
    />
    <SimpleButton on:click={addTag}>
        <PlusMultiple size="16" />
    </SimpleButton>
  </div>
</div>

<style>
  .tag-manager {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .tag {
    background-color: var(--sidebar-bg-color);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .remove-btn {
    background: none;
    border: none;
    color: white;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    opacity: 0.7;
  }

  .remove-btn:hover {
    opacity: 1;
  }

  .input-group {
    display: flex;
    gap: 4px;
  }

  input {
    flex-grow: 1;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px 8px;
    background: transparent;
    color: inherit;
    font-size: 0.9rem;
  }
</style>
