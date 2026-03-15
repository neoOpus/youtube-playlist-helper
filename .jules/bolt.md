# Bolt's Journal - Performance & Architecture Learnings

## 2025-05-15 - [SSR/Test Safety & Notyf]
**Learning:** Browser-dependent libraries (like `notyf`) initialized at the module level in shared packages (like `@yph/core`) can break unit tests in Node environments (Vitest) with `ReferenceError: document is not defined`.
**Action:** Use lazy initialization with `typeof window !== 'undefined'` checks for any library that touches the DOM, even in shared utility modules.

## 2025-05-15 - [Efficient Sorting with Schwartzian Transform]
**Learning:** Sorting by expensive derived values (like AI relevance scores) can lead to $O(N \log N)$ redundant calculations.
**Action:** Use a Schwartzian transform (map to `{item, score}`, sort by score, map back to `item`) to ensure expensive calculations are only performed $O(N)$ times.

## 2025-05-15 - [Filtering Sequence Optimization]
**Learning:** Applying filters before sorting reduces the dataset size for the $O(N \log N)$ sort operation.
**Action:** Always filter by simple criteria (groups, text search) before applying complex sort logic.
