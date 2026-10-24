/* ---------- parent area: progress per letter, letters to practise, play time, settings ---------- */
function stt(ch){S.stat=S.stat||{};return S.stat[ch]=S.stat[ch]||{b:0,w:0,s:[],r:0,rOk:0,last:0}}
function today(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
var PLAYT=Date.now();
function tickPlay(){var now=Date.now(),dt=Math.min(5*60000,now-PLAYT);PLAYT=now;S.play=S.play||{day:today(),min:0,total:0};
  if(S.play.day!==today()){S.play.day=today();S.play.min=0}S.play.min+=dt/60000;S.play.total+=dt/60000}
function overLimit(){tickPlay();return S.limit>0&&S.play.min>=S.limit}
function struggle(ch){var s=stt(ch),m=(S.miss&&S.miss[ch])||0,sec=s.s.length?s.s.reduce(function(a,b){return a+b},0)/s.s.length:0;
  return m*1.0+s.b*.5+(s.r-s.rOk)*1.5+(sec>30?1:0)}
function restScreen(){
  go(function(){mood('m-night');HUD.hidden=true;place(50,52,22);
    SC.appendChild(el('הגיע הזמן לנוח','ttl fade','position:absolute;top:9cqw;left:0;right:0;font-size:6cqw'));
    talk(GN('שיחקנו יפה היום! נמשיך מחר, אני אשמור לך את המקום.','שיחקנו יפה היום! נמשיך מחר, אני אשמור לך את המקום.'),{x:50,dy:20,ms:8000});
    SC.appendChild(btn('הורים','sm',function(){parentGate()},'position:absolute;bottom:3cqw;left:3cqw;font-size:1.9cqw;padding:.5cqw 1.6cqw;opacity:.85'));
  })}
function parentGate(){
  var a=rnd(3,9)|0,b=rnd(3,9)|0,ans=a*b,opts=shuffle([ans,ans+a,ans-b,ans+1].filter(function(v,i,s){return s.indexOf(v)===i})).slice(0,4);
  if(opts.indexOf(ans)<0)opts[0]=ans;opts=shuffle(opts);
  go(function(){mood('m-day');HUD.hidden=true;hideComp();
    SC.appendChild(el('לגישה של הורים','ttl','position:absolute;top:8cqw;left:0;right:0;font-size:4.6cqw'));
    SC.appendChild(el('כמה זה '+a+' × '+b+'?','','position:absolute;top:19cqw;left:0;right:0;text-align:center;color:#fff;font-size:4cqw;font-weight:700;text-shadow:0 .3cqw 0 var(--ink)'));
    var r=el('','row','position:absolute;top:31cqw;left:50%;transform:translateX(-50%);gap:2cqw');
    opts.forEach(function(o){r.appendChild(btn(String(o),'sm',function(){if(o===ans)parentArea();else title()},'font-size:3.4cqw;padding:1cqw 3.4cqw'))});
    SC.appendChild(r);SC.appendChild(btn('חזרה','sm',function(){title()},'position:absolute;bottom:3cqw;left:3cqw;font-size:2cqw'));
  })}
function parentArea(){
  tickPlay();save();
  go(function(){mood('m-day');HUD.hidden=true;hideComp();
    var p=el('','parent');SC.appendChild(p);
    var learned=S.letters.length,mins=Math.round((S.play&&S.play.min)||0),tot=Math.round((S.play&&S.play.total)||0);
    p.appendChild(el('<h2>אזור הורים</h2><p class="pa-sum"><b>'+(PN||'הילד/ה')+'</b> · פרק '+(S.ch+1)+' מתוך '+CHS.length+' · '+learned+' מתוך 22 אותיות · היום '+mins+' דק׳ · סה״כ '+tot+' דק׳</p>'));
    /* per-letter grid */
    var g='<div class="pa-grid">';
    ALLL.forEach(function(c){var on=S.letters.indexOf(c)>-1,sc=struggle(c),cls=!on?'no':sc>=4?'hard':sc>=1.5?'mid':'ok',s=stt(c);
      var tip=on?('כתיבה: '+((S.miss&&S.miss[c])||0)+' טעויות · בועות: '+s.b+' · חזרות: '+s.rOk+'/'+s.r):'עוד לא נלמדה';
      g+='<div class="pa-l '+cls+'" title="'+tip+'"><b>'+c+'</b><i>'+(on?(cls==='ok'?'טוב':cls==='mid'?'בסדר':'לתרגל'):'—')+'</i></div>'});
    p.appendChild(el(g+'</div><p class="pa-key"><span class="ok"></span>יודעת היטב <span class="mid"></span>בסדר <span class="hard"></span>כדאי לתרגל <span class="no"></span>עוד לא נלמדה</p>'));
    var hard=S.letters.slice().sort(function(x,y){return struggle(y)-struggle(x)}).filter(function(c){return struggle(c)>=1.5}).slice(0,3);
    p.appendChild(el('<p class="pa-tip">'+(hard.length?'<b>כדאי לתרגל יחד:</b> '+hard.map(function(c){return c+' ('+LET[c].name+', למשל '+LET[c].word+')'}).join(' · ')+'. המשחק כבר מחזיר אותן בחזרה של תחילת כל פרק.':'אין כרגע אותיות שדורשות תרגול נוסף.')+'</p>'));
    /* settings */
    var st=el('','pa-set');
    function tog(lbl,key){var b=btn(lbl+': '+(S[key]!==false?'פועל':'כבוי'),'sm',function(){S[key]=!(S[key]!==false);if(key==='music'&&ambG)ambG.gain.value=S.music?.12:0;syncTg();save();parentArea()});return b}
    st.appendChild(tog('דיבור','voice'));st.appendChild(tog('מוזיקה','music'));
    var lims=[0,15,20,30],li=lims.indexOf(S.limit||0);
    st.appendChild(btn('זמן משחק ביום: '+((S.limit||0)?S.limit+' דק׳':'ללא הגבלה'),'sm',function(){S.limit=lims[(li+1)%lims.length];save();parentArea()}));
    st.appendChild(btn('שינוי שם / בן-בת','sm',function(){askName()}));
    var rs=btn('איפוס התקדמות','sm',function(){if(rs.dataset.k){S=fresh();save();syncTg();title()}else{rs.dataset.k=1;rs.textContent='ללחוץ שוב לאישור האיפוס'}});st.appendChild(rs);
    p.appendChild(st);
    p.appendChild(el('<p class="pa-note">כל הנתונים נשמרים רק במכשיר הזה. סדר הקווים בכתיבה ושמות האותיות עדיין ממתינים לבדיקת גננת.</p>'));
    SC.appendChild(btn('חזרה למשחק','gold sm',function(){title()},'position:absolute;bottom:2.4cqw;left:50%;transform:translateX(-50%)'));
  })}
