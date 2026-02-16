export class InputMonitor {
  private debouncedSaves: Map<string, number> = new Map();

  constructor() {
    this.initListeners();
    this.initIframeObserver();
  }

  private initListeners() {
    document.addEventListener('input', (e) => this.handleChange(e), true);
    document.addEventListener('change', (e) => this.handleChange(e), true);
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLElement;
    if (this.isEditable(target)) {
      this.saveField(target);
    }
  }

  private isEditable(el: HTMLElement): boolean {
    return (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el.isContentEditable
    );
  }

  private async saveField(el: HTMLElement) {
    const value = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      ? el.value
      : el.innerHTML;

    if (!value.trim()) return;

    // TODO: Send to background for saving via Dexie
    console.log('Phoenix Monitoring:', value);
  }

  private initIframeObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLIFrameElement) {
            this.monitorIframe(node);
          }
        });
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Check existing iframes
    document.querySelectorAll('iframe').forEach(iframe => this.monitorIframe(iframe));
  }

  private monitorIframe(iframe: HTMLIFrameElement) {
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        doc.addEventListener('input', (e) => this.handleChange(e), true);
      }
    } catch (e) {
      // Cross-origin iframe, handled by manifest match rules if same-origin
    }
  }
}
