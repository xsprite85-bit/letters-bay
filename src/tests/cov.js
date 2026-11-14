// every line the game actually spoke in the test runs must be in the recording list
const fs=require('fs'),M=JSON.parse(fs.readFileSync(__dirname+'/voice/manifest.json','utf8'));
const src=fs.readFileSync(__dirname+'/game-src.html','utf8');
const LET=eval('('+src.slice(src.indexOf('var LET=')+8,src.indexOf('\n};',src.indexOf('var LET='))+2)+')');
function spk(t,PN){if(PN){t=t.split(', '+PN).join('').split(' '+PN).join('')}return /\s/.test(t)?t.replace(/(^|[\s:,])([א-ת])(?=[\s.,!?:]|$)/g,(m,a,c)=>a+(LET[c]?LET[c].name:c)):t}
const nar=new Set(M.filter(x=>x.kind!=='comp').map(x=>x.text)),comp=new Set(M.filter(x=>x.kind==='comp').map(x=>x.text));
const miss=new Map();
for(const f of fs.readdirSync(__dirname+'/vlog').filter(f=>f.endsWith('.json'))){
  const PN=f.includes('_m_')||f.startsWith('m_')?'נועם':'ליה';
  for(const x of JSON.parse(fs.readFileSync(__dirname+'/vlog/'+f))){
    if(x.k==='nar'){if(!nar.has(x.t))miss.set('nar|'+x.t,f);continue}
    let t=spk(x.t,PN);
    if(x.k==='say'?!nar.has(t):!comp.has(t))miss.set(x.k.split(':')[0]+'|'+t,f)}}
console.log('not in list:',miss.size);for(const [k,f] of miss)console.log(' ',k,'  <',f);
