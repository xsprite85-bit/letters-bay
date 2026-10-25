/* ---------- levels: every task is a level with 1-3 stars (accuracy only), replayable; islands open with a star total ---------- */
var RUN=null,VIEW=null;
function curCh(){return RUN?RUN.ch:(VIEW!=null?VIEW:S.ch)}
function LVS(ch){var a=[];CHS[ch].L.forEach(function(c){a.push({id:c+'s',t:'search',c:c},{id:c+'b',t:'catch',c:c},{id:c+'w',t:'write',c:c})});a.push({id:'chest',t:'chest'});return a}
function lvStars(ch,id){S.lvs=S.lvs||{};return S.lvs[ch+':'+id]||0}
function chStars(ch){return LVS(ch).reduce(function(a,l){return a+lvStars(ch,l.id)},0)}
function chNeed(ch){return LVS(ch).length*2}
function lvOpen(ch,i){if(ch<S.ch)return true;var L=LVS(ch);return i===0||lvStars(ch,L[i-1].id)>0}
function starsFor(t,e){if(t==='write')return e===0?3:e<=3?2:1;return e===0?3:e<=2?2:1}
function playLevel(ch,i){
  var L=LVS(ch)[i];RUN={ch:ch,i:i,id:L.id,t:L.t,e:0};
  var idx=CHS[ch].L.indexOf(L.c);
  if(L.t==='search')stepSearch(LET[L.c],idx);
  else if(L.t==='catch')stepCatch(LET[L.c],idx);
  else if(L.t==='write')stepTrace(LET[L.c],idx);
  else chest(0);
}
function finishLevel(){
  var r=RUN;if(!r)return;RUN=null;
  var st=starsFor(r.t,r.e),prev=lvStars(r.ch,r.id),gain=Math.max(0,st-prev);
  S.lvs[r.ch+':'+r.id]=Math.max(prev,st);S.stars+=gain;S.coins+=5*gain+(prev?0:5);
  if(r.t==='chest')S.chestDone=true;
  save();resultScreen(r,st,prev);
}
function starRow(n,size,anim){var h='';for(var i=0;i<3;i++)h+='<div class="'+(anim?'rs-star':'')+(i<n?' on':' off')+'" style="width:'+size+'cqw;animation-delay:'+(anim?(.5+i*.45):0)+'s">'+starSVG()+'</div>';return h}
function resultScreen(r,st,prev){
  go(function(){
    mood('m-day');music(st===3?'triumph':'calm',.7);HUD.hidden=false;hud();place(14,74,14);
    var box=el('','result pop-in');SC.appendChild(box);
    var T={search:'מצאת את האות!',catch:'תפסת את כל הבועות!',write:'כתבת את האות!',chest:'פתחת את הארגז!'};
    box.appendChild(el(T[r.t],'rs-t'));
    box.appendChild(el(starRow(st,9,true),'row rs-stars'));
    var msg=st===3?'מושלם!':st===2?GN('יפה מאוד! אפשר לנסות שוב בשביל 3 כוכבים.','יפה מאוד! אפשר לנסות שוב בשביל 3 כוכבים.'):GN('הצלחת! נסי שוב ותקבלי עוד כוכבים.','הצלחת! נסה שוב ותקבל עוד כוכבים.');
    box.appendChild(el(msg+(st>prev&&prev?' שיא חדש!':''),'rs-m'));
    for(var i=0;i<st;i++)(function(i){later(function(){snd('coin');var b=box.querySelectorAll('.rs-star')[i];if(b){var p=centerOf(b);burst(p.x,p.y,10,'star')}},500+i*450)})(i);
    if(st===3)later(function(){cheer();snd('win')},1900);
    var d=el('','row rs-b');
    d.appendChild(btn('↻ שוב','sm',function(){playLevel(r.ch,r.i)}));
    d.appendChild(btn('למפה','sm',function(){levelMap(r.ch)}));
    var L=LVS(r.ch);
    if(r.i+1<L.length&&lvOpen(r.ch,r.i+1))d.appendChild(btn('הבא ◀','gold sm',function(){playLevel(r.ch,r.i+1)}));
    else d.appendChild(btn('הבא ◀','gold sm',function(){levelMap(r.ch)}));
    box.appendChild(d);
  });
}
/* small glyphs for the level type */
function lvIcon(t){
  if(t==='search')return '<svg viewBox="0 0 40 40"><circle cx="17" cy="17" r="10" fill="#BFF3FF" stroke="#12395A" stroke-width="4"/><path d="M25 25 L35 35" stroke="#12395A" stroke-width="6" stroke-linecap="round"/></svg>';
  if(t==='catch')return '<svg viewBox="0 0 40 40"><circle cx="15" cy="22" r="11" fill="#d9f3ff" stroke="#12395A" stroke-width="3.5"/><circle cx="30" cy="11" r="6" fill="#d9f3ff" stroke="#12395A" stroke-width="3"/><path d="M10 18 Q12 14 16 13" stroke="#fff" stroke-width="3" fill="none"/></svg>';
  if(t==='write')return '<svg viewBox="0 0 40 40"><path d="M8 32 L10 24 L28 6 L34 12 L16 30z" fill="#FFC83D" stroke="#12395A" stroke-width="3.5" stroke-linejoin="round"/><path d="M8 32 L10 24 L16 30z" fill="#F2D2A9" stroke="#12395A" stroke-width="3"/></svg>';
  return '<svg viewBox="0 0 40 40"><rect x="5" y="16" width="30" height="18" rx="3" fill="#C98B4B" stroke="#12395A" stroke-width="3.5"/><path d="M5 16 Q5 6 20 6 Q35 6 35 16z" fill="#D9A15E" stroke="#12395A" stroke-width="3.5"/><rect x="16" y="14" width="8" height="8" rx="2" fill="#FFC83D" stroke="#12395A" stroke-width="2.5"/></svg>';
}
function levelMap(ch,first){
  if(ch==null)ch=S.ch;
  if(ch===S.ch&&overLimit()){restScreen();return}
  VIEW=ch;RUN=null;
  go(function(){
    mood('m-day');music('quest',.45+.06*ch);HUD.hidden=false;hud();
    var L=LVS(ch),have=chStars(ch),need=chNeed(ch),n=L.length;
    SC.appendChild(el('<svg viewBox="0 0 1000 625" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M0 470 Q250 430 500 470 T1000 460 V625 H0z" fill="#F2D59A" stroke="#12395A" stroke-width="6"/></svg>','fill'));
    SC.appendChild(el('<b>אי '+(ch+1)+' · '+CHS[ch].t+'</b>','lm-title'));
    SC.appendChild(el('<div style="width:3.6cqw">'+starSVG()+'</div><b>'+have+' / '+(L.length*3)+'</b>','row lm-count'));
    /* path of level circles, right to left with a wave */
    var pts=[];for(var i=0;i<n;i++){var u=n===1?.5:i/(n-1);pts.push([88-u*76,46+Math.sin(u*Math.PI*2.2)*14])}
    var path='M'+pts.map(function(p){return (p[0]*10)+' '+(p[1]*6.25)}).join(' L');
    SC.appendChild(el('<svg viewBox="0 0 1000 625" preserveAspectRatio="none" style="width:100%;height:100%"><path d="'+path+'" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="2 18" stroke-linecap="round" opacity=".85"/></svg>','fill'));
    var nextI=-1;L.forEach(function(l,i){if(nextI<0&&lvOpen(ch,i)&&!lvStars(ch,l.id))nextI=i});
    L.forEach(function(l,i){
      var open=lvOpen(ch,i),st=lvStars(ch,l.id),p=pts[i];
      var b=document.createElement('button');b.type='button';b.className='lvl'+(open?'':' locked')+(i===nextI?' next':'')+(l.t==='chest'?' chestl':'');
      b.style.cssText='left:'+p[0]+'%;top:'+p[1]+'%';
      b.setAttribute('aria-label',(l.t==='chest'?'תיבת אוצר':'שלב '+(i+1)+' · '+l.c));
      b.innerHTML='<span class="lv-c">'+(l.t==='chest'?'':l.c)+'</span><span class="lv-i">'+lvIcon(l.t)+'</span>'+(open?'<span class="lv-s">'+starRow(st,2.2)+'</span>':'<span class="lv-lock">🔒</span>');
      if(open)b.addEventListener('click',function(){snd('tap');playLevel(ch,i)});
      else b.addEventListener('click',function(){snd('soft');talk('קודם צריך לסיים את השלב הקודם.',{x:30,dy:16})});
      SC.appendChild(b);
    });
    if(nextI>=0){var q=pts[nextI];place(q[0]+(q[0]>50?-7:7),q[1]-3,10)}else place(50,30,11);
    var dock=el('','dock');
    dock.appendChild(btn('חנות','sm',function(){shop('map')}));
    if(ch>0)dock.appendChild(btn('▶ האי הקודם','sm',function(){levelMap(ch-1)}));
    var chestDone=lvStars(ch,'chest')>0;
    if(ch<S.ch)dock.appendChild(btn('האי הבא ◀','gold sm',function(){levelMap(ch+1)}));
    else if(chestDone&&have>=need)dock.appendChild(btn(ch>=CHS.length-1?'לסיום ההרפתקה ◀':'לאי הבא ◀','gold sm',function(){S.chestDone=true;reward()}));
    SC.appendChild(dock);
    var gate=el('','lm-gate');
    if(ch===S.ch){
      if(have>=need)gate.innerHTML=chestDone?'יש מספיק כוכבים! אפשר להפליג לאי הבא.':'יש מספיק כוכבים. נשאר לפתוח את תיבת האוצר!';
      else gate.innerHTML='כדי להפליג לאי הבא צריך <b>'+need+'</b> כוכבים · חסרים עוד <b>'+(need-have)+'</b>';
      SC.appendChild(gate)}
    later(function(){
      if(first&&ch===0&&!have)talk(GN('כל עיגול הוא משימה. לחצי על הראשון ונתחיל!','כל עיגול הוא משימה. לחץ על הראשון ונתחיל!'),{x:30,dy:15});
      else if(ch===S.ch&&chestDone&&have<need)talk(GN('אפשר לשחק שוב בשלבים ולאסוף עוד כוכבים!','אפשר לשחק שוב בשלבים ולאסוף עוד כוכבים!'),{x:30,dy:15});
    },700);
  });
}
