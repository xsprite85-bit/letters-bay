import os,sys,json,base64,wave,urllib.request,urllib.error,time,re
K=os.environ['GK']; MODEL="gemini-3.8-flash-tts"; VOICE="Kore"
STORY="Read in Hebrew, slowly and warmly, like a gentle storyteller reading an adventure to a five-year-old child. Natural, human, expressive rhythm with short pauses at commas and full stops: "
WORD="Say only this Hebrew word or name once, clearly and calmly, for a five-year-old learning to read. Say nothing else: "
only=sys.argv[1:]  # optional ids
M=json.load(open('manifest.json'))
def call(text):
    body={"contents":[{"parts":[{"text":text}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":VOICE}}}}}
    req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",json.dumps(body).encode(),{"Content-Type":"application/json","x-goog-api-key":K})
    return json.load(urllib.request.urlopen(req,timeout=180))
done=fail=0
for it in M:
    if only and it['id'] not in only: continue
    out=f"audio/{it['id']}.wav"
    if os.path.exists(out): continue
    prompt=it['text']
    for attempt in range(6):
        try:
            r=call(prompt)
            pcm=base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
            w=wave.open(out,"wb");w.setnchannels(1);w.setsampwidth(2);w.setframerate(24000);w.writeframes(pcm);w.close()
            print("ok",it['id'],round(len(pcm)/48000,1),"s",flush=True); done+=1; break
        except urllib.error.HTTPError as e:
            b=e.read().decode('utf8','ignore')
            if e.code==429:
                m=re.search(r'retry in (?:(\d+)h)?(?:(\d+)m)?([\d.]+)s',b)
                wait=(int(m.group(1) or 0)*3600+int(m.group(2) or 0)*60+float(m.group(3)))+2 if m else 60
                if wait>900: print("DAILY LIMIT, wait",round(wait/60),"min; stopping",flush=True); print("done",done); sys.exit(2)
                print("429, sleeping",round(wait),"s",flush=True); time.sleep(wait)
            else: print("ERR",it['id'],e.code,b[:200],flush=True); time.sleep(10)
        except Exception as e:
            print("ERR",it['id'],e,flush=True); time.sleep(10)
    else: fail+=1
    time.sleep(22)
print("finished: ok",done,"fail",fail)
