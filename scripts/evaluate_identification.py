import hashlib

def generate_typio_id(path):
    # Simplified Typio hashing logic (hashStr)
    return "field_" + hashlib.md5(path.encode()).hexdigest()[:8]

def simulate_site_change(original_path):
    # Simulate adding a div before the input
    if "nth-of-type" in original_path:
        # e.g., "div:nth-of-type(2)" becomes "div:nth-of-type(3)"
        import re
        def increment(match):
            return f":nth-of-type({int(match.group(1)) + 1})"
        return re.sub(r":nth-of-type\((\d+)\)", increment, original_path)
    return original_path + " > div"

# Test Data
paths = [
    "body > div:nth-of-type(1) > form > input:nth-of-type(1)",
    "body > #login-container > input:nth-of-type(1)",
]

print("--- Robustness Evaluation ---")
for p in paths:
    original_id = generate_typio_id(p)
    new_path = simulate_site_change(p)
    new_id = generate_typio_id(new_path)

    print(f"Original Path: {p}")
    print(f"Original ID:   {original_id}")
    print(f"New Path:      {new_path}")
    print(f"New ID:        {new_id}")
    if original_id == new_id:
        print("Result:        ROBUST")
    else:
        print("Result:        BROKEN (Data loss on site update)")
    print("-" * 30)

print("\n--- 2026 Semantic Suggestion ---")
print("Instead of 'body > div:nth-of-type(1) > ...', use AI to label it 'Login Email Field'.")
print("Even if the DOM changes, the AI will still map it correctly.")
