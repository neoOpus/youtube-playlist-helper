import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import os

async def verify():
    # Start a local server for the built files
    PORT = 8080
    DIRECTORY = "projects/extension/editor"

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=DIRECTORY, **kwargs)

    httpd = socketserver.TCPServer(("", PORT), Handler)
    thread = threading.Thread(target=httpd.serve_forever)
    thread.daemon = True
    thread.start()

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        try:
            print(f"Navigating to http://localhost:{PORT}/#/manage...")
            await page.goto(f"http://localhost:{PORT}/#/manage")
            await page.wait_for_timeout(3000)

            # Check for AI Architect title
            title = await page.query_selector("text=AI Architect")
            if title:
                print("SUCCESS: AI Architect section found on Manage page.")
                os.makedirs("verification", exist_ok=True)
                await page.screenshot(path="verification/ai_architect_view.png")
            else:
                print("FAILURE: AI Architect section NOT found.")
                await page.screenshot(path="verification/manage_page_failed.png")

            # Check for Smart Rules v2
            rules_title = await page.query_selector("text=Smart Rules v2")
            if rules_title:
                print("SUCCESS: Smart Rules v2 section found.")

            # Check for Heartbeat in Telemetry
            heartbeat = await page.query_selector("text=ACTIVE_AGENTS")
            if heartbeat:
                print("SUCCESS: ACTIVE_AGENTS telemetry detected.")

        except Exception as e:
            print(f"Error during verification: {e}")
        finally:
            await browser.close()
            httpd.shutdown()
            print("Verification server shutdown.")

if __name__ == "__main__":
    asyncio.run(verify())
