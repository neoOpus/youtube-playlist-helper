<svelte:options runes={true} />
<script lang="ts">
  import { ShieldX, RefreshCw, Terminal } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
  let error = $state<Error | null>(null);

  // In Svelte 5, we can use try-catch in effects or standard error handling patterns
  // For a true "Error Boundary", we'd typically wrap logic, but Svelte doesn't have
  // a built-in <svelte:error> component yet like React.
  // We will provide a fallback state that can be triggered.

  export function catchError(e: Error) {
      error = e;
      console.error("System Protocol Breach:", e);
  }

  function reset() {
      error = null;
      window.location.reload();
  }
</script>

{#if error}
    <div class="error-overlay" in:fade>
        <div class="error-content surface-2 p-12" in:fly={{ y: 40, duration: 600 }}>
            <div class="error-header">
                <div class="icon-ring">
                    <ShieldX size="48" color="#ff5252" />
                </div>
                <h1 class="pro-red-glow">CRITICAL SYSTEM BREACH</h1>
            </div>

            <div class="error-details mt-8">
                <div class="terminal-header">
                    <Terminal size="14" />
                    <span>KERNEL_PANIC_REPORT</span>
                </div>
                <pre class="error-stack">{error.message}\n\n{error.stack}</pre>
            </div>

            <div class="actions mt-10">
                <button class="pro-btn primary" onclick={reset}>
                    <RefreshCw size="18" />
                    <span>REBOOT INFRASTRUCTURE</span>
                </button>
                <p class="muted small mt-4">Security protocols have sequestered this error. Reboot recommended.</p>
            </div>
        </div>
    </div>
{:else}
    {@render children?.()}
{/if}

<style>
    .error-overlay {
        position: fixed;
        inset: 0;
        background: radial-gradient(circle at center, #1a0505 0%, #030712 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .error-content {
        max-width: 800px;
        width: 100%;
        text-align: center;
        border: 2px solid rgba(255, 82, 82, 0.2);
        box-shadow: 0 0 100px rgba(255, 82, 82, 0.1);
    }

    .error-header h1 {
        font-size: 2.5rem;
        font-weight: 900;
        letter-spacing: 0.1em;
        margin-top: 1.5rem;
    }

    .pro-red-glow {
        color: #ff5252;
        text-shadow: 0 0 20px rgba(255, 82, 82, 0.5);
    }

    .icon-ring {
        width: 100px;
        height: 100px;
        border: 4px double #ff5252;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        animation: pulse-border 2s infinite;
    }

    @keyframes pulse-border {
        0% { border-color: rgba(255, 82, 82, 0.2); }
        50% { border-color: rgba(255, 82, 82, 1); }
        100% { border-color: rgba(255, 82, 82, 0.2); }
    }

    .error-details {
        text-align: left;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .terminal-header {
        background: rgba(255, 255, 255, 0.03);
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: var(--text-dim);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .error-stack {
        padding: 1.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: #ff8a8a;
        max-height: 300px;
        overflow-y: auto;
        white-space: pre-wrap;
        margin: 0;
    }

    .actions {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
