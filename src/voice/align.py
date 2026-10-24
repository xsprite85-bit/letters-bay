"""align.py: word-align a Hebrew TTS clip to the game's nikud text.
usage: python3 align.py in.wav "text" out_id [--from SEC] [--to SEC]
writes clips/<out_id>.mp3 and clips/<out_id>.json  {text, dur, w:[[start,end],...] per whitespace token}"""
import sys,re,json,subprocess,difflib,os,numpy as np
from faster_whisper import WhisperModel
_M=None
def model():
    global _M
    if _M is None: _M=WhisperModel('/tmp/whisper-ivrit',device='cpu',compute_type='int8')
    return _M
def load(p):
    b=subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(b,np.int16).astype(np.float32)/32768
def norm(w):
    w=re.sub(r'[֑-ׇ]','',w)          # nikud/cantillation
    w=re.sub(r'[^א-ת]','',w)         # keep letters only
    return w.replace('יי','י').replace('וו','ו')  # full vs defective spelling
def align(wav,text,oid,t_from=0.0,t_to=None,outdir='clips'):
    os.makedirs(outdir,exist_ok=True)
    toks=text.split(); tn=[norm(t) for t in toks]
    segs,_=model().transcribe(load(wav),language='he',word_timestamps=True,beam_size=5)
    W=[(norm(w.word),w.start,w.end,w.probability) for s in segs for w in s.words]
    W=[w for w in W if w[1]>=t_from-0.05 and (t_to is None or w[2]<=t_to+0.05) and w[0]]
    sm=difflib.SequenceMatcher(None,tn,[w[0] for w in W],autojunk=False)
    times=[None]*len(toks); exact=0
    for op,a1,a2,b1,b2 in sm.get_opcodes():
        if op=='equal':
            for k in range(a2-a1): times[a1+k]=[W[b1+k][1],W[b1+k][2]]; exact+=1
        elif op=='replace' and a2-a1==b2-b1:
            for k in range(a2-a1): times[a1+k]=[W[b1+k][1],W[b1+k][2]]
        elif op=='replace' and b2>b1:   # spread whisper span over the text tokens
            s,e=W[b1][1],W[b2-1][2]; n=a2-a1
            L=[max(1,len(tn[a1+k])) for k in range(n)]; tot=sum(L); c=s
            for k in range(n): d=(e-s)*L[k]/tot; times[a1+k]=[c,c+d]; c+=d
    # interpolate any gaps
    for i,t in enumerate(times):
        if t is None:
            p=next((times[j][1] for j in range(i-1,-1,-1) if times[j]),t_from)
            n=next((times[j][0] for j in range(i+1,len(times)) if times[j]),p+0.5)
            times[i]=[p,max(p+0.05,n)]
    start=max(0.0,times[0][0]-0.2); end=times[-1][1]+0.45
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',f'{start:.3f}','-to',f'{end:.3f}','-i',wav,'-ac','1','-ar','24000','-b:a','48k',f'{outdir}/{oid}.mp3'],check=True)
    w=[[round(float(a-start),2),round(float(b-start),2)] for a,b in times]
    out={'text':text,'dur':round(float(end-start),2),'w':w,'exact':f'{exact}/{len(toks)}','heard':' '.join(x[0] for x in W)}
    json.dump(out,open(f'{outdir}/{oid}.json','w'),ensure_ascii=False)
    return out
if __name__=='__main__':
    a=sys.argv; f=float(a[a.index('--from')+1]) if '--from' in a else 0.0; t=float(a[a.index('--to')+1]) if '--to' in a else None
    r=align(a[1],a[2],a[3],f,t); print(json.dumps({k:r[k] for k in ('dur','exact','heard')},ensure_ascii=False)); print(r['w'])
