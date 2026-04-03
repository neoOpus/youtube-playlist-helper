<script lang="ts">
  export let count = 0;
  export let className = "";
</script>

<div class="playlist-count {className}">
  <span>({count})</span>
</div>

<style>
  .playlist-count {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background-color: black;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
  }
</style>
