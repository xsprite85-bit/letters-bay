/* ---------- shop: hats, sea friends and island decorations; some open only on later islands ---------- */
var HATS2={
  bow:'<path d="M0 -6 L-26 -22 Q-32 -6 -26 8z" fill="#FF7A9A" class="st"/><path d="M0 -6 L26 -22 Q32 -6 26 8z" fill="#FF7A9A" class="st"/><circle cx="0" cy="-6" r="7" fill="#FF4F7A" class="st"/>',
  flowers:'<path d="M-30 4 Q0 -14 30 4" fill="none" stroke="#3DBE8B" stroke-width="7" stroke-linecap="round"/>'+[[-24,0,'#FF7A9A'],[-8,-6,'#FFD43D'],[8,-6,'#7FC8FF'],[24,0,'#B98CFF']].map(function(f){return '<g transform="translate('+f[0]+' '+f[1]+')"><circle cx="0" cy="-7" r="5" fill="'+f[2]+'" class="st" stroke-width="2"/><circle cx="6" cy="-1" r="5" fill="'+f[2]+'" class="st" stroke-width="2"/><circle cx="-6" cy="-1" r="5" fill="'+f[2]+'" class="st" stroke-width="2"/><circle cx="0" cy="-2" r="3.5" fill="#fff" class="st" stroke-width="2"/></g>'}).join(''),
  pirate:'<path d="M-36 6 Q-30 -30 0 -32 Q30 -30 36 6 Q0 -6 -36 6z" fill="#2B2B3A" class="st"/><path d="M-36 6 Q0 -6 36 6" fill="none" stroke="#FFC83D" stroke-width="4"/><circle cx="0" cy="-16" r="7" fill="#fff" class="st" stroke-width="2"/><path d="M-4 -14 h8 M-3 -18 h1 M2 -18 h1" stroke="#2B2B3A" stroke-width="2"/>',
  beanie:'<path d="M-28 4 Q-28 -34 0 -34 Q28 -34 28 4z" fill="#3DBE8B" class="st"/><rect x="-30" y="-2" width="60" height="10" rx="4" fill="#2FA374" class="st"/><circle cx="0" cy="-38" r="8" fill="#FFF3C4" class="st"/><path d="M-14 -26 v20 M0 -30 v22 M14 -26 v20" stroke="#2FA374" stroke-width="3"/>',
  sailor:'<path d="M-26 4 Q-24 -22 0 -22 Q24 -22 26 4z" fill="#fff" class="st"/><rect x="-32" y="-2" width="64" height="9" rx="4" fill="#fff" class="st"/><rect x="-26" y="-10" width="52" height="7" fill="#3D7BE0"/><path d="M-8 -16 l4 4 l4 -4" fill="none" stroke="#3D7BE0" stroke-width="2.5"/>',
  wizard:'<path d="M-30 6 L4 -58 L22 6z" fill="#5A4BD6" class="st"/><ellipse cx="-4" cy="6" rx="36" ry="6" fill="#5A4BD6" class="st"/><path d="M-6 -22 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z" fill="#FFD43D"/><circle cx="8" cy="-36" r="2.5" fill="#FFD43D"/><circle cx="-12" cy="-6" r="2" fill="#FFD43D"/>',
  phones:'<path d="M-30 6 Q-32 -36 0 -36 Q32 -36 30 6" fill="none" stroke="#2B2B3A" stroke-width="7" stroke-linecap="round"/><rect x="-40" y="-8" width="16" height="22" rx="6" fill="#FF7A59" class="st"/><rect x="24" y="-8" width="16" height="22" rx="6" fill="#FF7A59" class="st"/>',
  viking:'<path d="M-28 6 Q-28 -30 0 -30 Q28 -30 28 6z" fill="#A9B4C9" class="st"/><rect x="-30" y="-2" width="60" height="9" rx="3" fill="#C98A4A" class="st"/><path d="M-26 -14 Q-46 -18 -44 -42 Q-36 -24 -24 -24z" fill="#FFF3C4" class="st"/><path d="M26 -14 Q46 -18 44 -42 Q36 -24 24 -24z" fill="#FFF3C4" class="st"/><circle cx="-12" cy="-12" r="2.5" fill="#12395A"/><circle cx="12" cy="-12" r="2.5" fill="#12395A"/>',
  mask:'<path d="M-30 -10 Q0 -22 30 -10" fill="none" stroke="#2B2B3A" stroke-width="5"/><rect x="-28" y="-20" width="56" height="22" rx="10" fill="#7FD3F7" class="st"/><path d="M0 -20 v22" stroke="#12395A" stroke-width="3"/><path d="M-20 -14 q4 -4 10 -3 M8 -14 q4 -4 10 -3" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M30 -10 q10 -2 10 -30" fill="none" stroke="#FF7A59" stroke-width="6" stroke-linecap="round"/>',
  halo:'<ellipse cx="0" cy="-30" rx="26" ry="8" fill="none" stroke="#FFD43D" stroke-width="6"/>'+[-22,-8,8,22].map(function(x,i){return '<path transform="translate('+x+' '+(-30-(i%2?6:2))+') scale(.5)" d="M0 -11 L3.2 -3.6 L11 -3.4 L5 1.8 L6.8 9.6 L0 5.4 L-6.8 9.6 L-5 1.8 L-11 -3.4 L-3.2 -3.6z" fill="#FFD43D" class="st"/>'}).join('')
};
var PETS={
  crab:'<svg viewBox="0 0 100 80"><path d="M14 30 q-10 -16 6 -22 q2 10 10 12z M86 30 q10 -16 -6 -22 q-2 10 -10 12z" fill="#FF6A4A" stroke="#12395A" stroke-width="4"/><ellipse cx="50" cy="48" rx="32" ry="20" fill="#FF6A4A" stroke="#12395A" stroke-width="4"/><path d="M22 58 l-12 10 M30 64 l-8 12 M78 58 l12 10 M70 64 l8 12" stroke="#12395A" stroke-width="4" stroke-linecap="round"/><circle cx="40" cy="34" r="5" fill="#fff" stroke="#12395A" stroke-width="2"/><circle cx="60" cy="34" r="5" fill="#fff" stroke="#12395A" stroke-width="2"/><circle cx="40" cy="34" r="2.2" fill="#12395A"/><circle cx="60" cy="34" r="2.2" fill="#12395A"/><path d="M42 50 q8 6 16 0" fill="none" stroke="#12395A" stroke-width="3"/></svg>',
  star:'<svg viewBox="0 0 100 100"><path d="M50 6 L62 38 L96 40 L69 61 L79 94 L50 75 L21 94 L31 61 L4 40 L38 38z" fill="#FF9F43" stroke="#12395A" stroke-width="4" stroke-linejoin="round"/><circle cx="42" cy="46" r="4" fill="#12395A"/><circle cx="58" cy="46" r="4" fill="#12395A"/><path d="M42 58 q8 6 16 0" fill="none" stroke="#12395A" stroke-width="3"/><g fill="#FFE1B0"><circle cx="50" cy="24" r="2.5"/><circle cx="74" cy="46" r="2.5"/><circle cx="26" cy="46" r="2.5"/></g></svg>',
  seahorse:'<svg viewBox="0 0 80 110"><path d="M40 100 q-20 -6 -10 -24 q8 -14 -4 -30 q-10 -14 6 -26 q14 -10 26 4 q-10 0 -12 8 q14 2 10 14 q-6 10 0 22 q10 20 -6 30 q-8 4 -10 -2z" fill="#FFD43D" stroke="#12395A" stroke-width="4" stroke-linejoin="round"/><circle cx="44" cy="22" r="4" fill="#12395A"/><path d="M58 22 l14 -2" stroke="#12395A" stroke-width="5" stroke-linecap="round"/><path d="M28 40 l-8 -4 M28 54 l-8 -2 M30 68 l-8 0" stroke="#12395A" stroke-width="3"/></svg>',
  jelly:'<svg viewBox="0 0 90 110"><path d="M10 50 Q10 8 45 8 Q80 8 80 50 Q62 44 45 50 Q28 44 10 50z" fill="#C9A9FF" stroke="#12395A" stroke-width="4" opacity=".95"/><path d="M20 50 q-6 20 4 40 M36 50 q6 24 -2 50 M54 50 q-6 24 2 50 M70 50 q6 20 -4 40" fill="none" stroke="#B98CFF" stroke-width="5" stroke-linecap="round"/><circle cx="35" cy="30" r="4" fill="#12395A"/><circle cx="55" cy="30" r="4" fill="#12395A"/><path d="M38 38 q7 5 14 0" fill="none" stroke="#12395A" stroke-width="3"/></svg>',
  whale:'<svg viewBox="0 0 110 70"><path d="M8 40 Q10 12 50 12 Q86 12 88 38 Q88 58 56 58 H24 Q8 58 8 40z" fill="#4A8FE0" stroke="#12395A" stroke-width="4"/><path d="M88 34 L104 18 L102 50z" fill="#4A8FE0" stroke="#12395A" stroke-width="4" stroke-linejoin="round"/><path d="M12 44 Q44 58 84 44 Q80 56 56 56 H24 Q12 54 12 44z" fill="#BFE3FF"/><circle cx="28" cy="32" r="4" fill="#12395A"/><path d="M40 10 q0 -8 -6 -10 M40 10 q2 -8 8 -10" fill="none" stroke="#7FC8FF" stroke-width="3" stroke-linecap="round"/></svg>',
  puffer:'<svg viewBox="0 0 100 90"><g stroke="#12395A" stroke-width="3">'+[0,40,80,120,160,200,240,280,320].map(function(a){return '<path transform="rotate('+a+' 48 46)" d="M48 8 l-4 8 h8z" fill="#FFE04D"/>'}).join('')+'</g><circle cx="48" cy="46" r="32" fill="#FFE04D" stroke="#12395A" stroke-width="4"/><path d="M80 46 L96 34 V58z" fill="#FFC83D" stroke="#12395A" stroke-width="4"/><circle cx="34" cy="38" r="6" fill="#fff" stroke="#12395A" stroke-width="2"/><circle cx="33" cy="38" r="3" fill="#12395A"/><circle cx="26" cy="54" r="4" fill="#FF8A8A" stroke="#12395A" stroke-width="2"/><g fill="#C9A24A"><circle cx="54" cy="30" r="2.5"/><circle cx="62" cy="50" r="2.5"/><circle cx="48" cy="62" r="2.5"/></g></svg>'
};
var DECOS={
  palm:{s:'<svg viewBox="0 0 120 160"><path d="M62 156 Q56 110 66 60" fill="none" stroke="#12395A" stroke-width="16" stroke-linecap="round"/><path d="M62 156 Q56 110 66 60" fill="none" stroke="#B9783A" stroke-width="10" stroke-linecap="round"/><g stroke="#12395A" stroke-width="4" fill="#3DBE8B"><path d="M66 60 Q30 36 6 52 Q34 44 66 62z"/><path d="M66 60 Q100 34 118 54 Q92 44 66 62z"/><path d="M66 60 Q54 22 70 6 Q66 30 68 60z"/><path d="M66 60 Q86 22 108 22 Q86 34 68 62z"/><path d="M66 60 Q40 18 18 22 Q46 32 64 62z"/></g><circle cx="60" cy="64" r="6" fill="#8A5A2A" stroke="#12395A" stroke-width="3"/><circle cx="72" cy="66" r="6" fill="#8A5A2A" stroke="#12395A" stroke-width="3"/></svg>',at:[5,62,13]},
  castle:{s:'<svg viewBox="0 0 120 100"><path d="M10 96 V50 h14 v-10 h10 v10 h12 V30 h10 v-10 h8 v10 h10 v20 h12 v-10 h10 v10 h14 v46z" fill="#F2D59A" stroke="#12395A" stroke-width="4" stroke-linejoin="round"/><rect x="52" y="66" width="16" height="30" rx="8" fill="#C99A55" stroke="#12395A" stroke-width="3"/><path d="M60 20 V4 l14 5 l-14 5" fill="#FF7A59" stroke="#12395A" stroke-width="3"/><g fill="#C99A55"><circle cx="26" cy="72" r="3"/><circle cx="92" cy="78" r="3"/><circle cx="40" cy="86" r="2.5"/></g></svg>',at:[28,88,11]},
  flag:{s:'<svg viewBox="0 0 90 120"><path d="M20 116 V8" stroke="#12395A" stroke-width="8" stroke-linecap="round"/><path d="M20 116 V8" stroke="#B9783A" stroke-width="4" stroke-linecap="round"/><path d="M22 10 Q50 0 84 12 Q70 26 84 44 Q50 32 22 44z" fill="#2B2B3A" stroke="#12395A" stroke-width="4"/><circle cx="52" cy="24" r="7" fill="#fff"/><path d="M44 34 l16 -6 M44 28 l16 6" stroke="#fff" stroke-width="3"/></svg>',at:[66,86,8]},
  lighthouse:{s:'<svg viewBox="0 0 80 170"><path d="M22 164 L30 44 H50 L58 164z" fill="#fff" stroke="#12395A" stroke-width="4" stroke-linejoin="round"/><path d="M26 110 H54 L56 132 H24z M28 76 H52 L53 96 H27z" fill="#FF5A5A"/><rect x="26" y="26" width="28" height="20" rx="3" fill="#FFE07A" stroke="#12395A" stroke-width="4"/><path d="M22 26 L40 8 L58 26z" fill="#FF5A5A" stroke="#12395A" stroke-width="4" stroke-linejoin="round"/><path d="M54 30 L80 22 V50z" fill="#FFF3B0" opacity=".7"/></svg>',at:[95,58,8]},
  rainbow:{s:'<svg viewBox="0 0 160 90"><g fill="none" stroke-width="10"><path d="M10 86 A70 70 0 0 1 150 86" stroke="#FF5A5A"/><path d="M20 86 A60 60 0 0 1 140 86" stroke="#FFC83D"/><path d="M30 86 A50 50 0 0 1 130 86" stroke="#3DBE8B"/><path d="M40 86 A40 40 0 0 1 120 86" stroke="#3D7BE0"/><path d="M50 86 A30 30 0 0 1 110 86" stroke="#B98CFF"/></g><g fill="#fff" stroke="#12395A" stroke-width="3"><ellipse cx="18" cy="84" rx="18" ry="8"/><ellipse cx="142" cy="84" rx="18" ry="8"/></g></svg>',at:[10,16,14]},
  gold:{s:'<svg viewBox="0 0 120 80"><path d="M8 76 Q20 30 60 26 Q100 30 112 76z" fill="#FFC83D" stroke="#12395A" stroke-width="4"/>'+[[30,60],[50,48],[72,50],[90,62],[60,66],[40,70],[80,70]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="8" fill="#FFE07A" stroke="#B8740E" stroke-width="2.5"/>'}).join('')+'<path d="M56 30 l6 -18 l6 18z" fill="#7FD3F7" stroke="#12395A" stroke-width="3"/><circle cx="34" cy="40" r="6" fill="#FF5A7A" stroke="#12395A" stroke-width="3"/></svg>',at:[84,90,11]}
};
/* id, kind, name, price, island needed (0 = from the start) */
var SHOP=[
 ['cap','hat','כובע קפטן',20,0],['bow','hat','פפיון',15,0],['party','hat','כובע מסיבה',25,0],['crab','pet','סרטן חבר',30,0],['palm','deco','עץ דקל',20,0],['star','pet','כוכב ים',25,0],
 ['flowers','hat','זר פרחים',30,1],['pirate','hat','כובע פיראטים',45,1],['castle','deco','ארמון חול',30,1],['flag','deco','דגל פיראטים',25,1],
 ['beanie','hat','כובע צמר',25,2],['sailor','hat','כובע מלחים',35,2],['seahorse','pet','סוסון ים',40,2],['lighthouse','deco','מגדלור',50,2],
 ['crown','hat','כתר זהב',40,3],['phones','hat','אוזניות',40,3],['jelly','pet','מדוזה',45,3],
 ['wizard','hat','כובע קוסם',50,4],['mask','hat','מסכת צלילה',55,4],['rainbow','deco','קשת בענן',60,4],
 ['viking','hat','קסדת ויקינגים',60,5],['puffer','pet','אבו נפחא',55,5],
 ['halo','hat','הילת כוכבים',70,6],['whale','pet','לוויתן קטן',60,6],['gold','deco','ערמת זהב',80,6]
];
var KINDN={hat:'כובעים',pet:'חברים לים',deco:'קישוטים לאי'};
function itemSVG(it){
  if(it[1]==='hat')return '<svg viewBox="-50 -64 100 78">'+hatG(it[0],'o').replace(/translate\([^)]*\) rotate\([^)]*\)/,'translate(0 0)')+'</svg>';
  if(it[1]==='pet')return PETS[it[0]];
  return DECOS[it[0]].s}
function hatSVGStandalone(h){var a=ANCH.o;var g=hatG(h,'o');if(!g)return '';
  g=g.replace(/translate\([^)]*\) rotate\([^)]*\)/,'translate(0 0)').replace(/class="st"/g,'stroke="#12395A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"').replace(/var\(--ink\)/g,'#12395A').replace(/var\(--gold\)/g,'#FFC83D').replace(/var\(--acc\)/g,'#FF7A59');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -70 100 80" width="400" height="320">'+g+'</svg>'}
window.HATSVG=hatSVGStandalone;
function drawPet(){var P=$('#pet');if(!P){P=document.createElement('div');P.id='pet';G.appendChild(P)}
  P.innerHTML=S.pet&&PETS[S.pet]?PETS[S.pet]:'';P.style.display=S.pet?'':'none'}
function shop(from,tab){
  tab=tab||'hat';
  go(function(){
    mood('m-day');HUD.hidden=false;hud();place(10,80,12);
    SC.appendChild(el('חנות הצדפים','ttl','position:absolute;top:3cqw;left:0;right:0;font-size:4.6cqw'));
    var tabs=el('','row shoptabs');['hat','pet','deco'].forEach(function(k){tabs.appendChild(btn(KINDN[k],'sm'+(k===tab?' gold':''),function(){shop(from,k)}))});SC.appendChild(tabs);
    var g=el('','shopgrid2');
    SHOP.filter(function(it){return it[1]===tab}).forEach(function(it){
      var own=S.owned.indexOf(it[0])>-1,locked=S.ch<it[4]&&!own;
      var on=it[1]==='hat'?S.hat===it[0]:it[1]==='pet'?S.pet===it[0]:(S.decoOff||[]).indexOf(it[0])<0&&own;
      var d=el('<div class="it-pic">'+itemSVG(it)+'</div><div class="it-n">'+it[2]+'</div>','item2'+(locked?' locked':'')+(on?' on':''));
      var label=locked?'🔒 באי '+(it[4]+1):on?(it[1]==='deco'?'על האי ✓':'עליך ✓'):own?(it[1]==='deco'?'לשים באי':it[1]==='pet'?'לקחת איתי':'ללבוש'):it[3]+' ₪';
      var b=btn(label,'sm '+(own||locked?'':'gold'),function(){
        if(locked){snd('soft');talk('הפריט הזה ייפתח כשנגיע לאי '+(it[4]+1)+'!',{x:24,dy:16});return}
        if(own){
          if(it[1]==='hat'){S.hat=on?null:it[0];drawComp()}
          else if(it[1]==='pet'){S.pet=on?null:it[0];drawPet()}
          else{S.decoOff=S.decoOff||[];var k=S.decoOff.indexOf(it[0]);if(on)S.decoOff.push(it[0]);else if(k>-1)S.decoOff.splice(k,1)}
          snd('chime');save();shop(from,tab);return}
        if(S.coins<it[3]){snd('soft');talk('צריך עוד '+(it[3]-S.coins)+' מטבעות. אפשר לשחק שוב בשלבים ולאסוף!',{x:24,dy:16});return}
        S.coins-=it[3];S.owned.push(it[0]);
        if(it[1]==='hat'){S.hat=it[0];drawComp()}else if(it[1]==='pet'){S.pet=it[0];drawPet()}
        hud();bump('#pCoins');snd('coin');cheer();save();var p=centerOf(d);burst(p.x,p.y,22,'star');
        talk(it[1]==='deco'?'יופי! זה יחכה לנו על האי.':'איזה יופי! זה בדיוק בשבילי.',{x:24,dy:16});later(function(){shop(from,tab)},1300)});
      d.appendChild(b);g.appendChild(d)});
    SC.appendChild(g);
    SC.appendChild(el('','dock')).appendChild(btn(from==='map'?'חזרה למפה':'להמשך','sm',function(){if(from==='map')map(false);else teaser()}));
    later(function(){talk(tab==='deco'?'קישוטים מופיעים על מפת האי!':tab==='pet'?'חבר לים ישחה איתנו בכל ההרפתקה!':'כל המטבעות כאן נאספו מהשלבים שעשית!',{x:24,dy:16})},400);
  });
}
function decoLayer(){var h='';SHOP.forEach(function(it){if(it[1]!=='deco'||S.owned.indexOf(it[0])<0||(S.decoOff||[]).indexOf(it[0])>-1)return;var d=DECOS[it[0]];
  h+='<div class="deco" style="left:'+d.at[0]+'%;top:'+d.at[1]+'%;width:'+d.at[2]+'cqw">'+d.s+'</div>'});return h}
