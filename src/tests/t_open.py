import sys,os,json
from playwright.sync_api import sync_playwright
g,comp=sys.argv[1],sys.argv[2]; ci={'t':0,'o':1,'g':2}[comp]
with sync_playwright() as p:
  b=p.chromium.launch();pg=b.new_page(viewport={'width':1000,'height':700});errs=[]
  pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.add_init_script('window.__CFG={"g":"","name":""};'+"localStorage.clear()")
  pg.goto('file://'+os.getcwd()+'/letter-bay-vtest.html?nofx');pg.wait_for_timeout(800)
  pg.get_by_role('button',name='יוצאים להרפתקה').click(force=True);pg.wait_for_timeout(900)
  pg.get_by_role('button',name='אני בת' if g=='f' else 'אני בן').click(force=True)
  pg.fill('input','ליה' if g=='f' else 'נועם');pg.get_by_role('button',name='יאללה!').click(force=True)
  for k in range(4):
    pg.locator('.nextHit').first.wait_for(timeout=60000);pg.wait_for_timeout(300);pg.locator('.nextHit').first.dispatch_event('click');pg.wait_for_timeout(900)
  pg.locator('.card').nth(ci).click(force=True);pg.wait_for_timeout(1500)
  pg.locator('.nextHit').first.wait_for(timeout=60000);pg.locator('.nextHit').first.dispatch_event('click');pg.wait_for_timeout(2500)
  pg.locator('.lvl').first.wait_for(timeout=20000);pg.wait_for_timeout(1500)
  # shop and parent area too
  pg.get_by_role('button',name='חנות').click(force=True);pg.wait_for_timeout(1200)
  for t in pg.locator('.shop-item, .si, [data-id]').all()[:6]:
    try:t.click(force=True,timeout=1000);pg.wait_for_timeout(500)
    except Exception:pass
  json.dump(pg.evaluate('window.__VL||[]'),open(f'vlog/open_{g}_{comp}.json','w'),ensure_ascii=False);print(g,comp,'errors',errs);b.close()
