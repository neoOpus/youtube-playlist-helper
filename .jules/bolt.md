## 2025-05-15 - [Efficient List Filtering and Sorting]
**Learning:** Performing filtering before sorting reduces the computational complexity from $O(N \log N)$ to $O(M \log M)$, where $M$ is the size of the filtered set. For expensive sort criteria like AI-driven relevance, using a Schwartzian transform (pre-calculating scores) further reduces the number of expensive function calls to exactly $M$.
**Action:** Always filter as early as possible in a processing pipeline and use Schwartzian transforms for expensive sort operations.
