import { generateHeuristicId } from '../common/id';

export class InputMonitor {
  private lastValues: Map<HTMLElement, string> = new Map();

  constructor() {
    this.initListeners();
    this.initIframeObserver();
  }

  private initListeners() {
    // Capture standard events
    ['input', 'change', 'keydown', 'keyup'].forEach(evtType => {
      document.addEventListener(evtType, (e) => this.handleChange(e), true);
    });

    // Subtree mutations for rich text
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        const target = m.target as HTMLElement;
        if (target.isContentEditable) this.handleChange({ target } as any);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLElement;
    if (!this.isEditable(target)) return;

    const value = this.getValue(target);
    if (this.lastValues.get(target) === value) return;

    this.lastValues.set(target, value);
    this.save(target, value);
  }

  private isEditable(el: HTMLElement): boolean {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el.isContentEditable;
  }

  private getValue(el: HTMLElement): string {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.innerHTML;
  }

  private save(el: HTMLElement, value: string) {
    if (value.length < 3) return;
    const id = generateHeuristicId(el);
    console.log('[Phoenix] Saving:', id, value.slice(0, 20));
    // Implementation for storage via background
    chrome.runtime.sendMessage({ type: 'SAVE_ENTRY', data: { id, value, url: location.href } });
  }

  private initIframeObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node instanceof HTMLIFrameElement) this.monitorIframe(node);
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
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

  // Next-level restoration logic
  public static restore(el: HTMLElement, value: string) {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value;
    } else {
      // DraftJS / Rich Text hack
      if (el.isContentEditable && !el.textContent?.trim()) {
          // Simulate keystroke to init internal state
          const ev = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
          el.dispatchEvent(ev);
      }
      el.focus();
      document.execCommand('selectAll', false);
      document.execCommand('insertHTML', false, value);
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
