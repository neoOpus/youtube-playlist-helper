<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import {
    SuperButton,
    SuperCheckbox,
    SuperToggle,
    RadioGroup,
    SuperInput,
    SuperSelect,
    LoadingSpinner,
    Tooltip,
    ContextMenu,
    Breadcrumbs
  } from "@yph/ui-kit";
  import {
    Terminal,
    Save,
    Trash2,
    Edit3,
    Plus,
    Search,
    Check,
    Layers,
    Monitor
  } from "lucide-svelte";
  import Modal from "../components/Modal.svelte";

  let showModal = $state(false);
  let showContextMenu = $state(false);
  let menuX = $state(0);
  let menuY = $state(0);

  let checkboxVal = $state(true);
  let toggleVal = $state(true);
  let radioVal = $state("opt1");
  let inputVal = $state("");
  let selectVal = $state("blue");

  const radioOptions = [
    { value: "opt1", label: "Protocol Alpha" },
    { value: "opt2", label: "Protocol Beta" }
  ];

  const selectOptions = [
    { value: "blue", label: "Modern Blue" },
    { value: "emerald", label: "Emerald Green" }
  ];

  const menuItems = [
      { label: "Edit Protocol", icon: Edit3, onclick: () => {} },
      { label: "Purge Node", icon: Trash2, onclick: () => {}, danger: true }
  ];

  function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      menuX = e.clientX;
      menuY = e.clientY;
      showContextMenu = true;
  }
</script>

<main class="view-container">
  <header class="view-header">
    <h1>Interface Architecture</h1>
    <p class="text-secondary">Component showcase for the "Clean & Sleek" v4 design system.</p>
  </header>

  <div class="gallery-grid">
    <section class="gallery-card surface-1">
      <div class="card-header"><Terminal size="18" class="icon-primary" /> <h2>Action Foundations</h2></div>
      <div class="showcase">
          <div class="group">
            <span class="g-label">State Variants</span>
            <div class="row">
                <SuperButton primary>Primary</SuperButton>
                <SuperButton secondary>Secondary</SuperButton>
                <SuperButton danger>Danger</SuperButton>
                <SuperButton outline>Outline</SuperButton>
            </div>
          </div>
          <div class="group mt-8">
            <span class="g-label">Structural Variants</span>
            <div class="row items-center">
                <SuperButton mini primary>Mini Action</SuperButton>
                <SuperButton circle primary><Plus size="18" /></SuperButton>
                <SuperButton disabled primary>Locked Node</SuperButton>
            </div>
          </div>
      </div>
    </section>

    <section class="gallery-card surface-1">
      <div class="card-header"><Monitor size="18" class="icon-primary" /> <h2>Input Interfacing</h2></div>
      <div class="showcase form-grid">
          <div class="row gap-8">
              <SuperInput label="Node Identifier" bind:value={inputVal} placeholder="Enter ID..." />
              <SuperSelect label="System Foundation" bind:value={selectVal} options={selectOptions} />
          </div>
          <div class="row mt-8 gap-12">
              <SuperCheckbox label="Neural Link Active" bind:checked={checkboxVal} />
              <SuperToggle label="Activity Stream" bind:active={toggleVal} />
          </div>
      </div>
    </section>

    <section class="gallery-card surface-1">
        <div class="card-header"><Layers size="18" class="icon-primary" /> <h2>Overlays & Context</h2></div>
        <div class="showcase row items-center gap-10">
            <SuperButton outline onclick={() => showModal = true}>Initialize Modal</SuperButton>
            <div class="context-trigger surface-2" oncontextmenu={handleContextMenu} role="button" tabindex="0">
                Right-Click for Context Menu
            </div>
            <Tooltip text="Infrastructure status nominal" position="top">
                <div class="tooltip-box">Hover for Insight</div>
            </Tooltip>
        </div>
    </section>
  </div>

  <Modal bind:display={showModal} title="System Configuration Protocol">
    <div class="modal-content">
      <p>This is the standardized modal interface. It utilizes high-contrast solid surfaces and refined typography for maximum clarity.</p>
      <div class="mt-8 flex justify-end">
        <SuperButton primary onclick={() => showModal = false}>Finalize</SuperButton>
      </div>
    </div>
  </Modal>

  <ContextMenu items={menuItems} bind:display={showContextMenu} x={menuX} y={menuY} />
</main>

<style>
  .view-header { margin-bottom: 32px; }
  h1 { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }

  .gallery-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
  .gallery-card { padding: 32px; }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-base); padding-bottom: 16px; }
  .card-header h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
  :global(.icon-primary) { color: var(--primary); }

  .showcase { display: flex; flex-direction: column; gap: 16px; }
  .g-label { display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; margin-bottom: 12px; }

  .row { display: flex; gap: 16px; }
  .gap-8 { gap: 32px; }
  .gap-12 { gap: 48px; }
  .gap-10 { gap: 40px; }
  .items-center { align-items: center; }
  .justify-end { justify-content: flex-end; }
  .flex { display: flex; }
  .mt-8 { margin-top: 2rem; }

  .context-trigger {
      padding: 16px 32px; border-radius: 8px; border: 1px dashed var(--border-strong);
      color: var(--text-secondary); font-weight: 700; cursor: context-menu;
  }

  .tooltip-box {
      padding: 8px 16px; background: var(--bg-surface-2); border: 1px solid var(--border-base);
      border-radius: 6px; font-weight: 800; font-size: 0.75rem; cursor: help; color: var(--primary);
  }

  .modal-content p { color: var(--text-secondary); font-weight: 500; line-height: 1.6; }
</style>
