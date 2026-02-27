import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Path updated to isolated monorepo structure
        await page.goto(f'file:///app/form-recovery-suite/chrome-form-recovery/testing/index.html')

        await page.evaluate("""
            window.generateHeuristicId = (el) => {
              if (!el) return 'null-element';
              const parts = [];
              try {
                  if (el.id && !el.id.match(/\\d{5,}/)) parts.push('id:' + el.id);
                  const name = el.getAttribute('name');
                  if (name) parts.push('name:' + name);
                  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
                  if (label) parts.push('label:' + label.slice(0, 20));

                  const parent = el.parentElement;
                  if (parent) {
                    const siblings = Array.from(parent.children);
                    parts.push('struct:' + siblings.map(s => s.tagName.toLowerCase()).join(',').slice(0, 50));
                  }

                  const form = el.closest('form');
                  if (form) {
                    const inputs = Array.from(form.querySelectorAll('input, textarea, [contenteditable]'));
                    parts.push('form-idx:' + inputs.indexOf(el));
                  }
              } catch (e) {
                  return 'error-' + e.message;
              }

              return btoa(unescape(encodeURIComponent(parts.join('|') || 'fallback'))).replace(/=/g, '');
            }
        """)

        elements_count = await page.evaluate("document.querySelectorAll('input, textarea, [contenteditable=\"true\"]').length")
        print(f"Found {elements_count} elements to test.")

        ids = set()
        for i in range(elements_count):
            id_val = await page.evaluate(f"(() => window.generateHeuristicId(document.querySelectorAll('input, textarea, [contenteditable=\"true\"]')[{i}]))()")
            ids.add(id_val)

        if len(ids) == elements_count:
            print("SUCCESS: Ultimate neoOpus Heuristic logic is 100% unique.")
        else:
            print(f"FAILED: Only {len(ids)} unique IDs for {elements_count} elements.")

        await browser.close()

asyncio.run(run())
