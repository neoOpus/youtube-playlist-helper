export function generateHeuristicId(el: HTMLElement): string {
  const parts: string[] = [];
  if (el.id) parts.push(`id:${el.id}`);
  const name = el.getAttribute('name');
  if (name) parts.push(`name:${name}`);
  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
  if (label) parts.push(`label:${label.slice(0, 20)}`);
  if (el instanceof HTMLInputElement && el.labels?.[0]) {
    parts.push(`text:${el.labels[0].textContent?.trim().slice(0, 20)}`);
  }
  const form = el.closest('form');
  if (form) {
    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
    parts.push(`form-idx:${inputs.indexOf(el)}`);
  }
  return btoa(parts.join('|') || 'fallback').replace(/=/g, '');
}
