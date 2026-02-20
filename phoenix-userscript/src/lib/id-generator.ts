export function generateHeuristicId(el: HTMLElement): string {
  const parts: string[] = [];

  // 1. Identification signals (The basics)
  if (el.id && !el.id.match(/\d{5,}/)) parts.push(`id:${el.id}`); // Ignore likely randomized IDs
  const name = el.getAttribute('name');
  if (name) parts.push(`name:${name}`);

  // 2. Accessibility / Semantic signals
  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
  if (label) parts.push(`label:${label.slice(0, 20)}`);

  // 3. Label text detection
  if (el instanceof HTMLInputElement && el.labels?.[0]) {
    parts.push(`text:${el.labels[0].textContent?.trim().slice(0, 20)}`);
  }

  // 4. Structural Fingerprinting (Clever Trick #1: V-Hash)
  // Get tag sequence of immediate siblings to identify position in dynamic lists
  const parent = el.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children);
    const tagSequence = siblings.map(s => s.tagName.toLowerCase()).join(',');
    parts.push(`struct:${tagSequence.slice(0, 50)}`);

    // Hash of surrounding text nodes (e.g. "Username:", "Email:")
    const surroundingText = parent.textContent?.replace(/\s+/g, ' ').trim().slice(0, 30);
    if (surroundingText) parts.push(`context:${surroundingText}`);
  }

  // 5. Shadow Root signals
  const root = el.getRootNode();
  if (root instanceof ShadowRoot && root.host?.id) {
    parts.push(`shadow-host:${root.host.id}`);
  }

  // 6. Logical Position (Fallback)
  const form = el.closest('form');
  if (form) {
    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
    parts.push(`form-idx:${inputs.indexOf(el)}`);
  }

  return btoa(unescape(encodeURIComponent(parts.join('|') || 'fallback'))).replace(/=/g, '');
}

export function getFieldName(el: HTMLElement): string {
    const raw = el.getAttribute('aria-label') ||
                el.getAttribute('placeholder') ||
                (el instanceof HTMLInputElement && el.labels?.[0]?.textContent?.trim()) ||
                el.getAttribute('name') ||
                'Unnamed Field';
    return raw.length > 30 ? raw.slice(0, 27) + '...' : raw;
}
