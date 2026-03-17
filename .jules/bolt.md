## 2026-02-15 - [Playlist Filtering Efficiency]
**Learning:** Filtering before sorting in Svelte reactive components significantly reduces the computational load for large datasets, especially when using expensive sorters like Smart Relevance. Combined with search debouncing and score pre-calculation, UI responsiveness improves from (N \log N)$ per keystroke to (M)$ with a delay, where $ is the filtered set size.
**Action:** Always prefer filtering data sets before applying sort operations, and pre-calculate complex sort keys (like relevance scores) to avoid redundant (N \log N)$ computations.

## 2026-02-15 - [String Comparison Optimization]
**Learning:** `String.prototype.localeCompare` is significantly slower than `Intl.Collator.compare` when sorting large arrays because it re-initializes locale-sensitive logic on every call. Using a pre-instantiated `Intl.Collator` can yield a ~3x performance boost for title-based sorting.
**Action:** Use a shared `Intl.Collator` instance for all string-based sorting operations in core services.
