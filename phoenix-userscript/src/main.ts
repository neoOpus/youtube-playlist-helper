import { mount } from 'svelte';
import { db } from './lib/db';
import { generateHeuristicId, getFieldName } from './lib/id-generator';
import { initInterceptor } from './lib/interceptor';
// @ts-ignore
import RecoveryMenu from './components/RecoveryMenu.svelte';
// @ts-ignore
import SmartGhost from './components/SmartGhost.svelte';

console.log('Phoenix SOTA Form Recovery: Initializing Robust Engine');

/**
 * Robust Field Restoration Logic
 * Handles state-managed editors (DraftJS, Slate) using execCommand
 */
function restoreField(el: HTMLElement, value: string) {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.value = value;
  } else if (el.isContentEditable) {
    // DraftJS Hack: Init state if empty
    if (!el.textContent?.trim()) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    }
    el.focus();
    document.execCommand('selectAll', false);
    document.execCommand('insertHTML', false, value);
  }

  // Trigger events for React/Vue listeners
  ['input', 'change'].forEach(t => el.dispatchEvent(new Event(t, { bubbles: true })));
}

function attachToField(el: HTMLElement) {
  if (el.dataset.phoenixAttached) return;
  el.dataset.phoenixAttached = 'true';

  const fieldId = generateHeuristicId(el);

  // Focus: Show UI
  el.addEventListener('focus', () => {
    const rect = el.getBoundingClientRect();

    // 1. Recovery Menu (Shadow DOM)
    const menuHost = document.createElement('div');
    Object.assign(menuHost.style, {
      position: 'absolute',
      left: `${rect.right - 35}px`,
      top: `${rect.top}px`,
      zIndex: '2147483647'
    });
    const menuShadow = menuHost.attachShadow({ mode: 'open' });
    document.body.appendChild(menuHost);

    mount(RecoveryMenu, {
      target: menuShadow,
      props: {
        fieldId,
        onRestore: (val: string) => {
          restoreField(el, val);
          menuHost.remove();
        }
      }
    });

    // 2. Smart Ghost (Predictive UX)
    const ghostHost = document.createElement('div');
    Object.assign(ghostHost.style, {
      position: 'absolute',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: 'none',
      zIndex: '2147483646'
    });
    const ghostShadow = ghostHost.attachShadow({ mode: 'open' });
    document.body.appendChild(ghostHost);

    mount(SmartGhost, {
      target: ghostShadow,
      props: { fieldId, targetEl: el }
    });

    const cleanup = (e: MouseEvent) => {
      if (!menuHost.contains(e.target as Node) && e.target !== el) {
        menuHost.remove();
        ghostHost.remove();
        document.removeEventListener('mousedown', cleanup);
      }
    };
    document.addEventListener('mousedown', cleanup);
  });

  // Aggressive Monitoring: Multiple events + MutationObserver (handled globally)
  ['input', 'change', 'keyup'].forEach(evt => {
    el.addEventListener(evt, () => {
      const value = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.innerHTML;
      if (value.length > 2) {
        db.save({
          domain: window.location.hostname,
          url: window.location.href,
          fieldId,
          fieldName: getFieldName(el),
          value,
          timestamp: Date.now(),
          isSubmitted: false
        });
      }
    });
  });
}

// Global Mutation Observer for dynamic nodes and subtree changes
const globalObserver = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    // Detect new fields
    m.addedNodes.forEach(node => {
      if (node instanceof HTMLElement) {
        node.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(f => attachToField(f as HTMLElement));
        if (node.matches('input[type="text"], textarea, [contenteditable="true"]')) attachToField(node);
      }
    });
    // Handle rich text mutations directly
    const target = m.target as HTMLElement;
    if (target.isContentEditable) {
        target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
});
globalObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

// Initial injection
document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => attachToField(el as HTMLElement));

// Submission Interceptor
initInterceptor((body) => {
    // Logic to mark entries as submitted if body contains field content
    console.log('[Phoenix] Network submission detected.');
});
