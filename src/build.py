import json,glob,base64,os
s=open('game-src.html',encoding='utf8').read()
import subprocess
P='/tmp/pix/node_modules/pixi.js/dist/pixi.min.js'
if not os.path.exists(P):
    os.makedirs('/tmp/pix',exist_ok=True);subprocess.run('cd /tmp/pix && npm init -y >/dev/null && npm i -s pixi.js@8.21.0',shell=True,check=True)
lib=open(P,encoding='utf8').read().replace('</script','<\\/script')
tag='<script src="https://cdn.jsdelivr.net/npm/pixi.js@8.21.0/dist/pixi.min.js"></script>'
aud={}
for j in sorted(glob.glob('voice/clips/*.json')):
    d=json.load(open(j,encoding='utf8')); mp3=j[:-5]+'.mp3'
    if not os.path.exists(mp3): continue
    aud[d['text']]={'src':'data:audio/mpeg;base64,'+base64.b64encode(open(mp3,'rb').read()).decode(),'dur':d['dur'],'w':d['w']}
import re
css=open('fonts/fonts.css').read()
css=re.sub(r'url\(fonts/([\w-]+\.woff2)\)',lambda m:'url(data:font/woff2;base64,'+base64.b64encode(open('fonts/'+m.group(1),'rb').read()).decode()+')',css)
s=s.replace('<link rel="stylesheet" href="fonts/fonts.css">','<style>'+css+'</style>',1)
for n in ('192','180'):
    s=s.replace('href="icon/icon-%s.png"'%n,'href="data:image/png;base64,'+base64.b64encode(open('icon/icon-%s.png'%n,'rb').read()).decode()+'"')
s=s.replace('/*AUD*/{}',json.dumps(aud,ensure_ascii=False),1)
open('letter-bay-game.html','w',encoding='utf8').write(s.replace(tag,'<script>'+lib+'</script>'))
print('clips embedded:',len(aud),'size MB',round(os.path.getsize('letter-bay-game.html')/1e6,2))
