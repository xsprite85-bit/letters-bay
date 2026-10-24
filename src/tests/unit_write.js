const fs=require('fs');eval(fs.readFileSync('strokes.js','utf8')+fs.readFileSync('write_step.js','utf8').split('function weakAdd')[0]);
function jitter(p,a){return rsmp(p,30).map(q=>[q[0]+(Math.random()-.5)*a,q[1]+(Math.random()-.5)*a])}
let bad=[];let n=0;
for(const ch in STK){STK[ch].forEach((s,i)=>{
  for(let r=0;r<20;r++){n++;
   if(!strokeOK(jitter(s.p,8),s,1,true))bad.push(ch+i+' fwd-fail');
   if(!s.b&&strokeOK(jitter(s.p.slice().reverse(),4),s,1,true))bad.push(ch+i+' rev-pass');
   // a shifted copy (wrong place) should fail
   if(strokeOK(s.p.map(q=>[q[0]+22,q[1]+22]),s,1,true))bad.push(ch+i+' shift-pass');
   // memory mode accepts reverse
   if(!strokeOK(jitter(s.p.slice().reverse(),6),s,1.25,false))bad.push(ch+i+' mem-rev-fail');
  }
  STK[ch].forEach((o,j)=>{if(j!==i&&strokeOK(o.p,s,1,true))bad.push(ch+': stroke '+j+' matches '+i)});
});}
const c={};bad.forEach(b=>c[b]=(c[b]||0)+1);console.log('checks',n,'problems',c);
