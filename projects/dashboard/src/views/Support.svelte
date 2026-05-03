<svelte:options runes={true} />
<script lang="ts">
  import { PayPalIcon, InfoIcon, SuperButton } from "@yph/ui-kit";
  import SectorComparison from "../components/SectorComparison.svelte";
  import { Heart, Globe, ShieldCheck, Zap, Mail } from "lucide-svelte";
</script>

<main class="view-container">
    <header class="view-header">
        <h1>Project Sustainability</h1>
        <p class="text-secondary">Fuel the development of sovereign media management tools.</p>
    </header>

    <div class="support-grid">
        <div class="main-column">
            <section class="hero-card surface-1">
                <div class="hero-header">
                    <div class="icon-wrap"><Heart size="32" fill="currentColor" /></div>
                    <div class="hero-text">
                        <h2>Sovereign Intelligence</h2>
                        <p>YouTube Playlist Helper is an independent, open-source infrastructure. Your contributions directly support research into local AI heuristics and privacy-first data synchronization.</p>
                    </div>
                </div>

                <div class="support-actions mt-8">
                    <SuperButton primary onclick={() => window.open('https://paypal.me/neoOpus', '_blank')}>
                        <PayPalIcon size="18" />
                        <span>Support via PayPal</span>
                    </SuperButton>
                    <button class="outline-btn" onclick={() => window.open('https://github.com', '_blank')}>
                        <Globe size="18" />
                        <span>Source Code</span>
                    </button>
                </div>
            </section>

            <SectorComparison />
        </div>

        <aside class="side-column">
            <section class="info-card surface-1">
                <h3>Priority Tiers</h3>
                <div class="tiers mt-6">
                    <div class="tier">
                        <ShieldCheck size="16" class="text-primary" />
                        <div class="tier-info">
                            <span class="t-name">Resilience Layer</span>
                            <p>Priority support and feature requests.</p>
                        </div>
                    </div>
                    <div class="tier">
                        <Zap size="16" class="text-secondary" />
                        <div class="tier-info">
                            <span class="t-name">Neural Access</span>
                            <p>Early access to experimental agents.</p>
                        </div>
                    </div>
                    <div class="tier">
                        <Mail size="16" />
                        <div class="tier-info">
                            <span class="t-name">Direct Channel</span>
                            <p>Contact the lead architect.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="architect-card surface-1 mt-6">
                <span class="label">Lead Architect</span>
                <div class="profile mt-4">
                    <div class="avatar">NO</div>
                    <div class="p-info">
                        <span class="name">neoOpus</span>
                        <span class="role">Systems Engineering</span>
                    </div>
                </div>
            </section>
        </aside>
    </div>
</main>

<style>
    .view-header { margin-bottom: var(--space-10); }
    h1 { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }

    .support-grid { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-8); }
    .main-column { display: flex; flex-direction: column; gap: var(--space-8); }

    .hero-card { padding: var(--space-10); }
    .hero-header { display: flex; gap: 32px; align-items: flex-start; }
    .icon-wrap {
        width: 80px; height: 80px; background: var(--primary); color: white;
        border-radius: 16px; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.3);
    }

    .hero-text h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 8px; }
    .hero-text p { font-size: 1rem; line-height: 1.6; color: var(--text-secondary); font-weight: 500; max-width: 600px; }

    .support-actions { display: flex; gap: 16px; }
    .outline-btn {
        background: transparent; border: 1px solid var(--border-strong); color: var(--text-main);
        padding: 0 24px; border-radius: 8px; font-weight: 700; font-size: 0.9rem;
        display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s;
    }
    .outline-btn:hover { border-color: var(--text-muted); background: var(--border-subtle); }

    .info-card { padding: var(--space-6); }
    .info-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; }

    .tiers { display: flex; flex-direction: column; gap: 20px; }
    .tier { display: flex; gap: 16px; align-items: flex-start; }
    .t-name { display: block; font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
    .tier-info p { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; font-weight: 500; }

    .architect-card { padding: var(--space-6); }
    .label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }
    .profile { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 40px; height: 40px; background: var(--bg-surface-2); border: 1px solid var(--border-strong); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: var(--primary); }
    .name { display: block; font-weight: 700; font-size: 0.95rem; }
    .role { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }

    :global(.text-primary) { color: var(--primary); }
    .text-secondary { color: var(--secondary); }
    .mt-6 { margin-top: 1.5rem; }

    @media (max-width: 1100px) {
        .support-grid { grid-template-columns: 1fr; }
        .hero-header { flex-direction: column; gap: 24px; align-items: center; text-align: center; }
        .hero-text p { max-width: none; }
        .support-actions { justify-content: center; }
    }
</style>
