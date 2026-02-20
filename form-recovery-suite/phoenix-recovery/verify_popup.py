import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Popup index.html
        await page.goto(f'file:///app/phoenix-recovery/dist/src/popup/index.html')
        await page.wait_for_selector('h1')
        title = await page.inner_text('h1')
        print(f'Popup Title: {title}')
        await page.screenshot(path='popup_verification.png')
        await browser.close()

asyncio.run(run())
