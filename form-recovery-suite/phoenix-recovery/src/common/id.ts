/**
 * Phoenix Heuristic Engine v2.0
 * (c) 2026 Anoir Ben Tanfous aka neoOpus
 */

export function generateHeuristicId(el: HTMLElement): string {
  const parts: string[] = [];

  // 1. Identification signals (The basics)
  // Ignore likely randomized IDs (common in React/Next.js)
  if (el.id && !el.id.match(/\d{5,}/)) parts.push(`id:${el.id}`);
  const name = el.getAttribute('name');
  if (name) parts.push(`name:${name}`);

  // 2. Accessibility / Semantic signals
  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
  if (label) parts.push(`label:${label.slice(0, 20)}`);

  // 3. Label text detection (Standard HTML labels)
  if (el instanceof HTMLInputElement && el.labels?.[0]) {
    parts.push(`text:${el.labels[0].textContent?.trim().slice(0, 20)}`);
  }

  // 4. Structural Fingerprinting (V-Hash)
  const parent = el.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children);
    const tagSequence = siblings.map(s => s.tagName.toLowerCase()).join(',');
    parts.push(`struct:${tagSequence.slice(0, 50)}`);

    // Semantic Context (Surrounding text node analysis)
    const surroundingText = parent.textContent?.replace(/\s+/g, ' ').trim().slice(0, 30);
    if (surroundingText) parts.push(`context:${surroundingText}`);
  }

  // 5. Shadow Root signals (Deep encapsulation)
  const root = el.getRootNode();
  if (root instanceof ShadowRoot && root.host?.id) {
    parts.push(`shadow-host:${root.host.id}`);
  }

  // 6. Logical Position (Last-resort fallback)
  const form = el.closest('form');
  if (form) {
    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
    parts.push(`form-idx:${inputs.indexOf(el)}`);
  }

  // Use a modern URL-safe Base64 approach
  return btoa(unescape(encodeURIComponent(parts.join('|') || 'fallback')))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function getFieldName(el: HTMLElement): string {
    const raw = el.getAttribute('aria-label') ||
                el.getAttribute('placeholder') ||
                (el instanceof HTMLInputElement && el.labels?.[0]?.textContent?.trim()) ||
                el.getAttribute('name') ||
                'Unnamed Field';
    return raw.length > 30 ? raw.slice(0, 27) + '...' : raw;
}
