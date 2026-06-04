<script lang="ts">
  let { children } = $props();
  let error = $state<Error | null>(null);

  export function catchError(e: Error) {
      error = e;
  }
</script>

{#if error}
    <div class="error-screen">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onclick={() => window.location.reload()}>Reload System</button>
    </div>
{:else}
    {@render children()}
{/if}

<style>
    .error-screen {
        height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: #000; color: #ff5252; padding: 2rem; text-align: center;
    }
    button { margin-top: 1rem; padding: 0.5rem 1rem; background: #ff5252; color: white; border: none; border-radius: 4px; }
</style>
