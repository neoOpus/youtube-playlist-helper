/**
 * Phoenix Nano-Delta Engine v1.0
 * (c) 2026 Anoir Ben Tanfous aka neoOpus
 */

export interface Delta {
  p: number; // Position
  d: number; // Delete count
  i: string; // Insert string
}

export const NanoDelta = {
  /**
   * Compares two strings and returns a compact delta.
   * Optimized for forward-typing in form fields.
   */
  diff: (oldStr: string, newStr: string): Delta | null => {
    if (oldStr === newStr) return null;

    let start = 0;
    while (start < oldStr.length && start < newStr.length && oldStr[start] === newStr[start]) {
      start++;
    }

    let endOld = oldStr.length - 1;
    let endNew = newStr.length - 1;
    while (endOld >= start && endNew >= start && oldStr[endOld] === newStr[endNew]) {
      endOld--;
      endNew--;
    }

    return {
      p: start,
      d: endOld - start + 1,
      i: newStr.slice(start, endNew + 1)
    };
  },

  /**
   * Applies a delta to an old string.
   */
  apply: (oldStr: string, delta: Delta): string => {
    return oldStr.slice(0, delta.p) + delta.i + oldStr.slice(delta.p + delta.d);
  }
};
