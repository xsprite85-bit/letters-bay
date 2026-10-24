/* ---------- writing: guided -> dotted x2 -> from memory ---------- */
function rsmp(pts,n){/* resample a polyline to n evenly spaced points */
  var d=[0],i;for(i=1;i<pts.length;i++)d.push(d[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  var L=d[d.length-1]||1,out=[],j=1;
  for(i=0;i<n;i++){var t=L*i/(n-1);while(j<pts.length-1&&d[j]<t)j++;var a=pts[j-1],b=pts[j],seg=(d[j]-d[j-1])||1,f=Math.max(0,Math.min(1,(t-d[j-1])/seg));out.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f])}
  return out}
function plen(p){var s=0;for(var i=1;i<p.length;i++)s+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return s}
function dmin(q,P){var m=1e9;for(var i=0;i<P.length;i++){var d=Math.hypot(q[0]-P[i][0],q[1]-P[i][1]);if(d<m)m=d}return m}
/* does user stroke u (box units) match target stroke s? tol scales the thresholds; dir=false accepts either direction */
function strokeOK(u,s,tol,dir){
  if(u.length<2||plen(u)<Math.max(8,plen(s.p)*.45))return false;
  var T=rsmp(s.p,28),U=rsmp(u,28),a=U[0],z=U[U.length-1],t0=T[0],t1=T[T.length-1];
  var fwd=Math.hypot(a[0]-t0[0],a[1]-t0[1])<17*tol&&Math.hypot(z[0]-t1[0],z[1]-t1[1])<19*tol&&Math.hypot(U[7][0]-T[7][0],U[7][1]-T[7][1])<22*tol;
  var rev=Math.hypot(a[0]-t1[0],a[1]-t1[1])<17*tol&&Math.hypot(z[0]-t0[0],z[1]-t0[1])<19*tol;
  if(!(fwd||((s.b||!dir)&&rev)))return false;
  var md=0;U.forEach(function(q){md+=dmin(q,T)});md/=U.length;
  var cov=0;T.forEach(function(q){if(dmin(q,U)<11*tol)cov++});
  return md<9.5*tol&&cov/T.length>=.78}
function weakAdd(ch,n){S.miss=S.miss||{};S.miss[ch]=(S.miss[ch]||0)+n}
/* writing board: mode 'guide' | 'dots' | 'memory'; done(misses) is called when the letter is written */
function writeBoard(parent,ch,mode,done){
  var strokes=STK[ch]||[],N=600,box=el('','wr pop-in');parent.appendChild(box);
  var cg=document.createElement('canvas'),cu=document.createElement('canvas');cg.width=cu.width=cg.height=cu.height=N;box.appendChild(cg);box.appendChild(cu);
  var g=cg.getContext('2d'),u=cu.getContext('2d'),K=N/100,cur=0,doneS=[],ink=[],path=null,miss=0,busy=false,gen=S.gen,left=strokes.map(function(_,i){return i});
  function line(ctx,p,w,col,dash){ctx.save();ctx.lineWidth=w;ctx.strokeStyle=col;ctx.lineCap='round';ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);ctx.beginPath();p.forEach(function(q,k){k?ctx.lineTo(q[0]*K,q[1]*K):ctx.moveTo(q[0]*K,q[1]*K)});ctx.stroke();ctx.restore()}
  function arrow(ctx,p){var R=rsmp(p,20),a=R[9],b=R[11],ang=Math.atan2(b[1]-a[1],b[0]-a[0]),x=b[0]*K,y=b[1]*K;
    ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle='#FF7A59';ctx.strokeStyle='#12395A';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-12,-15);ctx.lineTo(-12,15);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
  function dot(ctx,q,n,col){var x=q[0]*K,y=q[1]*K;ctx.save();ctx.fillStyle=col;ctx.strokeStyle='#12395A';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,20,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='700 24px Rubik,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n,x,y+1);ctx.restore()}
  function guide(){
    g.clearRect(0,0,N,N);
    g.save();g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=3;g.setLineDash([10,12]);g.beginPath();g.moveTo(0,22*K);g.lineTo(N,22*K);g.moveTo(0,84*K);g.lineTo(N,84*K);g.stroke();g.restore();
    strokes.forEach(function(s,i){
      if(doneS.indexOf(i)>=0){line(g,s.p,46,'#FFC83D');line(g,s.p,46,'rgba(18,57,90,.25)',[1,0]);line(g,s.p,40,'#FFC83D');return}
      if(mode==='guide'){line(g,s.p,46,'rgba(255,255,255,.55)');line(g,s.p,5,'rgba(18,57,90,.55)',[14,14])}
      else if(mode==='dots'){line(g,s.p,8,'rgba(255,255,255,.95)',[2,20])}});
    if(mode==='guide'&&cur<strokes.length){var s=strokes[cur];arrow(g,s.p);dot(g,s.p[0],cur+1,'#3DBE8B')}
    if(mode==='dots'&&cur<strokes.length)dot(g,strokes[cur].p[0],'',  'rgba(61,190,139,.85)');
  }
  function demo(i,cb){/* a glowing dot draws stroke i */
    if(i>=strokes.length||gen!==S.gen){cb&&cb();return}
    var R=rsmp(strokes[i].p,40),k=0;
    (function step(){if(gen!==S.gen)return;u.clearRect(0,0,N,N);for(var j=0;j<strokes.length;j++)if(j<i)line(u,strokes[j].p,30,'rgba(255,200,61,.75)');
      line(u,R.slice(0,k+1),30,'rgba(255,200,61,.9)');var q=R[k];u.save();u.fillStyle='#fff';u.shadowColor='#FFD43D';u.shadowBlur=30;u.beginPath();u.arc(q[0]*K,q[1]*K,16,0,7);u.fill();u.restore();
      if(++k<R.length)setTimeout(step,28);else setTimeout(function(){demo(i+1,cb)},250)})()}
  function clearInk(){u.clearRect(0,0,N,N)}
  function judge(p){
    if(mode==='memory'){
      ink.push(p);
      var hit=-1;left.forEach(function(i){if(hit<0&&strokeOK(p,strokes[i],1.25,false))hit=i});
      if(hit>=0){left.splice(left.indexOf(hit),1);doneS.push(hit);snd('pop');guide();clearInk();
        if(!left.length){fin();return}}
      else{miss++;snd('soft');fadeInk();
        if(miss===2){talk(GN('נסי שוב, מלמעלה למטה.','נסה שוב, מלמעלה למטה.'),{x:30,dy:17});flash()}
        else if(miss>=4){talk('הנה האות, נכתוב אותה ביחד.',{x:30,dy:17});mode='guide';cur=left[0];guide();demo(0)}}
      return}
    var target=strokes[cur],ok=strokeOK(p,target,mode==='guide'?1.1:1,true),other=-1;
    if(!ok)strokes.forEach(function(s,i){if(other<0&&i!==cur&&doneS.indexOf(i)<0&&strokeOK(p,s,1,true))other=i});
    if(ok||other>=0){var i=ok?cur:other;doneS.push(i);snd('pop');tone(520+doneS.length*120,.12,'sine',.06);clearInk();
      cur=0;while(doneS.indexOf(cur)>=0)cur++;guide();if(doneS.length>=strokes.length)fin()}
    else{miss++;snd('soft');fadeInk();
      if(mode==='guide'||miss%2===0){talk(GN('מתחילים בנקודה הירוקה והולכים עם החץ.','מתחילים בנקודה הירוקה והולכים עם החץ.'),{x:30,dy:17})}
      if(mode==='guide'&&miss%2===0)demo(cur,function(){clearInk()})}}
  function fadeInk(){busy=true;cu.animate([{opacity:1},{opacity:0}],{duration:450}).onfinish=function(){clearInk();busy=false}}
  function flash(){var c2=document.createElement('canvas');c2.width=c2.height=N;var x=c2.getContext('2d');strokes.forEach(function(s){line(x,s.p,30,'rgba(255,255,255,.8)')});
    c2.className='wrflash';box.appendChild(c2);c2.animate([{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.7},{opacity:0}],{duration:1800}).onfinish=function(){c2.remove()}}
  function fin(){busy=true;guide();clearInk();snd('chime');var p=centerOf(box);burst(p.x,p.y,18,'star');box.classList.add('ok');later(function(){done(miss)},900)}
  function pos(e){var q=GL.uv(cu,e);return [q[0]*100,q[1]*100]}
  cu.addEventListener('pointerdown',function(e){if(busy)return;e.preventDefault();try{cu.setPointerCapture(e.pointerId)}catch(x){}path=[pos(e)];u.save()});
  cu.addEventListener('pointermove',function(e){if(!path)return;e.preventDefault();var q=pos(e),l=path[path.length-1];if(Math.hypot(q[0]-l[0],q[1]-l[1])<.8)return;path.push(q);
    u.lineWidth=22;u.strokeStyle='#2B6FD6';u.lineCap='round';u.lineJoin='round';u.beginPath();u.moveTo(l[0]*K,l[1]*K);u.lineTo(q[0]*K,q[1]*K);u.stroke()});
  ['pointerup','pointercancel'].forEach(function(ev){cu.addEventListener(ev,function(){if(!path)return;var p=path;path=null;judge(p)})});
  guide();
  if(mode==='guide'){busy=true;later(function(){demo(0,function(){clearInk();busy=false})},500)}
  return box}

function stepTrace(L,idx){
  var plan=['guide','dots','dots','memory'],k=0,misses=0;
  go(function(){
    frame(2,idx);place(12,80,14);
    var prog=el('','row','position:absolute;top:13.5cqw;left:50%;transform:translateX(-50%);z-index:5;gap:1.2cqw');SC.appendChild(prog);
    function pr(){var h='';plan.forEach(function(m,i){h+='<div class="slot'+(i<k?' on':'')+'" style="width:4.6cqw;height:4.6cqw;font-size:3cqw">'+(i<k?L.ch:'')+'</div>'});prog.innerHTML=h}
    var area=el('','fill');SC.appendChild(area);
    var LINES={guide:GN('בואי נכתוב את '+L.ch+'! קודם תסתכלי, ואז תכתבי עם האצבע לפי המספרים.','בוא נכתוב את '+L.ch+'! קודם תסתכל, ואז תכתוב עם האצבע לפי המספרים.'),
      dots:GN('עכשיו רק נקודות. כתבי את '+L.ch+' שוב.','עכשיו רק נקודות. כתוב את '+L.ch+' שוב.'),
      memory:GN('ועכשיו בלי עזרה! כתבי '+L.ch+' מהזיכרון.','ועכשיו בלי עזרה! כתוב '+L.ch+' מהזיכרון.')};
    function next(){pr();if(k>=plan.length){weakAdd(L.ch,misses>3?2:misses>0?1:0);talk(GN('כתבת את ','כתבת את ')+L.ch+' לבד!',{x:30,dy:17});cheer();later(function(){stepWord(L,idx)},1300);return}
      area.innerHTML='';var m=plan[k];if(k===0||plan[k-1]!==m)talk(LINES[m],{x:30,dy:17,ms:5200});
      writeBoard(area,L.ch,m,function(ms){misses+=ms;k++;next()})}
    next();
  });
}
/* review: write two earlier letters from memory at the start of a chapter, the ones she missed most come first */
function reviewLetters(next){
  var past=[];for(var c=0;c<S.ch;c++)past=past.concat(CHS[c].L);
  if(!past.length){next();return}
  S.miss=S.miss||{};past=shuffle(past).sort(function(a,b){return (S.miss[b]||0)-(S.miss[a]||0)});
  var pick=past.slice(0,2),i=0;
  go(function(){
    mood('m-day');music('quest',.55);HUD.hidden=false;hud();place(12,80,14);
    SC.appendChild(el('חזרה קטנה לפני ההרפתקה','ttl fade','position:absolute;top:7cqw;left:0;right:0;font-size:4cqw'));
    var area=el('','fill');SC.appendChild(area);
    function one(){if(i>=pick.length){talk('זוכרים הכול! יוצאים לדרך.',{x:30,dy:17});later(next,1300);return}
      var ch=pick[i];area.innerHTML='';talk(GN('את זוכרת את '+LET[ch].name+'? כתבי אותה.','אתה זוכר את '+LET[ch].name+'? כתוב אותה.'),{x:30,dy:17,ms:4800});
      writeBoard(area,ch,'memory',function(ms){weakAdd(ch,ms>1?1:-1);if(S.miss[ch]<0)S.miss[ch]=0;S.coins+=5;hud();i++;one()})}
    one();
  });
}
