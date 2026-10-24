/* ---------- sea search: the letter hides under a rock, in seaweed or inside a shell ---------- */
function seaRockSVG(c){return '<svg viewBox="0 0 120 80"><path d="M8 72 Q4 40 30 26 Q52 6 82 18 Q114 30 112 62 Q110 76 90 76 H22 Q8 76 8 72z" fill="'+c+'" stroke="#12395A" stroke-width="5" stroke-linejoin="round"/><path d="M30 34 Q44 22 60 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/><circle cx="84" cy="52" r="5" fill="#12395A" opacity=".18"/><circle cx="40" cy="58" r="3.5" fill="#12395A" opacity=".18"/></svg>'}
function seaWeedSVG(c){var s='<svg viewBox="0 0 120 150">';[[20,-8],[42,4],[60,-4],[80,8],[98,-6]].forEach(function(b,i){s+='<path class="blade" style="transform-origin:'+b[0]+'px 150px;animation-delay:'+(-i*.4)+'s" d="M'+b[0]+' 150 Q'+(b[0]+b[1]-14)+' 100 '+(b[0]+b[1]+6)+' 60 Q'+(b[0]+b[1]-8)+' 30 '+(b[0]+b[1]+4)+' 6" fill="none" stroke="#12395A" stroke-width="15" stroke-linecap="round"/><path class="blade" style="transform-origin:'+b[0]+'px 150px;animation-delay:'+(-i*.4)+'s" d="M'+b[0]+' 150 Q'+(b[0]+b[1]-14)+' 100 '+(b[0]+b[1]+6)+' 60 Q'+(b[0]+b[1]-8)+' 30 '+(b[0]+b[1]+4)+' 6" fill="none" stroke="'+c+'" stroke-width="9" stroke-linecap="round"/>'});return s+'</svg>'}
function seaShellSVG(){return '<svg viewBox="0 0 120 90"><path class="lid" d="M10 52 Q14 8 60 6 Q106 8 110 52z" fill="#FFB3C1" stroke="#12395A" stroke-width="5" stroke-linejoin="round"/><path class="lid" d="M60 8 V50 M36 14 L44 50 M84 14 L76 50 M20 30 L30 50 M100 30 L90 50" stroke="#12395A" stroke-width="3" opacity=".45"/><path d="M10 52 Q60 92 110 52z" fill="#FF8FA6" stroke="#12395A" stroke-width="5" stroke-linejoin="round"/></svg>'}
function seaFishSVG(c){return '<svg viewBox="0 0 100 60"><path d="M74 30 L96 12 V48z" fill="'+c+'" stroke="#12395A" stroke-width="4" stroke-linejoin="round"/><ellipse cx="42" cy="30" rx="34" ry="21" fill="'+c+'" stroke="#12395A" stroke-width="4"/><circle cx="24" cy="25" r="4.5" fill="#12395A"/><path d="M44 14 Q50 30 44 46" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/></svg>'}
function seaCoralSVG(c){return '<svg viewBox="0 0 100 110"><path d="M50 108 V60 M50 74 Q30 64 26 40 M26 40 V20 M26 52 Q12 46 10 30 M50 64 Q70 52 72 30 M72 30 V12 M72 44 Q86 40 90 24 M50 60 V34" fill="none" stroke="#12395A" stroke-width="14" stroke-linecap="round"/><path d="M50 108 V60 M50 74 Q30 64 26 40 M26 40 V20 M26 52 Q12 46 10 30 M50 64 Q70 52 72 30 M72 30 V12 M72 44 Q86 40 90 24 M50 60 V34" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round"/></svg>'}
function stepSearch(L,idx){
  go(function(){
    mood('m-deep');music('mystery',.55+idx*.1);HUD.hidden=false;hud();place(10,30,12);
    var area=el('','fill sea');SC.appendChild(area);
    area.appendChild(el('<svg viewBox="0 0 1000 625" preserveAspectRatio="none" style="width:100%;height:100%"><defs><linearGradient id="sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D59A"/><stop offset="1" stop-color="#D9B26A"/></linearGradient></defs><path d="M0 420 Q160 380 330 410 T660 400 T1000 405 V625 H0z" fill="url(#sd)" stroke="#12395A" stroke-width="6"/><g fill="#C99A55" opacity=".5"><circle cx="120" cy="520" r="6"/><circle cx="420" cy="560" r="5"/><circle cx="760" cy="500" r="7"/><circle cx="900" cy="580" r="5"/></g></svg>','fill'));
    /* decoration: coral and fish swimming by */
    [[4,58,11,'#FF7A59'],[93,54,10,'#B98CFF'],[50,50,8,'#FF8FA6']].forEach(function(c){area.appendChild(el(seaCoralSVG(c[3]),'','position:absolute;left:'+c[0]+'%;top:'+c[1]+'%;width:'+c[2]+'cqw;transform:translateX(-50%);pointer-events:none'))});
    var fishC=['#FFB347','#7FE0A8','#FF7A8A','#7FC8FF','#FFE04D'];
    for(var f=0;f<6;f++){var fl=el(seaFishSVG(fishC[f%5]),'swim'+(f%2?' rtl':''),'top:'+rnd(8,58)+'%;width:'+rnd(5,9)+'cqw;animation-duration:'+rnd(9,17)+'s;animation-delay:'+(-rnd(0,14))+'s;z-index:'+(f%3===0?8:1));area.appendChild(fl)}
    /* hiding places */
    var n=Math.min(9,5+idx+Math.min(S.ch,3)),kinds=['rock','weed','shell'],spots=[],used=[];
    for(var i=0;i<n;i++){var x,y,t=0;do{x=rnd(9,91);y=rnd(62,84);t++}while(t<40&&used.some(function(u){return Math.abs(u[0]-x)<13&&Math.abs(u[1]-y)<12}));used.push([x,y]);spots.push({x:x,y:y,k:kinds[i%3]})}
    spots=shuffle(spots);
    var target=Math.floor(Math.random()*n),fakes=idx>=1||S.ch>=2?1:0,fakeAt=(target+1+Math.floor(Math.random()*(n-1)))%n,found=false,gen=S.gen,t0=Date.now(),opened=0;
    var NAMEK={rock:'מתחת לאבן',weed:'בין האצות',shell:'בתוך הצדף'};
    spots.forEach(function(sp,i){
      var hid=i===target?L.ch:(fakes&&i===fakeAt?pickDist(L.ch):null);
      var wrap=el('','hide','left:'+sp.x+'%;top:'+sp.y+'%');area.appendChild(wrap);
      if(hid){var lt=el(hid,'hidL');wrap.appendChild(lt)}else if(Math.random()<.5)wrap.appendChild(el('<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="#fff" opacity=".7" stroke="#12395A" stroke-width="3"/></svg>','hidB'));
      var ob=document.createElement('button');ob.type='button';ob.className='cover '+sp.k;ob.setAttribute('aria-label',NAMEK[sp.k]);
      ob.innerHTML=sp.k==='rock'?seaRockSVG(['#8C9AAE','#7B8796','#9AA6B8'][i%3]):sp.k==='weed'?seaWeedSVG(['#3DBE8B','#2FA374','#5BCB6A'][i%3]):seaShellSVG();
      wrap.appendChild(ob);sp.el=ob;sp.hid=hid;sp.wrap=wrap;
      function reveal(){if(sp.open)return;sp.open=true;opened++;snd('whoosh');
        if(hid===L.ch){found=true;win(sp)}
        else if(hid){snd('soft');talk(GN('זו לא '+L.ch+', זו '+hid+'. נמשיך לחפש!','זו לא '+L.ch+', זו '+hid+'. נמשיך לחפש!'),{x:22,dy:14})}
        else if(opened===2)talk('כאן אין כלום... אולי במקום אחר?',{x:22,dy:14})}
      if(sp.k==='rock'){/* drag the rock aside */
        var down=null;
        ob.addEventListener('pointerdown',function(e){if(sp.open||found)return;e.preventDefault();try{ob.setPointerCapture(e.pointerId)}catch(x){}down=GL.uv(area,e)});
        ob.addEventListener('pointermove',function(e){if(!down)return;var q=GL.uv(area,e),dx=(q[0]-down[0])*area.offsetWidth,dy=(q[1]-down[1])*area.offsetHeight;ob.style.transform='translate('+dx+'px,'+dy+'px)';
          if(Math.hypot(dx,dy)>area.offsetWidth*.07){down=null;ob.classList.add('away');ob.style.transform='translate('+(dx>0?160:-160)+'%,10%) rotate('+(dx>0?25:-25)+'deg)';reveal()}});
        ['pointerup','pointercancel'].forEach(function(ev){ob.addEventListener(ev,function(){if(down){down=null;ob.style.transform='';ob.classList.remove('wig');void ob.offsetWidth;ob.classList.add('wig');
          if(!sp.told){sp.told=true;talk(GN('האבן כבדה! גררי אותה הצידה.','האבן כבדה! גרור אותה הצידה.'),{x:22,dy:14})}}})});
      }else ob.addEventListener('click',function(){if(found)return;ob.classList.add('open');reveal()});
    });
    function win(sp){
      snd('chime');var lt=sp.wrap.querySelector('.hidL');lt.classList.add('got');var p=centerOf(lt);burst(p.x,p.y,22,'star');cheer();
      talk(GN('מצאת את '+L.ch+'!','מצאת את '+L.ch+'!'),{x:22,dy:14});
      later(function(){stepListen(L,idx)},1600)}
    later(function(){talk(GN('האות '+L.ch+' מתחבאת אי שם בים! חפשי מתחת לאבנים, בין האצות ובתוך הצדפים.','האות '+L.ch+' מתחבאת אי שם בים! חפש מתחת לאבנים, בין האצות ובתוך הצדפים.'),{x:22,dy:14,ms:6000})},500);
    /* hints after 20 s and 35 s */
    function hint(level){if(found||gen!==S.gen)return;var sp=spots[target];
      talk('אולי '+NAMEK[sp.k]+'...?',{x:22,dy:14});sp.el.classList.remove('wig');void sp.el.offsetWidth;sp.el.classList.add('wig');if(level>1)sp.el.classList.add('glowc')}
    later(function(){hint(1)},20000);later(function(){hint(2)},35000);
  });
}
