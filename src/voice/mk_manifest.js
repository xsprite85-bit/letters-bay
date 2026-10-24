const fs=require('fs');
const src=fs.readFileSync('../game-src.html','utf8');
function grab(name){const i=src.indexOf('var '+name+'=');let j=src.indexOf('\n];',i);if(name==='LET')j=src.indexOf('\n};',i);const body=src.slice(i+4+name.length+1,j+(name==='LET'?3:3));return eval('('+body.replace(/;$/,'')+')');}
const LET=grab('LET'),CHS=grab('CHS');
const m=[];
CHS.forEach((c,i)=>{if(c.intro)m.push({id:`ch${i+1}_intro`,kind:'story',text:c.intro});if(c.outro)m.push({id:`ch${i+1}_outro`,kind:'story',text:c.outro});});
const seen=new Set();
Object.values(LET).forEach(l=>{m.push({id:`let_${l.ch}`,kind:'word',text:l.name});if(!seen.has(l.word)){seen.add(l.word);m.push({id:`word_${l.ch}`,kind:'word',text:l.word});}});
fs.writeFileSync('manifest.json',JSON.stringify(m,null,1));
console.log(m.length,'items;',m.filter(x=>x.kind==='story').length,'story;',m.filter(x=>x.kind==='story').reduce((a,x)=>a+x.text.length,0),'story chars');
