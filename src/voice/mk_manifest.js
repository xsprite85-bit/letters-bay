const fs=require('fs');
const src=fs.readFileSync('../game-src.html','utf8');
function grab(name){const i=src.indexOf('var '+name+'=');let j=src.indexOf('\n];',i);if(name==='LET')j=src.indexOf('\n};',i);const body=src.slice(i+4+name.length+1,j+(name==='LET'?3:3));return eval('('+body.replace(/;$/,'')+')');}
const LET=grab('LET'),CHS=grab('CHS');
const m=[];
CHS.forEach((c,i)=>{if(c.intro)m.push({id:`ch${i+1}_intro`,kind:'story',text:c.intro});if(c.outro)m.push({id:`ch${i+1}_outro`,kind:'story',text:c.outro});});
const seen=new Set();
Object.values(LET).forEach(l=>{m.push({id:`let_${l.ch}`,kind:'word',text:l.name});[[l.word]].concat(l.more||[]).forEach((w,k)=>{if(!seen.has(w[0])){seen.add(w[0]);m.push({id:`word_${l.ch}${k?k+1:''}`,kind:'word',text:w[0]});}});});

// chapter 1: opening story (4 steps, girl/boy), the bottle episode (per companion and girl/boy), and the word-step sentences for its letters
{const P=[...src.matchAll(/\{t:'([^']+)',fx:'(storm|scatter|quiet)'/g)].map(x=>x[1]);
 P.forEach((t,i)=>m.push({id:`ch1_story${i+1}`,kind:'story',text:t}));
 const ask=src.match(/\{t:GN\('([^']+)','([^']+)'\)\+'\?'/);
 if(ask){m.push({id:'ch1_story4f',kind:'story',text:ask[1]+'?'});m.push({id:'ch1_story4m',kind:'story',text:ask[2]+'?'});}
 const ep=src.match(/GN\('אַתְּ וְ','אַתָּה וְ'\)\+n\[0\]\+' '\+n\[1\]\+'([^']+)'/);
 const NAMES={t:['גַּלִּי','מְטַיְּלִים'],o:['תָּמִי','מְטַיְּלוֹת'],g:['נוּנִי','מְטַיְּלִים']};
 if(ep)for(const c of 'tog')for(const g of 'fm'){const n=NAMES[c].slice();if(g==='m')n[1]='מְטַיְּלִים';m.push({id:`ch1_ep_${c}${g}`,kind:'story',text:(g==='f'?'אַתְּ וְ':'אַתָּה וְ')+n[0]+' '+n[1]+ep[1]});}
 for(const ch of CHS[0].L){const l=LET[ch];[[l.word]].concat(l.more||[]).forEach((w,k)=>{
   if(k===0){m.push({id:`ws_${ch}f`,kind:'story',text:'הַמִּלָּה '+w[0]+'. שָׁמַעְתְּ אֵיךְ הִיא מַתְחִילָה? הִנֵּה הָאוֹת '+ch+'.'});
             m.push({id:`ws_${ch}m`,kind:'story',text:'הַמִּלָּה '+w[0]+'. שָׁמַעְתָּ אֵיךְ הִיא מַתְחִילָה? הִנֵּה הָאוֹת '+ch+'.'});}
   else m.push({id:`wm_${ch}${k}`,kind:'story',text:'עוֹד מִלָּה: '+w[0]+'.'});});}}
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
