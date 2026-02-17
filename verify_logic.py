import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto(f'file:///app/chrome-form-recovery/testing/index.html')

        await page.evaluate("""
            window.generateHeuristicId = (el) => {
              if (!el) return 'null-element';
              const parts = [];
              try {
                  if (el.id) parts.push('id:' + el.id);
                  const name = el.getAttribute('name');
                  if (name) parts.push('name:' + name);
                  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
                  if (label) parts.push('label:' + label.slice(0, 20));

                  if (el instanceof HTMLInputElement && el.labels && el.labels[0]) {
                    parts.push('text:' + el.labels[0].textContent.trim().slice(0, 20));
                  }

                  const root = el.getRootNode();
                  if (root && root.host && root.host.id) {
                    parts.push('shadow-host:' + root.host.id);
                  }

                  const form = el.closest('form');
                  if (form) {
                    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
                    parts.push('form-idx:' + inputs.indexOf(el));
                  } else {
                    const sameType = Array.from(document.querySelectorAll(el.tagName.toLowerCase()));
                    parts.push('page-idx:' + sameType.indexOf(el));
                  }
              } catch (e) {
                  return 'error-' + e.message;
              }

              return btoa(unescape(encodeURIComponent(parts.join('|') || 'fallback'))).replace(/=/g, '');
            }
        """)

        elements_count = await page.evaluate("document.querySelectorAll('input, textarea, [contenteditable=\"true\"]').length")
        print(f"Found {elements_count} elements to test.")

        id_to_elements = {}

        for i in range(elements_count):
            res = await page.evaluate(f"""
                (() => {{
                    const el = document.querySelectorAll('input, textarea, [contenteditable="true"]')[{i}];
                    return {{
                        id_val: window.generateHeuristicId(el),
                        tag: el.tagName,
                        placeholder: el.getAttribute('placeholder') || el.getAttribute('name') || "N/A"
                    }};
                }})()
            """)
            id_val = res['id_val']
            tag = res['tag']
            placeholder = res['placeholder']

            if id_val not in id_to_elements:
                id_to_elements[id_val] = []
            id_to_elements[id_val].append((tag, placeholder))

        duplicates_found = False
        for id_val, items in id_to_elements.items():
            if len(items) > 1:
                duplicates_found = True
                print(f"Duplicate ID found: {id_val}")
                for tag, placeholder in items:
                    print(f"  - {tag} ({placeholder})")

        if not duplicates_found:
            print("SUCCESS: All elements have unique IDs.")
        else:
            print("FAILED: Duplicate IDs found.")

        await browser.close()

asyncio.run(run())
