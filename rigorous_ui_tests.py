import asyncio
import os
import subprocess
import time
import socket
from playwright.async_api import async_playwright

# Use relative path for portability
VERIFICATION_DIR = "./verification"

def wait_for_server(port, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with socket.create_connection(("localhost", port), timeout=1):
                return True
        except (ConnectionRefusedError, socket.timeout):
            time.sleep(1)
    return False

async def run_rigorous_tests():
    if not os.path.exists(VERIFICATION_DIR):
        os.makedirs(VERIFICATION_DIR)

    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        # Start dev server
        print("Starting dev server...")
        server = subprocess.Popen(['npm', 'run', 'dev', '--workspace=@yph/dashboard'],
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        if not wait_for_server(5000):
            print("ERROR: Dev server failed to start within timeout.")
            server.terminate()
            return

        try:
            # Inject seed data
            print("Injecting infrastructure seed data...")
            with open("seed_data.js", "r") as f:
                seed_script = f.read()
            await page.goto("http://localhost:5000/")
            await page.evaluate(seed_script)

            # 1. Dashboard Load & Baseline
            print("Scenario 1: System Initialization...")
            await page.goto('http://localhost:5000/#/manage')
            await page.wait_for_selector('.manage-view')
            await page.screenshot(path=f"{VERIFICATION_DIR}/01_manage_baseline.png", full_page=True)

            # 2. Chaos Testing: Rapid View Switching
            print("Scenario 2: Chaos Mode - Rapid View Switching...")
            views = ['#/', '#/sync', '#/manage', '#/saved']
            for _ in range(5):
                for view in views:
                    await page.goto(f'http://localhost:5000/{view}')
                    # Don't wait for load to simulate stress

            await page.goto('http://localhost:5000/#/manage')
            await page.wait_for_selector('.manage-view')
            await page.screenshot(path=f"{VERIFICATION_DIR}/02_chaos_switching_recovery.png")

            # 3. Mass Maintenance & Modulation
            print("Scenario 3: Mass Maintenance...")
            await page.fill('.query-input', 'all set-rating:5')
            await page.click('.exec-btn')
            await page.wait_for_selector('.log-line')
            await page.screenshot(path=f"{VERIFICATION_DIR}/03_bulk_op_execution.png")

            # 4. Infrastructure Decommissioning
            print("Scenario 4: Infrastructure Decommissioning...")
            page.on("dialog", lambda dialog: dialog.accept())
            await page.click('button:has-text("Decommission System")')

            await page.wait_for_timeout(2000)
            await page.screenshot(path=f"{VERIFICATION_DIR}/04_system_purged.png", full_page=True)

            print("Rigorous UI Evaluation (Chaos Enhanced) Complete.")

        except Exception as e:
            print(f"CRITICAL FAILURE during UI Evaluation: {e}")
            await page.screenshot(path=f"{VERIFICATION_DIR}/ERROR_STATE.png")
        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_rigorous_tests())
