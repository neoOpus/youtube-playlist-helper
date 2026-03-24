import asyncio
from playwright.async_api import async_playwright
import os
import time

async def verify_ui():
    async with async_playwright() as p:
        # Start a local server for the built files
        # We'll use python's http.server in the background
        import subprocess

        # Build path is projects/extension/editor
        server_process = subprocess.Popen(
            ["python3", "-m", "http.server", "5000", "--directory", "projects/extension/editor"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        time.sleep(2) # Give server time to start

        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            print("Connecting to dashboard...")
            await page.goto("http://localhost:5000/index.html")

            # Wait for app to load
            await page.wait_for_selector(".app-container", timeout=10000)
            print("App container found.")

            # Take screenshots of key views
            os.makedirs(".jules/screenshots", exist_ok=True)

            await page.screenshot(path=".jules/screenshots/pro_dashboard_main.png")
            print("Captured main dashboard screenshot.")

            # Navigate to Manage Hub
            await page.click("button:has-text('Manage Hub')")
            await asyncio.sleep(1)
            await page.screenshot(path=".jules/screenshots/pro_manage_hub.png")
            print("Captured Manage Hub screenshot.")

            # Check for Pro Red theme
            # We can trigger theme change via Sidebar
            await page.select_option(".theme-select", "pro-red")
            await asyncio.sleep(1)
            await page.screenshot(path=".jules/screenshots/pro_red_theme.png")
            print("Captured Pro Red theme screenshot.")

            # Success
            print("UI verification complete. Screenshots saved in .jules/screenshots/")

        except Exception as e:
            print(f"Error during UI verification: {e}")
            # Capture error state
            await page.screenshot(path=".jules/screenshots/error_state.png")
        finally:
            await browser.close()
            server_process.terminate()

if __name__ == "__main__":
    asyncio.run(verify_ui())
