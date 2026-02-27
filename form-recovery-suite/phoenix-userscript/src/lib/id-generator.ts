/**
 * Phoenix Heuristic Engine v2.1
 * (c) 2026 Anoir Ben Tanfous aka neoOpus
 */
import { categorizeField } from './categorizer';

export function generateHeuristicId(el: HTMLElement): string {
  const parts: string[] = [];
  if (el.id && !el.id.match(/\d{5,}/)) parts.push(`id:${el.id}`);
  const name = el.getAttribute('name');
  if (name) parts.push(`name:${name}`);
  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
  if (label) parts.push(`label:${label.slice(0, 20)}`);
  if (el instanceof HTMLInputElement && el.labels?.[0]) {
    parts.push(`text:${el.labels[0].textContent?.trim().slice(0, 20)}`);
  }
  const parent = el.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children);
    parts.push(`struct:${siblings.map(s => s.tagName.toLowerCase()).join(',').slice(0, 50)}`);
    const surroundingText = parent.textContent?.replace(/\s+/g, ' ').trim().slice(0, 30);
    if (surroundingText) parts.push(`context:${surroundingText}`);
  }
  const root = el.getRootNode();
  if (root instanceof ShadowRoot && root.host?.id) parts.push(`shadow-host:${root.host.id}`);
  const form = el.closest('form');
  if (form) {
    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
    parts.push(`form-idx:${inputs.indexOf(el)}`);
  }

  // Add Categorization Signal
  parts.push(`cat:${categorizeField(el, label)}`);

  return btoa(unescape(encodeURIComponent(parts.join('|') || 'fallback')))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function getFieldName(el: HTMLElement): string {
    const raw = el.getAttribute('aria-label') || el.getAttribute('placeholder') ||
                (el instanceof HTMLInputElement && el.labels?.[0]?.textContent?.trim()) ||
                el.getAttribute('name') || 'Unnamed Field';
    return raw.length > 30 ? raw.slice(0, 27) + '...' : raw;
}
