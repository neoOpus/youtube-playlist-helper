import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        # Start dev server
        import subprocess
        import time
        server = subprocess.Popen(['npm', 'run', 'dev', '--workspace=@yph/dashboard'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(8)

        try:
            await page.goto('http://localhost:5000/#/manage')
            await page.wait_for_selector('.infrastructure-map')
            await page.screenshot(path='/home/jules/verification/manage_live_map.png')

            # Switch to Topology
            await page.click('button:has-text("D3 Topology")')
            await page.wait_for_selector('.topology-graph svg')
            await page.wait_for_timeout(2000) # Let physics settle
            await page.screenshot(path='/home/jules/verification/manage_d3_topology.png')

            # Check DNA and Bulk
            await page.screenshot(path='/home/jules/verification/manage_dna_and_bulk.png', full_page=True)

            print("Captured Professional Management Visuals.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
