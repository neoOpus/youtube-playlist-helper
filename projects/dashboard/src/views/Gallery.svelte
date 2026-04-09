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
    Breadcrumbs,
    TerminalIcon,
    SaveIcon,
    DeleteIcon,
    PencilIcon,
    PlusMultiple,
    SearchIcon,
    CheckIcon
  } from "@yph/ui-kit";
  import Modal from "../components/Modal.svelte";

  let showModal = $state(false);
  let showContextMenu = $state(false);
  let menuX = $state(0);
  let menuY = $state(0);

  let checkboxVal = $state(true);
  let toggleVal = $state(true);
  let radioVal = $state("opt1");
  let inputVal = $state("");
  let selectVal = $state("red");

  const radioOptions = [
    { value: "opt1", label: "Option One" },
    { value: "opt2", label: "Option Two" },
    { value: "opt3", label: "Option Three" }
  ];

  const selectOptions = [
    { value: "red", label: "Pro Red" },
    { value: "blue", label: "Sync Blue" },
    { value: "green", label: "Success Green" }
  ];

  const menuItems = [
      { label: "Edit Protocol", icon: PencilIcon, onclick: () => alert("Edit") },
      { label: "Sync Node", icon: TerminalIcon, onclick: () => alert("Sync") },
      { label: "Export Data", icon: SaveIcon, onclick: () => alert("Export") },
      { label: "Decommission", icon: DeleteIcon, onclick: () => alert("Delete"), danger: true }
  ];

  function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      menuX = e.clientX;
      menuY = e.clientY;
      showContextMenu = true;
  }
</script>

<main class="view-container" in:fade>
  <header class="view-header aura-glow">
    <Breadcrumbs items={[{label: 'INFRASTRUCTURE'}, {label: 'COMPONENT GALLERY', active: true}]} />
    <h1>System Component Gallery</h1>
    <p class="muted">A live showcase of the Professional Edition design system and interaction patterns.</p>
  </header>

  <div class="gallery-grid">
    <!-- Buttons Section -->
    <section class="gallery-section pro-glass">
      <h2 class="section-title"><TerminalIcon size="18" /> Action Protocols (Buttons)</h2>
      <div class="component-showcase buttons-row">
        <div class="group">
          <span class="label">States</span>
          <div class="flex gap-4">
            <SuperButton primary>Primary Action</SuperButton>
            <SuperButton secondary>Secondary</SuperButton>
            <SuperButton danger>Danger Protocol</SuperButton>
            <SuperButton outline>Outline</SuperButton>
            <SuperButton link>Link Action</SuperButton>
          </div>
        </div>
        <div class="group mt-6">
          <span class="label">Variants</span>
          <div class="flex gap-4 items-center">
            <SuperButton mini primary>Mini Button</SuperButton>
            <SuperButton circle primary><PlusMultiple size="18" /></SuperButton>
            <SuperButton disabled primary>Disabled Node</SuperButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Form Elements -->
    <section class="gallery-section pro-glass">
      <h2 class="section-title"><CheckIcon size="18" /> Input Interfacing</h2>
      <div class="component-showcase form-grid">
        <div class="group">
          <span class="label">Text Field</span>
          <SuperInput label="Node Identifier" bind:value={inputVal} placeholder="Enter ID..." />
        </div>
        <div class="group mt-6">
          <span class="label">Select Menu</span>
          <SuperSelect label="System Theme" bind:value={selectVal} options={selectOptions} />
        </div>
        <div class="group mt-6 flex gap-10">
          <div class="sub-group">
            <span class="label">Check State</span>
            <SuperCheckbox label="Neural Link Active" bind:checked={checkboxVal} />
          </div>
          <div class="sub-group">
            <span class="label">Toggle Switch</span>
            <SuperToggle bind:active={toggleVal} />
          </div>
        </div>
        <div class="group mt-6">
          <span class="label">Radio Group</span>
          <RadioGroup bind:value={radioVal} options={radioOptions} />
        </div>
      </div>
    </section>

    <!-- Feedback & Overlays -->
    <section class="gallery-section pro-glass">
      <h2 class="section-title"><SearchIcon size="18" /> Intelligence Feedback</h2>
      <div class="component-showcase feedback-grid">
        <div class="group">
          <span class="label">Loading Feedback (2Hz)</span>
          <div class="flex items-center gap-4">
            <LoadingSpinner size={32} />
            <span class="small muted">Processing infrastructure...</span>
          </div>
        </div>
        <div class="group mt-8">
          <span class="label">Overlays</span>
          <div class="flex gap-4">
            <SuperButton outline onclick={() => showModal = true}>Launch Modal Wizard</SuperButton>
            <div
                class="context-trigger pro-glass-high" role="application" aria-label="Context Menu Demo"
                oncontextmenu={handleContextMenu}
            >
                Right-Click for Context Menu
            </div>
          </div>
        </div>
        <div class="group mt-8">
          <span class="label">Help Systems (Tooltips)</span>
          <div class="flex gap-10">
            <Tooltip text="Infrastructure node healthy" position="top">
                <span class="tooltip-target">Hover for Top</span>
            </Tooltip>
            <Tooltip text="Security protocol enabled" position="right">
                <span class="tooltip-target">Hover for Right</span>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  </div>

  <Modal bind:display={showModal} title="Neural Configuration Wizard">
    <div class="modal-demo">
      <p>This is a standard Professional Edition modal container with glassmorphism and A11y hardening.</p>
      <div class="mt-8 flex justify-end">
        <SuperButton primary onclick={() => showModal = false}>Complete Protocol</SuperButton>
      </div>
    </div>
  </Modal>

  <ContextMenu
    items={menuItems}
    bind:display={showContextMenu}
    x={menuX}
    y={menuY}
  />
</main>

<style>
  .gallery-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-8); margin-top: var(--space-8); }
  .gallery-section { padding: var(--space-10); }
  .section-title { margin-bottom: var(--space-8); display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-xl); }
  .label { display: block; font-size: var(--font-xs); font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: var(--space-3); }

  .flex { display: flex; }
  .gap-4 { gap: 1rem; }
  .gap-10 { gap: 2.5rem; }
  .items-center { align-items: center; }
  .justify-end { justify-content: flex-end; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-8 { margin-top: 2rem; }

  .context-trigger {
      padding: var(--space-4) var(--space-8);
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: var(--font-sm);
      cursor: context-menu;
      border: 1px dashed var(--border-strong);
      color: var(--text-muted);
  }

  .tooltip-target {
      padding: var(--space-2) var(--space-4);
      background: var(--hover);
      border-radius: var(--radius-sm);
      font-weight: 800;
      font-size: var(--font-xs);
      cursor: help;
  }

  .modal-demo { padding: var(--space-2); }
</style>
