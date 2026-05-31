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

        # Start dev server - USE DEVNULL TO PREVENT PIPE DEADLOCK
        print("Starting dev server...")
        server = subprocess.Popen(['npm', 'run', 'dev', '--workspace=@yph/dashboard'],
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # Wait for server to be ready using socket check
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

            # 2. Theme Architect Modulation
            print("Scenario 2: Theme Architect Modulation...")
            await page.click('button:has-text("Show Advanced Params")')
            await page.screenshot(path=f"{VERIFICATION_DIR}/02_manage_advanced.png")

            await page.click('button:has-text("D3 Topology")')
            await page.wait_for_selector('.topology-graph svg')
            await page.wait_for_timeout(3000)
            await page.screenshot(path=f"{VERIFICATION_DIR}/03_topology_stabilized.png")

            # 3. Mass Maintenance & Modulation (Bulk Ops)
            print("Scenario 3: Mass Maintenance...")
            await page.fill('.query-input', 'all set-rating:5')
            await page.click('.exec-btn')
            await page.wait_for_selector('.log-line')
            await page.screenshot(path=f"{VERIFICATION_DIR}/04_bulk_op_execution.png")

            # 4. Library Auditor & Sector DNA
            print("Scenario 4: Structural Analysis...")
            await page.screenshot(path=f"{VERIFICATION_DIR}/05_sector_dna_viz.png", clip={'x': 0, 'y': 0, 'width': 800, 'height': 600})

            # 5. Infrastructure Decommissioning (Extreme Stress)
            print("Scenario 5: Infrastructure Decommissioning...")
            page.on("dialog", lambda dialog: dialog.accept())
            await page.click('button:has-text("Decommission System")')

            await page.wait_for_timeout(2000)
            await page.screenshot(path=f"{VERIFICATION_DIR}/06_system_purged.png", full_page=True)

            print("Rigorous UI Evaluation Complete.")

        except Exception as e:
            print(f"CRITICAL FAILURE during UI Evaluation: {e}")
            await page.screenshot(path=f"{VERIFICATION_DIR}/ERROR_STATE.png")
        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_rigorous_tests())
