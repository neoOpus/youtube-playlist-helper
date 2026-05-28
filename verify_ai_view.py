import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Mocking storage and chrome extension environment if necessary
        # But here we just want to see if it renders in our built dashboard

        # Start a local server for the built files
        import http.server
        import socketserver
        import threading
        import os

        PORT = 8080
        os.chdir("projects/extension/editor")
        Handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", PORT), Handler)
        thread = threading.Thread(target=httpd.serve_forever)
        thread.start()

        try:
            await page.goto(f"http://localhost:{PORT}/#/manage")
            await page.wait_for_timeout(2000) # Wait for Svelte to mount

            # Check for AI Architect title
            title = await page.query_selector("text=AI Architect")
            if title:
                print("SUCCESS: AI Architect section found on Manage page.")
                await page.screenshot(path="/home/jules/verification/ai_architect_view.png")
            else:
                print("FAILURE: AI Architect section NOT found.")
                # Take a screenshot of what's actually there
                await page.screenshot(path="/home/jules/verification/manage_page_failed.png")

            # Try to toggle the enable switch
            toggle = await page.query_selector("text=Enable AI Enrichment Agent")
            if toggle:
                print("SUCCESS: AI Enable toggle found.")

        finally:
            httpd.shutdown()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
