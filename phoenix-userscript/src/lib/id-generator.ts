export function generateHeuristicId(el: HTMLElement): string {
  const parts: string[] = [];

  // 1. Direct signals
  if (el.id) parts.push(`id:${el.id}`);
  const name = el.getAttribute('name');
  if (name) parts.push(`name:${name}`);

  // 2. Accessibility signals
  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
  if (label) parts.push(`label:${label.slice(0, 20)}`);

  // 3. Contextual signals (find associated label)
  if (el instanceof HTMLInputElement && el.labels && el.labels.length > 0) {
    parts.push(`text:${el.labels[0].textContent?.trim().slice(0, 20)}`);
  }

  // 4. Fallback: Path relative to form
  const form = el.closest('form');
  if (form) {
    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
    const index = inputs.indexOf(el);
    parts.push(`form-idx:${index}`);
  }

  // Combine and hash
  const rawId = parts.join('|') || 'fallback-id';
  return btoa(rawId).replace(/=/g, '');
}

export function getFieldName(el: HTMLElement): string {
    return el.getAttribute('aria-label') ||
           el.getAttribute('placeholder') ||
           (el instanceof HTMLInputElement && el.labels?.[0]?.textContent?.trim()) ||
           el.getAttribute('name') ||
           'Unnamed Field';
}
