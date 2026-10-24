import asyncio,os
from playwright.async_api import async_playwright
root=os.path.dirname(os.path.abspath(__file__))+'/..'
svg=open(root+'/icon/logo.svg').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        for size in (512,192,180,96):
            pg=await b.new_page(viewport={'width':size,'height':size})
            await pg.set_content(f'<html><head><link rel="stylesheet" href="file://{root}/fonts/fonts.css"><style>body{{margin:0}}svg{{width:{size}px;height:{size}px;display:block}}</style></head><body>{svg}</body></html>')
            await pg.evaluate("document.fonts.load('700 100px \"Secular One\"','אבג')"); await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'{root}/icon/icon-{size}.png'); await pg.close()
        await b.close()
asyncio.run(main())
