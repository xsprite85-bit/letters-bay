from playwright.sync_api import sync_playwright
import pathlib
u=pathlib.Path('index-pages.html').resolve().as_uri()+'?nofx'
with sync_playwright() as p:
  b=p.chromium.launch();pg=b.new_page(viewport={'width':1280,'height':800});errs=[]
  pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto(u);pg.wait_for_timeout(800)
  print('btn visible',pg.is_visible('#fsG'),pg.get_attribute('#fsG','aria-label'))
  pg.mouse.click(640,300);pg.wait_for_timeout(500)
  print('after tap full',pg.evaluate('!!document.fullscreenElement'),pg.get_attribute('#fsG','aria-label'))
  pg.click('#fsG');pg.wait_for_timeout(500)
  print('after button',pg.evaluate('!!document.fullscreenElement'))
  pg.mouse.click(640,300);pg.wait_for_timeout(400)
  print('stays out after manual exit',not pg.evaluate('!!document.fullscreenElement'))
  pg.click('#fsG');pg.wait_for_timeout(500)
  print('button re-enters',pg.evaluate('!!document.fullscreenElement'))
  pg.screenshot(path='fs_check.png');print('errors',errs);b.close()
