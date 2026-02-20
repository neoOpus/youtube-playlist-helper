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
                  // 1. Direct
                  if (el.id && !el.id.match(/\\d{5,}/)) parts.push('id:' + el.id);
                  const name = el.getAttribute('name');
                  if (name) parts.push('name:' + name);
                  const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
                  if (label) parts.push('label:' + label.slice(0, 20));

                  // 2. Structural (V-Hash)
                  const parent = el.parentElement;
                  if (parent) {
                    const siblings = Array.from(parent.children);
                    const tagSequence = siblings.map(s => s.tagName.toLowerCase()).join(',');
                    parts.push('struct:' + tagSequence.slice(0, 50));
                    const surroundingText = parent.textContent.replace(/\\s+/g, ' ').trim().slice(0, 30);
                    if (surroundingText) parts.push('context:' + surroundingText);
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

        ids = set()
        for i in range(elements_count):
            id_val = await page.evaluate(f"(() => window.generateHeuristicId(document.querySelectorAll('input, textarea, [contenteditable=\"true\"]')[{i}]))()")
            ids.add(id_val)

        if len(ids) == elements_count:
            print("SUCCESS: Enhanced V-Hash logic is 100% unique.")
        else:
            print(f"FAILED: Only {len(ids)} unique IDs for {elements_count} elements.")

        await browser.close()

asyncio.run(run())
