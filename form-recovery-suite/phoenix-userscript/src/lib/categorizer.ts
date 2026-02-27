/**
 * Phoenix Heuristic Categorizer (Clever Trick #5)
 * Assigns semantic labels to fields based on patterns.
 */
export function categorizeField(el: HTMLElement, name: string): string {
  const text = (name + ' ' + el.id + ' ' + el.getAttribute('name') + ' ' + el.getAttribute('aria-label')).toLowerCase();

  if (text.includes('login') || text.includes('username') || text.includes('email')) return 'Auth';
  if (text.includes('comment') || text.includes('reply') || text.includes('message')) return 'Social';
  if (text.includes('search') || text.includes('query')) return 'Search';
  if (text.includes('post') || text.includes('title') || text.includes('desc')) return 'Content';
  if (text.includes('address') || text.includes('zip') || text.includes('city')) return 'Personal';

  return 'General';
}
