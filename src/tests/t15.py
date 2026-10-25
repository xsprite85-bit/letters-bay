import asyncio,os,sys,json
STK=json.load(open('stk.json'))
NAMES={'מֵם': 'מ', 'בֵּית': 'ב', 'אָלֶף': 'א', 'שִׁין': 'ש', 'לָמֶד': 'ל', 'רֵישׁ': 'ר', 'דָּלֶת': 'ד', 'גִּימֶל': 'ג', 'הֵא': 'ה', 'נוּן': 'נ', 'תָּו': 'ת', 'וָו': 'ו', 'כָּף': 'כ', 'פֵּא': 'פ', 'חֵית': 'ח', 'סָמֶךְ': 'ס', 'עַיִן': 'ע', 'קוּף': 'ק', 'זַיִן': 'ז', 'טֵית': 'ט', 'יוֹד': 'י', 'צָדִי': 'צ'}
from playwright.async_api import async_playwright
CH=[['מ','ב','א'],['ש','ל','ר'],['ד','ג','ה'],['נ','ת','ו'],['כ','פ','ח'],['ס','ע','ק'],['ז','ט','י','צ']]
async def main(ci):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg=await b.new_page(viewport={'width':1000,'height':700})
        errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.getcwd()+'/letter-bay-game.html?nofx'); await pg.wait_for_timeout(800)
        async def cb(t): await pg.get_by_role('button',name=t).first.click(force=True)
        await cb('בחירת פרק'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'c_pick.png')
        await pg.get_by_role('button',name=f'{ci+1} ·').first.click(force=True); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=f'c{ci}_ep.png')
        await pg.locator('.nextHit').first.wait_for(timeout=60000); await pg.locator('.nextHit').first.dispatch_event('click'); await pg.wait_for_timeout(1500)
        if ci>0:
            for _ in range(2):
                await pg.locator('.wr').last.wait_for(timeout=20000); await pg.wait_for_timeout(700)
                bub=await pg.evaluate("()=>document.querySelector('#bubble').textContent")
                rc=[v for k,v in NAMES.items() if k in (bub or '')][0]
                box=await pg.locator('.wr canvas').nth(1).bounding_box()
                for st in STK[rc]:
                    pts=st['p'];X=lambda q:(box['x']+box['width']*q[0]/100,box['y']+box['height']*q[1]/100)
                    await pg.mouse.move(*X(pts[0])); await pg.mouse.down()
                    for i in range(1,len(pts)):
                        for t in range(1,9): await pg.mouse.move(*X([pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t/8,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t/8]))
                    await pg.mouse.up(); await pg.wait_for_timeout(250)
                await pg.wait_for_timeout(1500)
            await pg.wait_for_timeout(1500)
        await pg.locator('.lvl').first.wait_for(timeout=20000); await pg.wait_for_timeout(800); await pg.screenshot(path=f'lv{ci}_map0.png')
        await pg.locator('.lvl').first.click(force=True); await pg.wait_for_timeout(1200)
        async def res(tag):
            await pg.locator('.result').wait_for(timeout=20000); await pg.wait_for_timeout(2300)
            t=await pg.locator('.result').inner_text(); print('RESULT',tag,len(await pg.locator('.result .rs-star.on').all()),'stars',flush=True)
            if tag.endswith('s') and tag[0]==CH[ci][0]: await pg.screenshot(path=f'lv{ci}_res.png')
            await pg.get_by_role('button',name='הבא ◀').click(force=True); await pg.wait_for_timeout(1300)
        for ch in CH[ci]:
            await pg.locator('.sea').wait_for(timeout=15000); await pg.wait_for_timeout(800)
            if ch==CH[ci][0]: await pg.screenshot(path=f'sea{ci}_0.png')
            cov=pg.locator('.sea .cover'); nn=await cov.count(); shot=False
            for j in range(nn):
                if await pg.locator('.hidL.got').count() or not await pg.locator('.sea').count(): break
                c=cov.nth(j); cls=await c.get_attribute('class')
                if 'rock' in cls:
                    bb=await c.bounding_box(); x=bb['x']+bb['width']/2; y=bb['y']+bb['height']/2
                    await pg.mouse.move(x,y); await pg.mouse.down(); await pg.mouse.move(x+bb['width']*1.2,y,steps=6); await pg.mouse.up()
                else: await c.click(force=True)
                await pg.wait_for_timeout(450)
                if ch==CH[ci][0] and j==2 and not shot: await pg.screenshot(path=f'sea{ci}_1.png'); shot=True
            assert await pg.locator('.hidL.got').count()==1 or await pg.locator('.orb').count()==1, 'letter not found'
            await pg.wait_for_timeout(2200)
            await pg.locator('.orb').click(force=True); await pg.wait_for_timeout(1200)
            await cb('הלאה'); await res(f'{ch}s')
            got=0
            for _ in range(200):
                bs=pg.locator('.catchb'); n=await bs.count()
                for i in range(n):
                    if (await bs.nth(i).inner_text())==ch:
                        await bs.nth(i).dispatch_event('pointerdown'); got+=1; break
                if got>=3: break
                await pg.wait_for_timeout(300)
            await res(f'{ch}b')
            for k in range(4):
                await pg.locator('.wr').last.wait_for(timeout=20000)
                await pg.wait_for_timeout(4200 if k==0 else 900)
                box=await pg.locator('.wr canvas').nth(1).bounding_box()
                if ch==CH[ci][0]: await pg.screenshot(path=f'wpre{ci}_{k}.png')
                for st in STK[ch]:
                    pts=st['p']
                    X=lambda q:(box['x']+box['width']*q[0]/100,box['y']+box['height']*q[1]/100)
                    await pg.mouse.move(*X(pts[0])); await pg.mouse.down()
                    for i in range(1,len(pts)):
                        a0,a1=pts[i-1],pts[i]
                        for t in range(1,9):
                            await pg.mouse.move(*X([a0[0]+(a1[0]-a0[0])*t/8,a0[1]+(a1[1]-a0[1])*t/8]))
                    await pg.mouse.up(); await pg.wait_for_timeout(250)
                if k==0 and ch==CH[ci][0]: await pg.screenshot(path=f'wr{ci}_guide.png')
                await pg.wait_for_timeout(1300)
            await pg.wait_for_timeout(1800)
            await pg.locator('.tile').first.click(force=True); await pg.wait_for_timeout(1000)
            if ch==CH[ci][0]: await pg.screenshot(path=f'c{ci}_word.png')
            await pg.get_by_role('button',name='קיבלתי').click(force=True); await res(f'{ch}w')
        for r in range(2):
            await pg.locator('.card').first.wait_for(timeout=20000); await pg.wait_for_timeout(600)
            for _ in range(3): await cb('רמז'); await pg.wait_for_timeout(300)
            await pg.locator('.card.glow').first.click(force=True); await pg.wait_for_timeout(4800)
        await pg.locator('.result').wait_for(timeout=20000); await pg.wait_for_timeout(2300)
        print('RESULT chest',len(await pg.locator('.result .rs-star.on').all()),'stars')
        await cb('למפה'); await pg.wait_for_timeout(1500)
        print('GATE',await pg.locator('.lm-gate').inner_text() if await pg.locator('.lm-gate').count() else '-', '| count', await pg.locator('.lm-count').inner_text())
        await pg.screenshot(path=f'lv{ci}_map1.png')
        await pg.get_by_role('button',name='לאי הבא ◀').click(force=True); await pg.wait_for_timeout(1500)
        await cb('לחנות'); await pg.wait_for_timeout(800); await cb('להמשך'); await pg.wait_for_timeout(1500)
        await cb('לפרק הבא'); await pg.wait_for_timeout(2500)
        print('NEXT', await pg.locator('.eptag').inner_text() if await pg.locator('.eptag').count() else 'no episode tag')
        print(ci,'errors',errs)
        await b.close()
asyncio.run(main(int(sys.argv[1])))
