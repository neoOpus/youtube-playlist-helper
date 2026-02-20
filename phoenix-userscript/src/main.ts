import { mount } from 'svelte';
import { db } from './lib/db';
import { generateHeuristicId, getFieldName } from './lib/id-generator';
import { initInterceptor } from './lib/interceptor';
// @ts-ignore
import RecoveryMenu from './components/RecoveryMenu.svelte';
// @ts-ignore
import SmartGhost from './components/SmartGhost.svelte';

console.log('Phoenix SOTA Form Recovery: Engine Initialized');

const debounces = new Map<HTMLElement, number>();

async function saveToDB(el: HTMLElement) {
  const value = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.innerHTML;
  if (value.length < 3) return;

  await db.save({
    domain: window.location.hostname,
    url: window.location.href,
    fieldId: generateHeuristicId(el),
    fieldName: getFieldName(el),
    fieldType: el instanceof HTMLInputElement ? el.type : el.tagName.toLowerCase(),
    value,
    timestamp: Date.now(),
    isSubmitted: false
  });
}

function handleInput(el: HTMLElement) {
  if (debounces.has(el)) clearTimeout(debounces.get(el));
  debounces.set(el, window.setTimeout(() => saveToDB(el), 1000));
}

function attachToField(el: HTMLElement) {
  if (el.dataset.phoenixAttached) return;
  el.dataset.phoenixAttached = 'true';

  el.addEventListener('focus', () => {
    const fieldId = generateHeuristicId(el);
    const rect = el.getBoundingClientRect();

    // UI Logic (consolidated)
    const host = document.createElement('div');
    Object.assign(host.style, { position: 'absolute', left: `${rect.right - 35}px`, top: `${rect.top}px`, zIndex: '2147483647' });
    const shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);

    mount(RecoveryMenu, {
      target: shadow,
      props: {
        fieldId,
        onRestore: (val: string) => {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = val;
          else el.innerHTML = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          host.remove();
        }
      }
    });

    const cleanup = (e: MouseEvent) => {
      if (!host.contains(e.target as Node) && e.target !== el) {
        host.remove();
        document.removeEventListener('mousedown', cleanup);
      }
    };
    document.addEventListener('mousedown', cleanup);
  });

  ['input', 'change', 'keydown'].forEach(evt => {
    el.addEventListener(evt, () => handleInput(el));
  });
}

const observer = new MutationObserver(() => {
  document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => attachToField(el as HTMLElement));
});
observer.observe(document.body, { childList: true, subtree: true });

document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => attachToField(el as HTMLElement));

initInterceptor((body) => {
    console.log('[Phoenix] Network submission detected.');
});
