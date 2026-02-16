import { mount } from 'svelte';
import { db } from './lib/db';
import { generateHeuristicId, getFieldName } from './lib/id-generator';
import { initInterceptor } from './lib/interceptor';
// @ts-ignore
import RecoveryMenu from './components/RecoveryMenu.svelte';
// @ts-ignore
import SmartGhost from './components/SmartGhost.svelte';

console.log('Phoenix SOTA Form Recovery Started');

function attachToField(el: HTMLElement) {
  if (el.dataset.phoenixAttached) return;
  el.dataset.phoenixAttached = 'true';

  const fieldId = generateHeuristicId(el);

  // Focus Logic
  el.addEventListener('focus', () => {
    const rect = el.getBoundingClientRect();

    // Recovery Menu
    const menuHost = document.createElement('div');
    menuHost.style.position = 'absolute';
    menuHost.style.left = `${rect.right - 30}px`;
    menuHost.style.top = `${rect.top}px`;
    menuHost.style.zIndex = '1000000';
    const menuShadow = menuHost.attachShadow({ mode: 'open' });
    document.body.appendChild(menuHost);

    mount(RecoveryMenu, {
      target: menuShadow,
      props: {
        fieldId,
        onRestore: (val: string) => {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.value = val;
          } else {
            el.innerHTML = val;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          menuHost.remove();
        }
      }
    });

    // Smart Ghost (Experimental)
    const ghostHost = document.createElement('div');
    ghostHost.style.position = 'absolute';
    ghostHost.style.left = `${rect.left}px`;
    ghostHost.style.top = `${rect.top}px`;
    ghostHost.style.width = `${rect.width}px`;
    ghostHost.style.height = `${rect.height}px`;
    ghostHost.style.pointerEvents = 'none';
    ghostHost.style.zIndex = '999999';
    const ghostShadow = ghostHost.attachShadow({ mode: 'open' });
    document.body.appendChild(ghostHost);

    mount(SmartGhost, {
      target: ghostShadow,
      props: { fieldId, targetEl: el }
    });

    const blurHandler = (e: MouseEvent) => {
      if (!menuHost.contains(e.target as Node) && e.target !== el) {
        menuHost.remove();
        ghostHost.remove();
        document.removeEventListener('mousedown', blurHandler);
      }
    };
    document.addEventListener('mousedown', blurHandler);
  });

  el.addEventListener('input', () => {
    const value = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      ? el.value
      : el.innerHTML;

    if (value.length > 3) {
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
}

const observer = new MutationObserver(() => {
  document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => {
    attachToField(el as HTMLElement);
  });
});
observer.observe(document.body, { childList: true, subtree: true });

document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => {
  attachToField(el as HTMLElement);
});

initInterceptor((data) => {
    console.log('Phoenix: Submission detected.');
});
