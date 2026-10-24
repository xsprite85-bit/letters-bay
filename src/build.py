s=open('game-src.html',encoding='utf8').read()
lib=open('/tmp/pix/node_modules/pixi.js/dist/pixi.min.js',encoding='utf8').read().replace('</script','<\\/script')
tag='<script src="https://cdn.jsdelivr.net/npm/pixi.js@8.21.0/dist/pixi.min.js"></script>'
open('letter-bay-game.html','w',encoding='utf8').write(s.replace(tag,'<script>'+lib+'</script>'))
