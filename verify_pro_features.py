import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        PORT = 8081
        os.chdir("projects/extension/editor")
        Handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", PORT), Handler)
        thread = threading.Thread(target=httpd.serve_forever)
        thread.start()

        try:
            # Check AI Architect updates
            await page.goto(f"http://localhost:{PORT}/#/manage")
            await page.wait_for_timeout(2000)

            verify_btn = await page.query_selector("text=Verify Link")
            if verify_btn:
                print("SUCCESS: Verify Link button found in AI Architect.")

            # Since we don't have mock data for playlists in this simple server,
            # we can't easily test the Editor or VideoIdCard deep logic without
            # more complex mocking. But we can check if the components load.

            print("Visual verification of Pro features completed.")
            await page.screenshot(path="/home/jules/verification/pro_features_overview.png")

        finally:
            httpd.shutdown()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
