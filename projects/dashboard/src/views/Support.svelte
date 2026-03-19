<script lang="ts">
  import { fade } from "svelte/transition";
  import { PayPalIcon, InfoIcon } from "@yph/ui-kit";
</script>

<div class="support-view view-container" in:fade>
    <header class="view-header">
        <div class="header-content aura-glow">
            <div class="title-row">
                <div class="icon-blob"><InfoIcon size="32" /></div>
                <h1>System Support</h1>
            </div>
            <p class="muted">Support the ongoing development of the YouTube Playlist Infrastructure.</p>
        </div>
    </header>

    <div class="support-content pro-glass">
        <h3>Contribution Protocol</h3>
        <p class="mt-4">If you find this node helpful, consider fueling its development via a decentralized donation.</p>

        <button class="paypal-btn mt-8">
            <PayPalIcon size="24" />
            <span>Fuel Development via PayPal</span>
        </button>

        <div class="meta-info mt-12">
            <p class="small muted">Node Version: 1.2.4-QUANTUM</p>
            <p class="small muted">Developed by neoOpus Core Architecture</p>
        </div>
    </div>
</div>

<style>
    .view-container {
      padding: var(--space-12) var(--space-8);
      max-width: 1000px;
      margin: 0 auto;
    }

    .view-header { margin-bottom: var(--space-12); }
    .header-content { display: flex; flex-direction: column; gap: var(--space-3); }
    .header-content h1 { font-size: 3rem; margin: 0; }

    .title-row { display: flex; align-items: center; gap: var(--space-5); }

    .icon-blob {
        background: var(--primary);
        color: white;
        padding: var(--space-3);
        border-radius: var(--radius-lg);
        box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.4);
    }

    .pro-glass {
        padding: var(--space-12);
        border-radius: var(--radius-xl);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h3 { font-size: var(--font-xl); font-weight: 900; letter-spacing: -0.02em; }
    p { max-width: 500px; line-height: 1.6; color: var(--text-muted); font-size: var(--font-base); }

    .paypal-btn {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        background: #0070ba;
        color: white;
        padding: var(--space-4) var(--space-8);
        border-radius: var(--radius-full);
        font-weight: 800;
        font-size: var(--font-base);
        transition: all 0.3s var(--easing-standard);
        box-shadow: 0 8px 24px rgba(0, 112, 186, 0.3);
    }

    .paypal-btn:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 12px 32px rgba(0, 112, 186, 0.4);
        background: #005ea6;
    }

    .meta-info { border-top: 1px solid var(--border); padding-top: var(--space-8); width: 100%; opacity: 0.6; }
    .mt-4 { margin-top: 1rem; }
    .mt-8 { margin-top: 2rem; }
    .mt-12 { margin-top: 3rem; }

    @media (max-width: 600px) { .view-container { padding: var(--space-8) var(--space-4); } .pro-glass { padding: var(--space-8); } }
</style>
