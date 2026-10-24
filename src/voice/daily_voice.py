"""daily_voice.py: record missing narration clips in the Kore voice inside the Gemini free quota.

Run from src/voice:  GK=<gemini key> python3 daily_voice.py [--max-requests N]
- builds the manifest from ../game-src.html (node mk_manifest.js)
- finds items with no clip, or whose text changed
- groups them into a few long readings (words / letter names together, story passages together)
- generates each reading once (plain Hebrew text only: an English instruction would be read aloud)
- word-aligns it with the Hebrew whisper model and cuts one clip + timing JSON per item
- stops cleanly when the daily quota is used up; writes report.json
"""
import os, sys, json, re, base64, wave, time, subprocess, difflib, urllib.request, urllib.error
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CLIPS = os.path.join(HERE, 'clips'); RAW = os.path.join(HERE, 'raw')
MODEL_DIR = os.environ.get('WHISPER_DIR', '/tmp/whisper-ivrit')
VOICE, TTS = 'Kore', 'gemini-3.8-flash-tts'
os.makedirs(CLIPS, exist_ok=True); os.makedirs(RAW, exist_ok=True)

def norm(w):
    w = re.sub(r'[֑-ׇ]', '', w); w = re.sub(r'[^א-ת]', '', w)
    return w.replace('יי', 'י').replace('וו', 'ו')

def ensure_model():
    if os.path.exists(os.path.join(MODEL_DIR, 'model.bin')): return
    from huggingface_hub import snapshot_download
    snapshot_download('ivrit-ai/whisper-large-v3-turbo-ct2', local_dir=MODEL_DIR)

_M = None
def model():
    global _M
    if _M is None:
        from faster_whisper import WhisperModel
        _M = WhisperModel(MODEL_DIR, device='cpu', compute_type='int8')
    return _M

def load16k(p):
    b = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', p, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.int16).astype(np.float32) / 32768

class Quota(Exception): pass

def tts(text, out, voice=VOICE):
    body = {"contents": [{"parts": [{"text": text}]}], "generationConfig": {"responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{TTS}:generateContent",
                                 json.dumps(body).encode(), {"Content-Type": "application/json", "x-goog-api-key": os.environ['GK']})
    for attempt in range(5):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=300))
            pcm = base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
            w = wave.open(out, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm); w.close()
            return len(pcm) / 48000
        except urllib.error.HTTPError as e:
            b = e.read().decode('utf8', 'ignore')
            if e.code == 429:
                m = re.search(r'retry in (?:(\d+)h)?(?:(\d+)m)?([\d.]+)s', b)
                wait = (int(m.group(1) or 0) * 3600 + int(m.group(2) or 0) * 60 + float(m.group(3))) + 2 if m else 60
                if wait > 900 or 'per day' in b and 'limit: 0' in b: raise Quota(b[:200])
                time.sleep(wait); continue
            raise
    raise Quota('too many retries')

def token_times(wav, toks):
    """[start,end] for every text token, plus how many matched the recognizer exactly"""
    segs, _ = model().transcribe(load16k(wav), language='he', word_timestamps=True, beam_size=5)
    W = [(norm(w.word), w.start, w.end) for s in segs for w in s.words]; W = [w for w in W if w[0]]
    tn = [norm(t) for t in toks]
    sm = difflib.SequenceMatcher(None, tn, [w[0] for w in W], autojunk=False)
    T = [None] * len(toks); exact = [False] * len(toks)
    for op, a1, a2, b1, b2 in sm.get_opcodes():
        if op == 'equal':
            for k in range(a2 - a1): T[a1 + k] = [W[b1 + k][1], W[b1 + k][2]]; exact[a1 + k] = True
        elif op == 'replace' and b2 > b1:
            s, e = W[b1][1], W[b2 - 1][2]; n = a2 - a1; L = [max(1, len(tn[a1 + k])) for k in range(n)]; tot = sum(L); c = s
            for k in range(n): d = (e - s) * L[k] / tot; T[a1 + k] = [c, c + d]; c += d
    for i, t in enumerate(T):
        if t is None:
            p = next((T[j][1] for j in range(i - 1, -1, -1) if T[j]), 0.0)
            n = next((T[j][0] for j in range(i + 1, len(T)) if T[j]), p + .5)
            T[i] = [p, max(p + .05, n)]
    return T, exact

def cut(wav, a, b, out):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '48k', out], check=True)

def batches(items):
    words = [it for it in items if it['kind'] == 'word']; story = [it for it in items if it['kind'] == 'story']
    out = []
    for i in range(0, len(words), 30): out.append(words[i:i + 30])
    cur, n = [], 0
    for it in story:
        if cur and n + len(it['text']) > 650: out.append(cur); cur, n = [], 0
        cur.append(it); n += len(it['text'])
    if cur: out.append(cur)
    # companion lines last (narration first), one batch per voice of up to 20 lines
    comp = {}
    for it in items:
        if it['kind'] == 'comp': comp.setdefault(it['voice'], []).append(it)
    for v, lst in comp.items():
        for i in range(0, len(lst), 20): out.append(lst[i:i + 20])
    return out

def main():
    maxreq = int(sys.argv[sys.argv.index('--max-requests') + 1]) if '--max-requests' in sys.argv else 99
    subprocess.run(['node', 'mk_manifest.js'], cwd=HERE, check=True)
    M = json.load(open(os.path.join(HERE, 'manifest.json'), encoding='utf8'))
    todo = []
    for it in M:
        j = os.path.join(CLIPS, it['id'] + '.json')
        if not os.path.exists(j) or json.load(open(j, encoding='utf8')).get('text') != it['text']: todo.append(it)
    report = {'pending_before': len(todo), 'done': [], 'weak': [], 'stopped': None, 'requests': 0}
    if not todo:
        report['stopped'] = 'nothing to do'; json.dump(report, open(os.path.join(HERE, 'report.json'), 'w'), ensure_ascii=False, indent=1); print(report); return
    ensure_model()
    for bi, group in enumerate(batches(todo)):
        if report['requests'] >= maxreq: report['stopped'] = 'max requests'; break
        # each item ends a sentence so the reader pauses between items
        parts = [it['text'] if re.search(r'[.!?…]$', it['text']) else it['text'] + '.' for it in group]
        text = ' '.join(parts); raw = os.path.join(RAW, f'batch{bi}_{int(time.time())}.wav')
        try:
            dur = tts(text, raw, group[0].get('voice', VOICE)); report['requests'] += 1
        except Quota as q:
            report['stopped'] = 'daily quota: ' + str(q)[:120]; break
        toks = text.split(); T, ex = token_times(raw, toks)
        k = 0
        for gi, it in enumerate(group):
            n = len(parts[gi].split()); a, b = k, k + n - 1; k += n
            nxt = T[b + 1][0] if b + 1 < len(T) else dur
            s = max(0.0, T[a][0] - .18); e = min(dur, max(T[b][1] + .05, min(T[b][1] + .4, nxt - .05)))
            okfrac = sum(ex[a:b + 1]) / n
            if okfrac < .6: report['weak'].append({'id': it['id'], 'text': it['text'], 'matched': round(okfrac, 2)})
            cut(raw, s, e, os.path.join(CLIPS, it['id'] + '.mp3'))
            w = [[round(float(x - s), 2), round(float(y - s), 2)] for x, y in T[a:b + 1]]
            json.dump(dict({'text': it['text'], 'dur': round(float(e - s), 2), 'w': w, 'matched': round(okfrac, 2)}, **({'comp': it['comp'], 'voice': it['voice']} if it.get('comp') else {})),
                      open(os.path.join(CLIPS, it['id'] + '.json'), 'w', encoding='utf8'), ensure_ascii=False)
            report['done'].append(it['id'])
        time.sleep(25)
    left = [it for it in M if not os.path.exists(os.path.join(CLIPS, it['id'] + '.json'))]
    report['pending_after'] = len(left)
    json.dump(report, open(os.path.join(HERE, 'report.json'), 'w'), ensure_ascii=False, indent=1)
    print(json.dumps({k: (v if k not in ('done',) else len(v)) for k, v in report.items()}, ensure_ascii=False))

if __name__ == '__main__': main()
