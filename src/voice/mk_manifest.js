const fs=require('fs');
const src=fs.readFileSync('../game-src.html','utf8');
function grab(name){const i=src.indexOf('var '+name+'=');let j=src.indexOf('\n];',i);if(name==='LET')j=src.indexOf('\n};',i);const body=src.slice(i+4+name.length+1,j+(name==='LET'?3:3));return eval('('+body.replace(/;$/,'')+')');}
const LET=grab('LET'),CHS=grab('CHS');
const m=[];
CHS.forEach((c,i)=>{if(c.intro)m.push({id:`ch${i+1}_intro`,kind:'story',text:c.intro});if(c.outro)m.push({id:`ch${i+1}_outro`,kind:'story',text:c.outro});});
const seen=new Set();
Object.values(LET).forEach(l=>{m.push({id:`let_${l.ch}`,kind:'word',text:l.name});[[l.word]].concat(l.more||[]).forEach((w,k)=>{if(!seen.has(w[0])){seen.add(w[0]);m.push({id:`word_${l.ch}${k?k+1:''}`,kind:'word',text:w[0]});}});});
// companion lines: fixed sentences said through talk() (literal, or a GN girl/boy pair), plus the story-style continue prompts
const VOX={t:'Umbriel',o:'Leda',g:'Puck'};
const lines=new Set();
let k=0;while((k=src.indexOf('talk(',k))>=0){k+=5;if(/function\s+$/.test(src.slice(k-20,k-5)))continue;
  const rest=src.slice(k);let mm;
  if((mm=rest.match(/^'([^'+]+)'\s*,\s*\{/)))lines.add(mm[1]);
  else if((mm=rest.match(/^GN\('([^'+]+)','([^'+]+)'\)\s*,\s*\{/))){lines.add(mm[1]);lines.add(mm[2]);}}
const TAP=['לחצי עליי ונמשיך!','לחץ עליי ונמשיך!'];
const tz=[...src.matchAll(/TEASE=\[([^\]]*)\]/g)].flatMap(x=>[...x[1].matchAll(/'([^']*)'/g)].map(y=>y[1])).concat([...src.matchAll(/tz:'([^']*)'/g)].map(y=>y[1]));
TAP.forEach(t=>{lines.add(t);tz.forEach(z=>lines.add(z+t));});
['אני כאן! לחצי עליי כדי להמשיך','אני כאן! לחץ עליי כדי להמשיך'].forEach(t=>lines.add(t));
function h(t){let x=5381;for(const c of t)x=((x*33)^c.charCodeAt(0))>>>0;return x.toString(36)}
for(const comp of Object.keys(VOX))[...lines].forEach(t=>m.push({id:`c${comp}_${h(t)}`,kind:'comp',comp,voice:VOX[comp],text:t}));
fs.writeFileSync('manifest.json',JSON.stringify(m,null,1));
console.log(m.length,'items;',m.filter(x=>x.kind==='story').length,'story;',m.filter(x=>x.kind==='story').reduce((a,x)=>a+x.text.length,0),'story chars');
