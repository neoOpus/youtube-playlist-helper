<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { PayPalIcon, InfoIcon, SuperButton, Breadcrumbs } from "@yph/ui-kit";
</script>

<main class="view-container" in:fade>
    <header class="view-header">
        <div class="header-content aura-glow">
            <Breadcrumbs items={[{label: 'SYSTEM'}, {label: 'SUPPORT INFRA', active: true}]} />
            <h1>System Support</h1>
            <p class="muted">Support the ongoing development of the YouTube Playlist Infrastructure.</p>
        </div>
    </header>

    <div class="support-grid">
        <section class="support-content pro-glass" in:fly={{ y: 20 }}>
            <div class="icon-blob">
                <InfoIcon size="48" />
            </div>

            <div class="text-content">
                <h3>Contribution Protocol</h3>
                <p>YouTube Playlist Helper is an open-source infrastructure infrastructure. If you find this node helpful, consider fueling its development via a decentralized donation.</p>

                <div class="support-actions mt-10">
                    <SuperButton onclick={() => window.open('https://paypal.me/neoOpus', '_blank')}>
                        <PayPalIcon size="20" />
                        <span>Fuel Development via PayPal</span>
                    </SuperButton>
                </div>

                <div class="meta-info mt-12">
                    <div class="meta-row">
                        <span class="label">Architecture Version</span>
                        <span class="val">1.2.4-Professional</span>
                    </div>
                    <div class="meta-row">
                        <span class="label">Lead Architect</span>
                        <span class="val">Anoir Ben Tanfous (neoOpus)</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="info-pane pro-glass" in:fly={{ y: 20, delay: 100 }}>
             <h3 class="card-title">Project Mission</h3>
             <p class="small mt-4">Our mission is to provide the most resilient, privacy-focused, and intelligent YouTube playlist management system in the world. Every contribution goes directly into R&D for local AI heuristics and E2EE synchronization.</p>

             <div class="perks mt-8">
                 <div class="perk-item">
                     <div class="dot primary"></div>
                     <span>Priority Feature Requests</span>
                 </div>
                 <div class="perk-item">
                     <div class="dot success"></div>
                     <span>Direct Developer Access</span>
                 </div>
                 <div class="perk-item">
                     <div class="dot info"></div>
                     <span>Early Alpha Access</span>
                 </div>
             </div>
        </section>
    </div>
</main>

<style>
    .view-container { padding: var(--space-8); max-width: 1200px; margin: 0 auto; }
    .support-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-8); margin-top: var(--space-4); }
    .support-content { padding: var(--space-12); display: flex; gap: var(--space-10); align-items: flex-start; }
    .icon-blob { background: var(--primary); color: white; width: 96px; height: 96px; flex-shrink: 0; border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; box-shadow: 0 16px 48px rgba(var(--primary-rgb), 0.4); }
    .text-content { flex-grow: 1; }
    h3 { font-size: var(--font-2xl); font-weight: 900; letter-spacing: -0.04em; margin-bottom: var(--space-4); }
    p { line-height: 1.7; color: var(--text-muted); font-size: var(--font-base); font-weight: 500; }
    .support-actions { display: flex; gap: var(--space-4); }
    .info-pane { padding: var(--space-10); display: flex; flex-direction: column; }
    .card-title { font-weight: 900; font-size: var(--font-lg); }
    .perks { display: flex; flex-direction: column; gap: var(--space-4); }
    .perk-item { display: flex; align-items: center; gap: var(--space-3); font-weight: 700; font-size: var(--font-sm); }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.primary { background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .dot.success { background: var(--success); box-shadow: 0 0 8px var(--success); }
    .dot.info { background: var(--info); box-shadow: 0 0 8px var(--info); }
    .meta-info { border-top: 1px solid var(--border); padding-top: var(--space-8); width: 100%; }
    .meta-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .meta-row .label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
    .meta-row .val { font-size: var(--font-xs); font-weight: 700; color: var(--text); }
    .mt-4 { margin-top: 1rem; }
    .mt-8 { margin-top: 2rem; }
    .mt-10 { margin-top: 2.5rem; }
    .mt-12 { margin-top: 3rem; }
    @media (max-width: 1000px) { .support-grid { grid-template-columns: 1fr; } .support-content { flex-direction: column; align-items: center; text-align: center; } .support-actions { justify-content: center; } }
</style>
