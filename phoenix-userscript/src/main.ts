import { mount } from 'svelte';
import { db } from './lib/db';
import { generateHeuristicId, getFieldName } from './lib/id-generator';
import { initInterceptor } from './lib/interceptor';
// @ts-ignore
import RecoveryMenu from './components/RecoveryMenu.svelte';
// @ts-ignore
import SmartGhost from './components/SmartGhost.svelte';

console.log('Phoenix SOTA Form Recovery: Robust Engine Active');

const fieldStates = new Map<HTMLElement, { lastSavedValue: string, lastWriteTime: number }>();

function restoreField(el: HTMLElement, value: string) {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.value = value;
  } else if (el.isContentEditable) {
    if (!el.textContent?.trim()) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    }
    el.focus();
    document.execCommand('selectAll', false);
    document.execCommand('insertHTML', false, value);
  }
  ['input', 'change'].forEach(t => el.dispatchEvent(new Event(t, { bubbles: true })));
}

async function handleFieldInput(el: HTMLElement) {
  const value = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.innerHTML;
  const state = fieldStates.get(el) || { lastSavedValue: '', lastWriteTime: 0 };

  const now = Date.now();
  const timeSinceLastWrite = now - state.lastWriteTime;
  const valueChangedSignificantly = Math.abs(value.length - state.lastSavedValue.length) > 20;

  // Throttled significant write (Clever Trick #2)
  if (value.length > 2 && (valueChangedSignificantly || timeSinceLastWrite > 30000)) {
    const fieldId = generateHeuristicId(el);
    await db.save({
      domain: window.location.hostname,
      url: window.location.href,
      fieldId,
      fieldName: getFieldName(el),
      value,
      timestamp: now,
      isSubmitted: false
    });
    fieldStates.set(el, { lastSavedValue: value, lastWriteTime: now });
  }
}

function attachToField(el: HTMLElement) {
  if (el.dataset.phoenixAttached) return;
  el.dataset.phoenixAttached = 'true';

  const fieldId = generateHeuristicId(el);

  el.addEventListener('focus', () => {
    const rect = el.getBoundingClientRect();

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

  ['input', 'change', 'keyup'].forEach(evt => {
    el.addEventListener(evt, () => handleFieldInput(el));
  });
}

// Global Observers
const globalObserver = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node instanceof HTMLElement) {
        node.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(f => attachToField(f as HTMLElement));
        if (node.matches('input[type="text"], textarea, [contenteditable="true"]')) attachToField(node);
      }
    });
    const target = m.target as HTMLElement;
    if (target.isContentEditable) handleFieldInput(target);
  });
});
globalObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => attachToField(el as HTMLElement));

initInterceptor((body) => {
    console.log('[Phoenix] Network submission detected.');
});

// Emergency Save Logic (Clever Trick #3)
window.addEventListener('beforeunload', () => {
    document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => {
        handleFieldInput(el as HTMLElement);
    });
});

// Extended Emergency Save Logic (Clever Trick #3)
['visibilitychange', 'pagehide', 'freeze'].forEach(evt => {
  window.addEventListener(evt, () => {
    document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => {
      handleFieldInput(el as HTMLElement);
    });
  });
});
