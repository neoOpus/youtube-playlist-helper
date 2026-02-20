import { generateHeuristicId, getFieldName } from '../common/id';
import { PhoenixBus } from '../common/messaging';

export class InputMonitor {
  private debounces: Map<HTMLElement, number> = new Map();
  private lastValues: Map<HTMLElement, string> = new Map();

  constructor() {
    this.initListeners();
    this.initIframeObserver();
  }

  private initListeners() {
    ['input', 'change', 'keydown'].forEach(evt => {
      document.addEventListener(evt, (e) => this.handleChange(e), true);
    });

    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        const target = m.target as HTMLElement;
        if (target.isContentEditable) {
           this.handleChange({ target } as any);
        }
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLElement;
    if (!this.isEditable(target)) return;

    const value = this.getValue(target);
    if (this.lastValues.get(target) === value) return;
    this.lastValues.set(target, value);

    // Debounce Save (Clever Trick)
    if (this.debounces.has(target)) clearTimeout(this.debounces.get(target));
    this.debounces.set(target, window.setTimeout(() => this.save(target, value), 1000));
  }

  private isEditable(el: HTMLElement): boolean {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el.isContentEditable;
  }

  private getValue(el: HTMLElement): string {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.innerHTML;
  }

  private save(el: HTMLElement, value: string) {
    if (value.length < 3) return;

    PhoenixBus.send({
      type: 'SAVE_ENTRY',
      data: {
        fieldId: generateHeuristicId(el),
        fieldName: getFieldName(el),
        fieldType: el instanceof HTMLInputElement ? el.type : el.tagName.toLowerCase(),
        value,
        url: location.href
      }
    });
  }

  private initIframeObserver() {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (node instanceof HTMLIFrameElement) this.monitorIframe(node);
        });
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    document.querySelectorAll('iframe').forEach(i => this.monitorIframe(i));
  }

  private monitorIframe(iframe: HTMLIFrameElement) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      ['input', 'change', 'keydown'].forEach(evt => {
        doc.addEventListener(evt, (e) => this.handleChange(e), true);
      });
    } catch (e) { /* Cross-origin */ }
  }
}
