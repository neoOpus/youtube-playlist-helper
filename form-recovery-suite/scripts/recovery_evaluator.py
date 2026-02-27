import math
import sys

def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def shannon_entropy(s):
    if not s: return 0
    prob = [float(s.count(c)) / len(s) for c in dict.fromkeys(list(s))]
    return - sum([p * math.log(p) / math.log(2.0) for p in prob])

def evaluate_restore_points(entries):
    """
    Ranks recovery entries based on length, entropy (information density),
    and similarity to other entries.
    """
    results = []
    for i, entry in enumerate(entries):
        entropy = shannon_entropy(entry)
        length = len(entry)
        # Quality score: length * entropy (reward high density and long text)
        score = length * entropy
        results.append({
            'index': i,
            'text': entry[:30] + '...',
            'score': round(score, 2),
            'entropy': round(entropy, 2)
        })

    # Sort by score descending
    return sorted(results, key=lambda x: x['score'], reverse=True)

if __name__ == "__main__":
    # Example usage:
    test_entries = [
        "short",
        "This is a longer entry with more information density.",
        "This is a longer entry with more information density and even more details added to it for robustness.",
        "aaa bbb ccc ddd eee fff ggg hhh",
    ]

    ranked = evaluate_restore_points(test_entries)
    print("--- Phoenix Recovery Evaluator (SOTA) ---")
    for r in ranked:
        print(f"[{r['index']}] Score: {r['score']} | Entropy: {r['entropy']} | Text: {r['text']}")
