export function generateHeuristicId(el: HTMLElement): string {
  const parts: string[] = [];

  // 1. Identification signals
  if (el.id) parts.push(`id:${el.id}`);
  const name = el.getAttribute('name');
  if (name) parts.push(`name:${name}`);

  // 2. Accessibility / Semantic signals
  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
  if (label) parts.push(`label:${label.slice(0, 20)}`);

  // 3. Label text detection
  if (el instanceof HTMLInputElement && el.labels?.[0]) {
    parts.push(`text:${el.labels[0].textContent?.trim().slice(0, 20)}`);
  }

  // 4. Site-specific "Exceptions" handling
  // If we are in a contenteditable inside a shadow root, add the host ID
  const root = el.getRootNode();
  if (root instanceof ShadowRoot && root.host?.id) {
    parts.push(`shadow-host:${root.host.id}`);
  }

  // 5. Logical Position (Last resort but helpful for SPAs)
  const form = el.closest('form');
  if (form) {
    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
    parts.push(`form-idx:${inputs.indexOf(el)}`);
  } else {
    // If no form, use absolute index of type on page (throttled/cached would be better)
    const sameType = Array.from(document.querySelectorAll(el.tagName.toLowerCase()));
    parts.push(`page-idx:${sameType.indexOf(el)}`);
  }

  // Base64 encoding for clean storage keys
  return btoa(unescape(encodeURIComponent(parts.join('|') || 'fallback'))).replace(/=/g, '');
}

export function getFieldName(el: HTMLElement): string {
    return el.getAttribute('aria-label') ||
           el.getAttribute('placeholder') ||
           (el instanceof HTMLInputElement && el.labels?.[0]?.textContent?.trim()) ||
           el.getAttribute('name') ||
           'Unnamed Field';
}
