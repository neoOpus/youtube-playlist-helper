/**
 * Lightweight Diffing Utility (Clever Trick #2)
 * Compares two strings and returns a patch or the full string if diff is too large.
 */
export function createPatch(oldStr: string, newStr: string): string | null {
  if (oldStr === newStr) return null;

  // For simplicity and 2026 performance, we use a simple 'delta' approach
  // In a real production apps, we might use Myers diff, but for forms,
  // we just want to know if it's a significant change.

  // If the change is small, we could store the delta, but to enable
  // easy "Time Machine" scrubbing, we store full snapshots throttled by
  // a 'Significance' threshold.

  const distance = Math.abs(newStr.length - oldStr.length);
  const isSignificant = distance > 10 || !oldStr;

  return isSignificant ? newStr : null;
}
