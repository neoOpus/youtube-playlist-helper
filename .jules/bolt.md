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
## 2026-02-15 - [Playlist Filtering Efficiency]
**Learning:** Filtering before sorting in Svelte reactive components significantly reduces the computational load for large datasets, especially when using expensive sorters like Smart Relevance. Combined with search debouncing and score pre-calculation, UI responsiveness improves from (N \log N)$ per keystroke to (M)$ with a delay, where $ is the filtered set size.
**Action:** Always prefer filtering data sets before applying sort operations, and pre-calculate complex sort keys (like relevance scores) to avoid redundant (N \log N)$ computations.

## 2026-02-15 - [String Comparison Optimization]
**Learning:** `String.prototype.localeCompare` is significantly slower than `Intl.Collator.compare` when sorting large arrays because it re-initializes locale-sensitive logic on every call. Using a pre-instantiated `Intl.Collator` can yield a ~3x performance boost for title-based sorting.
**Action:** Use a shared `Intl.Collator` instance for all string-based sorting operations in core services.
**Learning:** Filtering before sorting in Svelte reactive components significantly reduces the computational load for large datasets, especially when using expensive sorters like Smart Relevance. Combined with search debouncing and score pre-calculation, UI responsiveness improves from $O(N \log N)$ per keystroke to $O(M)$ with a delay, where $M$ is the filtered set size.
**Action:** Always prefer filtering data sets before applying sort operations, and pre-calculate complex sort keys (like relevance scores) to avoid redundant computations during sorting.
